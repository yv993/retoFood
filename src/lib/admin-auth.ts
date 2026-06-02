import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal env-based admin auth.
 *
 *   ADMIN_PASSWORD  — the single shared password for /admin.
 *
 * The session cookie stores an HMAC of a fixed message keyed by the password,
 * so the raw password never travels in the cookie and rotating the env var
 * invalidates all sessions. Guarded both in `src/proxy.ts` (before render) and
 * here (inside server components/actions) for defense in depth — Next 16
 * explicitly recommends not relying on the proxy alone.
 */
export const ADMIN_COOKIE = "bh_admin";
const MESSAGE = "bh-admin-session-v1";

export function adminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

/** Expected cookie value for the current password, or null if unconfigured. */
export function sessionToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHmac("sha256", pw).update(MESSAGE).digest("base64url");
}

/** Constant-time password check used at login. */
export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** True when the current request is an authenticated admin. */
export async function isAdmin(): Promise<boolean> {
  const expected = sessionToken();
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (expected) return token === expected;
  // Unconfigured: allow a local preview in development only, never in prod.
  return process.env.NODE_ENV !== "production";
}
