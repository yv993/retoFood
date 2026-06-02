"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/providers/LangProvider";
import { LANGS } from "@/lib/i18n";
import { Globe, ChevronDown, Check } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const active = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm font-semibold text-sand transition-colors duration-200 hover:border-gold/50 hover:text-cream"
      >
        <Globe width={16} height={16} />
        <span>{active.label}</span>
        <ChevronDown
          width={14}
          height={14}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <div
        role="menu"
        aria-hidden={!open}
        className={cn(
          "fade-mount absolute right-0 top-full z-(--z-popover) mt-2 w-40 rounded-2xl border border-line bg-char p-1.5 shadow-2xl shadow-black/50",
          open ? "shown pointer-events-auto" : "pointer-events-none",
        )}
      >
        {LANGS.map((l) => (
          <button
            key={l.code}
            role="menuitemradio"
            aria-checked={l.code === lang}
            onClick={() => {
              setLang(l.code);
              setOpen(false);
            }}
            className={cn(
              "flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
              l.code === lang ? "bg-gold/15 text-gold" : "text-sand hover:bg-panel hover:text-cream",
            )}
          >
            <span>
              <span className="font-semibold">{l.label}</span>
              <span className="ml-2 text-xs text-muted">{l.name}</span>
            </span>
            {l.code === lang && <Check width={14} height={14} />}
          </button>
        ))}
      </div>
    </div>
  );
}
