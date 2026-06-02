import { COMBO, dram } from "@/lib/site";

export default function ComboCallout({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-gold/30 bg-gradient-to-br from-panel to-char p-6 ${
        className ?? ""
      }`}
    >
      <p className="eyebrow text-gold">Best value</p>
      <h4 className="mt-2 font-display text-2xl text-cream">{COMBO.title}</h4>
      <p className="mt-1 text-sm text-muted">{COMBO.desc}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-sand line-through decoration-muted">
          {dram(COMBO.was)}
        </span>
        <span className="font-display text-2xl text-gold">{dram(COMBO.now)}</span>
      </div>
    </div>
  );
}
