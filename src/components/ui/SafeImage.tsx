"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { unsplash } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Known-good, very stable food photo used if an item image fails to load. */
const FALLBACK_SRC = unsplash("1568901346375-23c9450c58cd", 1200);

type Props = ImageProps & { fallbackSrc?: string; shimmer?: boolean };

/**
 * next/image wrapper that never renders a broken image: on error it first swaps
 * to a known-good food photo, and if that also fails it shows an on-brand
 * gradient placeholder (no broken-image icon). Optional `shimmer` shows a
 * theme-matched skeleton until the image finishes loading.
 */
export default function SafeImage(props: Props) {
  const { fallbackSrc = FALLBACK_SRC, src, alt, shimmer, ...imageProps } = props;
  const [current, setCurrent] = useState<ImageProps["src"]>(src);
  const [dead, setDead] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (dead) {
    return (
      <div
        role="img"
        aria-label={typeof alt === "string" && alt ? alt : "BurgerHouse"}
        className={cn(
          "grid place-items-center bg-gradient-to-br from-panel to-ink",
          props.fill ? "absolute inset-0" : "",
          props.className,
        )}
        style={!props.fill ? { width: props.width, height: props.height } : undefined}
      >
        <span className="font-display text-lg text-gold/40">
          Burger<span className="text-gold/60">House</span>
        </span>
      </div>
    );
  }

  return (
    <>
      <Image
        {...imageProps}
        alt={alt}
        src={current}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== fallbackSrc) setCurrent(fallbackSrc);
          else setDead(true);
        }}
      />
      {shimmer && !loaded && <span className="skeleton rounded-[inherit]" aria-hidden />}
    </>
  );
}
