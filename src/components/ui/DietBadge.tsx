import type { DietTag } from "@/lib/site";
import { cn } from "@/lib/cn";

const MAP: Record<DietTag, { label: string; cls: string }> = {
  Veg: { label: "Veg", cls: "bg-panel text-gold" },
  Spicy: { label: "Spicy", cls: "bg-ember/15 text-ember border border-ember/30" },
  Halal: { label: "Halal", cls: "border border-gold/30 text-goldlt" },
  Bestseller: { label: "Bestseller", cls: "bg-gold/15 text-gold" },
  Chef: { label: "Chef's pick", cls: "bg-gold/15 text-gold" },
};

export default function DietBadge({ tag }: { tag: DietTag }) {
  const m = MAP[tag];
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        m.cls,
      )}
    >
      {m.label}
    </span>
  );
}
