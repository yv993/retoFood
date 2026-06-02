"use client";

import { useState } from "react";
import { FAQS, type Faq as FaqItem } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Plus, Minus } from "@/components/ui/icons";

export default function Faq({ items = FAQS }: { items?: readonly FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line overflow-hidden rounded-3xl border border-line bg-char">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <h3>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display text-lg text-cream">{f.q}</span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-gold">
                  {isOpen ? <Minus width={16} height={16} /> : <Plus width={16} height={16} />}
                </span>
              </button>
            </h3>
            <div className={cn("collapsible", isOpen && "open")}>
              <div>
                <p className="px-6 pb-6 text-sand">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
