"use client";

import { REVIEWS, type Review } from "@/lib/site";
import { Star } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

function Card({ r }: { r: Review }) {
  return (
    <figure className="flex w-80 shrink-0 flex-col rounded-3xl border border-line bg-char p-6">
      <div className="mb-3 flex gap-1 text-gold" aria-hidden>
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} width={14} height={14} />
        ))}
      </div>
      <blockquote className="line-clamp-4 text-sm leading-relaxed text-sand">
        “{r.text}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-panel font-display text-gold">
          {r.initial}
        </span>
        <span>
          <span className="block text-sm font-semibold text-cream">{r.name}</span>
          <span className="text-xs text-muted">{r.meta}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ reverse, dur }: { reverse?: boolean; dur: string }) {
  const items = [...REVIEWS, ...REVIEWS];
  return (
    <div className="move-row group relative overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent" />
      <div
        className={cn("flex w-max gap-4 py-1", reverse ? "move-right" : "move-left")}
        style={{ ["--dur" as string]: dur }}
      >
        {items.map((r, i) => (
          <Card key={`${r.name}-${i}`} r={r} />
        ))}
      </div>
    </div>
  );
}

/** Two opposite-direction infinite marquees of testimonials. Pause on hover. */
export default function InfiniteMovingCards() {
  return (
    <div className="space-y-4">
      <Row dur="46s" />
      <Row dur="38s" reverse />
    </div>
  );
}
