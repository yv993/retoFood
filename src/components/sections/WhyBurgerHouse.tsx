import type { SVGProps, ComponentType } from "react";
import { Reveal, CountUp } from "@/components/motion/primitives";
import { Flame, Wheat, ShieldCheck, Pin, Star, Leaf } from "@/components/ui/icons";
import { RATING } from "@/lib/site";
import { cn } from "@/lib/cn";

interface Cell {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
  stat?: { to: number; suffix?: string; decimals?: number; label: string };
  className: string;
}

const CELLS: Cell[] = [
  {
    Icon: Flame,
    title: "Dry-aged Angus",
    body: "12-hour dry-aged, ground in-house every morning and smashed on a 300°C flat-top.",
    stat: { to: 12, suffix: "h", label: "dry-age" },
    className: "md:col-span-2",
  },
  {
    Icon: Star,
    title: "Loved across Yerevan",
    body: "Rated by thousands of guests and counting — come see why.",
    stat: { to: RATING.value, suffix: "★", decimals: 1, label: `${RATING.count.toLocaleString("en-US")}+ reviews` },
    className: "md:row-span-2",
  },
  {
    Icon: Wheat,
    title: "House-baked brioche",
    body: "Baked on-site before sunrise, every single day.",
    className: "",
  },
  {
    Icon: ShieldCheck,
    title: "Halal certified",
    body: "100% halal-certified Angus, marked across the menu.",
    className: "",
  },
  {
    Icon: Pin,
    title: "Minutes from the centre",
    body: "On Saryan Street — a short walk from Republic Square.",
    stat: { to: 7, suffix: " min", label: "from Republic Sq." },
    className: "md:col-span-2",
  },
  {
    Icon: Leaf,
    title: "Local Armenian produce",
    body: "Highland beef and Kotayk-valley vegetables, sourced locally.",
    className: "",
  },
];

export default function WhyBurgerHouse() {
  return (
    <section className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <Reveal className="mb-14 text-center">
          <p className="eyebrow text-gold">The difference</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
            Why BurgerHouse
          </h2>
          <div className="gold-rule mx-auto mt-5 h-px w-24" />
        </Reveal>

        <div className="grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {CELLS.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.06} className={cn(c.className)}>
              <article className="card-lift group relative h-full overflow-hidden rounded-3xl border border-line bg-char p-7">
                {/* gold accent */}
                <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold/10 blur-2xl transition-opacity duration-300 group-hover:bg-gold/20" />
                <div className="relative flex h-full flex-col">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <c.Icon width={24} height={24} />
                  </span>
                  {c.stat && (
                    <p className="mt-5 font-display text-4xl text-gold sm:text-5xl">
                      <CountUp to={c.stat.to} suffix={c.stat.suffix ?? ""} decimals={c.stat.decimals ?? 0} />
                    </p>
                  )}
                  <h3 className="mt-3 font-display text-xl text-cream">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
                  {c.stat && (
                    <p className="mt-auto pt-4 text-xs uppercase tracking-widest text-muted">
                      {c.stat.label}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
