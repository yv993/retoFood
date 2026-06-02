"use client";

import { useEffect, useRef } from "react";

/** Thin gold scroll-progress bar pinned to the top (vanilla, rAF-throttled). */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const p = max > 0 ? Math.min(doc.scrollTop / max, 1) : 0;
        el.style.setProperty("--sp", String(p));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="scroll-progress fixed inset-x-0 top-0 z-(--z-scrollbar) h-[2px] bg-gradient-to-r from-gold to-goldlt"
    />
  );
}
