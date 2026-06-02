"use client";

import Link from "next/link";
import { useCart, lineTotal } from "@/lib/cart";
import { unsplash, BLUR, dram } from "@/lib/site";
import SafeImage from "@/components/ui/SafeImage";
import NumberTicker from "@/components/ui/NumberTicker";
import OrderOnline from "@/components/ui/OrderOnline";
import CartUpsell from "@/components/cart/CartUpsell";
import { Minus, Plus, CloseIcon, Bag, ArrowRight } from "@/components/ui/icons";

export default function CartView() {
  const { lines, subtotal, count, setQty, removeItem, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-char px-6 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-line text-muted">
          <Bag width={28} height={28} />
        </span>
        <p className="font-display text-2xl text-cream">Your cart is empty</p>
        <p className="max-w-sm text-sm text-muted">
          Browse the menu and add something flame-grilled.
        </p>
        <Link
          href="/menu"
          className="btn-gold mt-1 inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Line items */}
      <div className="space-y-4 lg:col-span-2">
        {lines.map((l) => (
          <div
            key={l.id}
            className="flex gap-4 rounded-2xl border border-line bg-char p-4"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-line">
              <SafeImage
                src={unsplash(l.img, 300)}
                alt={l.name}
                fill
                sizes="96px"
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/menu/${l.slug}`}
                  className="font-display text-lg text-cream hover:text-gold"
                >
                  {l.name}
                </Link>
                <button
                  onClick={() => removeItem(l.id)}
                  aria-label={`Remove ${l.name}`}
                  className="cursor-pointer text-muted hover:text-ember"
                >
                  <CloseIcon width={18} height={18} />
                </button>
              </div>
              {l.addons.length > 0 && (
                <p className="mt-0.5 text-xs text-muted">
                  {l.addons.map((a) => a.name).join(", ")}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="inline-flex items-center gap-3 rounded-full border border-line px-2 py-1">
                  <button
                    onClick={() => setQty(l.id, l.qty - 1)}
                    aria-label="Decrease quantity"
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-cream hover:text-gold"
                  >
                    <Minus width={15} height={15} />
                  </button>
                  <span className="min-w-[2ch] text-center text-cream">{l.qty}</span>
                  <button
                    onClick={() => setQty(l.id, l.qty + 1)}
                    aria-label="Increase quantity"
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-cream hover:text-gold"
                  >
                    <Plus width={15} height={15} />
                  </button>
                </div>
                <span className="font-display text-lg text-gold">{dram(lineTotal(l))}</span>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={clear}
          className="cursor-pointer text-sm text-muted underline-offset-4 hover:text-ember hover:underline"
        >
          Clear cart
        </button>
      </div>

      {/* Summary */}
      <aside className="lg:col-span-1">
        <div className="sticky top-28 rounded-3xl border border-line bg-char p-6">
          <h2 className="font-display text-2xl text-cream">Order summary</h2>
          <div className="mt-5 border-t border-line pt-5">
            <CartUpsell subtotal={subtotal} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sand">
              Subtotal <span className="text-muted">· {count} item{count === 1 ? "" : "s"}</span>
            </span>
            <NumberTicker
              value={subtotal}
              format={(n) => dram(Math.round(n))}
              className="font-display text-2xl text-gold"
            />
          </div>
          <p className="mt-1 text-xs text-muted">Taxes &amp; delivery calculated at checkout.</p>
          <Link
            href="/checkout"
            className="btn-gold beam mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold"
          >
            Review your order <ArrowRight width={18} height={18} />
          </Link>
          <Link
            href="/menu"
            className="mt-3 block text-center text-sm text-muted hover:text-gold"
          >
            Continue shopping
          </Link>

          {/* Secondary: external delivery apps */}
          <div className="mt-5 border-t border-line pt-4">
            <p className="mb-2 text-center text-xs uppercase tracking-widest text-muted">
              Prefer a delivery app?
            </p>
            <OrderOnline
              variant="ghost"
              align="center"
              label="Order via delivery apps"
              className="w-full [&>button]:w-full [&>button]:justify-center [&>button]:px-4 [&>button]:py-3"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
