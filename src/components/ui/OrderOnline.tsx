"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DELIVERY } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Bag, ArrowRight, CloseIcon } from "@/components/ui/icons";

type Variant = "gold" | "ghost" | "bar";

/**
 * Order-online disclosure. Renders a trigger button and a popover (desktop
 * dropdown / mobile bottom sheet) listing the delivery partners.
 */
export default function OrderOnline({
  label = "Order Online",
  variant = "gold",
  className,
  align = "right",
}: {
  label?: string;
  variant?: Variant;
  className?: string;
  align?: "right" | "left" | "center";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerCls =
    variant === "gold"
      ? "btn-gold gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
      : variant === "ghost"
        ? "btn-ghost gap-2 rounded-full px-7 py-4 text-sm font-semibold"
        : "flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2.5 text-sm font-bold text-gold";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center transition-all duration-200",
          triggerCls,
        )}
      >
        <Bag width={variant === "bar" ? 16 : 18} height={variant === "bar" ? 16 : 18} />
        {label}
      </button>

      {/* Mobile bottom sheet */}
      {open && (
        <div
          className="fixed inset-0 z-(--z-popover) bg-ink/60 backdrop-blur-sm sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <div
        id={panelId}
        role="dialog"
        aria-label="Order online"
        aria-hidden={!open}
        className={cn(
          // Mobile: bottom sheet. Desktop: dropdown.
          "fade-mount fixed inset-x-0 bottom-0 z-(--z-popover) rounded-t-3xl border border-line bg-char p-5 shadow-2xl shadow-black/50",
          "sm:absolute sm:inset-auto sm:bottom-auto sm:top-full sm:mt-3 sm:w-80 sm:rounded-2xl",
          align === "right" && "sm:right-0",
          align === "left" && "sm:left-0",
          align === "center" && "sm:left-1/2 sm:-translate-x-1/2",
          open ? "shown pointer-events-auto" : "pointer-events-none",
        )}
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow text-gold">Order on your favourite app</p>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-line text-muted hover:text-cream sm:hidden"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>
        <ul className="space-y-2">
          {DELIVERY.partners.map((p) => (
            <li key={p.name}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-line bg-ink px-4 py-3 transition-colors duration-200 hover:border-[var(--brand)]"
                style={{ ["--brand" as string]: p.color }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-lg font-display text-sm font-bold text-ink"
                    style={{ background: p.color }}
                    aria-hidden
                  >
                    {p.name[0]}
                  </span>
                  <span>
                    <span className="block font-semibold text-cream group-hover:text-[var(--brand)]">
                      {p.name}
                    </span>
                    <span className="text-xs text-muted">{p.eta}</span>
                  </span>
                </span>
                <ArrowRight
                  width={18}
                  height={18}
                  className="text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--brand)]"
                />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-muted">
          Opens the partner app in a new tab.
        </p>
      </div>
    </div>
  );
}
