"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart, lineTotal } from "@/lib/cart";
import { dram, SITE } from "@/lib/site";
import { placeOrder, createCheckoutSession } from "@/lib/actions";
import NumberTicker from "@/components/ui/NumberTicker";
import OrderOnline from "@/components/ui/OrderOnline";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/cn";
import { Bag, Truck, Pin } from "@/components/ui/icons";

type Fulfillment = "delivery" | "pickup";
type PayMethod = "cash" | "restaurant" | "online";

const DELIVERY_FEE = 700;
const VAT_RATE = 0.2;
const TIP_PCTS = [0, 5, 10, 15];

// ── Stripe is intentionally deferred (not available in Armenia yet) ──────────
// Online card payment turns on automatically the moment Stripe keys exist.
// To re-enable later: set STRIPE_SECRET_KEY + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// (+ STRIPE_WEBHOOK_SECRET) — see README/DEPLOYMENT.md. No code change needed.
const STRIPE_ENABLED = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export default function CheckoutView() {
  const { lines, subtotal, count, clear } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [payMethod, setPayMethod] = useState<PayMethod>("cash");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [tipPct, setTipPct] = useState(0);
  const [promo, setPromo] = useState("");
  const [placing, setPlacing] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-char px-6 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-line text-muted">
          <Bag width={28} height={28} />
        </span>
        <p className="font-display text-2xl text-cream">Nothing to check out</p>
        <Link
          href="/menu"
          className="btn-gold mt-1 inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  const deliveryFee = fulfillment === "delivery" ? DELIVERY_FEE : 0;
  const tax = Math.round((subtotal + deliveryFee) * VAT_RATE);
  const tip = Math.round((subtotal * tipPct) / 100);
  const total = subtotal + deliveryFee + tax + tip;

  // Payment options depend on fulfillment; "online" only appears when Stripe is on.
  const payOptions: { id: PayMethod; label: string; sub: string }[] = [
    fulfillment === "delivery"
      ? { id: "cash", label: "Cash on delivery", sub: "Pay the driver" }
      : { id: "restaurant", label: "Pay at restaurant", sub: "Pay when you collect" },
    ...(STRIPE_ENABLED ? [{ id: "online" as const, label: "Pay online", sub: "Card via Stripe" }] : []),
  ];

  function changeFulfillment(next: Fulfillment) {
    setFulfillment(next);
    // Keep the payment method valid for the new mode.
    setPayMethod((cur) => (cur === "online" ? "online" : next === "delivery" ? "cash" : "restaurant"));
  }

  const fieldBase =
    "w-full rounded-xl border border-line bg-char px-4 py-3 text-cream placeholder-muted focus:border-gold focus:outline-none";

  async function payOnline() {
    const res = await createCheckoutSession({
      lines: lines.map((l) => ({ name: l.name, price: l.price, qty: l.qty, addons: l.addons })),
      fulfillment,
      tip,
      promo: promo.trim() || undefined,
    });
    if (res.url) {
      window.location.assign(res.url); // → Stripe Checkout
      return true;
    }
    toast({ title: "Couldn't start payment", desc: res.error, tone: "error" });
    return false;
  }

  async function submitOrder() {
    if (placing) return;
    if (!name.trim()) return toast({ title: "Add your name", tone: "error" });
    if (!/^[0-9 +()-]{6,18}$/.test(phone.trim()))
      return toast({ title: "Add a valid phone number", tone: "error" });
    if (fulfillment === "delivery" && !address.trim())
      return toast({ title: "Add a delivery address", tone: "error" });

    setPlacing(true);

    if (payMethod === "online") {
      const ok = await payOnline();
      if (!ok) setPlacing(false);
      return;
    }

    const res = await placeOrder({
      lines: lines.map((l) => ({ name: l.name, price: l.price, qty: l.qty, addons: l.addons })),
      fulfillment,
      paymentMethod: payMethod,
      name,
      phone,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
      tip,
      promo: promo.trim() || undefined,
    });

    if (res.ok) {
      clear();
      router.push(`/checkout/success?ref=${encodeURIComponent(res.ref)}`);
      return;
    }
    setPlacing(false);
    toast({ title: "Couldn't place the order", desc: res.error, tone: "error" });
  }

  const primaryLabel =
    payMethod === "online" ? `Pay ${dram(total)}` : `Place order · ${dram(total)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Form */}
      <form className="space-y-8 lg:col-span-2" onSubmit={(e) => e.preventDefault()}>
        {/* Fulfillment toggle */}
        <fieldset>
          <legend className="mb-3 font-display text-xl text-cream">How would you like it?</legend>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { id: "delivery", label: "Delivery", Icon: Truck, sub: `To your door · ${dram(DELIVERY_FEE)}` },
                { id: "pickup", label: "Pickup", Icon: Pin, sub: "Saryan St · free" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={fulfillment === opt.id}
                onClick={() => changeFulfillment(opt.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                  fulfillment === opt.id ? "border-gold bg-gold/10" : "border-line hover:border-gold/50",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl border",
                    fulfillment === opt.id ? "border-gold/40 bg-gold/15 text-gold" : "border-line text-muted",
                  )}
                >
                  <opt.Icon width={20} height={20} />
                </span>
                <span>
                  <span className="block font-semibold text-cream">{opt.label}</span>
                  <span className="text-xs text-muted">{opt.sub}</span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Contact + delivery */}
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-3 font-display text-xl text-cream">Your details</legend>
          <div>
            <label htmlFor="co-name" className="mb-1.5 block text-sm font-semibold text-sand">
              Full name
            </label>
            <input id="co-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" className={fieldBase} />
          </div>
          <div>
            <label htmlFor="co-phone" className="mb-1.5 block text-sm font-semibold text-sand">
              Phone
            </label>
            <input id="co-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+374 ..." className={fieldBase} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="co-email" className="mb-1.5 block text-sm font-semibold text-sand">
              Email <span className="font-normal text-muted">(for your confirmation)</span>
            </label>
            <input id="co-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@email.com" className={fieldBase} />
          </div>
          {fulfillment === "delivery" && (
            <div className="sm:col-span-2">
              <label htmlFor="co-addr" className="mb-1.5 block text-sm font-semibold text-sand">
                Delivery address
              </label>
              <input id="co-addr" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" placeholder="Street, building, apartment" className={fieldBase} />
            </div>
          )}
          <div className="sm:col-span-2">
            <label htmlFor="co-notes" className="mb-1.5 block text-sm font-semibold text-sand">
              Notes <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea id="co-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, doorbell, etc." className={fieldBase} />
          </div>
        </fieldset>

        {/* Payment method */}
        <fieldset>
          <legend className="mb-3 font-display text-xl text-cream">Payment</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {payOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={payMethod === opt.id}
                onClick={() => setPayMethod(opt.id)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors",
                  payMethod === opt.id ? "border-gold bg-gold/10" : "border-line hover:border-gold/50",
                )}
              >
                <span>
                  <span className="block font-semibold text-cream">{opt.label}</span>
                  <span className="text-xs text-muted">{opt.sub}</span>
                </span>
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                    payMethod === opt.id ? "border-gold bg-gold" : "border-line",
                  )}
                >
                  {payMethod === opt.id && <span className="h-2 w-2 rounded-full bg-ink" />}
                </span>
              </button>
            ))}
          </div>
          {!STRIPE_ENABLED && (
            <p className="mt-2 text-xs text-muted">
              💳 Card payment is coming soon. Your order is placed now and paid on{" "}
              {fulfillment === "delivery" ? "delivery" : "collection"}.
            </p>
          )}
        </fieldset>

        {/* Tip + promo */}
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-3 font-display text-xl text-cream">Tip &amp; promo</legend>
          <div>
            <span className="mb-1.5 block text-sm font-semibold text-sand">Add a tip</span>
            <div className="flex flex-wrap gap-2">
              {TIP_PCTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={tipPct === p}
                  onClick={() => setTipPct(p)}
                  className={cn(
                    "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    tipPct === p ? "border-gold bg-gold/15 text-gold" : "border-line text-sand hover:border-gold/50",
                  )}
                >
                  {p === 0 ? "No tip" : `${p}%`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="co-promo" className="mb-1.5 block text-sm font-semibold text-sand">
              Promo code <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id="co-promo"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="e.g. BURGER10"
              className={cn(fieldBase, "uppercase placeholder:normal-case")}
            />
            <p className="mt-1 text-xs text-muted">Applied to your order total.</p>
          </div>
        </fieldset>
      </form>

      {/* Summary + place order */}
      <aside className="lg:col-span-1">
        <div className="sticky top-28 rounded-3xl border border-line bg-char p-6">
          <h2 className="font-display text-2xl text-cream">Order summary</h2>
          <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            {lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-3 text-sand">
                <span>
                  {l.qty} × {l.name}
                </span>
                <span className="whitespace-nowrap text-muted">{dram(lineTotal(l))}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between text-sand">
              <span>Subtotal · {count} item{count === 1 ? "" : "s"}</span>
              <span>{dram(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sand">
              <span>{fulfillment === "delivery" ? "Delivery" : "Pickup"}</span>
              <span>{deliveryFee === 0 ? "Free" : dram(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sand">
              <span>VAT (20%)</span>
              <span>{dram(tax)}</span>
            </div>
            {tip > 0 && (
              <div className="flex justify-between text-sand">
                <span>Tip ({tipPct}%)</span>
                <span>{dram(tip)}</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="font-semibold text-cream">Total</span>
            <NumberTicker value={total} format={(n) => dram(Math.round(n))} className="font-display text-2xl text-gold" />
          </div>

          <button
            type="button"
            onClick={submitOrder}
            disabled={placing}
            className="btn-gold beam mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {placing ? (payMethod === "online" ? "Redirecting…" : "Placing…") : primaryLabel}
          </button>
          <p className="mt-2 text-center text-xs text-muted">
            {payMethod === "online"
              ? "Secure card payment via Stripe."
              : `No payment now — pay on ${fulfillment === "delivery" ? "delivery" : "collection"}. We'll confirm by phone${email ? " & email" : ""}.`}
          </p>

          {/* Secondary: external delivery apps */}
          <div className="mt-4 border-t border-line pt-4">
            <p className="mb-2 text-center text-xs uppercase tracking-widest text-muted">
              Or order via a delivery app
            </p>
            <OrderOnline
              variant="ghost"
              align="center"
              label="Order via delivery apps"
              className="w-full [&>button]:w-full [&>button]:justify-center [&>button]:px-4 [&>button]:py-3"
            />
          </div>

          <button
            onClick={clear}
            className="mt-3 block w-full cursor-pointer text-center text-sm text-muted underline-offset-4 hover:text-ember hover:underline"
          >
            Clear cart
          </button>
          <p className="mt-3 text-center text-[11px] text-muted">{SITE.name} · Yerevan</p>
        </div>
      </aside>
    </div>
  );
}
