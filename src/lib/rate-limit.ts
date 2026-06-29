import { LRUCache } from "lru-cache";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const cache = new LRUCache<string, RateLimitEntry>({
  max: 10000,
  ttl: 60000, // 1 minute
});

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 30
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = cache.get(identifier);

  if (!entry || now > entry.resetTime) {
    cache.set(identifier, { count: 1, resetTime: now + 60000 });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + 60000 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
}