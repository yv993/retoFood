"use client";

import { useMemo, useState } from "react";
import { BUILDER, BUILDER_BASE_PRICE, dram, type DietTag } from "@/lib/site";
import { Reveal } from "@/components/motion/primitives";
import DietBadge from "@/components/ui/DietBadge";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { type AddPayload } from "@/lib/cart";
import { Check, Sparkles } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const PATTY_COLOR: Record<string, string> = {
  angus: "#5b3a23",
  double: "#4a2f1c",
  chicken: "#c0883f",
  bean: "#6f7a3e",
};
const CHEESE_COLOR: Record<string, string> = {
  cheddar: "#e3a21e",
  gruyere: "#e8c77a",
  pepperjack: "#e6cf6e",
  gouda: "#d98a3f",
  none: "transparent",
};
const TOPPING_COLOR: Record<string, string> = {
  bacon: "#8a3b2a",
  avocado: "#6a8f3a",
  onion: "#b07a3a",
  jalapeno: "#4f8a2e",
  mushroom: "#7a5a3a",
  rings: "#caa15a",
  egg: "#f1e3a6",
};
const SAUCE_COLOR: Record<string, string> = {
  house: "#d8a23a",
  aioli: "#e8dcae",
  bbq: "#7a2f1e",
  truffle: "#bca15a",
  harissa: "#b5481f",
};

function band(selected: boolean, height: number, color: string): React.CSSProperties {
  return {
    height: selected ? height : 0,
    opacity: selected ? 1 : 0,
    marginTop: selected ? 3 : 0,
    background: color,
    transition: "height .35s cubic-bezier(.22,1,.36,1), opacity .3s ease, margin .35s ease",
  };
}

