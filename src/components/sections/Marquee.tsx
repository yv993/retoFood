"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/clientHooks";
import { MARQUEE } from "@/lib/site";

/** Infinite marquee that speeds up with scroll velocity and eases back when idle. */
export default function Marquee() {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let half = track.scrollWidth / 2;
    let boost = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let last = performance.now();
    const BASE = 40; // px per second

    const measure = () => (half = track.scrollWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      boost = Math.min(boost + dy * 0.6, 320);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      boost *= 0.92; // ease back to idle
      x -= (BASE + boost) * dt;
      if (half > 0 && x <= -half) x += half;
      track.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <div className="overflow-hidden border-y border-line bg-char py-4">
      <div
        ref={trackRef}
        className={`flex w-max gap-10 whitespace-nowrap text-sm uppercase tracking-[0.25em] text-muted ${
          reduced ? "marquee" : ""
        }`}
      >
        <MarqueeRow />
        <MarqueeRow hidden />
      </div>
    </div>
  );
}

function MarqueeRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden}>
      {MARQUEE.map((w) => (
        <span key={w} className="flex items-center gap-10">
          <span>{w}</span>
          <span className="text-gold">✦</span>
        </span>
      ))}
    </span>
  );
}
