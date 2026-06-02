import { listGiftCards, GIFTCARD_STATUSES } from "@/lib/db";
import { dramFmt, dateTime } from "@/lib/format";
import PageHead, { EmptyState } from "@/components/admin/PageHead";
import Toolbar from "@/components/admin/Toolbar";
import AdminTable from "@/components/admin/AdminTable";
import StatusForm from "@/components/admin/StatusForm";

type SP = { searchParams: Promise<{ q?: string; status?: string }> };

export default async function GiftCardsPage({ searchParams }: SP) {
  const { q, status } = await searchParams;
  const rows = await listGiftCards({ q, status });

  return (
    <div>
      <PageHead title="Gift cards" subtitle="Gift-card requests and purchases." />
      <Toolbar model="gift-cards" q={q} status={status} statuses={GIFTCARD_STATUSES} count={rows.length} />
      <AdminTable
        rows={rows}
        detailBase="/admin/gift-cards"
        empty={<EmptyState title="No gift cards yet" hint="Requests from /gift-cards appear here." />}
        columns={[
          { header: "Ref", cell: (g) => <span className="font-mono text-xs text-sand">{g.ref}</span> },
          { header: "Amount", cell: (g) => <span className="font-semibold text-gold">{dramFmt(g.amount)}</span> },
          { header: "Buyer", cell: (g) => <span className="text-sand">{g.buyerEmail ?? "—"}</span> },
          { header: "Created", cell: (g) => <span className="whitespace-nowrap text-xs text-muted">{dateTime(g.createdAt)}</span> },
          {
            header: "Status",
            cell: (g) => <StatusForm model="gift-cards" id={g.id} current={g.status} statuses={GIFTCARD_STATUSES} />,
          },
        ]}
      />
    </div>
  );
}
