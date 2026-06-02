"use client";

import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/clientHooks";
import { BLUR, HERO_STATS } from "@/lib/site";
import { CountUp, Magnetic } from "@/components/motion/primitives";
import { ArrowRight } from "@/components/ui/icons";

/** Deterministic floating accents (sesame seeds + ember sparks) — no RNG → SSR-safe. */
const ACCENTS = [
  { x: 8, y: 22, s: 6, kind: "seed", depth: 0.4 },
  { x: 18, y: 70, s: 4, kind: "ember", depth: 0.7 },
  { x: 30, y: 35, s: 5, kind: "seed", depth: 0.5 },
  { x: 44, y: 80, s: 3, kind: "ember", depth: 0.9 },
  { x: 62, y: 28, s: 6, kind: "seed", depth: 0.35 },
  { x: 72, y: 60, s: 4, kind: "ember", depth: 0.8 },
  { x: 84, y: 40, s: 5, kind: "seed", depth: 0.55 },
  { x: 90, y: 74, s: 3, kind: "ember", depth: 1 },
  { x: 52, y: 52, s: 4, kind: "seed", depth: 0.6 },
  { x: 12, y: 48, s: 3, kind: "ember", depth: 0.85 },
] as const;

/** Deterministic sparkle field behind the headline (SSR-safe, CSS twinkle). */
const SPARKLES = [
  { x: 4, y: 34, s: 3, d: 3.6, delay: 0 },
  { x: 14, y: 52, s: 2, d: 4.4, delay: 0.6 },
  { x: 9, y: 64, s: 4, d: 5, delay: 1.2 },
  { x: 26, y: 30, s: 2, d: 3.2, delay: 0.3 },
  { x: 33, y: 58, s: 3, d: 4.8, delay: 0.9 },
  { x: 44, y: 40, s: 2, d: 4, delay: 1.5 },
  { x: 20, y: 44, s: 3, d: 5.2, delay: 0.2 },
  { x: 38, y: 26, s: 2, d: 3.8, delay: 1 },
] as const;

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const layerSlow = useRef<HTMLDivElement>(null);
  const layerFast = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !root.current) return;
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    // GSAP is loaded on demand so it stays out of the initial JS bundle.
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = (trigger: Element) => ({
        trigger,
        start: "top top",
        end: "bottom top",
        scrub: true,
      });
      ctx = gsap.context(() => {
        const r = root.current!;
        gsap.to(bg.current, { yPercent: 18, ease: "none", scrollTrigger: st(r) });
        gsap.to(glow.current, { yPercent: 30, ease: "none", scrollTrigger: st(r) });
        gsap.to(layerSlow.current, { yPercent: -12, ease: "none", scrollTrigger: st(r) });
        gsap.to(layerFast.current, { yPercent: -34, ease: "none", scrollTrigger: st(r) });
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={root}
      id="hero"
      className="grain relative min-h-[100svh] w-full overflow-hidden"
    >
      {/* Background image (parallax) */}
      <div ref={bg} className="absolute inset-0 -top-[8%] h-[116%] will-change-transform">
        <SafeImage
          src="/img/hero.jpg"
          alt="Flame-grilled gourmet cheeseburger with melted cheddar and fresh toppings"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="kenburns object-cover"
        />
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/45 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />

      {/* Aurora / ember glow behind the headline */}
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="aurora h-full w-full" />
      </div>

      {/* Sparkles behind the headline (CSS-only twinkle, reduced-motion safe) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] mx-auto max-w-content px-4 sm:px-6"
      >
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className="sparkle absolute rounded-full bg-goldlt"
            style={
              {
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.s,
                height: s.s,
                boxShadow: "0 0 6px 1px rgba(227,199,102,0.6)",
                "--tw": `${s.d}s`,
                "--tw-delay": `${s.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Floating accents — two parallax depths */}
      {!reduced && (
        <>
          <div ref={layerSlow} aria-hidden className="absolute inset-0">
            {ACCENTS.filter((a) => a.depth < 0.6).map((a, i) => (
              <Accent key={`s${i}`} a={a} />
            ))}
          </div>
          <div ref={layerFast} aria-hidden className="absolute inset-0">
            {ACCENTS.filter((a) => a.depth >= 0.6).map((a, i) => (
              <Accent key={`f${i}`} a={a} />
            ))}
          </div>
        </>
      )}

      {/* Content — CSS entrance animations (paint before hydration → good LCP) */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-content flex-col justify-center px-4 pb-24 pt-28 sm:px-6">
        <div className="max-w-2xl">
          <p
            className="eyebrow fade-up mb-5 flex items-center gap-3 text-gold"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="inline-block h-px w-8 bg-gold" /> Yerevan · Gourmet Burger House
          </p>

          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tightish text-cream sm:text-7xl lg:text-[5.5rem]">
            <span className="inline-block overflow-hidden align-bottom">
              <span className="rise-clip" style={{ animationDelay: "0.15s" }}>
                Flame-grilled
              </span>
            </span>
            <br />
            <span className="inline-block overflow-hidden align-bottom text-grad italic">
              <span className="rise-clip" style={{ animationDelay: "0.3s" }}>
                obsession.
              </span>
            </span>
          </h1>

          <p
            className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-sand"
            style={{ animationDelay: "0.5s" }}
          >
            Dry-aged Angus beef, house-baked brioche, and sauces made from scratch every
            morning — built into the most talked-about burger in the city.
          </p>

          <div
            className="fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.62s" }}
          >
            <Magnetic strength={0.3}>
              <Link
                href="/menu"
                className="btn-gold beam inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition-all duration-200"
              >
                Explore the Menu
                <ArrowRight width={18} height={18} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link
                href="/reserve"
                className="btn-ghost inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold transition-all duration-200"
              >
                Book a Table
              </Link>
            </Magnetic>
          </div>

          {/* Stats with count-up */}
          <dl
            className="fade-up mt-12 flex flex-wrap gap-x-10 gap-y-4"
            style={{ animationDelay: "0.75s" }}
          >
            {HERO_STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl text-gold">
                  <CountUp
                    to={s.countTo ?? 0}
                    suffix={s.suffix ?? ""}
                    prefix={s.prefix ?? ""}
                    decimals={s.decimals ?? 0}
                  />
                </dt>
                <dd className="text-xs uppercase tracking-widest text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#signature"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-muted"
        aria-label="Scroll down"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-line p-1">
          <span className="h-2 w-1 animate-bounce rounded-full bg-gold" />
        </span>
      </a>
    </section>
  );
}

function Accent({ a }: { a: (typeof ACCENTS)[number] }) {
  return (
    <span
      className="accent absolute rounded-full"
      style={
        {
          left: `${a.x}%`,
          top: `${a.y}%`,
          width: a.s,
          height: a.kind === "seed" ? a.s * 1.8 : a.s,
          background: a.kind === "seed" ? "#E3C766" : "#B5481F",
          filter: a.kind === "ember" ? "blur(0.5px)" : "none",
          "--accent-dur": `${(4 + a.depth * 4).toFixed(2)}s`,
          "--accent-delay": `${a.depth.toFixed(2)}s`,
        } as React.CSSProperties
      }
    />
  );
}
