import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ALL_ITEMS,
  getMenuItemBySlug,
  unsplash,
  BLUR,
  dram,
  itemRating,
} from "@/lib/site";
import { Reveal } from "@/components/motion/primitives";
import SafeImage from "@/components/ui/SafeImage";
import SpotlightCard from "@/components/ui/SpotlightCard";
import DietBadge from "@/components/ui/DietBadge";
import SpiceLevel from "@/components/ui/SpiceLevel";
import ItemOrderPanel from "@/components/ui/ItemOrderPanel";
import { Star, Clock, ChevronLeft, ArrowRight, Check } from "@/components/ui/icons";

type Params = { params: Promise<{ slug: string }> };

// Only the prerendered item slugs are valid — anything else 404s with a 404 status.
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_ITEMS.map(({ item }) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const found = getMenuItemBySlug(slug);
  if (!found) return { title: "Item not found" };
  const { item } = found;
  const description = item.desc ?? `${item.name} — flame-grilled at BurgerHouse, Yerevan.`;
  const og = unsplash(item.img, 1200);
  return {
    title: item.name,
    description,
    alternates: { canonical: `/menu/${item.slug}` },
    openGraph: {
      title: `${item.name} · BurgerHouse Yerevan`,
      description,
      images: [{ url: og, width: 1200, height: 800, alt: item.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.name,
      description,
      images: [og],
    },
  };
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink px-3 py-1.5 text-sm text-sand">
      {children}
    </span>
  );
}

export default async function ItemPage({ params }: Params) {
  const { slug } = await params;
  const found = getMenuItemBySlug(slug);
  if (!found) notFound();
  const { item, category } = found;
  const rating = itemRating(item.slug);
  const related = ALL_ITEMS.filter(
    (f) => f.category.id === category.id && f.item.slug !== item.slug,
  ).slice(0, 3);

  return (
    <article className="bg-ink">
      {/* Hero image */}
      <section
        data-detail-hero
        className="relative h-[42vh] min-h-[320px] w-full overflow-hidden sm:h-[54vh]"
      >
        <SafeImage
          src={unsplash(item.img, 1600)}
          alt={item.name}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 pt-24 sm:pt-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-char/70 px-4 py-2 text-sm text-cream backdrop-blur transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft width={16} height={16} /> Back to menu
            </Link>
          </div>
        </div>
      </section>

      {/* Detail card */}
      <div className="relative z-10 mx-auto -mt-20 max-w-3xl px-4 pb-40 sm:px-6 md:pb-28">
        <div className="rounded-3xl border border-line bg-char p-7 sm:p-9">
          <p className="eyebrow text-gold">{category.title}</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
            {item.name}
          </h1>

          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <DietBadge key={t} tag={t} />
              ))}
            </div>
          )}

          {/* Meta chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="font-display text-3xl text-gold">{dram(item.price)}</span>
            <Chip>
              <Star width={14} height={14} className="text-gold" /> {rating.toFixed(1)}
            </Chip>
            {item.prepTime && (
              <Chip>
                <Clock width={14} height={14} className="text-gold" /> {item.prepTime}
              </Chip>
            )}
            {typeof item.spice === "number" && (
              <Chip>
                <SpiceLevel level={item.spice} />
              </Chip>
            )}
            {item.calories != null && (
              <Chip>
                <span className="font-semibold text-cream">{item.calories}</span> kcal
              </Chip>
            )}
          </div>

          {item.desc && (
            <p className="mt-6 leading-relaxed text-sand">{item.desc}</p>
          )}

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-2xl text-cream">Ingredients</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {item.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink px-3 py-1.5 text-sm text-sand"
                  >
                    <Check width={13} height={13} className="text-gold" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Allergens / dietary */}
          <div className="mt-6 rounded-2xl border border-line bg-ink p-4 text-sm">
            <span className="font-semibold text-cream">Allergens &amp; dietary: </span>
            <span className="text-muted">
              {item.allergens && item.allergens.length > 0
                ? `Contains ${item.allergens.join(", ")}.`
                : "No major allergens."}
              {item.tags && item.tags.length > 0 && ` ${item.tags.join(" · ")}.`}
            </span>
          </div>

          {/* Customize + CTA */}
          <ItemOrderPanel item={item} />
        </div>
      </div>

      {/* You might also like */}
      {related.length > 0 && (
        <section className="border-t border-line bg-char py-20 sm:py-24">
          <div className="mx-auto max-w-content px-4 sm:px-6">
            <Reveal className="mb-10 text-center">
              <p className="eyebrow text-gold">More to love</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tightish text-cream sm:text-4xl">
                You might also like
              </h2>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map(({ item: r }) => (
                <Link
                  key={r.slug}
                  href={`/menu/${r.slug}`}
                  className="card-lift group block rounded-2xl"
                >
                  <SpotlightCard className="flex h-full flex-col rounded-2xl border border-line bg-ink">
                    <div className="zoom relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                      <SafeImage
                        src={unsplash(r.img, 700)}
                        alt={r.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        placeholder="blur"
                        blurDataURL={BLUR}
                        shimmer
                        className="object-cover"
                      />
                    </div>
                    <div className="relative z-0 flex items-baseline justify-between gap-2 p-5">
                      <h3 className="font-display text-lg text-cream group-hover:text-gold">
                        {r.name}
                      </h3>
                      <span className="whitespace-nowrap font-display text-gold">
                        {dram(r.price)}
                      </span>
                    </div>
                  </SpotlightCard>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/menu"
                className="navlink inline-flex items-center gap-2 text-sm font-semibold text-goldlt hover:text-gold"
              >
                Back to the full menu <ArrowRight width={16} height={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
