import { listNewsletter } from "@/lib/db";
import { dateTime } from "@/lib/format";
import PageHead, { EmptyState } from "@/components/admin/PageHead";
import Toolbar from "@/components/admin/Toolbar";
import AdminTable from "@/components/admin/AdminTable";
import StatusForm from "@/components/admin/StatusForm";

const NEWSLETTER_STATUSES = ["active", "unsubscribed"] as const;

type SP = { searchParams: Promise<{ q?: string; status?: string }> };

export default async function NewsletterPage({ searchParams }: SP) {
  const { q, status } = await searchParams;
  const rows = await listNewsletter({ q, status });

  return (
    <div>
      <PageHead title="Newsletter" subtitle="VIP-list subscribers from across the site." />
      <Toolbar model="newsletter" q={q} status={status} statuses={NEWSLETTER_STATUSES} count={rows.length} />
      <AdminTable
        rows={rows}
        empty={<EmptyState title="No subscribers yet" hint="Signups from the footer and pop-ups appear here." />}
        columns={[
          { header: "Email", cell: (n) => <span className="text-cream">{n.email}</span> },
          { header: "Source", cell: (n) => <span className="text-sand">{n.source ?? "—"}</span> },
          { header: "Joined", cell: (n) => <span className="whitespace-nowrap text-xs text-muted">{dateTime(n.createdAt)}</span> },
          {
            header: "Status",
            cell: (n) => <StatusForm model="newsletter" id={n.id} current={n.status} statuses={NEWSLETTER_STATUSES} />,
          },
        ]}
      />
    </div>
  );
}
