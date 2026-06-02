import { notFound } from "next/navigation";
import { getCateringInquiry, INQUIRY_STATUSES } from "@/lib/db";
import { dramFmt, dateTime, dateShort } from "@/lib/format";
import PageHead from "@/components/admin/PageHead";
import StatusBadge from "@/components/admin/StatusBadge";
import StatusForm from "@/components/admin/StatusForm";
import { BackLink, DetailCard, Field } from "@/components/admin/Detail";

type P = { params: Promise<{ id: string }> };

export default async function CateringDetail({ params }: P) {
  const { id } = await params;
  const c = await getCateringInquiry(id);
  if (!c) notFound();

  const diet = c.dietary;
  const dietRow = diet
    ? [diet.veg ? `${diet.veg} veg` : "", diet.vegan ? `${diet.vegan} vegan` : "", diet.halal ? `${diet.halal} halal` : ""]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <div>
      <BackLink href="/admin/catering" label="Back to catering" />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <PageHead title={`Inquiry ${c.ref}`} />
        <StatusBadge status={c.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DetailCard>
            <Field label="Name">{c.name}</Field>
            <Field label="Email">{c.email}</Field>
            <Field label="Phone">{c.phone}</Field>
            <Field label="Event type">{c.eventType}</Field>
            <Field label="Service style">{c.serviceStyle ?? "—"}</Field>
            <Field label="Date">{c.date ? dateShort(c.date) : "—"}</Field>
            <Field label="Start / duration">{[c.startTime, c.duration].filter(Boolean).join(" · ") || "—"}</Field>
            <Field label="Venue">{c.venue ?? "—"}</Field>
            <Field label="Guests">{c.guests}</Field>
            <Field label="Package">{c.packageName ?? "—"}</Field>
            <Field label="Add-ons">{c.addOns?.length ? c.addOns.join(", ") : "—"}</Field>
            <Field label="Estimate">{c.estimate ? dramFmt(c.estimate) : "—"}</Field>
            <Field label="Budget">{c.budget ?? "—"}</Field>
            <Field label="Dietary">{dietRow || "—"}</Field>
            <Field label="Allergy notes">{diet?.allergyNotes ?? "—"}</Field>
            <Field label="Message">{c.message ?? "—"}</Field>
            <Field label="Created">{dateTime(c.createdAt)}</Field>
            <Field label="Updated">{dateTime(c.updatedAt)}</Field>
          </DetailCard>
        </div>
        <aside>
          <div className="rounded-2xl border border-line bg-char p-6">
            <h2 className="mb-3 font-display text-lg text-cream">Update status</h2>
            <StatusForm model="catering" id={c.id} current={c.status} statuses={INQUIRY_STATUSES} />
            <p className="mt-3 text-xs text-muted">Quoting / winning / losing emails the contact.</p>
            <a
              href={`mailto:${c.email}?subject=Your%20BurgerHouse%20catering%20inquiry%20${c.ref}`}
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:border-gold hover:text-gold"
            >
              Reply by email
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
