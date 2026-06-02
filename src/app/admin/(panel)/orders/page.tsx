import { listOrders, ORDER_STATUSES } from "@/lib/db";
import { dramFmt, dateTime } from "@/lib/format";
import PageHead, { EmptyState } from "@/components/admin/PageHead";
import Toolbar from "@/components/admin/Toolbar";
import AdminTable from "@/components/admin/AdminTable";
import StatusForm from "@/components/admin/StatusForm";

type SP = { searchParams: Promise<{ q?: string; status?: string }> };

export default async function OrdersPage({ searchParams }: SP) {
  const { q, status } = await searchParams;
  const rows = await listOrders({ q, status });

  return (
    <div>
      <PageHead title="Orders" subtitle="Paid orders from Stripe checkout. Move them through the kitchen workflow." />
      <Toolbar model="orders" q={q} status={status} statuses={ORDER_STATUSES} count={rows.length} />
      <AdminTable
        rows={rows}
        detailBase="/admin/orders"
        empty={<EmptyState title="No orders yet" hint="Paid orders appear here once Stripe is live and a checkout completes." />}
        columns={[
          { header: "Ref", cell: (o) => <span className="font-mono text-xs text-sand">{o.ref}</span> },
          { header: "Customer", cell: (o) => <span className="text-cream">{o.customerName ?? "—"}</span> },
          { header: "Total", cell: (o) => <span className="font-semibold text-gold">{dramFmt(o.total)}</span> },
          { header: "Fulfil", cell: (o) => <span className="capitalize text-sand">{o.fulfillment}</span> },
          { header: "Created", cell: (o) => <span className="whitespace-nowrap text-xs text-muted">{dateTime(o.createdAt)}</span> },
          {
            header: "Status",
            cell: (o) => <StatusForm model="orders" id={o.id} current={o.status} statuses={ORDER_STATUSES} />,
          },
        ]}
      />
    </div>
  );
}
