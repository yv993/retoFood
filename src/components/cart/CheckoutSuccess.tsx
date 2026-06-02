"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { fireConfetti } from "@/lib/confetti";
import { Check, ArrowRight } from "@/components/ui/icons";

/** Shown after a successful Stripe payment — clears the cart once. */
export default function CheckoutSuccess() {
  const { clear } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const raf = requestAnimationFrame(() => {
      clear();
      fireConfetti(48);
    });
    return () => cancelAnimationFrame(raf);
  }, [clear]);

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-line bg-char p-8 text-center sm:p-10">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
        <Check width={30} height={30} />
      </span>
      <h2 className="mt-5 font-display text-3xl text-cream">Order confirmed 🎉</h2>
      <p className="mt-3 text-sand">
        Thank you! Your payment went through and the kitchen is on it. A receipt is on its
        way to your email.
      </p>
      <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/menu"
          className="btn-gold inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
        >
          Order more <ArrowRight width={16} height={16} />
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-gold">
          Back to home
        </Link>
      </div>
    </div>
  );
}
