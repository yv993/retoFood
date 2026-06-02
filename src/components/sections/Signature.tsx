import Link from "next/link";
import { SIGNATURES, unsplash, BLUR, dram, slugify } from "@/lib/site";
import { Reveal, TiltCard } from "@/components/motion/primitives";
import SpotlightCard from "@/components/ui/SpotlightCard";
import SafeImage from "@/components/ui/SafeImage";
import QuickAddButton from "@/components/cart/QuickAddButton";
import { ArrowRight } from "@/components/ui/icons";

export default function Signature() {
  return (
    <section id="signature" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <Reveal className="mb-14 flex flex-col items-end justify-between gap-6 sm:flex-row">
          <div className="max-w-xl">
            <p className="eyebrow text-gold">The Icons</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              Our signature burgers
            </h2>
          </div>
          <p className="max-w-sm text-sand">
            Three recipes that built our name. Each one smashed on a 300°C flat-top and
            finished over open flame.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {SIGNATURES.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.06}>
              <TiltCard className="h-full">
                <div data-card className="relative h-full">
                  <SpotlightCard className="card-lift group/link h-full rounded-3xl border border-line bg-char transition-colors duration-300 hover:border-gold/40">
                    <Link
                      href={`/menu/${slugify(b.name)}`}
                      aria-label={`View ${b.name}`}
                      className="absolute inset-0 z-20 rounded-3xl"
                    />
                    <div className="relative h-60 overflow-hidden rounded-t-3xl">
                      <SafeImage
                        src={unsplash(b.img, 1000)}
                        alt={`${b.name} — ${b.desc}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        placeholder="blur"
                        blurDataURL={BLUR}
                        shimmer
                        className="object-cover transition-transform duration-700 group-hover/spot:scale-[1.06]"
                      />
                      <span
                        className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
                          b.badgeTone === "ember"
                            ? "bg-ember/90 text-cream"
                            : "bg-ink/80 text-gold"
                        }`}
                      >
                        {b.badge}
                      </span>
                    </div>
                    <div className="relative z-0 p-6">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-display text-2xl text-cream group-hover/link:text-gold">
                          {b.name}
                        </h3>
                        <span className="font-display text-xl text-gold">{dram(b.price)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-goldlt transition-colors group-hover/link:text-gold">
                        View details <ArrowRight width={15} height={15} />
                      </span>
                    </div>
                  </SpotlightCard>
                  <QuickAddButton
                    payload={{
                      slug: slugify(b.name),
                      name: b.name,
                      img: b.img,
                      price: b.price,
                    }}
                    className="right-4 top-4"
                  />
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
