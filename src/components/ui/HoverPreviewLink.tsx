"use client";

import Link from "next/link";
import { useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { unsplash, BLUR, dram } from "@/lib/site";
import { useHasHover } from "@/lib/clientHooks";
import { cn } from "@/lib/cn";

/**
 * Menu-item link that shows a small floating image+price preview on hover/focus
 * (desktop only). The card is absolutely positioned → zero layout shift.
 */
export default function HoverPreviewLink({
  href,
  name,
  img,
  price,
}: {
  href: string;
  name: string;
  img: string;
  price: number;
}) {
  const hasHover = useHasHover();
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <Link
        href={href}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="font-semibold text-cream transition-colors hover:text-gold"
      >
        {name}
      </Link>

      {hasHover && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-full left-0 z-(--z-popover) mb-2 block w-48 overflow-hidden rounded-xl border border-line bg-char shadow-2xl shadow-black/50 transition-all duration-200",
            open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
          )}
        >
          <span className="relative block aspect-[4/3]">
            <SafeImage
              src={unsplash(img, 400)}
              alt={name}
              fill
              sizes="192px"
              placeholder="blur"
              blurDataURL={BLUR}
              className="object-cover"
            />
          </span>
          <span className="flex items-center justify-between gap-2 p-2.5">
            <span className="text-xs text-cream">{name}</span>
            <span className="font-display text-sm text-gold">{dram(price)}</span>
          </span>
        </span>
      )}
    </span>
  );
}
