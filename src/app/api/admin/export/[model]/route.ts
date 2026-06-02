import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import {
  listOrders,
  listReservations,
  listCateringInquiries,
  listNewsletter,
  listGiftCards,
} from "@/lib/db";

export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: object[]): string {
  if (!rows.length) return "";
  const recs = rows as Record<string, unknown>[];
  const headers = [...new Set(recs.flatMap((r) => Object.keys(r)))];
  const lines = [headers.join(",")];
  for (const r of recs) lines.push(headers.map((h) => csvCell(r[h])).join(","));
  return lines.join("\n");
}

type Ctx = { params: Promise<{ model: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  // Proxy already guards /api/admin/* — re-check here as defense in depth.
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const { model } = await ctx.params;
  const q = req.nextUrl.searchParams.get("q") ?? undefined;
  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const query = { q, status };

  let rows: object[];
  switch (model) {
    case "orders":
      rows = await listOrders(query);
      break;
    case "reservations":
      rows = await listReservations(query);
      break;
    case "catering":
      rows = await listCateringInquiries(query);
      break;
    case "newsletter":
      rows = await listNewsletter(query);
      break;
    case "gift-cards":
      rows = await listGiftCards(query);
      break;
    default:
      return new Response("Unknown model", { status: 404 });
  }

  const csv = toCsv(rows);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="burgerhouse-${model}.csv"`,
    },
  });
}
