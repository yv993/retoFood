"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Floating in-page section nav (desktop only). Highlights the current section
 * via IntersectionObserver; clicks are smooth-scrolled by the existing Lenis
 * anchor delegation. z below the navbar — respects the global z-scale.
 */
export default function ScrollSpyNav({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActive(topmost.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="On this page"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-3">
        {sections.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className="group flex items-center justify-end gap-2"
              >
                <span
                  className={cn(
                    "text-xs font-semibold transition-opacity duration-200",
                    on ? "text-gold opacity-100" : "text-sand opacity-0 group-hover:opacity-100",
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn(
                    "h-2 w-2 rounded-full border transition-colors duration-200",
                    on ? "border-gold bg-gold" : "border-line group-hover:border-gold/60",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
