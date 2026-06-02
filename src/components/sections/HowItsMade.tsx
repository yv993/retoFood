"use client";

import SafeImage from "@/components/ui/SafeImage";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/clientHooks";
import { unsplash, BLUR } from "@/lib/site";
import { Clock, Flame, Wheat, Sparkles } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    n: "01",
    title: "Dry-age",
    body: "Highland Angus rests for 12 hours, then we grind it fresh — never frozen, never pre-formed.",
    img: "1606131731446-5568d87113aa",
    Icon: Clock,
  },
  {
    n: "02",
    title: "Smash on flame",
    body: "Pressed thin on a 300°C flat-top for a lace-crisp crust, then finished over open flame.",
    img: "1568901346375-23c9450c58cd",
    Icon: Flame,
  },
  {
    n: "03",
    title: "House brioche",
    body: "Buns baked on-site before sunrise, toasted in beef fat for the perfect golden lid.",
    img: "1586190848861-99aa4a171e90",
    Icon: Wheat,
  },
  {
    n: "04",
    title: "Plate up",
    body: "Stacked with craft sauces and local produce, then sent straight to your table — hot.",
    img: "1565299624946-b28f40a0ae38",
    Icon: Sparkles,
  },
];

export default function HowItsMade() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current!,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const idx = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
            setActive(idx);
          },
        });
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  // Reduced motion / no-JS: simple stacked layout.
  if (reduced) {
    return (
      <section className="border-y border-line bg-char py-24 sm:py-32">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <header className="mb-12 text-center">
            <p className="eyebrow text-gold">How it&rsquo;s made</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              From flame to plate
            </h2>
          </header>
          <div className="space-y-12">
            {STEPS.map((s) => (
              <div key={s.n} className="grid items-center gap-8 lg:grid-cols-2">
                <div>
                  <span className="font-display text-3xl text-gold">{s.n}</span>
                  <h3 className="mt-2 font-display text-2xl text-cream">{s.title}</h3>
                  <p className="mt-2 text-sand">{s.body}</p>
                </div>
                <div className="relative h-64 overflow-hidden rounded-3xl border border-line">
                  <SafeImage src={unsplash(s.img, 1000)} alt={s.title} fill sizes="(max-width:1024px) 100vw, 50vw" placeholder="blur" blurDataURL={BLUR} className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative border-y border-line bg-char"
      style={{ height: `${STEPS.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-content items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          {/* Left — pinned steps */}
          <div>
            <p className="eyebrow text-gold">How it&rsquo;s made</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              From flame to plate
            </h2>
            <ol className="mt-8 space-y-3">
              {STEPS.map((s, i) => {
                const on = i === active;
                return (
                  <li
                    key={s.n}
                    className={cn(
                      "flex gap-4 rounded-2xl border p-4 transition-all duration-300",
                      on ? "border-gold/40 bg-gold/5 opacity-100" : "border-line opacity-45",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-colors",
                        on ? "border-gold/40 bg-gold/10 text-gold" : "border-line text-muted",
                      )}
                    >
                      <s.Icon width={20} height={20} />
                    </span>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-sm text-gold">{s.n}</span>
                        <h3 className="font-display text-xl text-cream">{s.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-sand">{s.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right — swapping images */}
          <div className="relative hidden h-[60vh] overflow-hidden rounded-3xl border border-line lg:block">
            {STEPS.map((s, i) => (
              <SafeImage
                key={s.img}
                src={unsplash(s.img, 1200)}
                alt={s.title}
                fill
                sizes="50vw"
                placeholder="blur"
                blurDataURL={BLUR}
                className={cn(
                  "object-cover transition-opacity duration-500",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
            <span className="absolute bottom-5 left-5 font-display text-2xl text-cream">
              {STEPS[active].title}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
