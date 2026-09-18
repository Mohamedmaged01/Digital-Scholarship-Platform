import crypto from 'crypto';

// Salt length and iterations for PBKDF2
const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

/**
 * Hash a plain text password using Node's native PBKDF2 with SHA-512
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `${salt}:${derivedKey}`;
}

/**
 * Verify a plain text password against stored salt:hash string
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(':');
    if (!salt || !originalHash) return false;
    const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(derivedKey, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Generate a signed or structured bearer token with expiration
 */
export function generateToken(userId: string, role: string, permissions: string[]): string {
  const payload = {
    userId,
    role,
    permissions,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', process.env.ADMIN_JWT_SECRET || 'kasp-gov-sa-admin-secret-key-2026')
    .update(str)
    .digest('base64url');
  return `${str}.${signature}`;
}

/**
 * Verify and decode an admin bearer token
 */
export function verifyToken(token: string): { userId: string; role: string; permissions: string[] } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [str, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', process.env.ADMIN_JWT_SECRET || 'kasp-gov-sa-admin-secret-key-2026')
      .update(str)
      .digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(str, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
