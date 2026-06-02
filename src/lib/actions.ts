"use server";

import { headers } from "next/headers";
import Stripe from "stripe";
import { sendEmail, esc, BUSINESS_EMAIL } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";
import { isOpenAt } from "@/lib/hours";
import {
  createOrder,
  createReservation,
  createCateringInquiry,
  createNewsletterSignup,
  createGiftCard,
} from "@/lib/db";
import { sendOrderReceipt } from "@/lib/notify";

export type ActionResult = { ok: true } | { ok: false; error: string };

const phoneOk = (s: string) => /^[0-9 +()-]{6,18}$/.test(s.trim());
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function dram(n: number): string {
  return "֏" + n.toLocaleString("en-US");
}

/* ------------------------------------------------------------------ */
/* Reservation                                                         */
/* ------------------------------------------------------------------ */
export interface ReservationInput {
  name: string;
  phone: string;
  email?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  notes?: string;
  company?: string; // honeypot
}

export async function submitReservation(input: ReservationInput): Promise<ActionResult> {
  if (input.company) return { ok: true }; // honeypot tripped → pretend success
  if (!rateLimit(`resv:${await clientIp()}`, 5)) {
    return { ok: false, error: "Too many requests — please wait a minute." };
  }
  const name = (input.name ?? "").trim();
  const phone = (input.phone ?? "").trim();
  if (!name) return { ok: false, error: "Please enter your name." };
  if (!phoneOk(phone)) return { ok: false, error: "Enter a valid phone number." };
  if (!input.date) return { ok: false, error: "Pick a date." };
  if (!input.time) return { ok: false, error: "Pick a time." };

  const when = new Date(`${input.date}T${input.time}`);
  if (Number.isNaN(when.getTime())) return { ok: false, error: "Invalid date or time." };
  if (when.getTime() < Date.now()) return { ok: false, error: "Please choose a future time." };
  if (!isOpenAt(when)) {
    return { ok: false, error: "We're closed then — please pick a time within opening hours." };
  }
  const guests = Math.max(1, Math.min(30, Number(input.guests) || 2));
  const email = input.email && emailOk(input.email) ? input.email.trim() : undefined;

  const saved = await createReservation({
    name,
    phone,
    email,
    date: input.date,
    time: input.time,
    guests,
    notes: input.notes?.trim() || undefined,
  });

  const res = await sendEmail({
    to: BUSINESS_EMAIL,
    replyTo: email,
    subject: `New reservation — ${name} · ${guests} guests (${saved.ref})`,
    html: `<h2>New reservation</h2>
      <p><b>Ref:</b> ${esc(saved.ref)}</p>
      <p><b>Name:</b> ${esc(name)}</p>
      <p><b>Phone:</b> ${esc(phone)}</p>
      ${email ? `<p><b>Email:</b> ${esc(email)}</p>` : ""}
      <p><b>When:</b> ${esc(input.date)} at ${esc(input.time)}</p>
      <p><b>Party size:</b> ${guests}</p>
      ${input.notes ? `<p><b>Notes:</b> ${esc(input.notes)}</p>` : ""}`,
  });
  return res.ok ? { ok: true } : { ok: false, error: res.error! };
}

/* ------------------------------------------------------------------ */
/* Catering inquiry                                                    */
/* ------------------------------------------------------------------ */
export interface CateringInput {
  name: string;
  email: string;
  phone: string;
  date?: string;
  startTime?: string;
  duration?: string;
  venue?: string;
  guests: string;
  type: string;
  serviceStyle?: string;
  budget?: string;
  packageId?: string;
  packageName?: string;
  addOns?: string[];
  estimate?: number;
  dietary?: { veg?: number; vegan?: number; halal?: number; allergyNotes?: string };
  message?: string;
  company?: string;
}

function dramFmt(n: number): string {
  return "֏" + n.toLocaleString("en-US");
}

