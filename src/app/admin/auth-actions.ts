"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminConfigured, checkPassword, sessionToken } from "@/lib/admin-auth";

const MAX_AGE = 60 * 60 * 8; // 8 hours

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin") || "/admin";
  const safeNext = next.startsWith("/admin") ? next : "/admin";

  if (!adminConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      // Dev preview: no password set → let the developer in (clearly banner-flagged).
      redirect(safeNext);
    }
    redirect("/admin/login?error=notconfigured");
  }

  if (!checkPassword(password)) {
    redirect("/admin/login?error=1");
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, sessionToken()!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  redirect(safeNext);
}

export async function logout() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
