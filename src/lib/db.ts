import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * BurgerHouse data layer.
 *
 * Persists reservations / catering inquiries / newsletter signups / gift cards /
 * paid + placed orders. The PUBLIC API below never changes — only the backend
 * does, selected automatically at runtime:
 *
 *   • DATABASE_URL set  → Postgres via Prisma  (durable; required on Vercel,
 *                          whose filesystem is read-only). See DEPLOYMENT.md.
 *   • DATABASE_URL unset → JSON file at `.data/db.json` (local/dev), falling
 *                          back to in-memory if the filesystem is read-only.
 *
 * Switching is purely environmental — no call sites change. If DATABASE_URL is
 * set but the Prisma client isn't installed/generated yet, we log loudly and
 * fall back to the file/memory store so nothing crashes.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export type OrderStatus = "received" | "preparing" | "ready" | "completed" | "cancelled";
export type ReservationStatus = "requested" | "confirmed" | "seated" | "no-show" | "cancelled";
export type InquiryStatus = "new" | "quoted" | "won" | "lost";
export type GiftCardStatus = "requested" | "paid" | "redeemed" | "cancelled";
export type PaymentMethod = "online" | "cash" | "restaurant";

export const ORDER_STATUSES: OrderStatus[] = ["received", "preparing", "ready", "completed", "cancelled"];
export const RESERVATION_STATUSES: ReservationStatus[] = ["requested", "confirmed", "seated", "no-show", "cancelled"];
export const INQUIRY_STATUSES: InquiryStatus[] = ["new", "quoted", "won", "lost"];
export const GIFTCARD_STATUSES: GiftCardStatus[] = ["requested", "paid", "redeemed", "cancelled"];

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
  paymentMethod?: PaymentMethod;
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

export interface Query {
  q?: string;
  status?: string;
}

export type StoreMode = "postgres" | "file" | "memory";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */
function uid(): string {
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

/* ------------------------------------------------------------------ */
/* Repo contract (both backends implement this)                        */
/* ------------------------------------------------------------------ */
interface Repo {
  mode: StoreMode;
  createOrder(input: Omit<Order, keyof Base> & { status?: OrderStatus }): Promise<Order>;
  listOrders(query?: Query): Promise<Order[]>;
  getOrder(idOrRef: string): Promise<Order | undefined>;
  getOrderBySession(sessionId: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined>;

  createReservation(input: Omit<Reservation, keyof Base>): Promise<Reservation>;
  listReservations(query?: Query): Promise<Reservation[]>;
  getReservation(idOrRef: string): Promise<Reservation | undefined>;
  updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | undefined>;

  createCateringInquiry(input: Omit<CateringInquiry, keyof Base>): Promise<CateringInquiry>;
  listCateringInquiries(query?: Query): Promise<CateringInquiry[]>;
  getCateringInquiry(idOrRef: string): Promise<CateringInquiry | undefined>;
  updateCateringStatus(id: string, status: InquiryStatus): Promise<CateringInquiry | undefined>;

  createNewsletterSignup(
    input: Omit<NewsletterSignup, keyof Base | "status"> & { status?: NewsletterSignup["status"] },
  ): Promise<NewsletterSignup>;
  listNewsletter(query?: Query): Promise<NewsletterSignup[]>;
  updateNewsletterStatus(id: string, status: NewsletterSignup["status"]): Promise<NewsletterSignup | undefined>;

  createGiftCard(
    input: Omit<GiftCard, keyof Base | "status"> & { status?: GiftCardStatus },
  ): Promise<GiftCard>;
  listGiftCards(query?: Query): Promise<GiftCard[]>;
  getGiftCard(idOrRef: string): Promise<GiftCard | undefined>;
  getGiftCardBySession(sessionId: string): Promise<GiftCard | undefined>;
  updateGiftCardStatus(id: string, status: GiftCardStatus): Promise<GiftCard | undefined>;

  counts(): Promise<Record<string, number>>;
}

/* ================================================================== */
/* Backend A — file / in-memory store                                  */
/* ================================================================== */
interface Schema {
  orders: Order[];
  reservations: Reservation[];
  cateringInquiries: CateringInquiry[];
  newsletter: NewsletterSignup[];
  giftCards: GiftCard[];
}
const EMPTY: Schema = { orders: [], reservations: [], cateringInquiries: [], newsletter: [], giftCards: [] };

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface MemState {
  data: Schema;
  mode: "file" | "memory";
  loaded: boolean;
  loading: Promise<void> | null;
}
const g = globalThis as unknown as { __bhMem?: MemState };
const mem: MemState =
  g.__bhMem ?? (g.__bhMem = { data: structuredClone(EMPTY), mode: "file", loaded: false, loading: null });

async function memPersist(): Promise<void> {
  if (mem.mode === "memory") return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(mem.data, null, 2), "utf8");
  } catch (err) {
    mem.mode = "memory";
    console.warn("[db] write failed — switching to in-memory store", err);
  }
}

