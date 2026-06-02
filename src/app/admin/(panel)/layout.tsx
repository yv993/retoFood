import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin, adminConfigured } from "@/lib/admin-auth";
import { storeMode } from "@/lib/db";
import { logout } from "@/app/admin/auth-actions";
import AdminNav from "@/components/admin/AdminNav";
import { LogOut } from "@/components/ui/icons";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth — the proxy guards first, this re-checks at render time.
  if (!(await isAdmin())) redirect("/admin/login");

  const mode = storeMode();

  return (
    <div className="mx-auto max-w-content px-4 py-6 sm:px-6 lg:py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Sidebar */}
        <aside className="lg:w-56 lg:shrink-0">
          <div className="flex items-center justify-between lg:flex-col lg:items-stretch lg:gap-6">
            <Link href="/" className="font-display text-xl text-cream">
              Burger<span className="text-gold">House</span>
              <span className="mt-0.5 block text-xs font-normal text-muted">Admin</span>
            </Link>
            <div className="lg:mt-2">
              <AdminNav />
            </div>
          </div>
          <form action={logout} className="mt-6">
            <button
              type="submit"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-sand transition-colors hover:border-gold hover:text-gold"
            >
              <LogOut width={16} height={16} /> Sign out
            </button>
          </form>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {!adminConfigured() && (
            <div className="mb-6 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-xs text-gold">
              Dev preview — <code>ADMIN_PASSWORD</code> is not set, so this panel is unprotected.
              Set it before deploying.
            </div>
          )}
          {mode === "memory" && (
            <div className="mb-6 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-xs text-ember">
              In-memory store — records reset on redeploy. Configure Prisma + Postgres for durable
              storage (see DEPLOYMENT.md).
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
