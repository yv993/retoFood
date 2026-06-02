import { Ember } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const LABELS = ["Not spicy", "Mild", "Medium", "Hot"] as const;

/** 0–3 ember dots showing spice level. */
export default function SpiceLevel({
  level,
  showLabel = true,
}: {
  level: 0 | 1 | 2 | 3;
  showLabel?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Spice: ${LABELS[level]}`}>
      {[1, 2, 3].map((i) => (
        <Ember
          key={i}
          width={13}
          height={13}
          className={cn(i <= level ? "text-ember" : "text-line")}
        />
      ))}
      {showLabel && <span className="ml-1 text-xs text-muted">{LABELS[level]}</span>}
    </span>
  );
}
