"use client";

import { FREE_DELIVERY_THRESHOLD, dram } from "@/lib/site";
import { Truck } from "@/components/ui/icons";

/** Free-delivery progress hint shown in the cart drawer + cart page. */
export default function CartUpsell({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));
  const unlocked = remaining === 0;

  return (
    <div className="rounded-2xl border border-line bg-ink p-3">
      <p className="flex items-center gap-2 text-xs text-sand">
        <Truck width={15} height={15} className={unlocked ? "text-gold" : "text-muted"} />
        {unlocked ? (
          <span>You&rsquo;ve unlocked free delivery 🎉</span>
        ) : (
          <span>
            Add <span className="font-semibold text-gold">{dram(remaining)}</span> more for
            free delivery
          </span>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-goldlt transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
