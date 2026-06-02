import SafeImage from "@/components/ui/SafeImage";
import { SITE, unsplash, IMAGES, BLUR, STORY_STATS } from "@/lib/site";
import { Reveal, Parallax, CountUp } from "@/components/motion/primitives";

export default function Story() {
  return (
    <section id="story" className="relative bg-ink py-24 sm:py-32">
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
          <p className="eyebrow text-gold">Our Story</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
            Born from a backyard grill
          </h2>
          <p className="mt-6 leading-relaxed text-sand">
            BurgerHouse began with two brothers, one charcoal grill, and a refusal to
            compromise. What started as weekend cookouts on Saryan Street grew into
            Yerevan&rsquo;s most loved burger house — where every patty is still ground
            in-house, every bun is baked before sunrise, and every sauce is built from
            family recipes.
          </p>
          <p className="mt-4 leading-relaxed text-sand">
            We source beef from Armenian highland farms, vegetables from the Kotayk valley,
            and we flame-grill to order. No freezers. No shortcuts. Just fire, craft, and the
            best burger you&rsquo;ll have all year.
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
  );
}