export async function submitCatering(input: CateringInput): Promise<ActionResult> {
  if (input.company) return { ok: true };
  if (!rateLimit(`cater:${await clientIp()}`, 5)) {
    return { ok: false, error: "Too many requests — please wait a minute." };
  }
  const name = (input.name ?? "").trim();
  if (!name) return { ok: false, error: "Please enter your name." };
  if (!emailOk(input.email)) return { ok: false, error: "Enter a valid email." };
  if (!phoneOk(input.phone)) return { ok: false, error: "Enter a valid phone number." };
  const guests = Number(input.guests);
  if (!input.guests || guests < 1) return { ok: false, error: "Roughly how many guests?" };

  const d = input.dietary ?? {};
  const dietary =
    d.veg || d.vegan || d.halal || d.allergyNotes
      ? {
          veg: Number(d.veg) || undefined,
          vegan: Number(d.vegan) || undefined,
          halal: Number(d.halal) || undefined,
          allergyNotes: d.allergyNotes?.trim() || undefined,
        }
      : undefined;

  const saved = await createCateringInquiry({
    name,
    email: input.email.trim(),
    phone: input.phone.trim(),
    eventType: input.type,
    serviceStyle: input.serviceStyle,
    date: input.date || undefined,
    startTime: input.startTime || undefined,
    duration: input.duration || undefined,
    venue: input.venue?.trim() || undefined,
    guests: Math.max(1, Math.min(2000, guests)),
    packageId: input.packageId,
    packageName: input.packageName,
    addOns: input.addOns?.length ? input.addOns : undefined,
    estimate: input.estimate && input.estimate > 0 ? input.estimate : undefined,
    budget: input.budget,
    dietary,
    message: input.message?.trim() || undefined,
  });

  const dietRow =
    dietary &&
    [
      dietary.veg ? `${dietary.veg} veg` : "",
      dietary.vegan ? `${dietary.vegan} vegan` : "",
      dietary.halal ? `${dietary.halal} halal` : "",
    ]
      .filter(Boolean)
      .join(", ");

  const res = await sendEmail({
    to: BUSINESS_EMAIL,
    replyTo: input.email.trim(),
    subject: `Catering inquiry — ${name} (${esc(input.type)}) · ${saved.ref}`,
    html: `<h2>Catering / events inquiry</h2>
      <p><b>Ref:</b> ${esc(saved.ref)}</p>
      <p><b>Name:</b> ${esc(name)}</p>
      <p><b>Email:</b> ${esc(input.email)}</p>
      <p><b>Phone:</b> ${esc(input.phone)}</p>
      <p><b>Event:</b> ${esc(input.type)}${input.serviceStyle ? ` · ${esc(input.serviceStyle)}` : ""}</p>
      ${input.date ? `<p><b>Date:</b> ${esc(input.date)}${input.startTime ? ` at ${esc(input.startTime)}` : ""}${input.duration ? ` · ${esc(input.duration)}` : ""}</p>` : ""}
      ${input.venue ? `<p><b>Venue:</b> ${esc(input.venue)}</p>` : ""}
      <p><b>Approx. guests:</b> ${esc(input.guests)}</p>
      ${input.packageName ? `<p><b>Package:</b> ${esc(input.packageName)}</p>` : ""}
      ${input.addOns?.length ? `<p><b>Add-ons:</b> ${esc(input.addOns.join(", "))}</p>` : ""}
      ${input.estimate ? `<p><b>Estimate:</b> ${dramFmt(input.estimate)} <i>(self-serve estimate)</i></p>` : ""}
      ${input.budget ? `<p><b>Budget:</b> ${esc(input.budget)}</p>` : ""}
      ${dietRow ? `<p><b>Dietary:</b> ${esc(dietRow)}</p>` : ""}
      ${dietary?.allergyNotes ? `<p><b>Allergies:</b> ${esc(dietary.allergyNotes)}</p>` : ""}
      ${input.message ? `<p><b>Message:</b> ${esc(input.message)}</p>` : ""}`,
  });
  return res.ok ? { ok: true } : { ok: false, error: res.error! };
}