async function memEnsure(): Promise<void> {
  if (mem.loaded) return;
  if (mem.loading) return mem.loading;
  mem.loading = (async () => {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        const raw = await fs.readFile(DB_FILE, "utf8");
        mem.data = { ...structuredClone(EMPTY), ...(JSON.parse(raw) as Partial<Schema>) };
      } catch {
        await memPersist();
      }
      mem.mode = "file";
      console.info(`[db] store=file path=${DB_FILE}`);
    } catch (err) {
      mem.mode = "memory";
      console.warn(
        "[db] store=memory — filesystem not writable; records persist only for this instance and reset on redeploy. Set DATABASE_URL + Prisma for durable storage (see DEPLOYMENT.md).",
        err instanceof Error ? err.message : err,
      );
    } finally {
      mem.loaded = true;
      mem.loading = null;
    }
  })();
  return mem.loading;
}

function matches(rec: Record<string, unknown>, q: string): boolean {
  const needle = q.toLowerCase();
  return Object.values(rec).some((v) => {
    if (v == null) return false;
    if (typeof v === "object") return JSON.stringify(v).toLowerCase().includes(needle);
    return String(v).toLowerCase().includes(needle);
  });
}
function memFilter<T extends Base>(list: T[], query?: Query): T[] {
  let out = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  if (query?.status && query.status !== "all") out = out.filter((r) => r.status === query.status);
  if (query?.q) out = out.filter((r) => matches(r as Record<string, unknown>, query.q!));
  return out;
}
function stamp<T>(prefix: string, status: string, input: T): T & Base {
  const ts = now();
  return { id: uid(), ref: makeRef(prefix), status, createdAt: ts, updatedAt: ts, ...input };
}

