"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MENU, dram, unsplash, BLUR, type DietTag } from "@/lib/site";
import DietBadge from "@/components/ui/DietBadge";
import ComboCallout from "@/components/ui/ComboCallout";
import SafeImage from "@/components/ui/SafeImage";
import SpotlightCard from "@/components/ui/SpotlightCard";
import QuickAddButton from "@/components/cart/QuickAddButton";
import MenuFilters from "@/components/sections/MenuFilters";
import MenuFilterSheet from "@/components/sections/MenuFilterSheet";
import { ArrowRight } from "@/components/ui/icons";

export default function MenuExplorer() {
  const [cat, setCat] = useState<string>("all");
  const [diet, setDiet] = useState<DietTag[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const tabs = [{ id: "all", title: "All" }, ...MENU.map((c) => ({ id: c.id, title: c.title }))];

  const toggleDiet = (t: DietTag) =>
    setDiet((d) => (d.includes(t) ? d.filter((x) => x !== t) : [...d, t]));

  const filtered = useMemo(() => {
    return MENU.filter((c) => cat === "all" || c.id === cat)
      .map((c) => ({
        ...c,
        items: c.items.filter((it) => diet.every((t) => it.tags?.includes(t))),
      }))
      .filter((c) => c.items.length > 0);
  }, [cat, diet]);

  const empty = filtered.length === 0;

  return (
    <div>
      {/* Filters — inline on desktop, bottom-sheet on mobile */}
      <div className="mb-12 hidden md:block">
        <MenuFilters
          tabs={tabs}
          cat={cat}
          setCat={setCat}
          diet={diet}
          toggleDiet={toggleDiet}
          clearDiet={() => setDiet([])}
        />
      </div>

      <div className="mb-10 flex items-center justify-between gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-sand"
        >
          Filters
          {(cat !== "all" || diet.length > 0) && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
              {(cat !== "all" ? 1 : 0) + diet.length}
            </span>
          )}
        </button>
        <span className="truncate text-xs text-muted">
          {tabs.find((t) => t.id === cat)?.title}
        </span>
      </div>

      <MenuFilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <MenuFilters
          tabs={tabs}
          cat={cat}
          setCat={setCat}
          diet={diet}
          toggleDiet={toggleDiet}
          clearDiet={() => setDiet([])}
          align="start"
        />
      </MenuFilterSheet>

      {empty ? (
        <p className="py-16 text-center text-muted">
          No dishes match those filters. Try clearing a filter.
        </p>
      ) : (
        <div key={`${cat}-${diet.join("")}`} className="fade-up space-y-14">
          {filtered.map((c) => (
            <div key={c.id}>
              <h3 className="mb-6 flex items-center gap-3 font-display text-2xl text-cream">
                <span className="text-gold">{c.index}</span> {c.title}
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {c.items.map((item) => (
                  <div data-card key={item.name} className="relative">
                    <SpotlightCard className="card-lift group flex h-full flex-col rounded-2xl border border-line bg-char">
                      <Link
                        href={`/menu/${item.slug}`}
                        aria-label={`View ${item.name}`}
                        className="absolute inset-0 z-20 rounded-2xl"
                      />
                      <div className="zoom relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                        <SafeImage
                          src={unsplash(item.img, 800)}
                          alt={item.name}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          placeholder="blur"
                          blurDataURL={BLUR}
                          shimmer
                          className="object-cover"
                        />
                      </div>
                      <div className="relative z-0 flex flex-1 flex-col p-5">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-display text-lg text-cream group-hover:text-gold">
                            {item.name}
                          </h4>
                          <span className="whitespace-nowrap font-display text-gold">
                            {dram(item.price)}
                          </span>
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.tags.map((t) => (
                              <DietBadge key={t} tag={t} />
                            ))}
                          </div>
                        )}
                        {item.desc && (
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                            {item.desc}
                          </p>
                        )}
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-goldlt transition-colors group-hover:text-gold">
                          View details <ArrowRight width={15} height={15} />
                        </span>
                      </div>
                    </SpotlightCard>
                    <QuickAddButton
                      payload={{
                        slug: item.slug,
                        name: item.name,
                        img: item.img,
                        price: item.price,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto mt-16 max-w-md">
        <ComboCallout />
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        Prices in Armenian Dram (֏). All beef is halal-certified Angus. Allergen info
        available on request.
      </p>
    </div>
  );
}
