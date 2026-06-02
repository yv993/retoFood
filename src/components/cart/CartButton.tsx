"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { Bag } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/** Navbar cart button with live count badge + border-beam when filled. */
export default function CartButton({
  withId = false,
  className,
}: {
  withId?: boolean;
  className?: string;
}) {
  const { count, openCart, lastAddedAt } = useCart();
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (lastAddedAt === 0) return;
    const r = requestAnimationFrame(() => setBounce(true));
    const t = setTimeout(() => setBounce(false), 540);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(t);
    };
  }, [lastAddedAt]);

  return (
    <button
      {...(withId ? { id: "cart-target" } : {})}
      type="button"
      onClick={openCart}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className={cn(
        "relative grid h-11 w-11 cursor-pointer place-items-center rounded-full border transition-colors duration-200",
        count > 0 ? "border-gold/40 text-gold" : "border-line text-cream hover:border-gold/50",
        className,
      )}
    >
      <Bag width={20} height={20} />
      {count > 0 && (
        <span
          className={cn(
            "absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink",
            bounce && "badge-pop",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
