import { dram, type MenuItem } from "@/lib/site";
import DietBadge from "@/components/ui/DietBadge";

/** A single menu line with dotted price leader, tags, and optional description. */
export default function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li>
      <div className="flex items-baseline gap-2">
        <span className="font-semibold text-cream">{item.name}</span>
        {item.tags?.map((t) => (
          <DietBadge key={t} tag={t} />
        ))}
        <span className="leader flex-1" />
        <span className="font-display text-gold">{dram(item.price)}</span>
      </div>
      {item.desc && <p className="mt-1 text-sm text-muted">{item.desc}</p>}
    </li>
  );
}