/* ------------------------------------------------------------------ */
/* Catering deposit (Stripe, gated like the rest)                      */
/* ------------------------------------------------------------------ */
export async function createCateringDeposit(input: {
  name?: string;
  email?: string;
  packageName?: string;
  guests?: number;
}): Promise<{ url?: string; error?: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { error: "Online deposits aren't enabled on this deployment yet." };
  if (!rateLimit(`deposit:${await clientIp()}`, 8)) {
    return { error: "Too many attempts — please wait a moment." };
  }
  const amount = Math.max(
    1000,
    Math.min(2_000_000, Number(process.env.CATERING_DEPOSIT_AMD) || 50000),
  );
  const stripe = new Stripe(key);
  const h = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (h.get("host") ? `https://${h.get("host")}` : "http://localhost:3000");
  const minor = (n: number) => Math.round(n * 100);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(input.email && emailOk(input.email) ? { customer_email: input.email.trim() } : {}),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "amd",
            unit_amount: minor(amount),
            product_data: {
              name: "Catering deposit",
              description: input.packageName
                ? `${input.packageName} package${input.guests ? ` · ~${input.guests} guests` : ""} — refundable date hold`
                : "Refundable date hold",
            },
          },
        },
      ],
      success_url: `${origin}/catering?deposit=success`,
      cancel_url: `${origin}/catering?deposit=cancel`,
      metadata: {
        kind: "catering-deposit",
        packageName: input.packageName ?? "",
        guests: String(input.guests ?? ""),
        name: input.name ?? "",
      },
    });
    return session.url ? { url: session.url } : { error: "Could not start the deposit." };
  } catch (err) {
    console.error("[stripe] catering deposit failed", err);
    return { error: "Payment could not be started. Please try again." };
  }
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */
export async function subscribeNewsletter(input: {
  email: string;
  company?: string;
}): Promise<ActionResult> {
  if (input.company) return { ok: true };
  if (!rateLimit(`news:${await clientIp()}`, 8)) {
    return { ok: false, error: "Too many requests — please wait a minute." };
  }
  if (!emailOk(input.email)) return { ok: false, error: "Please enter a valid email." };

  await createNewsletterSignup({ email: input.email.trim(), source: "site" });

  const res = await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `New VIP-list signup`,
    html: `<p>New newsletter signup: <b>${esc(input.email)}</b></p>`,
  });
  return res.ok ? { ok: true } : { ok: false, error: res.error! };
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */
export async function submitContact(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  company?: string;
}): Promise<ActionResult> {
  if (input.company) return { ok: true };
  if (!rateLimit(`contact:${await clientIp()}`, 5)) {
    return { ok: false, error: "Too many requests — please wait a minute." };
  }
  const name = (input.name ?? "").trim();
  const message = (input.message ?? "").trim();
  if (!name) return { ok: false, error: "Please enter your name." };
  if (!emailOk(input.email)) return { ok: false, error: "Enter a valid email." };
  if (message.length < 5) return { ok: false, error: "Please add a short message." };

  const res = await sendEmail({
    to: BUSINESS_EMAIL,
    replyTo: input.email.trim(),
    subject: `Contact form — ${name}`,
    html: `<h2>New message via the website</h2>
      <p><b>Name:</b> ${esc(name)}</p>
      <p><b>Email:</b> ${esc(input.email)}</p>
      ${input.phone ? `<p><b>Phone:</b> ${esc(input.phone)}</p>` : ""}
      <p><b>Message:</b><br/>${esc(message).replace(/\n/g, "<br/>")}</p>`,
  });
  return res.ok ? { ok: true } : { ok: false, error: res.error! };
}

/* ------------------------------------------------------------------ */
/* Gift-card request (purchase notification)                           */
/* ------------------------------------------------------------------ */
export async function requestGiftCard(input: {
  amount: number;
  email?: string;
  message?: string;
  company?: string;
}): Promise<ActionResult> {
  if (input.company) return { ok: true };
  if (!rateLimit(`gift:${await clientIp()}`, 5)) {
    return { ok: false, error: "Too many requests — please wait a minute." };
  }
  const amount = Math.max(1000, Math.min(200000, Number(input.amount) || 0));

  const saved = await createGiftCard({
    amount,
    buyerEmail: input.email && emailOk(input.email) ? input.email.trim() : undefined,
    message: input.message?.trim() || undefined,
  });

  const res = await sendEmail({
    to: BUSINESS_EMAIL,
    replyTo: input.email && emailOk(input.email) ? input.email.trim() : undefined,
    subject: `Gift card request — ${dram(amount)} (${saved.ref})`,
    html: `<p>Gift card requested for <b>${dram(amount)}</b>.</p>
      ${input.email ? `<p><b>Buyer email:</b> ${esc(input.email)}</p>` : ""}
      ${input.message ? `<p><b>Message:</b> ${esc(input.message)}</p>` : ""}`,
  });
  return res.ok ? { ok: true } : { ok: false, error: res.error! };
}

