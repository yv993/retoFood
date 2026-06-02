"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { fireConfetti } from "@/lib/confetti";
import { submitReservation } from "@/lib/actions";
import { slotsForDay } from "@/lib/hours";
import { Minus, Plus, Calendar, Clock, Users } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface Errors {
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
}

const MAX_GUESTS = 12;
const todayStr = () => new Date().toISOString().slice(0, 10);

export default function ReservationForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [note, setNote] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  // Slots limited to opening hours for the chosen day; past slots removed if today.
  const slots = useMemo(() => {
    if (!date) return [];
    const d = new Date(`${date}T00:00`);
    if (Number.isNaN(d.getTime())) return [];
    let list = slotsForDay(d.getDay());
    if (date === todayStr()) {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      list = list.filter((s) => {
        const [h, m] = s.split(":").map(Number);
        return h * 60 + m > mins + 30; // need 30 min lead time
      });
    }
    return list;
  }, [date]);

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!phone.trim()) e.phone = "We need a phone number to confirm.";
    else if (!/^[0-9 +()-]{6,18}$/.test(phone.trim())) e.phone = "Enter a valid phone number.";
    if (!date) e.date = "Pick a date.";
    if (!time) e.time = "Pick a time slot.";
    return e;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPending(true);
    const res = await submitReservation({ name, phone, date, time, guests, notes: note, company });
    setPending(false);

    if (res.ok) {
      toast({
        title: "Reservation requested 🎉",
        desc: `Thanks ${name.trim().split(" ")[0]} — we'll confirm your table for ${guests} by phone shortly.`,
      });
      fireConfetti();
      setName("");
      setPhone("");
      setDate("");
      setTime("");
      setGuests(2);
      setNote("");
      setErrors({});
    } else {
      toast({ title: "Hmm — that didn't go through", desc: res.error, tone: "error" });
    }
  }

  const fieldBase =
    "w-full rounded-xl border bg-char px-4 py-3 text-cream placeholder-muted focus:outline-none transition-colors";
  const border = (err?: string) =>
    err ? "border-ember focus:border-ember" : "border-line focus:border-gold";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {/* Honeypot — visually hidden, ignored by humans */}
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
        <label htmlFor="r-name" className="mb-1.5 block text-sm font-semibold text-sand">
          Full name
        </label>
        <input
          id="r-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
          }}
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={!!errors.name}
          className={cn(fieldBase, border(errors.name))}
        />
        {errors.name && <p className="mt-1 text-xs text-ember">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="r-phone" className="mb-1.5 block text-sm font-semibold text-sand">
          Phone
        </label>
        <input
          id="r-phone"
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
          }}
          autoComplete="tel"
          placeholder="+374 ..."
          aria-invalid={!!errors.phone}
          className={cn(fieldBase, border(errors.phone))}
        />
        {errors.phone && <p className="mt-1 text-xs text-ember">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="r-date" className="mb-1.5 block text-sm font-semibold text-sand">
          <span className="inline-flex items-center gap-1.5">
            <Calendar width={14} height={14} className="text-gold" /> Date
          </span>
        </label>
        <input
          id="r-date"
          type="date"
          min={todayStr()}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTime("");
            if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
          }}
          aria-invalid={!!errors.date}
          className={cn(fieldBase, border(errors.date), "[color-scheme:dark]")}
        />
        {errors.date && <p className="mt-1 text-xs text-ember">{errors.date}</p>}
      </div>

      <div>
        <label htmlFor="r-time" className="mb-1.5 block text-sm font-semibold text-sand">
          <span className="inline-flex items-center gap-1.5">
            <Clock width={14} height={14} className="text-gold" /> Time slot
          </span>
        </label>
        <select
          id="r-time"
          value={time}
          disabled={!date}
          onChange={(e) => {
            setTime(e.target.value);
            if (errors.time) setErrors((p) => ({ ...p, time: undefined }));
          }}
          aria-invalid={!!errors.time}
          className={cn(fieldBase, border(errors.time), "[color-scheme:dark] disabled:opacity-50")}
        >
          <option value="">
            {!date ? "Pick a date first" : slots.length ? "Choose a time" : "No slots — try another day"}
          </option>
          {slots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.time && <p className="mt-1 text-xs text-ember">{errors.time}</p>}
      </div>

      {/* Party-size stepper */}
      <div className="sm:col-span-2">
        <span className="mb-1.5 block text-sm font-semibold text-sand">
          <span className="inline-flex items-center gap-1.5">
            <Users width={14} height={14} className="text-gold" /> Party size
          </span>
        </span>
        <div className="inline-flex items-center gap-4 rounded-xl border border-line bg-char px-4 py-2.5">
          <button
            type="button"
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            disabled={guests <= 1}
            aria-label="Fewer guests"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-cream transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus width={16} height={16} />
          </button>
          <span className="min-w-[3ch] text-center font-display text-2xl text-cream" aria-live="polite">
            {guests}
            {guests >= MAX_GUESTS ? "+" : ""}
          </span>
          <button
            type="button"
            onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
            disabled={guests >= MAX_GUESTS}
            aria-label="More guests"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-cream transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus width={16} height={16} />
          </button>
          <span className="text-sm text-muted">
            {guests >= MAX_GUESTS ? "Large party — we'll call to arrange" : "guests"}
          </span>
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="r-note" className="mb-1.5 block text-sm font-semibold text-sand">
          Notes <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="r-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Birthday, allergies, seating preference…"
          className={cn(fieldBase, border())}
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-gold beam inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Sending…" : "Request Reservation"}
        </button>
      </div>
    </form>
  );
}
