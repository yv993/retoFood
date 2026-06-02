"use client";

import { useEffect, useRef, useState } from "react";
import { REVIEWS } from "@/lib/site";
import { usePrefersReducedMotion } from "@/lib/clientHooks";
import { Star } from "@/components/ui/icons";

/** Auto-playing, swipeable testimonial carousel (vanilla pointer + CSS track). */
export default function TestimonialCarousel() {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragDx, setDragDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startX: number }>({ startX: 0 });
  const n = REVIEWS.length;
  const go = (next: number) => setI((next + n) % n);

  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), 5000);
    return () => clearInterval(id);
  }, [reduced, paused, n]);

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Guest testimonials"
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-char">
        <div
          className="flex"
          style={{
            transform: `translateX(calc(-${i * 100}% + ${dragDx}px))`,
            transition:
              dragging || reduced ? "none" : "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
            touchAction: "pan-y",
          }}
          onPointerDown={(e) => {
            drag.current.startX = e.clientX;
            setDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!dragging) return;
            setDragDx(e.clientX - drag.current.startX);
          }}
          onPointerUp={(e) => {
            if (!dragging) return;
            const dx = e.clientX - drag.current.startX;
            setDragging(false);
            setDragDx(0);
            if (dx < -60) go(i + 1);
            else if (dx > 60) go(i - 1);
          }}
          onPointerCancel={() => {
            setDragging(false);
            setDragDx(0);
          }}
        >
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="w-full shrink-0 select-none p-8 sm:p-10"
              aria-hidden={r !== REVIEWS[i]}
            >
              <div className="mb-4 flex gap-1 text-gold" aria-hidden>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} width={16} height={16} />
                ))}
              </div>
              <blockquote className="font-display text-xl leading-relaxed text-cream sm:text-2xl">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-panel font-display text-gold">
                  {r.initial}
                </span>
                <span>
                  <span className="block font-semibold text-cream">{r.name}</span>
                  <span className="text-xs text-muted">{r.meta}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {REVIEWS.map((_, d) => (
          <button
            key={d}
            onClick={() => go(d)}
            aria-label={`Go to testimonial ${d + 1}`}
            aria-current={d === i}
            className={`h-2 cursor-pointer rounded-full transition-all duration-200 ${
              d === i ? "w-6 bg-gold" : "w-2 bg-line hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
