import { diagnose } from "@/lib/db";
import PageHead from "@/components/admin/PageHead";

// Temporary admin-only diagnostics for verifying the production database wiring.
export const dynamic = "force-dynamic";

export default async function DiagnosticsPage() {
  const d = await diagnose();
  return (
    <div>
      <PageHead title="Diagnostics" subtitle="Database connectivity (admin only)." />
      <pre className="overflow-auto rounded-2xl border border-line bg-char p-6 text-sm text-sand">
        {JSON.stringify(d, null, 2)}
      </pre>
      <p className="mt-4 text-sm text-muted">
        Expect: <code>mode: &quot;postgres&quot;</code>, <code>connected: true</code>,{" "}
        <code>error: null</code>.
      </p>
    </div>
  );
}
