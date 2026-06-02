import { listCateringInquiries, INQUIRY_STATUSES } from "@/lib/db";
import { dramFmt, dateShort } from "@/lib/format";
import PageHead, { EmptyState } from "@/components/admin/PageHead";
import Toolbar from "@/components/admin/Toolbar";
import AdminTable from "@/components/admin/AdminTable";
import StatusForm from "@/components/admin/StatusForm";

type SP = { searchParams: Promise<{ q?: string; status?: string }> };

export default async function CateringPage({ searchParams }: SP) {
  const { q, status } = await searchParams;
  const rows = await listCateringInquiries({ q, status });

  return (
    <div>
      <PageHead title="Catering inquiries" subtitle="Event leads from the catering page. Quote, win, or close them out." />
      <Toolbar model="catering" q={q} status={status} statuses={INQUIRY_STATUSES} count={rows.length} />
      <AdminTable
        rows={rows}
        detailBase="/admin/catering"
        empty={<EmptyState title="No catering inquiries yet" hint="Submissions from /catering appear here." />}
        columns={[
          { header: "Ref", cell: (c) => <span className="font-mono text-xs text-sand">{c.ref}</span> },
          { header: "Name", cell: (c) => <span className="text-cream">{c.name}</span> },
          { header: "Event", cell: (c) => <span className="text-sand">{c.eventType}</span> },
          { header: "Guests", cell: (c) => <span className="text-sand">{c.guests}</span> },
          { header: "Est.", cell: (c) => <span className="text-gold">{c.estimate ? dramFmt(c.estimate) : "—"}</span> },
          { header: "Date", cell: (c) => <span className="whitespace-nowrap text-xs text-muted">{c.date ? dateShort(c.date) : "—"}</span> },
          {
            header: "Status",
            cell: (c) => <StatusForm model="catering" id={c.id} current={c.status} statuses={INQUIRY_STATUSES} />,
          },
        ]}
      />
    </div>
  );
}
