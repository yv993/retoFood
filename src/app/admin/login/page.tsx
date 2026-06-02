import Link from "next/link";
import { login } from "@/app/admin/auth-actions";
import { adminConfigured } from "@/lib/admin-auth";

type SP = { searchParams: Promise<{ error?: string; next?: string }> };

export default async function AdminLogin({ searchParams }: SP) {
  const { error, next } = await searchParams;
  const configured = adminConfigured();

  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-char p-8">
        <Link href="/" className="font-display text-2xl text-cream">
          Burger<span className="text-gold">House</span>
        </Link>
        <h1 className="mt-6 font-display text-2xl text-cream">Admin sign-in</h1>
        <p className="mt-1 text-sm text-muted">Staff access only.</p>

        {error === "1" && (
          <p className="mt-4 rounded-xl border border-ember/50 bg-ember/10 px-4 py-3 text-sm text-ember">
            Incorrect password.
          </p>
        )}
        {error === "notconfigured" && (
          <p className="mt-4 rounded-xl border border-ember/50 bg-ember/10 px-4 py-3 text-sm text-ember">
            Admin isn&rsquo;t configured. Set <code>ADMIN_PASSWORD</code> in the environment.
          </p>
        )}
        {!configured && (
          <p className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-xs text-gold">
            Dev mode: <code>ADMIN_PASSWORD</code> isn&rsquo;t set — sign-in is open locally. Set it
            before deploying.
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next ?? "/admin"} />
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-sand">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-cream placeholder-muted focus:border-gold focus:outline-none"
              placeholder={configured ? "••••••••" : "(any value in dev)"}
            />
          </div>
          <button
            type="submit"
            className="btn-gold inline-flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold"
          >
            Sign in
          </button>
        </form>

        <Link href="/" className="mt-6 block text-center text-sm text-muted hover:text-gold">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
