import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "node:crypto";

// Next 16: the former `middleware` convention is now `proxy` (Node.js runtime).
// Self-contained on purpose — the proxy should not depend on app modules.

const ADMIN_COOKIE = "bh_admin";
const MESSAGE = "bh-admin-session-v1";

function expectedToken(): string | null {
  // Normalise to match src/lib/admin-auth.ts: trim + strip a wrapping quote pair.
  const pw = (process.env.ADMIN_PASSWORD ?? "").trim().replace(/^(['"])([\s\S]*)\1$/, "$2");
  if (!pw) return null;
  return crypto.createHmac("sha256", pw).update(MESSAGE).digest("base64url");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page and its POST must stay reachable while unauthenticated.
  if (pathname === "/admin/login") return NextResponse.next();

  const expected = expectedToken();
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const authed = expected
    ? token === expected
    : process.env.NODE_ENV !== "production"; // dev preview when ADMIN_PASSWORD is unset

  if (!authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
