import { notFound } from "next/navigation";
import { getOrder, ORDER_STATUSES } from "@/lib/db";
import { dramFmt, dateTime } from "@/lib/format";
import PageHead from "@/components/admin/PageHead";
import StatusBadge from "@/components/admin/StatusBadge";
import StatusForm from "@/components/admin/StatusForm";
import { BackLink, DetailCard, Field } from "@/components/admin/Detail";

type P = { params: Promise<{ id: string }> };

export default async function OrderDetail({ params }: P) {
  const { id } = await params;
  const o = await getOrder(id);
  if (!o) notFound();

  return (
    <div>
      <BackLink href="/admin/orders" label="Back to orders" />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <PageHead title={`Order ${o.ref}`} />
        <StatusBadge status={o.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DetailCard>
            <Field label="Customer">{o.customerName ?? "—"}</Field>
            <Field label="Email">{o.email ?? "—"}</Field>
            <Field label="Phone">{o.phone ?? "—"}</Field>
            <Field label="Fulfilment"><span className="capitalize">{o.fulfillment}</span></Field>
            <Field label="Items">
              <ul className="space-y-1">
                {o.lines.map((l, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span>{l.name}{l.qty > 1 ? ` ×${l.qty}` : ""}</span>
                    <span className="text-gold">{dramFmt(l.price)}</span>
                  </li>
                ))}
              </ul>
            </Field>
            <Field label="Total"><span className="font-display text-lg text-gold">{dramFmt(o.total)}</span></Field>
            <Field label="Stripe session"><span className="break-all font-mono text-xs text-muted">{o.stripeSessionId ?? "—"}</span></Field>
            <Field label="Note">{o.note ?? "—"}</Field>
            <Field label="Created">{dateTime(o.createdAt)}</Field>
            <Field label="Updated">{dateTime(o.updatedAt)}</Field>
          </DetailCard>
        </div>

        <aside>
          <div className="rounded-2xl border border-line bg-char p-6">
            <h2 className="mb-3 font-display text-lg text-cream">Update status</h2>
            <StatusForm model="orders" id={o.id} current={o.status} statuses={ORDER_STATUSES} />
            <p className="mt-3 text-xs text-muted">The customer is emailed on status changes when an address is on file.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
