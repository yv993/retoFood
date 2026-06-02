"use client";

import { useEffect, useRef } from "react";
import { useHasHover, usePrefersReducedMotion } from "@/lib/clientHooks";

/**
 * Soft gold spotlight + dot that follows the pointer (desktop only).
 * The native cursor is only hidden (body[data-cursor="on"]) AFTER the first real
 * pointer move has positioned the dot — so you're never left with no cursor at
 * all. Leaving the window / losing focus restores the native cursor.
 */
export default function Cursor() {
  const hasHover = useHasHover();
  const reduced = usePrefersReducedMotion();
  const active = hasHover && !reduced;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const dotEl = dot.current;
    const ringEl = ring.current;
    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;
    let shown = false;

    const show = () => {
      if (shown) return;
      shown = true;
      document.body.dataset.cursor = "on"; // hide native cursor (dot is now positioned)
      if (dotEl) dotEl.style.opacity = "1";
      if (ringEl) ringEl.style.opacity = "1";
    };
    const hide = () => {
      shown = false;
      delete document.body.dataset.cursor; // restore native cursor
      if (dotEl) dotEl.style.opacity = "0";
      if (ringEl) ringEl.style.opacity = "0";
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        hide();
        return;
      }
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dotEl) dotEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      show();
    };
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ringEl)
        ringEl.style.transform = `translate3d(${ringPos.x.toFixed(2)}px, ${ringPos.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    // Never get stuck off-screen: restore the native cursor when the pointer
    // leaves the window or the tab loses focus. The next move re-shows it.
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      cancelAnimationFrame(raf);
      delete document.body.dataset.cursor;
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={dot} aria-hidden className="cursor-dot" />
      <div ref={ring} aria-hidden className="cursor-ring" />
    </>
  );
}