/* ------------------------------------------------------------------ */
/* Stripe Checkout                                                     */
/* ------------------------------------------------------------------ */
export interface CheckoutLineInput {
  name: string;
  price: number; // base unit price in dram
  qty: number;
  addons?: { name: string; price: number }[];
}
export interface CheckoutInput {
  lines: CheckoutLineInput[];
  fulfillment: "delivery" | "pickup";
  tip?: number;
  promo?: string;
}

const PROMOS: Record<string, number> = { BURGER10: 10, YEREVAN15: 15 };
const DELIVERY_FEE = 700;
const VAT_RATE = 0.2;

/* ------------------------------------------------------------------ */
/* Place order WITHOUT a payment provider (cash / pay at restaurant).  */
/* This is the primary checkout path while Stripe is deferred. It       */
/* creates a real persisted Order, emails the customer + restaurant,    */
/* and returns the reference for the success page.                      */
/* ------------------------------------------------------------------ */
export interface PlaceOrderInput {
  lines: CheckoutLineInput[];
  fulfillment: "delivery" | "pickup";
  paymentMethod: "cash" | "restaurant";
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  tip?: number;
  promo?: string;
  company?: string; // honeypot
}

const PAYMENT_LABEL: Record<string, string> = {
  cash: "Cash on delivery",
  restaurant: "Pay at restaurant",
};

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<{ ok: true; ref: string } | { ok: false; error: string }> {
  if (input.company) return { ok: true, ref: "" }; // honeypot → pretend success
  if (!rateLimit(`order:${await clientIp()}`, 8)) {
    return { ok: false, error: "Too many attempts — please wait a moment." };
  }
  const name = (input.name ?? "").trim();
  const phone = (input.phone ?? "").trim();
  const email = input.email && emailOk(input.email) ? input.email.trim() : undefined;
  if (!input.lines?.length) return { ok: false, error: "Your cart is empty." };
  if (!name) return { ok: false, error: "Please enter your name." };
  if (!phoneOk(phone)) return { ok: false, error: "Enter a valid phone number." };
  if (input.fulfillment === "delivery" && !(input.address ?? "").trim()) {
    return { ok: false, error: "Please add a delivery address." };
  }
  if (input.paymentMethod !== "cash" && input.paymentMethod !== "restaurant") {
    return { ok: false, error: "Choose how you'll pay." };
  }

  // Totals are computed server-side — never trust the client.
  let foodTotal = 0;
  const orderLines = input.lines.map((l) => {
    const addonSum = (l.addons ?? []).reduce((s, a) => s + a.price, 0);
    const qty = Math.max(1, Math.min(99, Number(l.qty) || 1));
    const lineSum = (l.price + addonSum) * qty;
    foodTotal += lineSum;
    const addonNames = (l.addons ?? []).map((a) => a.name).join(", ");
    return { name: addonNames ? `${l.name} (${addonNames})` : l.name, qty, price: lineSum };
  });

  const deliveryFee = input.fulfillment === "delivery" ? DELIVERY_FEE : 0;
  const tax = Math.round((foodTotal + deliveryFee) * VAT_RATE);
  const tip = Math.max(0, Math.min(100000, Number(input.tip) || 0));
  const pct = input.promo ? PROMOS[input.promo.trim().toUpperCase()] ?? 0 : 0;
  const discount = pct > 0 ? Math.round((foodTotal * pct) / 100) : 0;
  const total = Math.max(0, foodTotal + deliveryFee + tax + tip - discount);

  const noteParts = [
    PAYMENT_LABEL[input.paymentMethod],
    input.address?.trim() ? `Address: ${input.address.trim()}` : "",
    input.notes?.trim() ? `Notes: ${input.notes.trim()}` : "",
    discount ? `Promo ${input.promo!.toUpperCase()} (−${dram(discount)})` : "",
  ].filter(Boolean);

  const order = await createOrder({
    status: "received",
    customerName: name,
    email,
    phone,
    fulfillment: input.fulfillment,
    paymentMethod: input.paymentMethod,
    lines: orderLines,
    total,
    currency: "AMD",
    note: noteParts.join(" · "),
  });

  // Customer confirmation (when an email is given) + restaurant notification.
  if (email) await sendOrderReceipt(order);
  await sendEmail({
    to: BUSINESS_EMAIL,
    replyTo: email,
    subject: `New order ${order.ref} — ${dram(total)} (${PAYMENT_LABEL[input.paymentMethod]})`,
    html: `<h2>New order — ${esc(PAYMENT_LABEL[input.paymentMethod])}</h2>
      <p><b>Ref:</b> ${esc(order.ref)} · <b>${esc(input.fulfillment)}</b></p>
      <p><b>Customer:</b> ${esc(name)} · ${esc(phone)}${email ? ` · ${esc(email)}` : ""}</p>
      ${input.address?.trim() ? `<p><b>Address:</b> ${esc(input.address.trim())}</p>` : ""}
      <ul>${orderLines.map((l) => `<li>${esc(l.name)} ×${l.qty} — ${dram(l.price)}</li>`).join("")}</ul>
      <p><b>Total:</b> ${dram(total)} (incl. VAT ${dram(tax)}${deliveryFee ? `, delivery ${dram(deliveryFee)}` : ""}${tip ? `, tip ${dram(tip)}` : ""}${discount ? `, −${dram(discount)} promo` : ""})</p>
      ${input.notes?.trim() ? `<p><b>Notes:</b> ${esc(input.notes.trim())}</p>` : ""}`,
  });

  return { ok: true, ref: order.ref };
}

