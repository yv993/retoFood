import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <section className="grain relative grid min-h-[100svh] place-items-center overflow-hidden bg-ink px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="aurora h-full w-full" />
      </div>
      <div className="relative text-center">
        <p className="eyebrow text-gold">Lost the trail</p>
        <h1 className="mt-4 font-display text-7xl font-bold tracking-tightish text-cream sm:text-9xl">
          4<span className="text-grad">0</span>4
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sand">
          This page slipped off the grill. Let&rsquo;s get you back to something delicious.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-gold inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition-all duration-200"
          >
            Back home
            <ArrowRight width={18} height={18} />
          </Link>
          <Link
            href="/menu"
            className="btn-ghost inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold transition-all duration-200"
          >
            See the menu
          </Link>
        </div>
      </div>
    </section>
  );
}
