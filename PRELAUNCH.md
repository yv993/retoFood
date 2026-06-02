# BurgerHouse — Pre-Launch QA Checklist

Run the automated smoke test first, then walk the manual list. The site is fully
functional **without Stripe** (orders are placed as cash-on-delivery / pay-at-restaurant).

```bash
npm run smoke      # builds, starts the server, checks key routes (≈1 min)
```

`npm run smoke` verifies: home/menu/catering render, checkout works without Stripe,
catering PDF resolves, sitemap/robots are correct, `/admin` is protected, login renders,
and the Stripe webhook no-ops safely.

---

## 0. Content & config (edit `src/lib/site.ts`)
- [ ] Replace every `// TODO: REPLACE WITH REAL VALUE` (address, phone, email, hours, socials, WhatsApp/Telegram, map coords, menu + catering prices). Find them: `grep -rn "REPLACE WITH REAL VALUE" src/lib/site.ts`.
- [ ] Replace `[REGISTERED BUSINESS ENTITY]` / `[…ADDRESS]` / `[…EMAIL]` / reg number in `LEGAL` (used across the legal pages).
- [ ] Replace `public/catering-menu.pdf` with the real menu PDF.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain; confirm it matches `SITE.url`.

## 1. Ordering / checkout (critical — no Stripe)
- [ ] Add items to cart from `/menu`, a signature card, and a menu detail page; cart badge updates; fly-to-cart animates.
- [ ] Cart drawer + `/cart`: change quantities, remove items, totals recalc.
- [ ] `/checkout`: toggle **Delivery** ↔ **Pickup**; payment options switch to **Cash on delivery** / **Pay at restaurant**.
- [ ] Submit with missing name/phone (and missing address on delivery) → inline error toasts.
- [ ] Place a valid order → redirected to `/checkout/success?ref=ORD-…` showing the order summary + reference; cart clears.
- [ ] Order appears in `/admin/orders` with status **received**; confirmation email to customer + notification to restaurant (when `RESEND_API_KEY` set).
- [ ] Tip + promo (`BURGER10`, `YEREVAN15`) reflected in the total and the saved order.

## 2. Forms (all persist + email)
- [ ] `/reserve` — date/time within hours; success toast + confetti; appears in `/admin/reservations`.
- [ ] `/catering` — package tiers, live estimator total updates, add-ons; "Get a quote" preselects a package; submit → `/admin/catering`. Deposit button funnels to the form (Stripe deferred).
- [ ] Newsletter (footer) → `/admin/newsletter` (de-duped by email).
- [ ] `/gift-cards` → `/admin/gift-cards`.
- [ ] `/contact` → email received.
- [ ] Honeypot: bots filling the hidden `company` field get a silent success, no record.

## 3. Routes & links
- [ ] Every nav + footer link resolves; `/`, `/menu`, `/menu/[slug]` (×N), `/about`, `/gallery`, `/reserve`, `/catering`, `/gift-cards`, `/contact`, legal pages.
- [ ] 404 page for an unknown menu slug returns a real 404.
- [ ] External delivery-app buttons, WhatsApp, phone, Telegram, map link all open correctly.

## 4. Admin (`/admin`)
- [ ] With `ADMIN_PASSWORD` set: `/admin` redirects to login; wrong password rejected; correct password signs in; sign-out works.
- [ ] Each table: search + status filter + CSV export.
- [ ] Status workflows: Order received→preparing→ready→completed/cancelled; Reservation requested→confirmed→seated→no-show; Catering new→quoted→won/lost. Customer status email sent when an email is on file.
- [ ] Detail pages render every field.
- [ ] `/admin` is **not** in `sitemap.xml`, is disallowed in `robots.txt`, and is `noindex`.

## 5. Languages (i18n)
- [ ] Language switcher EN / RU / HY changes copy; choice persists across navigation/reload; no layout breakage in any language.

## 6. Mobile & desktop
- [ ] Test at 375 / 768 / 1024 / 1440 px: no horizontal scroll, tap targets ≥ 44px, sticky bars don't cover content.
- [ ] Mobile menu filter bottom-sheet, cart drawer, and mobile action bar work.
- [ ] Custom cursor only on pointer devices; hidden/disabled on touch.

## 7. Performance / trust / SEO
- [ ] Images load (self-hosted from `/public/img`); no broken images; no layout shift on load.
- [ ] LCP hero loads fast; fonts swap without FOIT.
- [ ] `prefers-reduced-motion`: animations, marquee, parallax, cursor all stop.
- [ ] Cookie banner: analytics fire **only** after "Accept" (and only if `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set).
- [ ] Open Graph / Twitter preview image resolves (self-hosted) — test with a link unfurl.
- [ ] Run Lighthouse (mobile) on `/`, `/menu`, `/catering`; address any red items.

## 8. Production data & deploy
- [ ] `DATABASE_URL` set to Postgres; Prisma migrated (`npx prisma migrate deploy`); place a test order and confirm it persists across a redeploy.
- [ ] `RESEND_API_KEY` + verified `RESEND_FROM`; test emails land (not spam).
- [ ] (When Armenia supports it) add Stripe keys + webhook to enable card payment — no code change needed.
- [ ] Final `npm run build` + `npm run typecheck` green in CI.
