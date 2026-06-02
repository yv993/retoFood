import Link from "next/link";
import { MENU, dram } from "@/lib/site";
import { Reveal } from "@/components/motion/primitives";
import DietBadge from "@/components/ui/DietBadge";
import HoverPreviewLink from "@/components/ui/HoverPreviewLink";
import ComboCallout from "@/components/ui/ComboCallout";
import { ArrowRight } from "@/components/ui/icons";

export default function MenuTeaser() {
  const burgers = MENU.find((c) => c.id === "burgers") ?? MENU[0];

  return (
    <section id="menu" className="relative border-y border-line bg-char py-24 sm:py-32">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <Reveal className="mb-14 text-center">
          <p className="eyebrow text-gold">Eat &amp; Drink</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
            A taste of the menu
          </h2>
          <div className="gold-rule mx-auto mt-5 h-px w-24" />
        </Reveal>

        <div className="grid items-start gap-x-16 gap-y-12 lg:grid-cols-2">
          <Reveal>
            <h3 className="mb-6 flex items-center gap-3 font-display text-2xl text-cream">
              <span className="text-gold">{burgers.index}</span> {burgers.title}
            </h3>
            <ul className="space-y-5">
              {burgers.items.map((item) => (
                <li key={item.name}>
                  <div className="flex items-baseline gap-2">
                    <HoverPreviewLink
                      href={`/menu/${item.slug}`}
                      name={item.name}
                      img={item.img}
                      price={item.price}
                    />
                    {item.tags?.map((t) => (
                      <DietBadge key={t} tag={t} />
                    ))}
                    <span className="leader flex-1" />
                    <span className="font-display text-gold">{dram(item.price)}</span>
                  </div>
                  {item.desc && <p className="mt-1 text-sm text-muted">{item.desc}</p>}
                </li>
              ))}
            </ul>
            <Link
              href="/menu"
              className="navlink mt-8 inline-flex items-center gap-2 text-sm font-semibold text-goldlt hover:text-gold"
            >
              View the full menu
              <ArrowRight width={16} height={16} />
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <ComboCallout />
            <p className="mt-8 text-sm leading-relaxed text-muted">
              Sides, craft drinks and dessert join the line-up on the full menu — from
              truffle parmesan fries to a burnt Basque cheesecake. Everything is prepared
              to order.
            </p>
            <p className="mt-4 text-sm text-muted">
              Prices in Armenian Dram (֏). All beef is halal-certified Angus. Allergen info
              available on request.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
