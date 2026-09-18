/**
 * Structured Enterprise Logger with Trace Correlation & Performance Metrics
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  traceId?: string;
  actorId?: string;
  action?: string;
  durationMs?: number;
  metadata?: Record<string, any>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

export class Logger {
  private static formatEntry(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      service: 'kasp-backend-service',
      environment: process.env.NODE_ENV || 'development',
    });
  }

  public static info(message: string, meta?: Record<string, any>, traceId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      traceId,
      metadata: meta
    };
    console.log(this.formatEntry(entry));
  }

  public static warn(message: string, meta?: Record<string, any>, traceId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      traceId,
      metadata: meta
    };
    console.warn(this.formatEntry(entry));
  }

  public static error(message: string, error?: any, meta?: Record<string, any>, traceId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      traceId,
      metadata: meta,
      error: error ? {
        message: error.message || String(error),
        stack: error.stack,
        code: error.code
      } : undefined
    };
    console.error(this.formatEntry(entry));
  }

  public static audit(actorId: string, action: string, resource: string, details?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: `AUDIT: [${actorId}] performed ${action} on ${resource}`,
      actorId,
      action,
      metadata: details
    };
    console.log(this.formatEntry(entry));
  }
}
