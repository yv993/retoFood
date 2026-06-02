"use client";

import { useRef, useState } from "react";
import { dram } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/ui/ToastProvider";
import { fireConfetti } from "@/lib/confetti";
import { flyToCart } from "@/lib/flyToCart";
import { requestGiftCard } from "@/lib/actions";
import { Gift, Check } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const AMOUNTS = [5000, 10000, 20000, 50000];
const GIFT_IMG = "1568901346375-23c9450c58cd";

export default function GiftCard() {
  const { toast } = useToast();
  const { addItem, openCart } = useCart();
  const [amount, setAmount] = useState(10000);
  const visualRef = useRef<HTMLDivElement>(null);

  async function buy() {
    addItem({
      slug: `gift-card-${amount}`,
      name: `Gift Card · ${dram(amount)}`,
      img: GIFT_IMG,
      price: amount,
      qty: 1,
    });
    flyToCart(visualRef.current);
    fireConfetti();
    openCart();
    const res = await requestGiftCard({ amount });
    toast(
      res.ok
        ? {
            title: "Gift card added 🎁",
            desc: `A ${dram(amount)} BurgerHouse gift card was added to your cart.`,
          }
        : { title: "Added to cart", desc: res.error, tone: "error" },
    );
  }

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      {/* Visual */}
      <div
        ref={visualRef}
        className="relative mx-auto aspect-[1.6/1] w-full max-w-md overflow-hidden rounded-3xl border border-gold/30 p-7 shadow-2xl shadow-black/50"
        style={{ background: "linear-gradient(135deg,#1c1a17,#0e0e0f 60%)" }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl font-bold text-cream">
              Burger<span className="text-gold">House</span>
            </span>
            <Gift width={26} height={26} className="text-gold" />
          </div>
          <div>
            <p className="eyebrow text-muted">Gift Card</p>
            <p className="mt-1 font-display text-5xl text-gold">{dram(amount)}</p>
          </div>
          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted">
            <span>Yerevan · Saryan St</span>
            <span>No expiry</span>
          </div>
        </div>
      </div>

      {/* Picker */}
      <div>
        <p className="eyebrow text-gold">Choose an amount</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              aria-pressed={amount === a}
              className={cn(
                "cursor-pointer rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200",
                amount === a
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-line text-sand hover:border-gold/50 hover:text-cream",
              )}
            >
              {dram(a)}
            </button>
          ))}
        </div>

        <ul className="mt-7 space-y-3 text-sm text-sand">
          {[
            "Redeemable in-store and on every delivery app",
            "Delivered instantly by email with a personal note",
            "Never expires — spend it whenever hunger strikes",
          ].map((perk) => (
            <li key={perk} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <Check width={12} height={12} />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <button
          onClick={buy}
          className="btn-gold mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition-all duration-200"
        >
          <Gift width={18} height={18} /> Buy a gift card · {dram(amount)}
        </button>
      </div>
    </div>
  );
}
