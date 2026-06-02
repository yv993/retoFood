"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

/** Lazily mounts the OpenStreetMap iframe only when it scrolls near the viewport. */
export default function MapEmbed({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    if (!("IntersectionObserver" in window)) {
      const raf = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-3xl border border-line bg-char ${className ?? ""}`}
    >
      {show ? (
        <iframe
          title="Map of BurgerHouse, Saryan Street, Yerevan"
          src={SITE.contact.mapEmbed}
          className="h-64 w-full grayscale-[.2]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="grid h-64 w-full place-items-center text-sm text-muted">
          Loading map…
        </div>
      )}
    </div>
  );
}
