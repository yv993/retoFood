import Link from "next/link";
import { Search, Download } from "@/components/ui/icons";

/** Search + status filter (plain GET form — works without JS) + CSV export. */
export default function Toolbar({
  model,
  q,
  status,
  statuses,
  count,
}: {
  model: string;
  q?: string;
  status?: string;
  statuses: readonly string[];
  count: number;
}) {
  const exportHref = `/api/admin/export/${model}?${new URLSearchParams({
    ...(q ? { q } : {}),
    ...(status && status !== "all" ? { status } : {}),
  }).toString()}`;

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <form method="GET" className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search width={16} height={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search…"
            className="w-full rounded-xl border border-line bg-char py-2.5 pl-9 pr-3 text-sm text-cream placeholder-muted focus:border-gold focus:outline-none"
          />
        </div>
        <select
          name="status"
          defaultValue={status ?? "all"}
          className="rounded-xl border border-line bg-char px-3 py-2.5 text-sm text-cream [color-scheme:dark] focus:border-gold focus:outline-none"
        >
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="cursor-pointer rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:border-gold hover:text-gold"
        >
          Filter
        </button>
      </form>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">{count} total</span>
        <Link
          href={exportHref}
          prefetch={false}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-line px-3 py-2.5 text-sm font-semibold text-sand transition-colors hover:border-gold hover:text-gold"
        >
          <Download width={15} height={15} /> CSV
        </Link>
      </div>
    </div>
  );
}
