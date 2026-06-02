import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * BurgerHouse data layer.
 *
 * A tiny, dependency-free repository so reservations / catering inquiries /
 * newsletter signups / gift cards / paid orders are PERSISTED, not just emailed.
 *
 * Backends (auto-selected, clearly logged once at first use):
 *   • "file"   — JSON file at `.data/db.json` (default for local/dev). Survives
 *                restarts; ideal for a single Node server.
 *   • "memory" — used when the filesystem is read-only (e.g. some serverless
 *                platforms) so the build/runtime never crashes. Data is per
 *                instance and resets on redeploy — this is logged as a warning.
 *
 * Production upgrade path: set `DATABASE_URL` and follow DEPLOYMENT.md to swap
 * this module for Prisma + Postgres. The schema in `prisma/schema.prisma`
 * mirrors the models below 1:1, so call sites don't change.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export type OrderStatus = "received" | "preparing" | "ready" | "completed" | "cancelled";
export type ReservationStatus = "requested" | "confirmed" | "seated" | "no-show" | "cancelled";
export type InquiryStatus = "new" | "quoted" | "won" | "lost";
export type GiftCardStatus = "requested" | "paid" | "redeemed" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];
export const RESERVATION_STATUSES: ReservationStatus[] = [
  "requested",
  "confirmed",
  "seated",
  "no-show",
  "cancelled",
];
export const INQUIRY_STATUSES: InquiryStatus[] = ["new", "quoted", "won", "lost"];
export const GIFTCARD_STATUSES: GiftCardStatus[] = [
  "requested",
  "paid",
  "redeemed",
  "cancelled",
];

interface Base {
  id: string;
  ref: string;
  status: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface OrderLine {
  name: string;
  qty: number;
  price: number; // dram, line total
}
export interface Order extends Base {
  status: OrderStatus;
  customerName?: string;
  email?: string;
  phone?: string;
  fulfillment: "delivery" | "pickup";
  lines: OrderLine[];
  total: number; // dram
  currency: string;
  stripeSessionId?: string;
  note?: string;
}

export interface Reservation extends Base {
  status: ReservationStatus;
  name: string;
  phone: string;
  email?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  notes?: string;
}

export interface CateringInquiry extends Base {
  status: InquiryStatus;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  serviceStyle?: string;
  date?: string;
  startTime?: string;
  duration?: string;
  venue?: string;
  guests: number;
  packageId?: string;
  packageName?: string;
  addOns?: string[];
  estimate?: number; // dram
  budget?: string;
  dietary?: { veg?: number; vegan?: number; halal?: number; allergyNotes?: string };
  message?: string;
}

export interface NewsletterSignup extends Base {
  status: "active" | "unsubscribed";
  email: string;
  source?: string;
}

export interface GiftCard extends Base {
  status: GiftCardStatus;
  amount: number; // dram
  buyerEmail?: string;
  recipientEmail?: string;
  message?: string;
  code?: string;
  stripeSessionId?: string;
}

interface Schema {
  orders: Order[];
  reservations: Reservation[];
  cateringInquiries: CateringInquiry[];
  newsletter: NewsletterSignup[];
  giftCards: GiftCard[];
}

const EMPTY: Schema = {
  orders: [],
  reservations: [],
  cateringInquiries: [],
  newsletter: [],
  giftCards: [],
};

/* ------------------------------------------------------------------ */
/* Store (singleton, HMR-safe)                                         */
/* ------------------------------------------------------------------ */
type Mode = "file" | "memory";

interface StoreState {
  data: Schema;
  mode: Mode;
  loaded: boolean;
  loading: Promise<void> | null;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const g = globalThis as unknown as { __bhStore?: StoreState };
const store: StoreState =
  g.__bhStore ?? (g.__bhStore = { data: structuredClone(EMPTY), mode: "file", loaded: false, loading: null });

async function ensureLoaded(): Promise<void> {
  if (store.loaded) return;
  if (store.loading) return store.loading;
  store.loading = (async () => {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        const raw = await fs.readFile(DB_FILE, "utf8");
        store.data = { ...structuredClone(EMPTY), ...(JSON.parse(raw) as Partial<Schema>) };
      } catch {
        // No file yet — start empty and write it.
        await persist();
      }
      store.mode = "file";
      console.info(`[db] store=file path=${DB_FILE}`);
    } catch (err) {
      store.mode = "memory";
      console.warn(
        "[db] store=memory — filesystem not writable; records persist only for this instance and reset on redeploy. Set DATABASE_URL + Prisma for durable storage (see DEPLOYMENT.md).",
        err instanceof Error ? err.message : err,
      );
    } finally {
      store.loaded = true;
      store.loading = null;
    }
  })();
  return store.loading;
}

