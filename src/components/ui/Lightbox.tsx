"use client";

import SafeImage from "@/components/ui/SafeImage";
import { useCallback, useEffect, useRef, useState } from "react";
import { unsplash, BLUR, type GALLERY } from "@/lib/site";
import { cn } from "@/lib/cn";
import { CloseIcon, ChevronLeft, ChevronRight } from "@/components/ui/icons";

type GalleryItem = (typeof GALLERY)[number];

/** Accessible, focus-trapped image lightbox. `index === null` → closed. */
export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: readonly GalleryItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const open = index !== null;
  const [shown, setShown] = useState(false);

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      onNavigate((index + dir + images.length) % images.length);
    },
    [index, images.length, onNavigate],
  );

  // Fade in on mount.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setShown(true));
    return () => {
      cancelAnimationFrame(raf);
      setShown(false);
    };
  }, [open]);

  // Focus trap, scroll lock, keyboard nav.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open, go, onClose]);

  const current = index !== null ? images[index] : null;
  if (!open || !current) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className={cn(
        "fade-mount fixed inset-0 z-(--z-lightbox) grid place-items-center bg-ink/95 p-4 backdrop-blur",
        shown && "shown",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-line bg-char/70 text-cream hover:border-gold hover:text-gold"
      >
        <CloseIcon width={22} height={22} />
      </button>

      <button
        onClick={() => go(-1)}
        aria-label="Previous image"
        className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-char/70 text-cream hover:border-gold hover:text-gold sm:left-6"
      >
        <ChevronLeft width={24} height={24} />
      </button>

      <div className="relative h-[78vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-line">
        <SafeImage
          key={current.id}
          src={unsplash(current.id, 1600)}
          alt={current.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-contain"
        />
      </div>

      <button
        onClick={() => go(1)}
        aria-label="Next image"
        className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-char/70 text-cream hover:border-gold hover:text-gold sm:right-6"
      >
        <ChevronRight width={24} height={24} />
      </button>

      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-muted">
        {(index ?? 0) + 1} / {images.length}
      </p>
    </div>
  );
}
