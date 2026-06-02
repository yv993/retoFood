"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { Phone, Bag } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/** Always-reachable mobile action bar: Cart · Menu · Reserve · Call. */
export default function MobileActionBar() {
  const pathname = usePathname();
  const { count, openCart } = useCart();

  // Item detail pages render their own sticky "Add to order" bar.
  if (/^\/menu\/.+/.test(pathname)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-(--z-actionbar) border-t border-line bg-char/90 backdrop-blur md:hidden">
      <div
        className="mx-auto grid max-w-content grid-cols-4 gap-2 px-3 py-2"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={openCart}
          aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          className={cn(
            "relative flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-sm font-semibold",
            count > 0 ? "border-gold/40 bg-gold/10 text-gold" : "border-line bg-ink text-cream",
          )}
        >
          <Bag width={16} height={16} /> Cart
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
        <Link
          href="/menu"
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-ink px-2 py-2.5 text-sm font-semibold text-cream"
        >
          Menu
        </Link>
        <Link
          href="/reserve"
          className="btn-gold flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-sm font-bold"
        >
          Reserve
        </Link>
        <a
          href={`tel:${SITE.contact.phoneHref}`}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-ink px-2 py-2.5 text-sm font-semibold text-cream"
        >
          <Phone width={16} height={16} /> Call
        </a>
      </div>
    </div>
  );
}
