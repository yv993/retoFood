import { notFound } from "next/navigation";
import { getGiftCard, GIFTCARD_STATUSES } from "@/lib/db";
import { dramFmt, dateTime } from "@/lib/format";
import PageHead from "@/components/admin/PageHead";
import StatusBadge from "@/components/admin/StatusBadge";
import StatusForm from "@/components/admin/StatusForm";
import { BackLink, DetailCard, Field } from "@/components/admin/Detail";

type P = { params: Promise<{ id: string }> };

export default async function GiftCardDetail({ params }: P) {
  const { id } = await params;
  const g = await getGiftCard(id);
  if (!g) notFound();

  return (
    <div>
      <BackLink href="/admin/gift-cards" label="Back to gift cards" />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <PageHead title={`Gift card ${g.ref}`} />
        <StatusBadge status={g.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DetailCard>
            <Field label="Amount"><span className="font-display text-lg text-gold">{dramFmt(g.amount)}</span></Field>
            <Field label="Buyer email">{g.buyerEmail ?? "—"}</Field>
            <Field label="Recipient email">{g.recipientEmail ?? "—"}</Field>
            <Field label="Message">{g.message ?? "—"}</Field>
            <Field label="Code"><span className="font-mono">{g.code ?? "—"}</span></Field>
            <Field label="Stripe session"><span className="break-all font-mono text-xs text-muted">{g.stripeSessionId ?? "—"}</span></Field>
            <Field label="Created">{dateTime(g.createdAt)}</Field>
            <Field label="Updated">{dateTime(g.updatedAt)}</Field>
          </DetailCard>
        </div>
        <aside>
          <div className="rounded-2xl border border-line bg-char p-6">
            <h2 className="mb-3 font-display text-lg text-cream">Update status</h2>
            <StatusForm model="gift-cards" id={g.id} current={g.status} statuses={GIFTCARD_STATUSES} />
          </div>
        </aside>
      </div>
    </div>
  );
}
