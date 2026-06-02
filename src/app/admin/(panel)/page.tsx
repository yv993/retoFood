import Link from "next/link";
import {
  counts,
  listOrders,
  listReservations,
  listCateringInquiries,
} from "@/lib/db";
import { dramFmt, dateTime } from "@/lib/format";
import StatusBadge from "@/components/admin/StatusBadge";
import PageHead from "@/components/admin/PageHead";

const CARDS = [
  { key: "orders", label: "Orders", href: "/admin/orders" },
  { key: "reservations", label: "Reservations", href: "/admin/reservations" },
  { key: "catering", label: "Catering", href: "/admin/catering" },
  { key: "newsletter", label: "Newsletter", href: "/admin/newsletter" },
  { key: "giftCards", label: "Gift cards", href: "/admin/gift-cards" },
];

export default async function AdminDashboard() {
  const [c, orders, reservations, catering] = await Promise.all([
    counts(),
    listOrders(),
    listReservations(),
    listCateringInquiries(),
  ]);

  return (
    <div>
      <PageHead title="Dashboard" subtitle="Live overview of everything coming through the site." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-2xl border border-line bg-char p-5 transition-colors hover:border-gold/40"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-4xl text-gold">{c[card.key] ?? 0}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <RecentPanel title="Latest orders" href="/admin/orders" empty="No orders yet.">
          {orders.slice(0, 5).map((o) => (
            <Row key={o.id} href={`/admin/orders/${o.id}`} ref_={o.ref} status={o.status} when={o.createdAt}>
              {o.customerName ?? "—"} · {dramFmt(o.total)}
            </Row>
          ))}
        </RecentPanel>

        <RecentPanel title="Latest reservations" href="/admin/reservations" empty="No reservations yet.">
          {reservations.slice(0, 5).map((r) => (
            <Row key={r.id} href={`/admin/reservations/${r.id}`} ref_={r.ref} status={r.status} when={r.createdAt}>
              {r.name} · {r.date} {r.time} · {r.guests}p
            </Row>
          ))}
        </RecentPanel>

        <RecentPanel title="Latest catering inquiries" href="/admin/catering" empty="No inquiries yet.">
          {catering.slice(0, 5).map((c2) => (
            <Row key={c2.id} href={`/admin/catering/${c2.id}`} ref_={c2.ref} status={c2.status} when={c2.createdAt}>
              {c2.name} · {c2.eventType} · {c2.guests}p
            </Row>
          ))}
        </RecentPanel>
      </div>
    </div>
  );
}

function RecentPanel({
  title,
  href,
  empty,
  children,
}: {
  title: string;
  href: string;
  empty: string;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children : [children];
  const hasItems = items.some(Boolean) && items.length > 0;
  return (
    <section className="rounded-2xl border border-line bg-char/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg text-cream">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-goldlt hover:text-gold">
          View all →
        </Link>
      </div>
      {hasItems ? <ul className="divide-y divide-line">{children}</ul> : <p className="py-6 text-sm text-muted">{empty}</p>}
    </section>
  );
}

function Row({
  href,
  ref_,
  status,
  when,
  children,
}: {
  href: string;
  ref_: string;
  status: string;
  when: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="flex items-center justify-between gap-3 py-3 transition-colors hover:text-gold">
        <span className="min-w-0">
          <span className="block truncate text-sm text-cream">{children}</span>
          <span className="block font-mono text-xs text-muted">{ref_} · {dateTime(when)}</span>
        </span>
        <StatusBadge status={status} />
      </Link>
    </li>
  );
}
