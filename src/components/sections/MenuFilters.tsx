import type { DietTag } from "@/lib/site";
import { cn } from "@/lib/cn";

const DIET_FILTERS: DietTag[] = ["Veg", "Spicy", "Halal"];

/** Presentational category tabs + dietary filters (used inline on desktop and in the mobile sheet). */
export default function MenuFilters({
  tabs,
  cat,
  setCat,
  diet,
  toggleDiet,
  clearDiet,
  align = "center",
}: {
  tabs: { id: string; title: string }[];
  cat: string;
  setCat: (id: string) => void;
  diet: DietTag[];
  toggleDiet: (t: DietTag) => void;
  clearDiet: () => void;
  align?: "center" | "start";
}) {
  const justify = align === "center" ? "justify-center" : "justify-start";
  return (
    <div>
      <div className={cn("mb-5 flex flex-wrap gap-2", justify)} role="tablist" aria-label="Menu categories">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={cat === t.id}
            onClick={() => setCat(t.id)}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200",
              cat === t.id
                ? "border-gold bg-gold/15 text-gold"
                : "border-line text-sand hover:border-gold/50 hover:text-cream",
            )}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className={cn("flex flex-wrap items-center gap-2", justify)}>
        <span className="text-xs uppercase tracking-widest text-muted">Filter:</span>
        {DIET_FILTERS.map((t) => (
          <button
            key={t}
            aria-pressed={diet.includes(t)}
            onClick={() => toggleDiet(t)}
            className={cn(
              "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200",
              diet.includes(t)
                ? "border-gold bg-gold/15 text-gold"
                : "border-line text-muted hover:text-cream",
            )}
          >
            {t}
          </button>
        ))}
        {diet.length > 0 && (
          <button
            onClick={clearDiet}
            className="cursor-pointer text-xs text-muted underline-offset-4 hover:text-gold hover:underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
