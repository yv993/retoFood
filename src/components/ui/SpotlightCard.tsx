"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Spotlight card — a radial gold glow follows the cursor on hover.
 * SSR-safe (no window at render) and reduced-motion friendly (the glow is a
 * hover affordance, not an auto-playing animation).
 */
export default function SpotlightCard({
  children,
  className,
  glow = "rgba(201,162,39,0.18)",
  radius = 260,
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn("group/spot relative overflow-hidden", className)}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
