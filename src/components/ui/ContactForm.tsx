"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { fireConfetti } from "@/lib/confetti";
import { submitContact } from "@/lib/actions";
import { cn } from "@/lib/cn";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
    if (message.trim().length < 5) err.message = "Add a short message.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setPending(true);
    const res = await submitContact({ name, email, phone, message, company });
    setPending(false);
    if (res.ok) {
      toast({ title: "Message sent 🎉", desc: "Thanks — we'll get back to you shortly." });
      fireConfetti();
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setErrors({});
    } else {
      toast({ title: "Couldn't send that", desc: res.error, tone: "error" });
    }
  }

  const base =
    "w-full rounded-xl border bg-char px-4 py-3 text-cream placeholder-muted focus:outline-none transition-colors";
  const bd = (e?: string) => (e ? "border-ember focus:border-ember" : "border-line focus:border-gold");

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} className="hidden" aria-hidden />
      <div>
        <label htmlFor="ct-name" className="mb-1.5 block text-sm font-semibold text-sand">Full name</label>
        <input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" className={cn(base, bd(errors.name))} />
        {errors.name && <p className="mt-1 text-xs text-ember">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="ct-email" className="mb-1.5 block text-sm font-semibold text-sand">Email</label>
        <input id="ct-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@email.com" className={cn(base, bd(errors.email))} />
        {errors.email && <p className="mt-1 text-xs text-ember">{errors.email}</p>}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ct-phone" className="mb-1.5 block text-sm font-semibold text-sand">
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="ct-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+374 ..." className={cn(base, bd())} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ct-msg" className="mb-1.5 block text-sm font-semibold text-sand">Message</label>
        <textarea id="ct-msg" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" className={cn(base, bd(errors.message))} />
        {errors.message && <p className="mt-1 text-xs text-ember">{errors.message}</p>}
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-gold beam inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
