"use client";

import SafeImage from "@/components/ui/SafeImage";
import { useState } from "react";
import dynamic from "next/dynamic";
import { unsplash, BLUR, type GALLERY } from "@/lib/site";
import { cn } from "@/lib/cn";

// Lightbox is only needed on click — load it on demand.
const Lightbox = dynamic(() => import("@/components/ui/Lightbox"));

type GalleryItem = (typeof GALLERY)[number];

/** Bento gallery with click-to-open lightbox. */
export default function GalleryGrid({
  images,
  variant = "full",
}: {
  images: readonly GalleryItem[];
  variant?: "preview" | "full";
}) {
  const [active, setActive] = useState<number | null>(null);

  // Preview reproduces the original Home gallery's exact bento spans (6 tiles).
  const previewSpans = [
    "md:row-span-2",
    "",
    "",
    "md:col-span-2",
    "",
    "",
  ];
  // Full page: a rhythmic bento across all tiles.
  const fullSpans = [
    "md:col-span-2 md:row-span-2",
    "",
    "",
    "md:row-span-2",
    "md:col-span-2",
    "",
    "",
    "md:col-span-2",
    "",
    "",
  ];

  const spans = variant === "preview" ? previewSpans : fullSpans;

  return (
    <>
      <div
        className={cn(
          "grid gap-3 sm:gap-4",
          variant === "preview"
            ? "grid-cols-2 md:grid-cols-4"
            : "grid-cols-2 md:auto-rows-[170px] md:grid-cols-4",
        )}
      >
        {images.map((img, i) => (
          <button
            key={img.id + i}
            onClick={() => setActive(i)}
            className={cn(
              "zoom group relative overflow-hidden rounded-2xl border border-line",
              variant === "preview" ? "" : "h-44 sm:h-52 md:h-auto",
              spans[i] ?? "",
            )}
            aria-label={`Open image: ${img.alt}`}
          >
            <SafeImage
              src={unsplash(img.id, 1100)}
              alt={img.alt}
              width={1100}
              height={900}
              sizes="(max-width: 768px) 50vw, 25vw"
              placeholder="blur"
              blurDataURL={BLUR}
              shimmer
              className={cn(
                "h-full w-full object-cover",
                variant === "preview" && i !== 0 && "h-44 sm:h-52",
                variant === "preview" && i === 0 && "h-full",
              )}
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        index={active}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </>
  );
}
