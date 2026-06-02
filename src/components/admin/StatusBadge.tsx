import { cn } from "@/lib/cn";

const TONES: Record<string, string> = {
  // greens
  confirmed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  ready: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  completed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  won: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  paid: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  active: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  seated: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  redeemed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  // gold / in-progress
  preparing: "border-gold/40 bg-gold/10 text-gold",
  quoted: "border-gold/40 bg-gold/10 text-gold",
  // neutral / new
  received: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  requested: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  new: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  // red / terminal-negative
  cancelled: "border-ember/40 bg-ember/10 text-ember",
  "no-show": "border-ember/40 bg-ember/10 text-ember",
  lost: "border-ember/40 bg-ember/10 text-ember",
  unsubscribed: "border-ember/40 bg-ember/10 text-ember",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        TONES[status] ?? "border-line bg-char text-sand",
      )}
    >
      {status}
    </span>
  );
}
