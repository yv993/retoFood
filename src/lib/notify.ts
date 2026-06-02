import { sendEmail, esc, BUSINESS_EMAIL } from "@/lib/email";
import type { Order, Reservation, CateringInquiry } from "@/lib/db";

function dram(n: number): string {
  return "֏" + n.toLocaleString("en-US");
}

const wrap = (title: string, body: string) =>
  `<div style="font-family:system-ui,sans-serif;max-width:560px">
     <h2 style="color:#1a1a1a">${esc(title)}</h2>${body}
     <p style="color:#888;font-size:13px;margin-top:24px">BurgerHouse · 14 Saryan St, Yerevan</p>
   </div>`;

/* ------------------------------------------------------------------ */
/* Order receipt (sent from the Stripe webhook on payment success)     */
/* ------------------------------------------------------------------ */
export async function sendOrderReceipt(order: Order): Promise<void> {
  if (!order.email) return;
  const lines = order.lines
    .map((l) => `<tr><td>${esc(l.name)}</td><td align="right">${dram(l.price)}</td></tr>`)
    .join("");
  await sendEmail({
    to: order.email,
    subject: `Your BurgerHouse order ${order.ref} is confirmed`,
    html: wrap("Order confirmed 🍔", `
      <p>Thanks${order.customerName ? `, ${esc(order.customerName.split(" ")[0])}` : ""}! We've got your order.</p>
      <p><b>Reference:</b> ${esc(order.ref)}<br/><b>Fulfilment:</b> ${esc(order.fulfillment)}</p>
      <table width="100%" style="border-collapse:collapse;margin:12px 0">${lines}
        <tr><td style="padding-top:8px"><b>Total</b></td><td align="right" style="padding-top:8px"><b>${dram(order.total)}</b></td></tr>
      </table>
      <p>We'll be in touch as it's prepared.</p>`),
  });
}

/* ------------------------------------------------------------------ */
/* Customer-facing status-change emails (sent from /admin)             */
/* ------------------------------------------------------------------ */
const ORDER_COPY: Record<string, string> = {
  preparing: "Good news — the kitchen is now preparing your order.",
  ready: "Your order is ready! 🎉",
  completed: "Your order is complete. Thanks for choosing BurgerHouse!",
  cancelled: "Your order has been cancelled. If this is unexpected, please contact us.",
};
export async function sendOrderStatusEmail(order: Order): Promise<void> {
  const copy = ORDER_COPY[order.status];
  if (!order.email || !copy) return;
  await sendEmail({
    to: order.email,
    subject: `Order ${order.ref} — ${order.status}`,
    html: wrap("Order update", `<p>${esc(copy)}</p><p><b>Reference:</b> ${esc(order.ref)}</p>`),
  });
}

const RES_COPY: Record<string, string> = {
  confirmed: "Your table is confirmed — we can't wait to see you.",
  cancelled: "Your reservation has been cancelled. Hope to host you another time.",
  "no-show": "We missed you! Your reservation was marked as a no-show.",
};
export async function sendReservationStatusEmail(r: Reservation): Promise<void> {
  const copy = RES_COPY[r.status];
  if (!r.email || !copy) return;
  await sendEmail({
    to: r.email,
    subject: `Reservation ${r.ref} — ${r.status}`,
    html: wrap("Reservation update", `
      <p>${esc(copy)}</p>
      <p><b>Reference:</b> ${esc(r.ref)}<br/><b>When:</b> ${esc(r.date)} at ${esc(r.time)} · ${r.guests} guests</p>`),
  });
}

const CAT_COPY: Record<string, string> = {
  quoted: "We've sent you a tailored catering quote — check your inbox for details.",
  won: "Your event is booked — thank you! Our team will be in touch with next steps.",
  lost: "Thanks for considering us. We'd love another chance to cater for you.",
};
export async function sendCateringStatusEmail(c: CateringInquiry): Promise<void> {
  const copy = CAT_COPY[c.status];
  if (!c.email || !copy) return;
  await sendEmail({
    to: c.email,
    subject: `Your catering inquiry ${c.ref} — ${c.status}`,
    html: wrap("Catering update", `<p>${esc(copy)}</p><p><b>Reference:</b> ${esc(c.ref)}</p>`),
  });
}

export { BUSINESS_EMAIL };
