import { SITE } from "@/lib/site";

/**
 * Brand preloader (ported from the original #loader). Pure CSS animation — no
 * JS/state — so it fades out before hydration and never gates LCP. Hidden
 * entirely under prefers-reduced-motion (see globals.css).
 */
export default function Preloader() {
  return (
    <div id="loader" className="fixed inset-0 z-(--z-preloader) grid place-items-center bg-ink">
      <div className="text-center">
        <div className="font-display text-3xl tracking-tightish text-cream">
          Burger<span className="text-gold">House</span>
        </div>
        <div className="mx-auto mt-4 h-px w-40 overflow-hidden bg-line">
          <div id="loaderBar" className="h-full bg-gold" />
        </div>
        <p className="eyebrow mt-3 text-muted">
          {SITE.contact.city} · Est. {SITE.est}
        </p>
      </div>
    </div>
  );
}
