"use client";

import { useRef, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { unsplash, BLUR, BEFORE_AFTER } from "@/lib/site";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";

/** Draggable before/after image comparison (mouse, touch, keyboard). */
export default function BeforeAfter({
  beforeLabel = "Raw",
  afterLabel = "Flame-grilled",
}: {
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full touch-pan-y select-none overflow-hidden rounded-3xl border border-line"
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      {/* After (base layer, fully visible) */}
      <SafeImage
        src={unsplash(BEFORE_AFTER.after.id, 1200)}
        alt={BEFORE_AFTER.after.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        placeholder="blur"
        blurDataURL={BLUR}
        className="object-cover"
      />
      {/* Before (clipped to the slider position) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden
      >
        <SafeImage
          src={unsplash(BEFORE_AFTER.before.id, 1200)}
          alt={BEFORE_AFTER.before.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover"
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-cream backdrop-blur">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-gold/90" />
        <button
          type="button"
          role="slider"
          aria-label="Drag to reveal the flame-grilled result"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 3));
            else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 3));
            else if (e.key === "Home") setPos(0);
            else if (e.key === "End") setPos(100);
          }}
          className="absolute top-1/2 -ml-5 -mt-5 grid h-10 w-10 cursor-ew-resize place-items-center rounded-full border border-gold bg-char text-gold shadow-lg shadow-black/40 focus-visible:outline-none"
        >
          <ChevronLeft width={14} height={14} className="-mr-1" />
          <ChevronRight width={14} height={14} className="-ml-1" />
        </button>
      </div>
    </div>
  );
}
