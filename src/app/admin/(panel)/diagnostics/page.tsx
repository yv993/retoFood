import { diagnose, createOrder, listOrders } from "@/lib/db";
import PageHead from "@/components/admin/PageHead";

// Temporary admin-only diagnostics for verifying the production database wiring.
export const dynamic = "force-dynamic";

type SP = { searchParams: Promise<{ write?: string }> };

export default async function DiagnosticsPage({ searchParams }: SP) {
  const { write } = await searchParams;

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
        {JSON.stringify({ diagnose: d, writeTest: writeResult }, null, 2)}
      </pre>
      <p className="mt-4 text-sm text-muted">
        Add <code>?write=1</code> to create a real test order and confirm it persists.
      </p>
    </div>
  );
}
