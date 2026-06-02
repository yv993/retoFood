import { notFound } from "next/navigation";
import { getReservation, RESERVATION_STATUSES } from "@/lib/db";
import { dateTime } from "@/lib/format";
import PageHead from "@/components/admin/PageHead";
import StatusBadge from "@/components/admin/StatusBadge";
import StatusForm from "@/components/admin/StatusForm";
import { BackLink, DetailCard, Field } from "@/components/admin/Detail";

type P = { params: Promise<{ id: string }> };

export default async function ReservationDetail({ params }: P) {
  const { id } = await params;
  const r = await getReservation(id);
  if (!r) notFound();

  return (
    <div>
      <BackLink href="/admin/reservations" label="Back to reservations" />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <PageHead title={`Reservation ${r.ref}`} />
        <StatusBadge status={r.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DetailCard>
            <Field label="Name">{r.name}</Field>
            <Field label="Phone">{r.phone}</Field>
            <Field label="Email">{r.email ?? "—"}</Field>
            <Field label="Date">{r.date}</Field>
            <Field label="Time">{r.time}</Field>
            <Field label="Guests">{r.guests}</Field>
            <Field label="Notes">{r.notes ?? "—"}</Field>
            <Field label="Created">{dateTime(r.createdAt)}</Field>
            <Field label="Updated">{dateTime(r.updatedAt)}</Field>
          </DetailCard>
        </div>
        <aside>
          <div className="rounded-2xl border border-line bg-char p-6">
            <h2 className="mb-3 font-display text-lg text-cream">Update status</h2>
            <StatusForm model="reservations" id={r.id} current={r.status} statuses={RESERVATION_STATUSES} />
            <p className="mt-3 text-xs text-muted">Confirming or cancelling emails the guest when an address is on file.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
