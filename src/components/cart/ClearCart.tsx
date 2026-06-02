"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { fireConfetti } from "@/lib/confetti";

/** Clears the cart + fires confetti once on the confirmation page. Renders nothing. */
export default function ClearCart({ celebrate = true }: { celebrate?: boolean }) {
  const { clear } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const raf = requestAnimationFrame(() => {
      clear();
      if (celebrate) fireConfetti(48);
    });
    return () => cancelAnimationFrame(raf);
  }, [clear, celebrate]);

  return null;
}
