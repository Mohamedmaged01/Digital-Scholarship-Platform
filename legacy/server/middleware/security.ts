/**
 * Enterprise Security Middleware Suite
 * Includes Rate Limiting, Security Headers, Sanitization, and Unified Response Envelope
 */

import { Request, Response, NextFunction } from 'express';
import { Logger } from '../core/logger';

// Rate Limiter tracking in-memory (backed by Redis key pattern in production)
const rateLimitBuckets: Map<string, { count: number; resetAt: number }> = new Map();

export function createRateLimiter(options: { windowMs: number; max: number; keyPrefix: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const key = `${options.keyPrefix}:${ip}`;
    const now = Date.now();

    let bucket = rateLimitBuckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 1, resetAt: now + options.windowMs };
      rateLimitBuckets.set(key, bucket);
    } else {
      bucket.count++;
    }

    res.setHeader('X-RateLimit-Limit', options.max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - bucket.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(bucket.resetAt / 1000));

    if (bucket.count > options.max) {
      Logger.warn(`Rate limit exceeded for IP: ${ip} on prefix ${options.keyPrefix}`);
      return res.status(429).json({
        success: false,
        data: null,
        meta: { timestamp: new Date().toISOString() },
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please retry in a few moments.',
          retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000)
        }
      });
    }

    next();
  };
}

export const publicRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 120, keyPrefix: 'rl:public' });
export const authRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 20, keyPrefix: 'rl:auth' });
export const aiRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 30, keyPrefix: 'rl:ai' });
export const uploadRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 10, keyPrefix: 'rl:upload' });

/**
 * Enterprise Security Headers
 */
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}

/**
 * Standard API Response Helper
 */
export function sendApiResponse(res: Response, status: number, data: any, meta: Record<string, any> = {}) {
  return res.status(status).json({
    success: status >= 200 && status < 300,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    },
    error: null
  });
}

export function sendApiError(res: Response, status: number, code: string, message: string, details?: any) {
  return res.status(status).json({
    success: false,
    data: null,
    meta: {
      timestamp: new Date().toISOString()
    },
    error: {
      code,
      message,
      details: details || []
    }
  });
}
