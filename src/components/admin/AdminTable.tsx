import Link from "next/link";
import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
}

export default function AdminTable<T extends { id: string }>({
  rows,
  columns,
  detailBase,
  empty,
}: {
  rows: T[];
  columns: Column<T>[];
  detailBase?: string;
  empty: ReactNode;
}) {
  if (!rows.length) return <>{empty}</>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-char text-xs uppercase tracking-wide text-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.header} className="px-4 py-3 font-semibold">
                {c.header}
              </th>
            ))}
            {detailBase && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.id} className="align-top transition-colors hover:bg-char/40">
              {columns.map((c) => (
                <td key={c.header} className="px-4 py-3">
                  {c.cell(r)}
                </td>
              ))}
              {detailBase && (
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link
                    href={`${detailBase}/${r.id}`}
                    className="font-semibold text-goldlt hover:text-gold"
                  >
                    View →
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