const memoryRepo: Repo = {
  get mode() {
    return mem.mode;
  },

  async createOrder(input) {
    await memEnsure();
    const rec = stamp("ORD", input.status ?? "received", input) as Order;
    mem.data.orders.push(rec);
    await memPersist();
    return rec;
  },
  async listOrders(query) {
    await memEnsure();
    return memFilter(mem.data.orders, query);
  },
  async getOrder(idOrRef) {
    await memEnsure();
    return mem.data.orders.find((o) => o.id === idOrRef || o.ref === idOrRef);
  },
  async getOrderBySession(sessionId) {
    await memEnsure();
    return mem.data.orders.find((o) => o.stripeSessionId === sessionId);
  },
  async updateOrderStatus(id, status) {
    await memEnsure();
    const rec = mem.data.orders.find((o) => o.id === id);
    if (!rec) return undefined;
    rec.status = status;
    rec.updatedAt = now();
    await memPersist();
    return rec;
  },

  async createReservation(input) {
    await memEnsure();
    const rec = stamp("RES", "requested", input) as Reservation;
    mem.data.reservations.push(rec);
    await memPersist();
    return rec;
  },
  async listReservations(query) {
    await memEnsure();
    return memFilter(mem.data.reservations, query);
  },
  async getReservation(idOrRef) {
    await memEnsure();
    return mem.data.reservations.find((r) => r.id === idOrRef || r.ref === idOrRef);
  },
  async updateReservationStatus(id, status) {
    await memEnsure();
    const rec = mem.data.reservations.find((r) => r.id === id);
    if (!rec) return undefined;
    rec.status = status;
    rec.updatedAt = now();
    await memPersist();
    return rec;
  },

  async createCateringInquiry(input) {
    await memEnsure();
    const rec = stamp("CAT", "new", input) as CateringInquiry;
    mem.data.cateringInquiries.push(rec);
    await memPersist();
    return rec;
  },
  async listCateringInquiries(query) {
    await memEnsure();
    return memFilter(mem.data.cateringInquiries, query);
  },
  async getCateringInquiry(idOrRef) {
    await memEnsure();
    return mem.data.cateringInquiries.find((c) => c.id === idOrRef || c.ref === idOrRef);
  },
  async updateCateringStatus(id, status) {
    await memEnsure();
    const rec = mem.data.cateringInquiries.find((c) => c.id === id);
    if (!rec) return undefined;
    rec.status = status;
    rec.updatedAt = now();
    await memPersist();
    return rec;
  },

  async createNewsletterSignup(input) {
    await memEnsure();
    const existing = mem.data.newsletter.find((n) => n.email.toLowerCase() === input.email.toLowerCase());
    if (existing) {
      existing.status = "active";
      existing.updatedAt = now();
      await memPersist();
      return existing;
    }
    const rec = stamp("NL", input.status ?? "active", {
      email: input.email,
      source: input.source,
    }) as NewsletterSignup;
    mem.data.newsletter.push(rec);
    await memPersist();
    return rec;
  },
  async listNewsletter(query) {
    await memEnsure();
    return memFilter(mem.data.newsletter, query);
  },
  async updateNewsletterStatus(id, status) {
    await memEnsure();
    const rec = mem.data.newsletter.find((n) => n.id === id);
    if (!rec) return undefined;
    rec.status = status;
    rec.updatedAt = now();
    await memPersist();
    return rec;
  },

  async createGiftCard(input) {
    await memEnsure();
    const rec = stamp("GC", input.status ?? "requested", input) as GiftCard;
    mem.data.giftCards.push(rec);
    await memPersist();
    return rec;
  },
  async listGiftCards(query) {
    await memEnsure();
    return memFilter(mem.data.giftCards, query);
  },
  async getGiftCard(idOrRef) {
    await memEnsure();
    return mem.data.giftCards.find((c) => c.id === idOrRef || c.ref === idOrRef);
  },
  async getGiftCardBySession(sessionId) {
    await memEnsure();
    return mem.data.giftCards.find((c) => c.stripeSessionId === sessionId);
  },
  async updateGiftCardStatus(id, status) {
    await memEnsure();
    const rec = mem.data.giftCards.find((c) => c.id === id);
    if (!rec) return undefined;
    rec.status = status;
    rec.updatedAt = now();
    await memPersist();
    return rec;
  },

  async counts() {
    await memEnsure();
    return {
      orders: mem.data.orders.length,
      reservations: mem.data.reservations.length,
      catering: mem.data.cateringInquiries.length,
      newsletter: mem.data.newsletter.length,
      giftCards: mem.data.giftCards.length,
    };
  },
};

/* ================================================================== */
/* Backend B — Prisma / Postgres (loaded only when DATABASE_URL set)   */
/* ================================================================== */
// The specifier is assembled at runtime so bundlers don't try to resolve
// @prisma/client at build time — it's an optional dependency you install only
// for a real database (see DEPLOYMENT.md). tsc never sees the module either.
const PRISMA_PKG = ["@prisma", "client"].join("/");

