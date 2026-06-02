"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

type Choice = "accepted" | "declined" | null;
const KEY = "bh-consent";
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function CookieConsent() {
  const [choice, setChoice] = useState<Choice>("accepted"); // assume decided → no SSR banner flash
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Basic first-party error logging (placeholder for Sentry/Logflare).
    const onError = (e: ErrorEvent) => console.error("[client-error]", e.message);
    const onRej = (e: PromiseRejectionEvent) => console.error("[unhandled-rejection]", e.reason);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRej);

    // Defer the read so we don't call setState synchronously inside the effect.
    const raf = requestAnimationFrame(() => {
      const stored = (localStorage.getItem(KEY) as Choice) ?? null;
      setChoice(stored);
      setReady(true);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }, []);

  const decide = (c: Exclude<Choice, null>) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* ignore */
    }
    setChoice(c);
  };

  const analyticsOn = ready && choice === "accepted" && !!PLAUSIBLE_DOMAIN;

  return (
    <>
      {analyticsOn && (
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}

      {ready && choice === null && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-3 z-(--z-drawer-backdrop) mx-auto max-w-2xl rounded-2xl border border-line bg-char/95 p-4 shadow-2xl shadow-black/50 backdrop-blur md:bottom-4"
          style={{ marginBottom: "max(0px, env(safe-area-inset-bottom))" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-sand">
              We use only essential storage to run the site, plus optional analytics. See our{" "}
              <Link href="/cookie-policy" className="text-goldlt hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => decide("declined")}
                className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm font-semibold text-sand transition-colors hover:border-gold/50 hover:text-cream"
              >
                Decline
              </button>
              <button
                onClick={() => decide("accepted")}
                className="btn-gold cursor-pointer rounded-full px-5 py-2 text-sm font-bold"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
