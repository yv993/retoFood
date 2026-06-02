"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/clientHooks";
import { Reveal } from "@/components/motion/primitives";
import { Leaf, Clock, Flame, Sparkles } from "@/components/ui/icons";

const STEPS = [
  { Icon: Leaf, title: "From the farm", body: "Highland Angus and Kotayk-valley produce, sourced from Armenian growers we know by name." },
  { Icon: Clock, title: "Dry-aged", body: "Rested for 12 hours to deepen flavour, then ground fresh in-house every single morning." },
  { Icon: Flame, title: "On the flame", body: "Smashed on a 300°C flat-top for a lace-crisp crust, then finished over open flame." },
  { Icon: Sparkles, title: "To your plate", body: "Stacked with craft sauces and sent out hot — never frozen, never reheated." },
];

export default function FarmToFlame() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !sectionRef.current || !beamRef.current) return;
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          beamRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: "top 70%",
              end: "bottom 75%",
              scrub: true,
            },
          },
        );
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow text-gold">The journey</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
            From farm to flame
          </h2>
        </Reveal>

        <ol className="relative mx-auto max-w-2xl">
          {/* Beam track + scroll-drawn fill */}
          <div className="absolute bottom-6 left-5 top-6 w-0.5 -translate-x-1/2 bg-line" aria-hidden>
            <div
              ref={beamRef}
              className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-gradient-to-b from-gold to-goldlt"
              style={{ transform: reduced ? "scaleY(1)" : "scaleY(0)" }}
            />
          </div>

          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 pb-12 last:pb-0">
              <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-char text-gold">
                <s.Icon width={20} height={20} />
              </span>
              <Reveal delay={i * 0.05} className="pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-sm text-gold">0{i + 1}</span>
                  <h3 className="font-display text-xl text-cream">{s.title}</h3>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-sand">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
