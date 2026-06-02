# BurgerHouse — Deployment Guide

This is a Next.js 16 (App Router) app. It runs with **zero configuration** (forms log to the
console, payment is disabled, data persists to a local file). This guide covers taking it to
production on **Vercel** with email, payments, a real database, and the private admin dashboard.

---

## 1. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production + Preview).
All are optional; features degrade gracefully when absent.

| Variable | Required for | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | Sending email | From [resend.com](https://resend.com). Without it, forms validate + log only. |
| `RESEND_FROM` | Sender identity | e.g. `BurgerHouse <orders@burgerhouse.am>` — must be a Resend-verified domain. |
| `CONTACT_EMAIL` | Form notifications inbox | Defaults to `hello@burgerhouse.am`. |
| `STRIPE_SECRET_KEY` | Checkout + deposit (server) | Use **test** keys first, then live. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Enables Pay buttons (client) | Both Stripe keys must be present for payment UI. |
| `STRIPE_WEBHOOK_SECRET` | Persisting paid orders + receipts | From the Stripe webhook you create in step 3. |
| `CATERING_DEPOSIT_AMD` | Catering deposit amount | Integer dram; defaults to `50000`. |
| `NEXT_PUBLIC_SITE_URL` | Stripe redirect URLs, canonical metadata | e.g. `https://burgerhouse.am`. |
| `DATABASE_URL` | Durable database (Prisma/Postgres) | Omit to use the built-in file/in-memory store. |
| `ADMIN_PASSWORD` | `/admin` access | **Required in production** — admin is blocked if unset in prod. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analytics (consent-gated) | Your Plausible site domain. |

> `NEXT_PUBLIC_*` vars are inlined at build time — changing them requires a redeploy.

---

## 2. Database (optional but recommended for production)

**Default:** with no `DATABASE_URL`, the app uses [`src/lib/db.ts`](src/lib/db.ts):
a JSON file at `.data/db.json` locally, or an in-memory store on read-only/serverless filesystems
(logged as a warning). On Vercel's serverless runtime the in-memory store **resets between
deploys and is per-instance**, so configure a real database for production.

### Switch to Prisma + Postgres

1. Provision Postgres (Vercel Postgres, Neon, Supabase, RDS…) and copy its connection string into
   `DATABASE_URL`.
2. Install Prisma:
   ```bash
   npm i -D prisma && npm i @prisma/client
   ```
3. The schema is already written — [`prisma/schema.prisma`](prisma/schema.prisma) (Postgres
   provider, models matching `src/lib/db.ts` 1:1). Generate the client and run the first migration:
   ```bash
   npx prisma migrate dev --name init     # local
   npx prisma generate
   ```
   For CI/Vercel, add `prisma generate` to a `postinstall` script and run
   `npx prisma migrate deploy` during release.
4. Replace the function bodies in `src/lib/db.ts` with Prisma calls (the exported signatures stay
   the same, so **no call sites change** — actions, admin pages, webhook, and CSV export all keep
   working). Example:
   ```ts
   import { PrismaClient } from "@prisma/client";
   const prisma = new PrismaClient();
   export async function listOrders(q) {
     return prisma.order.findMany({ orderBy: { createdAt: "desc" }, /* + where */ });
   }
   ```
5. Seed (optional): adapt `scripts/seed.mjs` or write `prisma/seed.ts` and wire
   `prisma.seed` in `package.json`.

> **Local SQLite instead of Postgres:** change `provider` to `sqlite` in `prisma/schema.prisma`
> and set `DATABASE_URL="file:./dev.db"`.

---

## 3. Stripe

1. **Test mode first.** Add `STRIPE_SECRET_KEY` (`sk_test_…`) and
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_…`). Deploy and run a full checkout with a
   [test card](https://stripe.com/docs/testing) (`4242 4242 4242 4242`).
2. **Webhook.** Stripe Dashboard → Developers → Webhooks → **Add endpoint**:
   - URL: `https://YOUR_DOMAIN/api/stripe/webhook`
   - Events: `checkout.session.completed`
   - Copy the **Signing secret** (`whsec_…`) into `STRIPE_WEBHOOK_SECRET`.
   - The handler is idempotent on the Stripe session id, persists a paid **Order**, and emails a
     receipt to the customer + a notification to `CONTACT_EMAIL`. Catering deposits
     (`metadata.kind = catering-deposit`) email the events team.
   - Test locally with the Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
3. **Go live.** Swap to live keys (`sk_live_…` / `pk_live_…`), create a **live** webhook endpoint,
   and update `STRIPE_WEBHOOK_SECRET` to the live signing secret.

---

## 4. Admin dashboard

- Set a strong `ADMIN_PASSWORD`. Sign in at `/admin` (cookie session, HMAC of a fixed message keyed
  by the password — rotating the env var invalidates all sessions).
- Guarded by [`src/proxy.ts`](src/proxy.ts) (Next 16's renamed middleware, Node.js runtime) **and**
  re-verified inside each panel server component/route handler.
- `/admin` and `/api/*` are `disallow`ed in `robots.ts`, excluded from `sitemap.ts`, and the admin
  layout sets `robots: { index: false }`.

---

## 5. Deploy to Vercel

1. Push the repo to GitHub/GitLab and **Import** it in Vercel (framework auto-detected as Next.js).
2. Add the environment variables from step 1.
3. Build command `next build`, output handled automatically. Deploy.
4. **Custom domain (`burgerhouse.am`):** Vercel → Project → Settings → Domains → add the domain,
   then create the DNS records Vercel shows (apex `A`/`ALIAS` + `www` `CNAME`) at your registrar.
   Set `NEXT_PUBLIC_SITE_URL=https://burgerhouse.am` and redeploy.

---

## 6. Go-live checklist

- [ ] `npm run build` and `npm run typecheck` pass locally and in CI.
- [ ] `DATABASE_URL` points at production Postgres; migrations applied (`prisma migrate deploy`).
- [ ] `ADMIN_PASSWORD` set; confirm `/admin` requires it and `/admin/login` works.
- [ ] Stripe **live** keys set; **live** webhook endpoint added with the correct signing secret.
- [ ] Run one real checkout → order appears in `/admin/orders`, receipt email received.
- [ ] Submit reservation / catering / newsletter / gift card → each appears in `/admin` and emails fire.
- [ ] `RESEND_FROM` domain verified in Resend; test emails land (not spam).
- [ ] `NEXT_PUBLIC_SITE_URL` is the canonical domain; `robots.txt` + `sitemap.xml` look correct and
      exclude `/admin`, `/cart`, `/checkout`, `/api`.
- [ ] Replace the placeholder `public/catering-menu.pdf` with the real menu.
- [ ] Lighthouse pass (desktop ≥ 95) on `/`, `/menu`, `/catering`.
- [ ] `prefers-reduced-motion` respected; cookie consent gates analytics.

---

## What persists end-to-end

| Action | Saved as | Also emails | Admin view |
| --- | --- | --- | --- |
| `/reserve` form | `Reservation` (`RES-…`) | Notification to staff | Reservations |
| `/catering` inquiry | `CateringInquiry` (`CAT-…`) | Notification to staff | Catering |
| Newsletter signup | `NewsletterSignup` (`NL-…`, de-duped) | Notification | Newsletter |
| `/gift-cards` request | `GiftCard` (`GC-…`) | Notification | Gift cards |
| Paid Stripe checkout | `Order` (`ORD-…`) via webhook | Receipt to customer + staff notice | Orders |
| Admin status change | Updates the record | Customer status email (when email on file) | (in place) |
