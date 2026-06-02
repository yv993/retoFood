This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment variables

Copy `.env.example` → `.env.local` and fill in what you need. **Everything is optional** —
the site builds and runs with no keys; features degrade gracefully:

| Variable | Feature | Without it |
| --- | --- | --- |
| `RESEND_API_KEY` | Email for reservation / catering / newsletter / gift-card / contact forms (via [Resend](https://resend.com)) | Forms validate + log server-side (dev no-op); no email sent |
| `RESEND_FROM` | Verified sender address | Uses Resend's onboarding sender |
| `CONTACT_EMAIL` | Inbox that receives form notifications | Defaults to `hello@burgerhouse.am` |
| `STRIPE_SECRET_KEY` | Stripe Checkout session creation (server) | — |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Enables the **Pay** buttons on `/checkout` and the catering deposit | Pay buttons stay disabled with a clear message |
| `STRIPE_WEBHOOK_SECRET` | Verifies `/api/stripe/webhook`; persists paid orders + emails receipts | Webhook acknowledges and no-ops (no order saved) |
| `CATERING_DEPOSIT_AMD` | Catering "lock your date" deposit amount, in dram | Defaults to `50000` |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for Stripe success/cancel URLs | Falls back to the request host |
| `DATABASE_URL` | Production database (Postgres via Prisma — see `DEPLOYMENT.md`) | Built-in file/in-memory store (below) |
| `ADMIN_PASSWORD` | Password for the `/admin` dashboard | `/admin` is open in dev, blocked in prod |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Privacy-friendly analytics (loaded only after cookie consent) | No analytics loaded |

## Data layer & admin

The site persists **reservations, catering inquiries, newsletter signups, gift cards and paid
orders** via a small repository in [`src/lib/db.ts`](src/lib/db.ts):

- **Default (zero-config):** a JSON file at `.data/db.json` in dev, automatically falling back to
  an in-memory store in read-only environments (logged clearly). Forms still email as before — the
  DB write is additive, with email-only fallback if the store is unavailable.
- **Production:** set `DATABASE_URL` and follow [`DEPLOYMENT.md`](DEPLOYMENT.md) to switch to
  Prisma + Postgres. The reference schema lives in [`prisma/schema.prisma`](prisma/schema.prisma)
  and mirrors the TypeScript models 1:1.

Seed sample rows for local development:

```bash
npm run db:seed      # writes sample records into .data/db.json
```

**Admin dashboard** — visit [`/admin`](http://localhost:3000/admin). Sign in with `ADMIN_PASSWORD`
(in development, sign-in is open if it's unset). It's `noindex`, excluded from `robots`/`sitemap`,
and guarded by [`src/proxy.ts`](src/proxy.ts) (Next 16's renamed middleware) **and** re-checked in
each server component/action. Pages: Orders, Reservations, Catering, Newsletter, Gift cards — each
searchable/filterable with detail views, a status workflow, and CSV export.

**Checkout flow:** cart → `/checkout` → `createCheckoutSession` server action → Stripe Checkout →
`/checkout/success` (clears cart) or `/checkout/cancel`. Line items are priced in AMD (dram),
with delivery fee, 20% VAT, optional tip and promo codes (`BURGER10`, `YEREVAN15`).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
