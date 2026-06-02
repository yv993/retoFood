// Seed the local file store (.data/db.json) with a few sample records so the
// /admin dashboard has something to show in development.
//
//   node scripts/seed.mjs
//
// Safe to re-run: it overwrites .data/db.json. Do NOT run against production
// data. For Prisma/Postgres, use `prisma/seed.ts` instead (see DEPLOYMENT.md).

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const pick = (n) =>
  Array.from({ length: n }, () => alphabet[crypto.randomInt(alphabet.length)]).join("");
const ref = (p) => `${p}-${pick(4)}-${pick(3)}`;
const iso = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString();
const rec = (p, status, extra) => ({
  id: crypto.randomUUID(),
  ref: ref(p),
  status,
  createdAt: iso(extra._d ?? 0),
  updatedAt: iso(extra._d ?? 0),
  ...Object.fromEntries(Object.entries(extra).filter(([k]) => k !== "_d")),
});

const data = {
  orders: [
    rec("ORD", "received", {
      _d: 0,
      customerName: "Ani Grigoryan",
      email: "ani@example.com",
      phone: "+374 91 234567",
      fulfillment: "delivery",
      lines: [{ name: "Smoky Ember ×2", qty: 2, price: 11800 }, { name: "Truffle Fries", qty: 1, price: 2200 }],
      total: 16800,
      currency: "AMD",
    }),
    rec("ORD", "preparing", {
      _d: 1,
      customerName: "David K.",
      email: "david@example.com",
      fulfillment: "pickup",
      lines: [{ name: "Classic Angus", qty: 1, price: 4900 }],
      total: 5880,
      currency: "AMD",
    }),
    rec("ORD", "completed", {
      _d: 4,
      customerName: "Lilit M.",
      fulfillment: "delivery",
      lines: [{ name: "Truffle Noir Deluxe", qty: 2, price: 13800 }],
      total: 17460,
      currency: "AMD",
    }),
  ],
  reservations: [
    rec("RES", "requested", { _d: 0, name: "Sona Petrosyan", phone: "+374 77 112233", email: "sona@example.com", date: "2026-06-12", time: "19:30", guests: 4, notes: "Window table if possible" }),
    rec("RES", "confirmed", { _d: 2, name: "Mherjan", phone: "+374 99 445566", date: "2026-06-08", time: "20:00", guests: 2 }),
  ],
  cateringInquiries: [
    rec("CAT", "new", {
      _d: 0,
      name: "TechCorp Yerevan",
      email: "events@techcorp.am",
      phone: "+374 10 556677",
      eventType: "Corporate",
      serviceStyle: "On-site live station",
      date: "2026-07-03",
      guests: 80,
      packageId: "signature",
      packageName: "Signature",
      addOns: ["Live flame station", "Milkshake bar"],
      estimate: 920000,
      budget: "800k–1.2M",
      message: "Summer offsite, rooftop venue.",
    }),
    rec("CAT", "quoted", { _d: 3, name: "Narek & Mariam", email: "narek@example.com", phone: "+374 93 778899", eventType: "Wedding", guests: 120, packageName: "Premium", estimate: 1680000 }),
  ],
  newsletter: [
    rec("NL", "active", { _d: 0, email: "fan1@example.com", source: "footer" }),
    rec("NL", "active", { _d: 5, email: "fan2@example.com", source: "popup" }),
  ],
  giftCards: [
    rec("GC", "requested", { _d: 1, amount: 25000, buyerEmail: "gift@example.com", message: "Happy birthday!" }),
    rec("GC", "paid", { _d: 6, amount: 50000, buyerEmail: "buyer@example.com", code: "BH-" + pick(8) }),
  ],
};

await fs.mkdir(DATA_DIR, { recursive: true });
await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf8");
console.log(`Seeded ${DB_FILE} with sample records.`);