async function persist(): Promise<void> {
  if (store.mode === "memory") return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(store.data, null, 2), "utf8");
  } catch (err) {
    // Degrade to memory rather than throwing inside a form submit.
    store.mode = "memory";
    console.warn("[db] write failed — switching to in-memory store", err);
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function id(): string {
  return crypto.randomUUID();
}

/** Human-friendly, sortable-ish reference, e.g. ORD-7F3K-9Q2. */
export function makeRef(prefix: string): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const pick = (n: number) =>
    Array.from({ length: n }, () => alphabet[crypto.randomInt(alphabet.length)]).join("");
  return `${prefix}-${pick(4)}-${pick(3)}`;
}

function now(): string {
  return new Date().toISOString();
}

function matches(rec: Record<string, unknown>, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return Object.values(rec).some((v) => {
    if (v == null) return false;
    if (typeof v === "object") return JSON.stringify(v).toLowerCase().includes(needle);
    return String(v).toLowerCase().includes(needle);
  });
}

export interface Query {
  q?: string;
  status?: string;
}

function filterList<T extends Base>(list: T[], query?: Query): T[] {
  let out = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  if (query?.status && query.status !== "all") out = out.filter((r) => r.status === query.status);
  if (query?.q) out = out.filter((r) => matches(r as Record<string, unknown>, query.q!));
  return out;
}

/* ------------------------------------------------------------------ */
/* Public API — Orders                                                 */
/* ------------------------------------------------------------------ */
export async function createOrder(
  input: Omit<Order, keyof Base> & { status?: OrderStatus },
): Promise<Order> {
  await ensureLoaded();
  const ts = now();
  const rec: Order = {
    id: id(),
    ref: makeRef("ORD"),
    status: input.status ?? "received",
    createdAt: ts,
    updatedAt: ts,
    ...input,
  };
  store.data.orders.push(rec);
  await persist();
  return rec;
}

export async function listOrders(query?: Query): Promise<Order[]> {
  await ensureLoaded();
  return filterList(store.data.orders, query);
}

export async function getOrder(idOrRef: string): Promise<Order | undefined> {
  await ensureLoaded();
  return store.data.orders.find((o) => o.id === idOrRef || o.ref === idOrRef);
}

export async function getOrderBySession(sessionId: string): Promise<Order | undefined> {
  await ensureLoaded();
  return store.data.orders.find((o) => o.stripeSessionId === sessionId);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
  await ensureLoaded();
  const rec = store.data.orders.find((o) => o.id === id);
  if (!rec) return undefined;
  rec.status = status;
  rec.updatedAt = now();
  await persist();
  return rec;
}

/* ------------------------------------------------------------------ */
/* Reservations                                                        */
/* ------------------------------------------------------------------ */
export async function createReservation(
  input: Omit<Reservation, keyof Base>,
): Promise<Reservation> {
  await ensureLoaded();
  const ts = now();
  const rec: Reservation = {
    id: id(),
    ref: makeRef("RES"),
    status: "requested",
    createdAt: ts,
    updatedAt: ts,
    ...input,
  };
  store.data.reservations.push(rec);
  await persist();
  return rec;
}

export async function listReservations(query?: Query): Promise<Reservation[]> {
  await ensureLoaded();
  return filterList(store.data.reservations, query);
}

