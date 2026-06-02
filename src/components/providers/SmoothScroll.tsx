"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/clientHooks";

/** Wires GSAP ScrollTrigger to Lenis and delegates in-page anchor clicks. */
function ScrollBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Load GSAP lazily and sync ScrollTrigger to Lenis once available.
    (async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = (await import("gsap")).default;
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const update = () => ScrollTrigger.update();
      lenis.on("scroll", update);
      ScrollTrigger.refresh();
      cleanup = () => lenis.off("scroll", update);
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [lenis]);

  // Smooth-scroll same-page hash links through Lenis.
  useEffect(() => {
    if (!lenis) return;
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const hash = target.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  // When reduced motion is requested, skip Lenis entirely (native scroll).
  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ duration: 1.1, smoothWheel: true, touchMultiplier: 1.5 }}
    >
      {children}
      <ScrollBridge />
    </ReactLenis>
  );
}
