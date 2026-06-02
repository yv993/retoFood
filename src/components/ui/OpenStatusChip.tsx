"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";
import { cn } from "@/lib/cn";

/** Live "Open now / Closed" chip computed from opening hours (client-only). */
export default function OpenStatusChip({
  className,
  showDetail = true,
}: {
  className?: string;
  showDetail?: boolean;
}) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getOpenStatus());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Reserve space pre-hydration to avoid layout shift.
  if (!status) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-line bg-char/60 px-3 py-1 text-xs text-muted",
          className,
        )}
      >
        <span className="h-2 w-2 rounded-full bg-muted" />
        Hours
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-600",
        status.open
          ? "border-gold/40 bg-gold/10 text-goldlt"
          : "border-line bg-char/60 text-sand",
        className,
      )}
      role="status"
    >
      <span className="relative flex h-2 w-2">
        {status.open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            status.open ? "bg-gold" : "bg-ember",
          )}
        />
      </span>
      {status.label}
      {showDetail && <span className="font-400 text-muted">· {status.detail}</span>}
    </span>
  );
}
