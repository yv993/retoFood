import { diagnose, createOrder, listOrders, deleteOrder } from "@/lib/db";
import PageHead from "@/components/admin/PageHead";

// Temporary admin-only diagnostics for verifying the production database wiring.
export const dynamic = "force-dynamic";

type SP = { searchParams: Promise<{ write?: string; cleanup?: string }> };

export default async function DiagnosticsPage({ searchParams }: SP) {
  const { write, cleanup } = await searchParams;

  let cleanupResult: unknown = null;
  if (cleanup === "1") {
    const all = await listOrders();
    const tests = all.filter((o) => o.customerName?.startsWith("DB TEST"));
    for (const o of tests) await deleteOrder(o.id);
    cleanupResult = { deleted: tests.map((o) => o.ref), remaining: (await listOrders()).length };
  }

  let writeResult: unknown = null;
  if (write === "1") {
    const order = await createOrder({
      status: "received",
      customerName: "DB TEST — safe to cancel",
      email: undefined,
      phone: "+374 00 000000",
      fulfillment: "pickup",
      paymentMethod: "restaurant",
      lines: [{ name: "Connectivity test", qty: 1, price: 1 }],
      total: 1,
      currency: "AMD",
      note: "Automated write test — delete or cancel.",
    });
    const back = await listOrders();
    writeResult = {
      created: order.ref,
      readBackCount: back.length,
      foundCreated: back.some((o) => o.ref === order.ref),
    };
  }

  const d = await diagnose();
  return (
    <div>
      <PageHead title="Diagnostics" subtitle="Database connectivity (admin only)." />
      <pre className="overflow-auto rounded-2xl border border-line bg-char p-6 text-sm text-sand">
        {JSON.stringify({ diagnose: d, writeTest: writeResult, cleanup: cleanupResult }, null, 2)}
      </pre>
      <p className="mt-4 text-sm text-muted">
        Add <code>?write=1</code> to create a real test order and confirm it persists.
      </p>
    </div>
  );
}
