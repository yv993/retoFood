"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/ui/icons";
import { useToast } from "@/components/ui/ToastProvider";
import { subscribeNewsletter } from "@/lib/actions";

/** VIP-list email capture — submits to a server action + success toast. */
export default function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (done || pending) return; // guard against double-submit
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setPending(true);
    const res = await subscribeNewsletter({ email, company });
    setPending(false);
    if (res.ok) {
      setDone(true);
      setEmail("");
      toast({ title: "You're on the VIP list 🎉", desc: "Watch your inbox for specials & secret drops." });
      window.setTimeout(() => setDone(false), 5000);
    } else {
      setError(res.error);
      toast({ title: "Couldn't subscribe", desc: res.error, tone: "error" });
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-goldlt">
        You&rsquo;re on the list — watch your inbox for first dibs on specials.{" "}
        <button
          type="button"
          onClick={() => setDone(false)}
          className="cursor-pointer font-semibold text-gold underline-offset-2 hover:underline"
        >
          Subscribe again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="hidden"
        aria-hidden
      />
      <label htmlFor="vip-email" className="mb-2 block text-sm font-semibold text-sand">
        Join the VIP list
      </label>
      <div className="flex items-stretch gap-2">
        <input
          id="vip-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="min-w-0 flex-1 rounded-full border border-line bg-char px-4 py-3 text-sm text-cream placeholder-muted focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={pending}
          className="btn-gold grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full transition-all duration-200 disabled:opacity-70"
        >
          <ArrowRight width={18} height={18} />
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-ember">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-muted">
          Specials, secret menu drops, no spam.
        </p>
      )}
    </form>
  );
}
