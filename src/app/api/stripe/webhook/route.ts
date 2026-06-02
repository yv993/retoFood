import Stripe from "stripe";
import type { NextRequest } from "next/server";
import { createOrder, getOrderBySession, type OrderLine } from "@/lib/db";
import { sendOrderReceipt } from "@/lib/notify";
import { sendEmail, esc, BUSINESS_EMAIL } from "@/lib/email";

// Stripe needs the raw request body to verify the signature — never cached.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  // No keys → acknowledge so Stripe doesn't retry forever; nothing to persist.
  if (!key || !secret) {
    console.info("[stripe:webhook] not configured (missing STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET) — ignoring event");
    return new Response("ok", { status: 200 });
  }

  const stripe = new Stripe(key);
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig ?? "", secret);
  } catch (err) {
    console.error("[stripe:webhook] signature verification failed", err);
    return new Response("invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const kind = session.metadata?.kind;

    try {
      if (kind === "catering-deposit") {
        // Deposit hold — notify the events team (no dedicated model).
        await sendEmail({
          to: BUSINESS_EMAIL,
          subject: `Catering deposit received — ${session.metadata?.packageName || "event"}`,
          html: `<h2>Catering deposit paid</h2>
            <p><b>Amount:</b> ֏${((session.amount_total ?? 0) / 100).toLocaleString("en-US")}</p>
            <p><b>Package:</b> ${esc(session.metadata?.packageName || "—")}</p>
            <p><b>Guests:</b> ${esc(session.metadata?.guests || "—")}</p>
            <p><b>Customer:</b> ${esc(session.customer_details?.email || session.metadata?.name || "—")}</p>`,
        });
      } else {
        // Regular food order — idempotent on the Stripe session id.
        const existing = await getOrderBySession(session.id);
        if (!existing) {
          let lines: OrderLine[] = [];
          try {
            const li = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
            lines = li.data.map((item) => ({
              name: item.description ?? "Item",
              qty: item.quantity ?? 1,
              price: Math.round((item.amount_total ?? 0) / 100),
            }));
          } catch (err) {
            console.error("[stripe:webhook] could not list line items", err);
          }

          const order = await createOrder({
            status: "received",
            customerName: session.customer_details?.name ?? undefined,
            email: session.customer_details?.email ?? undefined,
            phone: session.customer_details?.phone ?? undefined,
            fulfillment: (session.metadata?.fulfillment as "delivery" | "pickup") ?? "pickup",
            lines,
            total: Math.round((session.amount_total ?? 0) / 100),
            currency: (session.currency ?? "amd").toUpperCase(),
            stripeSessionId: session.id,
          });

          await sendOrderReceipt(order);
          await sendEmail({
            to: BUSINESS_EMAIL,
            subject: `New paid order ${order.ref} — ֏${order.total.toLocaleString("en-US")}`,
            html: `<h2>New paid order</h2>
              <p><b>Ref:</b> ${esc(order.ref)} · <b>${esc(order.fulfillment)}</b></p>
              <p><b>Total:</b> ֏${order.total.toLocaleString("en-US")}</p>
              <p><b>Customer:</b> ${esc(order.customerName || "—")} · ${esc(order.email || "—")}</p>`,
          });
        }
      }
    } catch (err) {
      console.error("[stripe:webhook] handler error", err);
      // Return 500 so Stripe retries delivery.
      return new Response("handler error", { status: 500 });
    }
  }

  return new Response("ok", { status: 200 });
}
