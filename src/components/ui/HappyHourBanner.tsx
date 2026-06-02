"use client";

import { useEffect, useState } from "react";
import { HAPPY_HOUR } from "@/lib/site";
import { Sparkles } from "@/components/ui/icons";

interface Countdown {
  during: boolean;
  hh: string;
  mm: string;
  ss: string;
}

function compute(now: Date): Countdown {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const isHappy = (d: number) => HAPPY_HOUR.days.includes(d);

  let target: Date;
  let during = false;

  if (isHappy(day) && mins >= HAPPY_HOUR.start && mins < HAPPY_HOUR.end) {
    during = true;
    target = new Date(now);
    target.setHours(Math.floor(HAPPY_HOUR.end / 60), HAPPY_HOUR.end % 60, 0, 0);
  } else {
    // find next start within the coming week
    let found: Date | null = null;
    for (let offset = 0; offset <= 7; offset++) {
      const d = (day + offset) % 7;
      if (!isHappy(d)) continue;
      if (offset === 0 && mins >= HAPPY_HOUR.start) continue;
      const cand = new Date(now);
      cand.setDate(now.getDate() + offset);
      cand.setHours(Math.floor(HAPPY_HOUR.start / 60), HAPPY_HOUR.start % 60, 0, 0);
      found = cand;
      break;
    }
    target = found ?? new Date(now.getTime() + 3600_000);
  }

  let diff = Math.max(0, target.getTime() - now.getTime());
  const h = Math.floor(diff / 3_600_000);
  diff -= h * 3_600_000;
  const m = Math.floor(diff / 60_000);
  diff -= m * 60_000;
  const s = Math.floor(diff / 1000);

  return {
    during,
    hh: String(h).padStart(2, "0"),
    mm: String(m).padStart(2, "0"),
    ss: String(s).padStart(2, "0"),
  };
}

export default function HappyHourBanner() {
  const [cd, setCd] = useState<Countdown | null>(null);

  useEffect(() => {
    const tick = () => setCd(compute(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-y border-gold/20 bg-gradient-to-r from-char via-ink to-char">
      <div className="mx-auto flex max-w-content flex-col items-center justify-center gap-x-4 gap-y-1.5 px-4 py-3 text-center sm:flex-row sm:px-6">
        <span className="inline-flex items-center gap-2 text-gold">
          <Sparkles width={18} height={18} />
          <span className="eyebrow">{HAPPY_HOUR.label}</span>
        </span>
        <span className="text-sm text-sand">
          {HAPPY_HOUR.blurb} · {HAPPY_HOUR.daysLabel} {HAPPY_HOUR.startLabel}–
          {HAPPY_HOUR.endLabel}
        </span>

        {/* Live countdown — fixed-size placeholder so there's no layout shift
            after hydration (reserves the exact width before `cd` arrives). */}
        <span
          className="inline-flex items-center gap-2 text-sm"
          aria-live="off"
          suppressHydrationWarning
        >
          <span className="w-14 text-right text-muted">{cd?.during ? "Ends in" : "Starts in"}</span>
          <span className="inline-block w-[8ch] text-center font-display tabular-nums text-gold">
            {cd ? `${cd.hh}:${cd.mm}:${cd.ss}` : "--:--:--"}
          </span>
        </span>
      </div>
    </div>
  );
}
