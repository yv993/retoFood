import { REVIEWS, RATING, PRESS } from "@/lib/site";
import { Reveal } from "@/components/motion/primitives";
import InfiniteMovingCards from "@/components/ui/InfiniteMovingCards";
import { Star } from "@/components/ui/icons";

export default function Reviews() {
  const cards = REVIEWS.slice(0, 3);

  return (
    <section id="reviews" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        {/* Press / awards strip */}
        <Reveal className="mb-16">
          <p className="mb-5 text-center text-xs uppercase tracking-[0.28em] text-muted">
            As featured in &amp; awarded by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70">
            {PRESS.map((p) => (
              <span
                key={p}
                className="font-display text-lg text-sand transition-colors duration-200 hover:text-gold sm:text-xl"
              >
                {p}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal className="mb-14 text-center">
          <p className="eyebrow text-gold">Word of Mouth</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
            Loved across Yerevan
          </h2>
          <div
            className="mt-4 flex items-center justify-center gap-2 text-gold"
            aria-label={`Rated ${RATING.value} out of 5`}
          >
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} width={20} height={20} />
            ))}
            <span className="ml-2 text-sm text-sand">
              {RATING.value} · {RATING.count.toLocaleString("en-US")}+ Google reviews
            </span>
          </div>
        </Reveal>

        <div className="mb-14 grid gap-6 md:grid-cols-3">
          {cards.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06}>
              <figure className="h-full rounded-3xl border border-line bg-char p-7">
                <div className="mb-4 flex gap-1 text-gold" aria-hidden>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} width={15} height={15} />
                  ))}
                </div>
                <blockquote className="leading-relaxed text-sand">“{r.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-panel font-display text-gold">
                    {r.initial}
                  </span>
                  <span>
                    <span className="block font-semibold text-cream">{r.name}</span>
                    <span className="text-xs text-muted">{r.meta}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Infinite moving cards (full-bleed) */}
      <Reveal>
        <InfiniteMovingCards />
      </Reveal>
    </section>
  );
}