export default function BurgerBuilder() {
  const stepBun = BUILDER[0];
  const stepPatty = BUILDER[1];
  const stepCheese = BUILDER[2];
  const stepToppings = BUILDER[3];
  const stepSauce = BUILDER[4];

  const [bun, setBun] = useState(stepBun.options[0].id);
  const [patty, setPatty] = useState(stepPatty.options[0].id);
  const [cheese, setCheese] = useState(stepCheese.options[0].id);
  const [toppings, setToppings] = useState<string[]>(["bacon"]);
  const [sauce, setSauce] = useState(stepSauce.options[0].id);

  const priceOf = (stepIdx: number, id: string) =>
    BUILDER[stepIdx].options.find((o) => o.id === id)?.price ?? 0;

  const total = useMemo(() => {
    let t = BUILDER_BASE_PRICE;
    t += priceOf(0, bun) + priceOf(1, patty) + priceOf(2, cheese) + priceOf(4, sauce);
    for (const id of toppings) t += stepToppings.options.find((o) => o.id === id)?.price ?? 0;
    return t;
  }, [bun, patty, cheese, sauce, toppings, stepToppings.options]);

  const toggleTopping = (id: string) =>
    setToppings((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  const pattyHeight = patty === "double" ? 42 : 26;

  const getPayload = (): AddPayload => {
    const nameOf = (i: number, id: string) =>
      BUILDER[i].options.find((o) => o.id === id)?.name ?? id;
    const selections = [
      { name: nameOf(0, bun), price: 0 },
      { name: nameOf(1, patty), price: 0 },
      ...(cheese !== "none" ? [{ name: nameOf(2, cheese), price: 0 }] : []),
      ...toppings.map((t) => ({ name: nameOf(3, t), price: 0 })),
      { name: nameOf(4, sauce), price: 0 },
    ];
    return {
      slug: "custom-burger",
      name: "Build Your Own Burger",
      img: "1568901346375-23c9450c58cd",
      price: total,
      qty: 1,
      addons: selections,
    };
  };

  return (
    <section id="builder" className="relative overflow-hidden border-y border-line bg-char py-24 sm:py-32">
      {/* Aurora + sparkles accent behind the header */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 h-[38vh] w-[64vh] -translate-x-1/2"
      >
        <div className="aurora h-full w-full opacity-60" />
        <Sparkles className="absolute left-[18%] top-6 animate-pulse text-gold/60" width={22} height={22} />
        <Sparkles className="absolute right-[20%] top-12 animate-pulse text-goldlt/50" width={16} height={16} />
        <Sparkles className="absolute left-1/2 top-2 animate-pulse text-gold/40" width={14} height={14} />
      </div>

      <div className="relative mx-auto max-w-content px-4 sm:px-6">
        <Reveal className="mb-14 text-center">
          <p className="eyebrow text-gold">Make it yours</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
            Build your own burger
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sand">
            Stack it your way — watch it come together and add it straight to your order.
          </p>
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Live burger */}
          <Reveal className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-line bg-ink p-8">
              <div
                data-builder-visual
                className="mx-auto flex w-[240px] flex-col items-stretch justify-end"
              >
                {/* Top bun */}
                <div
                  className="relative h-12 rounded-t-[120px]"
                  style={{ background: "linear-gradient(180deg,#d9a05a,#c4863f)" }}
                  aria-hidden
                >
                  <span className="absolute left-1/2 top-3 h-1 w-2 -translate-x-1/2 rounded-full bg-[#f0d8a8]" />
                  <span className="absolute left-[35%] top-5 h-1 w-2 rounded-full bg-[#f0d8a8]" />
                  <span className="absolute right-[35%] top-5 h-1 w-2 rounded-full bg-[#f0d8a8]" />
                </div>

                {/* Toppings */}
                {stepToppings.options.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-md"
                    style={band(toppings.includes(o.id), 13, TOPPING_COLOR[o.id] ?? "#8a6a3a")}
                    aria-hidden
                  />
                ))}

                {/* Cheese (drips) */}
                <div
                  className="rounded-[6px]"
                  style={{
                    ...band(cheese !== "none", 14, CHEESE_COLOR[cheese] ?? "#e3a21e"),
                    clipPath:
                      cheese !== "none"
                        ? "polygon(0 0,100% 0,100% 60%,92% 100%,84% 60%,72% 100%,64% 60%,50% 100%,40% 60%,28% 100%,18% 60%,8% 100%,0 60%)"
                        : undefined,
                  }}
                  aria-hidden
                />

                {/* Sauce drizzle */}
                <div
                  className="rounded-full"
                  style={band(true, 7, SAUCE_COLOR[sauce] ?? "#d8a23a")}
                  aria-hidden
                />

                {/* Patty */}
                <div
                  className="rounded-[10px]"
                  style={{
                    height: pattyHeight,
                    marginTop: 3,
                    background: `linear-gradient(180deg, ${PATTY_COLOR[patty] ?? "#5b3a23"}, #3a2417)`,
                    transition: "height .35s cubic-bezier(.22,1,.36,1)",
                  }}
                  aria-hidden
                />

                {/* Bottom bun */}
                <div
                  className="mt-[3px] h-8 rounded-b-[40px]"
                  style={{ background: "linear-gradient(180deg,#c4863f,#a96f33)" }}
                  aria-hidden
                />
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-line pt-5">
                <span className="text-sm text-muted">Your total</span>
                <span className="font-display text-3xl text-gold">{dram(total)}</span>
              </div>
              <div className="mt-4">
                <AddToCartButton
                  getPayload={getPayload}
                  flyFrom={() =>
                    document.querySelector("[data-builder-visual]") as HTMLElement | null
                  }
                  label={`Add to order · ${dram(total)}`}
                  className="w-full"
                />
              </div>
            </div>
          </Reveal>

          {/* Options */}
          <Reveal delay={0.08} className="space-y-8">
            <Step
              title={stepBun.title}
              options={stepBun.options}
              value={bun}
              onSelect={setBun}
            />
            <Step
              title={stepPatty.title}
              options={stepPatty.options}
              value={patty}
              onSelect={setPatty}
            />
            <Step
              title={stepCheese.title}
              options={stepCheese.options}
              value={cheese}
              onSelect={setCheese}
            />
            <Step
              title={stepToppings.title}
              options={stepToppings.options}
              multi
              values={toppings}
              onToggle={toggleTopping}
            />
            <Step
              title={stepSauce.title}
              options={stepSauce.options}
              value={sauce}
              onSelect={setSauce}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Step({
  title,
  options,
  value,
  values,
  multi,
  onSelect,
  onToggle,
}: {
  title: string;
  options: { id: string; name: string; price: number; tags?: DietTag[] }[];
  value?: string;
  values?: string[];
  multi?: boolean;
  onSelect?: (id: string) => void;
  onToggle?: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-display text-xl text-cream">
        {title}
        {multi && <span className="text-xs font-sans uppercase tracking-widest text-muted">· choose any</span>}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = multi ? !!values?.includes(o.id) : value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={selected}
              onClick={() => (multi ? onToggle?.(o.id) : onSelect?.(o.id))}
              className={cn(
                "group flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                selected
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-line text-sand hover:border-gold/50 hover:text-cream",
              )}
            >
              <span
                className={cn(
                  "grid h-4 w-4 place-items-center rounded-full border transition-colors",
                  selected ? "border-gold bg-gold text-ink" : "border-line",
                )}
              >
                {selected && <Check width={11} height={11} />}
              </span>
              <span className="font-medium">{o.name}</span>
              {o.price > 0 && <span className="text-xs text-muted">+{dram(o.price)}</span>}
              {o.tags?.map((t) => (
                <DietBadge key={t} tag={t} />
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
