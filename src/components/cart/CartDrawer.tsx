"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart, lineTotal } from "@/lib/cart";
import { unsplash, BLUR, dram } from "@/lib/site";
import SafeImage from "@/components/ui/SafeImage";
import NumberTicker from "@/components/ui/NumberTicker";
import CartUpsell from "@/components/cart/CartUpsell";
import { CloseIcon, Minus, Plus, Bag, ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export default function CartDrawer() {
  const { open, closeCart, lines, subtotal, count, setQty, removeItem } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
        return;
      }
      if (e.key === "Tab") {
        const f = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, a, input, [tabindex]:not([tabindex="-1"])',
        );
        if (!f || f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restore.current?.focus?.();
    };
  }, [open, closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={closeCart}
        className={cn(
          "fixed inset-0 z-(--z-drawer-backdrop) bg-ink/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        inert={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-(--z-drawer-panel) flex w-full max-w-md flex-col border-l border-line bg-char shadow-2xl shadow-black/50 transition-transform duration-300 will-change-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl text-cream">
            Your cart{" "}
            {count > 0 && <span className="text-base text-muted">· {count}</span>}
          </h2>
          <button
            ref={closeRef}
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-line text-cream hover:border-gold hover:text-gold"
          >
            <CloseIcon width={18} height={18} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-line text-muted">
              <Bag width={28} height={28} />
            </span>
            <p className="font-display text-xl text-cream">Your cart is empty</p>
            <p className="max-w-xs text-sm text-muted">
              Add something flame-grilled from the menu to get started.
            </p>
            <Link
              href="/menu"
              onClick={closeCart}
              className="btn-gold mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {lines.map((l) => (
                <div key={l.id} className="flex gap-3 border-b border-line py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line">
                    <SafeImage
                      src={unsplash(l.img, 200)}
                      alt={l.name}
                      fill
                      sizes="64px"
                      placeholder="blur"
                      blurDataURL={BLUR}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-cream">{l.name}</span>
                      <button
                        onClick={() => removeItem(l.id)}
                        aria-label={`Remove ${l.name}`}
                        className="cursor-pointer text-muted hover:text-ember"
                      >
                        <CloseIcon width={16} height={16} />
                      </button>
                    </div>
                    {l.addons.length > 0 && (
                      <p className="mt-0.5 text-xs text-muted">
                        {l.addons.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center gap-3 rounded-full border border-line px-2 py-1">
                        <button
                          onClick={() => setQty(l.id, l.qty - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-7 w-7 cursor-pointer place-items-center rounded-full text-cream hover:text-gold"
                        >
                          <Minus width={14} height={14} />
                        </button>
                        <span className="min-w-[1.5ch] text-center text-sm text-cream">
                          {l.qty}
                        </span>
                        <button
                          onClick={() => setQty(l.id, l.qty + 1)}
                          aria-label="Increase quantity"
                          className="grid h-7 w-7 cursor-pointer place-items-center rounded-full text-cream hover:text-gold"
                        >
                          <Plus width={14} height={14} />
                        </button>
                      </div>
                      <span className="font-display text-gold">{dram(lineTotal(l))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line p-5">
              <div className="mb-4">
                <CartUpsell subtotal={subtotal} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sand">Subtotal</span>
                <NumberTicker
                  value={subtotal}
                  format={(n) => dram(Math.round(n))}
                  className="font-display text-2xl text-gold"
                />
              </div>
              <p className="mt-1 text-xs text-muted">
                Taxes &amp; delivery calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-gold beam mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
              >
                Review your order <ArrowRight width={18} height={18} />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-2 block text-center text-sm text-muted hover:text-gold"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