export async function getReservation(id: string): Promise<Reservation | undefined> {
  await ensureLoaded();
  return store.data.reservations.find((r) => r.id === id || r.ref === id);
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation | undefined> {
  await ensureLoaded();
  const rec = store.data.reservations.find((r) => r.id === id);
  if (!rec) return undefined;
  rec.status = status;
  rec.updatedAt = now();
  await persist();
  return rec;
}

/* ------------------------------------------------------------------ */
/* Catering inquiries                                                  */
/* ------------------------------------------------------------------ */
export async function createCateringInquiry(
  input: Omit<CateringInquiry, keyof Base>,
): Promise<CateringInquiry> {
  await ensureLoaded();
  const ts = now();
  const rec: CateringInquiry = {
    id: id(),
    ref: makeRef("CAT"),
    status: "new",
    createdAt: ts,
    updatedAt: ts,
    ...input,
  };
  store.data.cateringInquiries.push(rec);
  await persist();
  return rec;
}

export async function listCateringInquiries(query?: Query): Promise<CateringInquiry[]> {
  await ensureLoaded();
  return filterList(store.data.cateringInquiries, query);
}

export async function getCateringInquiry(id: string): Promise<CateringInquiry | undefined> {
  await ensureLoaded();
  return store.data.cateringInquiries.find((c) => c.id === id || c.ref === id);
}

export async function updateCateringStatus(
  id: string,
  status: InquiryStatus,
): Promise<CateringInquiry | undefined> {
  await ensureLoaded();
  const rec = store.data.cateringInquiries.find((c) => c.id === id);
  if (!rec) return undefined;
  rec.status = status;
  rec.updatedAt = now();
  await persist();
  return rec;
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */
export async function createNewsletterSignup(
  input: Omit<NewsletterSignup, keyof Base | "status"> & { status?: NewsletterSignup["status"] },
): Promise<NewsletterSignup> {
  await ensureLoaded();
  // De-dupe by email — keep one active record.
  const existing = store.data.newsletter.find(
    (n) => n.email.toLowerCase() === input.email.toLowerCase(),
  );
  if (existing) {
    existing.status = "active";
    existing.updatedAt = now();
    await persist();
    return existing;
  }
  const ts = now();
  const rec: NewsletterSignup = {
    id: id(),
    ref: makeRef("NL"),
    status: input.status ?? "active",
    createdAt: ts,
    updatedAt: ts,
    email: input.email,
    source: input.source,
  };
  store.data.newsletter.push(rec);
  await persist();
  return rec;
}

export async function listNewsletter(query?: Query): Promise<NewsletterSignup[]> {
  await ensureLoaded();
  return filterList(store.data.newsletter, query);
}

export async function updateNewsletterStatus(
  id: string,
  status: NewsletterSignup["status"],
): Promise<NewsletterSignup | undefined> {
  await ensureLoaded();
  const rec = store.data.newsletter.find((n) => n.id === id);
  if (!rec) return undefined;
  rec.status = status;
  rec.updatedAt = now();
  await persist();
  return rec;
}

/* ------------------------------------------------------------------ */
/* Gift cards                                                          */
/* ------------------------------------------------------------------ */
export async function createGiftCard(
  input: Omit<GiftCard, keyof Base | "status"> & { status?: GiftCardStatus },
): Promise<GiftCard> {
  await ensureLoaded();
  const ts = now();
  const rec: GiftCard = {
    id: id(),
    ref: makeRef("GC"),
    status: input.status ?? "requested",
    createdAt: ts,
    updatedAt: ts,
    ...input,
  };
  store.data.giftCards.push(rec);
  await persist();
  return rec;
}

export async function listGiftCards(query?: Query): Promise<GiftCard[]> {
  await ensureLoaded();
  return filterList(store.data.giftCards, query);
}

export async function getGiftCard(id: string): Promise<GiftCard | undefined> {
  await ensureLoaded();
  return store.data.giftCards.find((c) => c.id === id || c.ref === id);
}

export async function getGiftCardBySession(sessionId: string): Promise<GiftCard | undefined> {
  await ensureLoaded();
  return store.data.giftCards.find((c) => c.stripeSessionId === sessionId);
}

export async function updateGiftCardStatus(
  id: string,
  status: GiftCardStatus,
): Promise<GiftCard | undefined> {
  await ensureLoaded();
  const rec = store.data.giftCards.find((c) => c.id === id);
  if (!rec) return undefined;
  rec.status = status;
  rec.updatedAt = now();
  await persist();
  return rec;
}

/* ------------------------------------------------------------------ */
/* Dashboard counts                                                    */
/* ------------------------------------------------------------------ */
export async function counts(): Promise<Record<string, number>> {
  await ensureLoaded();
  return {
    orders: store.data.orders.length,
    reservations: store.data.reservations.length,
    catering: store.data.cateringInquiries.length,
    newsletter: store.data.newsletter.length,
    giftCards: store.data.giftCards.length,
  };
}

export function storeMode(): Mode {
  return store.mode;
}
