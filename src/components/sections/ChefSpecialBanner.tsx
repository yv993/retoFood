"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { unsplash, BLUR, dram, CHEF_SPECIAL } from "@/lib/site";
import { ArrowRight, Sparkles } from "@/components/ui/icons";

function endOfDay(now: Date) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  let ms = Math.max(0, end.getTime() - now.getTime());
  const h = Math.floor(ms / 3_600_000);
  ms -= h * 3_600_000;
  const m = Math.floor(ms / 60_000);
  ms -= m * 60_000;
  const s = Math.floor(ms / 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}`;
}

export default function ChefSpecialBanner() {
  const [cd, setCd] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setCd(endOfDay(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const s = CHEF_SPECIAL;

  return (
    <section className="bg-ink py-10 sm:py-14">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-3xl border border-gold/30 bg-char sm:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[200px]">
            <SafeImage
              src={unsplash(s.img, 900)}
              alt={s.name}
              fill
              sizes="(max-width: 640px) 100vw, 40vw"
              placeholder="blur"
              blurDataURL={BLUR}
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-char/30" />
          </div>
          <div className="p-7 sm:p-9">
            <span className="eyebrow inline-flex items-center gap-2 text-gold">
              <Sparkles width={16} height={16} /> {s.badge} today
            </span>
            <h2 className="mt-3 font-display text-3xl tracking-tightish text-cream sm:text-4xl">
              {s.name}
            </h2>
            <p className="mt-2 max-w-md text-sand">{s.desc}</p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl text-gold">{dram(s.price)}</span>
              {s.was && (
                <span className="text-sm text-muted line-through decoration-muted">
                  {dram(s.was)}
                </span>
              )}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={`/menu/${s.slug}`}
                className="btn-gold inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-200"
              >
                Order the special <ArrowRight width={16} height={16} />
              </Link>
              <span
                className="inline-flex items-center gap-2 text-sm text-muted"
                aria-live="off"
                suppressHydrationWarning
              >
                <span>Ends in</span>
                <span className="inline-block w-[8ch] text-center font-display tabular-nums text-gold">
                  {cd ?? "--:--:--"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
