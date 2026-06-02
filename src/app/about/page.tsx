import type { Metadata } from "next";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { Reveal, Parallax, CountUp } from "@/components/motion/primitives";
import GalleryGrid from "@/components/ui/GalleryGrid";
import HowItsMade from "@/components/sections/HowItsMade";
import FarmToFlame from "@/components/sections/FarmToFlame";
import BeforeAfter from "@/components/ui/BeforeAfter";
import { ArrowRight } from "@/components/ui/icons";
import { SITE, unsplash, IMAGES, BLUR, STORY_STATS, GALLERY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How BurgerHouse grew from a backyard charcoal grill on Saryan Street into Yerevan's most loved gourmet burger house.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    title: "Ground in-house",
    body: "Every patty is ground fresh each morning from highland Angus — never frozen, never pre-formed.",
  },
  {
    title: "Baked before sunrise",
    body: "Our brioche is baked on-site daily, so the bun is as much a part of the burger as the beef.",
  },
  {
    title: "Flame, not shortcuts",
    body: "We finish over open flame and build every sauce from family recipes. No freezers, no compromises.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="Born from a backyard grill"
        subtitle="Two brothers, one charcoal grill, and a refusal to compromise."
      />

      {/* Story + image */}
      <section className="bg-ink py-16 sm:py-24">
        <div className="mx-auto grid max-w-content items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <Parallax distance={50}>
              <div className="overflow-hidden rounded-3xl border border-line">
                <SafeImage
                  src={unsplash(IMAGES.story, 1200)}
                  alt="Chef flame-grilling patties in the open BurgerHouse kitchen"
                  width={1200}
                  height={1400}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  className="h-full w-full object-cover"
                />
              </div>
            </Parallax>
            <div className="absolute -bottom-6 -right-3 hidden rounded-2xl border border-gold/40 bg-char px-6 py-5 shadow-2xl sm:block">
              <p className="font-display text-3xl text-gold">Est. {SITE.est}</p>
              <p className="text-xs uppercase tracking-widest text-muted">
                {SITE.contact.street}, {SITE.contact.city}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="leading-relaxed text-sand">
              BurgerHouse began with weekend cookouts on Saryan Street that drew longer and
              longer lines of friends, then strangers, then a city. What never changed was
              the obsession: grind the beef fresh, bake the bun in-house, and treat a burger
              with the seriousness of fine dining.
            </p>
            <p className="mt-4 leading-relaxed text-sand">
              Today we source beef from Armenian highland farms and vegetables from the
              Kotayk valley, and we still flame-grill every order. It&rsquo;s the same fire
              that started in a backyard — just a few thousand burgers wiser.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-line pt-8">
              {STORY_STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl text-gold">
                    <CountUp to={s.countTo ?? 0} suffix={s.suffix ?? ""} />
                  </p>
                  <p className="text-xs uppercase tracking-widest text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Raw → flame-grilled comparison */}
      <section className="border-t border-line bg-ink py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="mb-8 text-center">
            <p className="eyebrow text-gold">See the difference</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tightish text-cream sm:text-4xl">
              Raw → flame-grilled
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sand">
              Drag the slider to watch a fresh-ground patty become the real thing.
            </p>
          </Reveal>
          <Reveal>
            <BeforeAfter />
          </Reveal>
        </div>
      </section>

      {/* From farm to flame — scroll-drawn timeline */}
      <FarmToFlame />

      {/* How it's made — sticky scroll */}
      <HowItsMade />

      {/* Values */}
      <section className="border-y border-line bg-char py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow text-gold">What we stand for</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              Craft over convenience
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="card-lift h-full rounded-3xl border border-line bg-ink p-7">
                  <span className="font-display text-3xl text-gold">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-xl text-cream">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Kitchen gallery */}
      <section className="bg-ink py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Reveal className="mb-10 flex flex-col items-end justify-between gap-4 sm:flex-row">
            <div>
              <p className="eyebrow text-gold">Inside the kitchen</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tightish text-cream sm:text-4xl">
                Where the fire lives
              </h2>
            </div>
            <Link
              href="/gallery"
              className="navlink inline-flex items-center gap-2 text-sm font-semibold text-goldlt hover:text-gold"
            >
              See the full gallery <ArrowRight width={16} height={16} />
            </Link>
          </Reveal>
          <Reveal>
            <GalleryGrid images={GALLERY.slice(0, 6)} variant="preview" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
