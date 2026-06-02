/**
 * Tiny in-memory sliding-window rate limiter for spam protection.
 * Note: per-instance memory (resets on cold start) — fine as a basic guard;
 * swap for Upstash/Redis for production-grade limits.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
