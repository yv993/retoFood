// Runs `prisma migrate deploy` during the Vercel build, but ONLY when a database
// URL is configured. Locally (no DB URL) it skips, so `next build` / `npm run
// smoke` keep working against the file store. A migration failure is logged but
// does NOT fail the build (the app falls back gracefully and we can re-run).
import { execSync } from "node:child_process";

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;

if (!url) {
  console.log("[migrate] No PRISMA_DATABASE_URL/DATABASE_URL — skipping migrations (file store).");
  process.exit(0);
}

try {
  console.log("[migrate] Applying `prisma migrate deploy`…");
  execSync("prisma migrate deploy", { stdio: "inherit" });
  console.log("[migrate] Migrations applied.");
} catch (err) {
  console.error("[migrate] `prisma migrate deploy` failed (continuing build):", err?.message ?? err);
}
