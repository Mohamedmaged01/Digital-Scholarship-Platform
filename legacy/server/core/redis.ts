/**
 * Redis In-Memory Client & Cache-Aside Implementation
 * Provides high-speed caching, TTL expiration, distributed locking, and hit-rate telemetry
 */

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  keysCount: number;
}

interface CacheItem<T> {
  value: T;
  expiresAt: number | null;
}

export class RedisService {
  private static store: Map<string, CacheItem<any>> = new Map();
  private static locks: Map<string, { owner: string; expiresAt: number }> = new Map();
  private static hits = 0;
  private static misses = 0;

  /**
   * Cache-Aside get with automatic fallback
   */
  public static async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetcher();
    this.set(key, fresh, ttlSeconds);
    return fresh;
  }

  public static get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) {
      this.misses++;
      return null;
    }

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return item.value as T;
  }

  public static set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  public static delete(key: string): boolean {
    return this.store.delete(key);
  }

  public static invalidateByPattern(pattern: string): number {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    let count = 0;
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Distributed Lock pattern (e.g. Redlock algorithm emulation)
   * Ensures idempotency and race condition prevention during concurrent submissions
   */
  public static async acquireLock(resourceKey: string, owner: string, ttlMs: number = 5000): Promise<boolean> {
    const existing = this.locks.get(resourceKey);
    const now = Date.now();

    if (existing && existing.expiresAt > now) {
      if (existing.owner === owner) return true; // Re-entrant
      return false; // Already locked by another worker
    }

    this.locks.set(resourceKey, { owner, expiresAt: now + ttlMs });
    return true;
  }

  public static releaseLock(resourceKey: string, owner: string): void {
    const existing = this.locks.get(resourceKey);
    if (existing && existing.owner === owner) {
      this.locks.delete(resourceKey);
    }
  }

  public static getStats(): CacheStats {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? Math.round((this.hits / total) * 1000) / 10 : 0;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate,
      keysCount: this.store.size
    };
  }
}
