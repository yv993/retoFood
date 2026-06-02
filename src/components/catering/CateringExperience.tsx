"use client";

import { useMemo, useState } from "react";
import { CATERING, dram } from "@/lib/site";
import { createCateringDeposit } from "@/lib/actions";
import { Reveal } from "@/components/motion/primitives";
import SpotlightCard from "@/components/ui/SpotlightCard";
import NumberTicker from "@/components/ui/NumberTicker";
import CateringInquiryForm from "@/components/ui/CateringInquiryForm";
import { useToast } from "@/components/ui/ToastProvider";
import { Check, Sparkles, Minus, Plus } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const STRIPE_ENABLED = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

function scrollToQuote() {
  document.getElementById("catering-quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CateringExperience() {
  const { toast } = useToast();
  const [packageId, setPackageId] = useState<string>("signature");
  const [guests, setGuests] = useState<number>(40);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [depositPending, setDepositPending] = useState(false);

  const pkg = CATERING.packages.find((p) => p.id === packageId) ?? CATERING.packages[1];
  const safeGuests = Math.max(CATERING.minGuests, Number.isFinite(guests) ? guests : CATERING.minGuests);

  const { estimate, addOnNames } = useMemo(() => {
    const base = pkg.perGuest * safeGuests;
    let addTotal = 0;
    const names: string[] = [];
    for (const id of addOnIds) {
      const a = CATERING.addOns.find((x) => x.id === id);
      if (!a) continue;
      addTotal += a.perGuest ? a.price * safeGuests : a.price;
      names.push(a.name);
    }
    return { estimate: base + addTotal, addOnNames: names };
  }, [pkg, safeGuests, addOnIds]);

  const toggleAddOn = (id: string) =>
    setAddOnIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  function selectPackage(id: string) {
    setPackageId(id);
    scrollToQuote();
  }

  async function payDeposit() {
    if (depositPending || !STRIPE_ENABLED) return;
    setDepositPending(true);
    const res = await createCateringDeposit({ packageName: pkg.name, guests: safeGuests });
    if (res.url) {
      window.location.assign(res.url);
      return;
    }
    setDepositPending(false);
    toast({ title: "Couldn't start the deposit", desc: res.error, tone: "error" });
  }

  return (
    <>
      {/* ---- Pricing tiers ---- */}
      <section className="bg-ink py-16 sm:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow text-gold">Packages</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              Pick a starting point
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sand">
              Transparent per-guest pricing. Customise everything in the next step — these are just the foundations.
            </p>
          </Reveal>

          <div className="grid items-stretch gap-6 lg:grid-cols-3">
            {CATERING.packages.map((p, i) => {
              const active = p.id === packageId;
              return (
                <Reveal key={p.id} delay={i * 0.06}>
                  <SpotlightCard
                    className={cn(
                      "card-lift flex h-full flex-col rounded-3xl border bg-char p-7 transition-colors",
                      p.popular ? "border-gold/50" : "border-line",
                      active && "ring-1 ring-gold/40",
                    )}
                  >
                    {p.popular && (
                      <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">
                        <Sparkles width={13} height={13} /> Most popular
                      </span>
                    )}
                    <h3 className="font-display text-2xl text-cream">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted">{p.tagline}</p>
                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className="font-display text-4xl text-gold">{dram(p.perGuest)}</span>
                      <span className="text-sm text-muted">/ guest</span>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-wide text-sand">{p.guests}</p>
                    <ul className="mt-6 flex-1 space-y-2.5">
                      {p.inclusions.map((inc) => (
                        <li key={inc} className="flex gap-2.5 text-sm text-sand">
                          <Check width={16} height={16} className="mt-0.5 shrink-0 text-gold" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => selectPackage(p.id)}
                      className={cn(
                        "mt-7 inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold transition-all duration-200",
                        p.popular
                          ? "btn-gold"
                          : "border border-line text-cream hover:border-gold hover:text-gold",
                      )}
                    >
                      Get a quote
                    </button>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Estimator + form ---- */}
      <section id="catering-quote" className="scroll-mt-24 border-t border-line bg-char py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow text-gold">Build your quote</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              Configure &amp; estimate
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sand">
              Adjust guests and add-ons for a live ballpark. It pre-fills the form below — your final, tailored quote always comes by email.
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Estimator */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-3xl border border-line bg-ink p-7">
                {/* Package */}
                <p className="text-sm font-semibold text-sand">Package</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATERING.packages.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPackageId(p.id)}
                      aria-pressed={p.id === packageId}
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                        p.id === packageId
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-line text-sand hover:border-gold/50",
                      )}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                {/* Guests */}
                <div className="mt-6 flex items-center justify-between">
                  <label htmlFor="guest-count" className="text-sm font-semibold text-sand">
                    Guests
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Fewer guests"
                      onClick={() => setGuests((g) => Math.max(CATERING.minGuests, g - 5))}
                      className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-cream hover:border-gold hover:text-gold"
                    >
                      <Minus width={16} height={16} />
                    </button>
                    <input
                      id="guest-count"
                      type="number"
                      min={CATERING.minGuests}
                      value={guests}
                      onChange={(e) => setGuests(Math.max(CATERING.minGuests, Number(e.target.value) || CATERING.minGuests))}
                      className="w-20 rounded-xl border border-line bg-char px-3 py-2 text-center font-display text-lg text-cream focus:border-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label="More guests"
                      onClick={() => setGuests((g) => g + 5)}
                      className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-cream hover:border-gold hover:text-gold"
                    >
                      <Plus width={16} height={16} />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted">Minimum {CATERING.minGuests} guests.</p>

                {/* Add-ons */}
                <p className="mt-6 text-sm font-semibold text-sand">Add-ons</p>
                <div className="mt-2 space-y-2">
                  {CATERING.addOns.map((a) => {
                    const on = addOnIds.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAddOn(a.id)}
                        aria-pressed={on}
                        className={cn(
                          "flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                          on ? "border-gold/50 bg-gold/5" : "border-line hover:border-gold/40",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border",
                            on ? "border-gold bg-gold text-ink" : "border-line text-transparent",
                          )}
                        >
                          <Check width={13} height={13} />
                        </span>
                        <span className="flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="text-sm font-semibold text-cream">{a.name}</span>
                            <span className="whitespace-nowrap text-sm text-gold">
                              {dram(a.price)}{a.perGuest ? "/guest" : ""}
                            </span>
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">{a.desc}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-sand">Estimated total</span>
                    <NumberTicker value={estimate} format={dram} className="font-display text-3xl text-gold" />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    ≈ {dram(Math.round(estimate / safeGuests))} / guest · estimate only — final quote by email.
                  </p>
                </div>

                {/* Deposit */}
                <button
                  type="button"
                  onClick={payDeposit}
                  disabled={!STRIPE_ENABLED || depositPending}
                  title={STRIPE_ENABLED ? undefined : "Online deposits aren't enabled on this deployment yet"}
                  className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-bold text-cream transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {depositPending ? "Starting…" : "Pay deposit to lock your date"}
                </button>
                <p className="mt-2 text-center text-xs text-muted">
                  {STRIPE_ENABLED
                    ? "Refundable deposit · secures your event date"
                    : "🔒 Online deposit isn't enabled here yet — send the inquiry and we'll arrange it."}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <Reveal>
                <div className="rounded-3xl border border-line bg-ink p-7 sm:p-9">
                  <h3 className="font-display text-2xl text-cream">Tell us about your event</h3>
                  <p className="mt-2 text-sm text-muted">
                    Our events team replies within 24 hours with ideas and a tailored quote.
                  </p>
                  <div className="mt-6">
                    <CateringInquiryForm
                      selection={{
                        packageId: pkg.id,
                        packageName: pkg.name,
                        guests: safeGuests,
                        addOns: addOnNames,
                        estimate,
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
