import { listReservations, RESERVATION_STATUSES } from "@/lib/db";
import PageHead, { EmptyState } from "@/components/admin/PageHead";
import Toolbar from "@/components/admin/Toolbar";
import AdminTable from "@/components/admin/AdminTable";
import StatusForm from "@/components/admin/StatusForm";

type SP = { searchParams: Promise<{ q?: string; status?: string }> };

export default async function ReservationsPage({ searchParams }: SP) {
  const { q, status } = await searchParams;
  const rows = await listReservations({ q, status });

  return (
    <div>
      <PageHead title="Reservations" subtitle="Table bookings from the website. Confirm, seat, or mark no-shows." />
      <Toolbar model="reservations" q={q} status={status} statuses={RESERVATION_STATUSES} count={rows.length} />
      <AdminTable
        rows={rows}
        detailBase="/admin/reservations"
        empty={<EmptyState title="No reservations yet" hint="Bookings from the /reserve form land here." />}
        columns={[
          { header: "Ref", cell: (r) => <span className="font-mono text-xs text-sand">{r.ref}</span> },
          { header: "Name", cell: (r) => <span className="text-cream">{r.name}</span> },
          { header: "When", cell: (r) => <span className="whitespace-nowrap text-sand">{r.date} · {r.time}</span> },
          { header: "Guests", cell: (r) => <span className="text-sand">{r.guests}</span> },
          { header: "Phone", cell: (r) => <span className="whitespace-nowrap text-xs text-muted">{r.phone}</span> },
          {
            header: "Status",
            cell: (r) => <StatusForm model="reservations" id={r.id} current={r.status} statuses={RESERVATION_STATUSES} />,
          },
        ]}
      />
    </div>
  );
}
