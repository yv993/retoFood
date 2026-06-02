"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CloseIcon } from "@/components/ui/icons";

/** Mobile bottom-sheet wrapper for the menu filters (focus-trap, ESC, backdrop, scroll-lock). */
export default function MenuFilterSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const f = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, a, [tabindex]:not([tabindex="-1"])',
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
      document.body.style.overflow = prev;
      restore.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-(--z-drawer-backdrop) bg-ink/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu filters"
        inert={!open}
        className={cn(
          "fixed inset-x-0 bottom-0 z-(--z-drawer-panel) rounded-t-3xl border-t border-line bg-char p-5 shadow-2xl shadow-black/50 transition-transform duration-300 md:hidden",
          open ? "translate-y-0" : "translate-y-full",
        )}
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg text-cream">Filter the menu</h3>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close filters"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-cream hover:border-gold hover:text-gold"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>
        {children}
        <button
          onClick={onClose}
          className="btn-gold mt-6 w-full cursor-pointer rounded-full px-6 py-3 text-sm font-bold"
        >
          Show results
        </button>
      </div>
    </>
  );
}
