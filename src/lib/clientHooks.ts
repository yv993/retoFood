"use client";

import { useSyncExternalStore } from "react";

function makeMediaHook(query: string) {
  return function useMedia(): boolean {
    return useSyncExternalStore(
      (cb) => {
        const m = window.matchMedia(query);
        m.addEventListener("change", cb);
        return () => m.removeEventListener("change", cb);
      },
      () => window.matchMedia(query).matches,
      () => false, // server snapshot
    );
  };
}

/** True when the user requests reduced motion. */
export const usePrefersReducedMotion = makeMediaHook(
  "(prefers-reduced-motion: reduce)",
);

/** True only on devices with a real hover-capable pointer (desktop). */
export const useHasHover = makeMediaHook("(hover: hover) and (pointer: fine)");
