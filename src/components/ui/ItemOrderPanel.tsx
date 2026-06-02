"use client";

import Link from "next/link";
import { useState } from "react";
import { dram, type MenuItem } from "@/lib/site";
import { type AddPayload } from "@/lib/cart";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { Minus, Plus, Check, ChevronLeft } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const MAX_QTY = 20;
const flyFromHero = () =>
  (document.querySelector("[data-detail-hero] img") as HTMLElement | null) ?? null;

/** Quantity stepper + optional add-on chips + live total, wired to the cart. */
export default function ItemOrderPanel({ item }: { item: MenuItem }) {
  const addons = item.addons;
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const chosenAddons = (addons ?? []).filter((a) => selected.includes(a.name));
  const addonTotal = chosenAddons.reduce((s, a) => s + a.price, 0);
  const total = (item.price + addonTotal) * qty;

  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  const getPayload = (): AddPayload => ({
    slug: item.slug,
    name: item.name,
    img: item.img,
    price: item.price,
    qty,
    addons: chosenAddons.map((a) => ({ name: a.name, price: a.price })),
  });

  return (
    <div className="mt-8 border-t border-line pt-8">
      <h2 className="font-display text-2xl text-cream">Customize</h2>

      {/* Quantity */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-sand">Quantity</span>
        <div className="inline-flex items-center gap-4 rounded-xl border border-line bg-ink px-3 py-2">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Fewer"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-cream transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus width={16} height={16} />
          </button>
          <span className="min-w-[2ch] text-center font-display text-xl text-cream" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
            disabled={qty >= MAX_QTY}
            aria-label="More"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-cream transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus width={16} height={16} />
          </button>
        </div>
      </div>

      {/* Add-ons */}
      {addons && addons.length > 0 && (
        <div className="mt-7">
          <p className="mb-3 text-sm font-semibold text-sand">
            Add-ons <span className="font-normal text-muted">· optional</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {addons.map((a) => {
              const on = selected.includes(a.name);
              return (
                <button
                  key={a.name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(a.name)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                    on
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-line text-sand hover:border-gold/50 hover:text-cream",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-4 w-4 place-items-center rounded-full border transition-colors",
                      on ? "border-gold bg-gold text-ink" : "border-line",
                    )}
                  >
                    {on && <Check width={11} height={11} />}
                  </span>
                  <span className="font-medium">{a.name}</span>
                  {a.price > 0 && <span className="text-xs text-muted">+{dram(a.price)}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop inline CTA */}
      <div className="mt-9 hidden items-center justify-between gap-4 md:flex">
        <div>
          <span className="block text-xs uppercase tracking-widest text-muted">Total</span>
          <span className="font-display text-3xl text-gold">{dram(total)}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/menu"
            className="btn-ghost inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-200"
          >
            <ChevronLeft width={16} height={16} /> Back to menu
          </Link>
          <AddToCartButton
            getPayload={getPayload}
            flyFrom={flyFromHero}
            label={`Add to order · ${dram(total)}`}
          />
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-(--z-actionbar) border-t border-line bg-char/95 backdrop-blur md:hidden">
        <div
          className="mx-auto flex max-w-content items-center gap-3 px-4 py-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex-1">
            <span className="block text-xs text-muted">Total</span>
            <span className="font-display text-xl text-gold">{dram(total)}</span>
          </div>
          <AddToCartButton
            getPayload={getPayload}
            flyFrom={flyFromHero}
            label="Add to order"
            className="[&]:px-6 [&]:py-3"
          />
        </div>
      </div>
    </div>
  );
}