/* eslint-disable @typescript-eslint/no-explicit-any */
async function buildPrismaRepo(): Promise<Repo> {
  const mod: any = await import(/* webpackIgnore: true */ PRISMA_PKG);
  const PrismaClient = mod.PrismaClient;
  const gp = globalThis as unknown as { __bhPrisma?: any };
  const prisma = gp.__bhPrisma ?? (gp.__bhPrisma = new PrismaClient());

  const iso = (d: any) => (d instanceof Date ? d.toISOString() : d);
  const norm = <T>(r: any): T => ({ ...r, createdAt: iso(r?.createdAt), updatedAt: iso(r?.updatedAt) }) as T;
  const normList = <T>(rows: any[]): T[] => rows.map((r) => norm<T>(r));

  function where(query: Query | undefined, fields: string[]) {
    const w: any = {};
    if (query?.status && query.status !== "all") w.status = query.status;
    if (query?.q) w.OR = fields.map((f) => ({ [f]: { contains: query.q, mode: "insensitive" } }));
    return w;
  }
  const order = { orderBy: { createdAt: "desc" as const } };

  return {
    mode: "postgres",

    async createOrder(input) {
      return norm<Order>(await prisma.order.create({ data: { ref: makeRef("ORD"), status: input.status ?? "received", ...input } }));
    },
    async listOrders(query) {
      return normList<Order>(await prisma.order.findMany({ where: where(query, ["ref", "customerName", "email", "phone"]), ...order }));
    },
    async getOrder(idOrRef) {
      const r = await prisma.order.findFirst({ where: { OR: [{ id: idOrRef }, { ref: idOrRef }] } });
      return r ? norm<Order>(r) : undefined;
    },
    async getOrderBySession(sessionId) {
      const r = await prisma.order.findFirst({ where: { stripeSessionId: sessionId } });
      return r ? norm<Order>(r) : undefined;
    },
    async updateOrderStatus(id, status) {
      const r = await prisma.order.update({ where: { id }, data: { status } }).catch(() => null);
      return r ? norm<Order>(r) : undefined;
    },

    async createReservation(input) {
      return norm<Reservation>(await prisma.reservation.create({ data: { ref: makeRef("RES"), status: "requested", ...input } }));
    },
    async listReservations(query) {
      return normList<Reservation>(await prisma.reservation.findMany({ where: where(query, ["ref", "name", "phone", "email"]), ...order }));
    },
    async getReservation(idOrRef) {
      const r = await prisma.reservation.findFirst({ where: { OR: [{ id: idOrRef }, { ref: idOrRef }] } });
      return r ? norm<Reservation>(r) : undefined;
    },
    async updateReservationStatus(id, status) {
      const r = await prisma.reservation.update({ where: { id }, data: { status } }).catch(() => null);
      return r ? norm<Reservation>(r) : undefined;
    },

    async createCateringInquiry(input) {
      return norm<CateringInquiry>(await prisma.cateringInquiry.create({ data: { ref: makeRef("CAT"), status: "new", ...input } }));
    },
    async listCateringInquiries(query) {
      return normList<CateringInquiry>(await prisma.cateringInquiry.findMany({ where: where(query, ["ref", "name", "email", "phone", "eventType"]), ...order }));
    },
    async getCateringInquiry(idOrRef) {
      const r = await prisma.cateringInquiry.findFirst({ where: { OR: [{ id: idOrRef }, { ref: idOrRef }] } });
      return r ? norm<CateringInquiry>(r) : undefined;
    },
    async updateCateringStatus(id, status) {
      const r = await prisma.cateringInquiry.update({ where: { id }, data: { status } }).catch(() => null);
      return r ? norm<CateringInquiry>(r) : undefined;
    },

    async createNewsletterSignup(input) {
      const r = await prisma.newsletterSignup.upsert({
        where: { email: input.email },
        update: { status: "active" },
        create: { ref: makeRef("NL"), status: input.status ?? "active", email: input.email, source: input.source },
      });
      return norm<NewsletterSignup>(r);
    },
    async listNewsletter(query) {
      return normList<NewsletterSignup>(await prisma.newsletterSignup.findMany({ where: where(query, ["ref", "email", "source"]), ...order }));
    },
    async updateNewsletterStatus(id, status) {
      const r = await prisma.newsletterSignup.update({ where: { id }, data: { status } }).catch(() => null);
      return r ? norm<NewsletterSignup>(r) : undefined;
    },

    async createGiftCard(input) {
      return norm<GiftCard>(await prisma.giftCard.create({ data: { ref: makeRef("GC"), status: input.status ?? "requested", ...input } }));
    },
    async listGiftCards(query) {
      return normList<GiftCard>(await prisma.giftCard.findMany({ where: where(query, ["ref", "buyerEmail", "recipientEmail", "code"]), ...order }));
    },
    async getGiftCard(idOrRef) {
      const r = await prisma.giftCard.findFirst({ where: { OR: [{ id: idOrRef }, { ref: idOrRef }] } });
      return r ? norm<GiftCard>(r) : undefined;
    },
    async getGiftCardBySession(sessionId) {
      const r = await prisma.giftCard.findFirst({ where: { stripeSessionId: sessionId } });
      return r ? norm<GiftCard>(r) : undefined;
    },
    async updateGiftCardStatus(id, status) {
      const r = await prisma.giftCard.update({ where: { id }, data: { status } }).catch(() => null);
      return r ? norm<GiftCard>(r) : undefined;
    },

    async counts() {
      const [orders, reservations, catering, newsletter, giftCards] = await Promise.all([
        prisma.order.count(),
        prisma.reservation.count(),
        prisma.cateringInquiry.count(),
        prisma.newsletterSignup.count(),
        prisma.giftCard.count(),
      ]);
      return { orders, reservations, catering, newsletter, giftCards };
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ------------------------------------------------------------------ */
/* Backend selection (memoised)                                        */
/* ------------------------------------------------------------------ */
let repoPromise: Promise<Repo> | null = null;
let resolvedMode: StoreMode = "file";

async function selectRepo(): Promise<Repo> {
  if (process.env.DATABASE_URL) {
    try {
      const repo = await buildPrismaRepo();
      resolvedMode = "postgres";
      console.info("[db] store=postgres (Prisma)");
      return repo;
    } catch (err) {
      console.error(
        "[db] DATABASE_URL is set but the Prisma client isn't available — falling back to the file/memory store. Run `npm i @prisma/client && npx prisma generate` (see DEPLOYMENT.md).",
        err instanceof Error ? err.message : err,
      );
    }
  }
  resolvedMode = mem.mode;
  return memoryRepo;
}

function repo(): Promise<Repo> {
  if (!repoPromise) repoPromise = selectRepo();
  return repoPromise;
}

/** Current backend, after it has been selected (for admin banners etc.). */
export async function storeMode(): Promise<StoreMode> {
  await repo();
  // memoryRepo keeps refining file→memory after the first write.
  return resolvedMode === "postgres" ? "postgres" : mem.mode;
}

/* ------------------------------------------------------------------ */
/* Public API — thin delegators (call sites never change)              */
/* ------------------------------------------------------------------ */
export const createOrder: Repo["createOrder"] = async (i) => (await repo()).createOrder(i);
export const listOrders: Repo["listOrders"] = async (q) => (await repo()).listOrders(q);
export const getOrder: Repo["getOrder"] = async (i) => (await repo()).getOrder(i);
export const getOrderBySession: Repo["getOrderBySession"] = async (s) => (await repo()).getOrderBySession(s);
export const updateOrderStatus: Repo["updateOrderStatus"] = async (i, s) => (await repo()).updateOrderStatus(i, s);

export const createReservation: Repo["createReservation"] = async (i) => (await repo()).createReservation(i);
export const listReservations: Repo["listReservations"] = async (q) => (await repo()).listReservations(q);
export const getReservation: Repo["getReservation"] = async (i) => (await repo()).getReservation(i);
export const updateReservationStatus: Repo["updateReservationStatus"] = async (i, s) => (await repo()).updateReservationStatus(i, s);

export const createCateringInquiry: Repo["createCateringInquiry"] = async (i) => (await repo()).createCateringInquiry(i);
export const listCateringInquiries: Repo["listCateringInquiries"] = async (q) => (await repo()).listCateringInquiries(q);
export const getCateringInquiry: Repo["getCateringInquiry"] = async (i) => (await repo()).getCateringInquiry(i);
export const updateCateringStatus: Repo["updateCateringStatus"] = async (i, s) => (await repo()).updateCateringStatus(i, s);

export const createNewsletterSignup: Repo["createNewsletterSignup"] = async (i) => (await repo()).createNewsletterSignup(i);
export const listNewsletter: Repo["listNewsletter"] = async (q) => (await repo()).listNewsletter(q);
export const updateNewsletterStatus: Repo["updateNewsletterStatus"] = async (i, s) => (await repo()).updateNewsletterStatus(i, s);

export const createGiftCard: Repo["createGiftCard"] = async (i) => (await repo()).createGiftCard(i);
export const listGiftCards: Repo["listGiftCards"] = async (q) => (await repo()).listGiftCards(q);
export const getGiftCard: Repo["getGiftCard"] = async (i) => (await repo()).getGiftCard(i);
export const getGiftCardBySession: Repo["getGiftCardBySession"] = async (s) => (await repo()).getGiftCardBySession(s);
export const updateGiftCardStatus: Repo["updateGiftCardStatus"] = async (i, s) => (await repo()).updateGiftCardStatus(i, s);

export const counts: Repo["counts"] = async () => (await repo()).counts();
