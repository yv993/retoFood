"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { fireConfetti } from "@/lib/confetti";
import { submitCatering } from "@/lib/actions";
import { CATERING, dram } from "@/lib/site";
import { cn } from "@/lib/cn";

export interface CateringSelection {
  packageId: string;
  packageName: string;
  guests: number;
  addOns: string[]; // display names
  estimate: number;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function CateringInquiryForm({ selection }: { selection: CateringSelection }) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState<string>(CATERING.eventTypes[0]);
  const [serviceStyle, setServiceStyle] = useState<string>(CATERING.serviceStyles[2]);
  const [budget, setBudget] = useState<string>("");
  const [veg, setVeg] = useState("");
  const [vegan, setVegan] = useState("");
  const [halal, setHalal] = useState("");
  const [allergyNotes, setAllergyNotes] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    const err: Errors = {};
    if (!name.trim()) err.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) err.email = "Enter a valid email.";
    if (!/^[0-9 +()-]{6,18}$/.test(phone.trim())) err.phone = "Enter a valid phone number (6–18 digits).";
    setErrors(err);
    if (Object.keys(err).length) return;

    setPending(true);
    const res = await submitCatering({
      name,
      email,
      phone,
      venue,
      date,
      startTime,
      duration,
      guests: String(selection.guests),
      type,
      serviceStyle,
      budget: budget || undefined,
      packageId: selection.packageId,
      packageName: selection.packageName,
      addOns: selection.addOns,
      estimate: selection.estimate,
      dietary: {
        veg: veg ? Number(veg) : undefined,
        vegan: vegan ? Number(vegan) : undefined,
        halal: halal ? Number(halal) : undefined,
        allergyNotes: allergyNotes || undefined,
      },
      message,
      company,
    });
    setPending(false);

    if (res.ok) {
      toast({
        title: "Inquiry sent 🎉",
        desc: `Thanks ${name.trim().split(" ")[0]} — our events team will email you within 24 hours.`,
      });
      fireConfetti();
      setName("");
      setEmail("");
      setPhone("");
      setVenue("");
      setDate("");
      setStartTime("");
      setDuration("");
      setBudget("");
      setVeg("");
      setVegan("");
      setHalal("");
      setAllergyNotes("");
      setMessage("");
      setErrors({});
    } else {
      toast({ title: "Couldn't send that", desc: res.error, tone: "error" });
    }
  }

  const base =
    "w-full rounded-xl border bg-char px-4 py-3 text-cream placeholder-muted focus:outline-none transition-colors";
  const bd = (e?: string) => (e ? "border-ember focus:border-ember" : "border-line focus:border-gold");
  const labelCls = "mb-1.5 block text-sm font-semibold text-sand";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {/* Carried selection summary */}
      <div className="sm:col-span-2 rounded-2xl border border-gold/30 bg-gold/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">Your selection</p>
        <p className="mt-1 text-sm text-sand">
          <span className="font-semibold text-cream">{selection.packageName}</span> · {selection.guests} guests
          {selection.addOns.length > 0 && <> · {selection.addOns.join(", ")}</>}
        </p>
        <p className="mt-1 text-sm">
          <span className="text-muted">Estimated total: </span>
          <span className="font-display text-gold">{dram(selection.estimate)}</span>
          <span className="text-muted"> — final quote by email</span>
        </p>
      </div>

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

      <div>
        <label htmlFor="c-name" className={labelCls}>Full name</label>
        <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" className={cn(base, bd(errors.name))} />
        {errors.name && <p className="mt-1 text-xs text-ember">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="c-email" className={labelCls}>Email</label>
        <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@email.com" className={cn(base, bd(errors.email))} />
        {errors.email && <p className="mt-1 text-xs text-ember">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="c-phone" className={labelCls}>Phone</label>
        <input id="c-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+374 ..." className={cn(base, bd(errors.phone))} />
        {errors.phone && <p className="mt-1 text-xs text-ember">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="c-type" className={labelCls}>Event type</label>
        <select id="c-type" value={type} onChange={(e) => setType(e.target.value)} className={cn(base, bd(), "[color-scheme:dark]")}>
          {CATERING.eventTypes.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="c-style" className={labelCls}>Service style</label>
        <select id="c-style" value={serviceStyle} onChange={(e) => setServiceStyle(e.target.value)} className={cn(base, bd(), "[color-scheme:dark]")}>
          {CATERING.serviceStyles.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="c-budget" className={labelCls}>Budget <span className="font-normal text-muted">(optional)</span></label>
        <select id="c-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={cn(base, bd(), "[color-scheme:dark]")}>
          <option value="">Prefer not to say</option>
          {CATERING.budgets.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="c-date" className={labelCls}>Event date</label>
        <input id="c-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={cn(base, bd(), "[color-scheme:dark]")} />
      </div>
      <div>
        <label htmlFor="c-time" className={labelCls}>Start time</label>
        <input id="c-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={cn(base, bd(), "[color-scheme:dark]")} />
      </div>
      <div>
        <label htmlFor="c-duration" className={labelCls}>Duration <span className="font-normal text-muted">(optional)</span></label>
        <input id="c-duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3 hours" className={cn(base, bd())} />
      </div>
      <div>
        <label htmlFor="c-venue" className={labelCls}>Venue / address</label>
        <input id="c-venue" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Where's the event?" autoComplete="street-address" className={cn(base, bd())} />
      </div>

      {/* Dietary headcount */}
      <div className="sm:col-span-2">
        <p className={labelCls}>Dietary headcount <span className="font-normal text-muted">(optional)</span></p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="c-veg" className="mb-1 block text-xs text-muted">Vegetarian</label>
            <input id="c-veg" type="number" min={0} value={veg} onChange={(e) => setVeg(e.target.value)} placeholder="0" className={cn(base, bd())} />
          </div>
          <div>
            <label htmlFor="c-vegan" className="mb-1 block text-xs text-muted">Vegan</label>
            <input id="c-vegan" type="number" min={0} value={vegan} onChange={(e) => setVegan(e.target.value)} placeholder="0" className={cn(base, bd())} />
          </div>
          <div>
            <label htmlFor="c-halal" className="mb-1 block text-xs text-muted">Halal</label>
            <input id="c-halal" type="number" min={0} value={halal} onChange={(e) => setHalal(e.target.value)} placeholder="0" className={cn(base, bd())} />
          </div>
        </div>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-allergy" className={labelCls}>Allergy notes <span className="font-normal text-muted">(optional)</span></label>
        <input id="c-allergy" value={allergyNotes} onChange={(e) => setAllergyNotes(e.target.value)} placeholder="Nut allergy, gluten-free, etc." className={cn(base, bd())} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="c-msg" className={labelCls}>Tell us more <span className="font-normal text-muted">(optional)</span></label>
        <textarea id="c-msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Set-menu ideas, theme, timing…" className={cn(base, bd())} />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-gold inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Sending…" : "Send inquiry"}
        </button>
      </div>
    </form>
  );
}