export async function createCheckoutSession(
  input: CheckoutInput,
): Promise<{ url?: string; error?: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { error: "Online payment isn't configured yet." };
  if (!input.lines?.length) return { error: "Your cart is empty." };
  if (!rateLimit(`checkout:${await clientIp()}`, 12)) {
    return { error: "Too many attempts — please wait a moment." };
  }

  const stripe = new Stripe(key);
  const h = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (h.get("host") ? `https://${h.get("host")}` : "http://localhost:3000");
  // AMD has 2-decimal subunits in Stripe → multiply dram by 100.
  const minor = (n: number) => Math.round(n * 100);

  let foodTotal = 0;
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = input.lines.map((l) => {
    const addonSum = (l.addons ?? []).reduce((s, a) => s + a.price, 0);
    const unit = l.price + addonSum;
    foodTotal += unit * l.qty;
    const description = (l.addons ?? []).map((a) => a.name).join(", ");
    return {
      quantity: Math.max(1, Math.min(99, l.qty)),
      price_data: {
        currency: "amd",
        unit_amount: minor(unit),
        product_data: { name: l.name, ...(description ? { description } : {}) },
      },
    };
  });

  const deliveryFee = input.fulfillment === "delivery" ? DELIVERY_FEE : 0;
  if (deliveryFee) {
    line_items.push({
      quantity: 1,
      price_data: { currency: "amd", unit_amount: minor(deliveryFee), product_data: { name: "Delivery" } },
    });
  }
  const tax = Math.round((foodTotal + deliveryFee) * VAT_RATE);
  if (tax > 0) {
    line_items.push({
      quantity: 1,
      price_data: { currency: "amd", unit_amount: minor(tax), product_data: { name: "VAT (20%)" } },
    });
  }
  const tip = Math.max(0, Math.min(100000, Number(input.tip) || 0));
  if (tip > 0) {
    line_items.push({
      quantity: 1,
      price_data: { currency: "amd", unit_amount: minor(tip), product_data: { name: "Tip" } },
    });
  }

  const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
  const pct = input.promo ? PROMOS[input.promo.trim().toUpperCase()] ?? 0 : 0;
  if (pct > 0) {
    const coupon = await stripe.coupons.create({
      percent_off: pct,
      duration: "once",
      name: `Promo ${input.promo!.toUpperCase()}`,
    });
    discounts.push({ coupon: coupon.id });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      ...(discounts.length ? { discounts } : {}),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: { fulfillment: input.fulfillment },
    });
    return session.url ? { url: session.url } : { error: "Could not start checkout." };
  } catch (err) {
    console.error("[stripe] session create failed", err);
    return { error: "Payment could not be started. Please try again." };
  }
}
