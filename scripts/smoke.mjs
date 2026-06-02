// Minimal pre-launch smoke test: builds the app, starts the production server,
// and checks that the key routes render and behave correctly (including that
// /admin is protected and checkout works WITHOUT Stripe).
//
//   npm run smoke
//
// Set SMOKE_NO_BUILD=1 to skip the build (if you've already built).
import { spawn, spawnSync } from "node:child_process";

const PORT = process.env.SMOKE_PORT || "3099";
const BASE = `http://localhost:${PORT}`;
const isWin = process.platform === "win32";
const npx = isWin ? "npx.cmd" : "npx";

function log(ok, msg) {
  console.log(`${ok ? "✓" : "✗"} ${msg}`);
  return ok;
}

if (!process.env.SMOKE_NO_BUILD) {
  console.log("→ Building (next build)…");
  const b = spawnSync(npx, ["next", "build"], { stdio: "inherit", shell: isWin });
  if (b.status !== 0) {
    console.error("✗ Build failed");
    process.exit(1);
  }
}

console.log(`→ Starting server on :${PORT}…`);
const server = spawn(npx, ["next", "start", "-p", PORT], { stdio: "ignore", shell: isWin });

let failures = 0;
const fail = () => failures++;

async function waitForReady(timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${BASE}/`, { redirect: "manual" });
      if (r.status > 0) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  return false;
}

async function check(name, path, { expect = 200, contains, method = "GET" } = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, { method, redirect: "manual" });
    let ok = res.status === expect;
    let detail = `${res.status}`;
    if (ok && contains) {
      const body = await res.text();
      ok = body.includes(contains);
      detail += ok ? ` · "${contains}" ✓` : ` · missing "${contains}"`;
    }
    if (!log(ok, `${name} (${method} ${path}) → ${detail}`)) fail();
  } catch (err) {
    log(false, `${name} (${method} ${path}) → ${err.message}`);
    fail();
  }
}

try {
  if (!(await waitForReady())) {
    console.error("✗ Server did not become ready");
    server.kill();
    process.exit(1);
  }

  await check("Home renders", "/", { contains: "BurgerHouse" });
  await check("Menu renders", "/menu");
  await check("Catering estimator", "/catering", { contains: "Build your quote" });
  await check("Checkout renders (no Stripe needed)", "/checkout");
  await check("Catering menu PDF", "/catering-menu.pdf");
  await check("Sitemap", "/sitemap.xml", { contains: "/catering" });
  await check("Robots excludes admin", "/robots.txt", { contains: "/admin" });
  await check("Admin is protected", "/admin", { expect: 307 });
  await check("Admin login renders", "/admin/login", { contains: "Admin sign-in" });
  await check("Stripe webhook no-ops safely", "/api/stripe/webhook", { method: "POST", expect: 200 });

  console.log(`\n${failures === 0 ? "✅ All checks passed" : `❌ ${failures} check(s) failed`}`);
} finally {
  server.kill();
}

process.exit(failures === 0 ? 0 : 1);
