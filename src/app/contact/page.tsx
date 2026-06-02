import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/primitives";
import ContactForm from "@/components/ui/ContactForm";
import VisitInfo from "@/components/ui/VisitInfo";
import { SITE } from "@/lib/site";
import { Phone, Mail, WhatsApp, Telegram } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with BurgerHouse Yerevan — call, email, WhatsApp or Telegram, or send us a message.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const methods = [
    { Icon: Phone, label: "Call us", value: SITE.contact.phoneDisplay, href: `tel:${SITE.contact.phoneHref}`, ext: false },
    { Icon: Mail, label: "Email", value: SITE.contact.email, href: `mailto:${SITE.contact.email}`, ext: false },
    { Icon: WhatsApp, label: "WhatsApp", value: SITE.contact.whatsappDisplay, href: SITE.contact.whatsappHref, ext: true },
    { Icon: Telegram, label: "Telegram", value: SITE.contact.telegramDisplay, href: SITE.contact.telegramHref, ext: true },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Say hello"
        title="Contact us"
        subtitle="Questions, feedback, big orders — reach us however suits you."
      />

      <section className="bg-ink pb-24 sm:pb-32">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <div className="rounded-3xl border border-line bg-char p-7 sm:p-9">
                <ContactForm />
              </div>
            </Reveal>

            <Reveal delay={0.08} className="space-y-6 lg:col-span-2">
              <div className="rounded-3xl border border-line bg-char p-6">
                <h2 className="font-display text-xl text-cream">Reach us directly</h2>
                <ul className="mt-4 space-y-2">
                  {methods.map((m) => (
                    <li key={m.label}>
                      <a
                        href={m.href}
                        {...(m.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center gap-3 rounded-xl border border-line bg-ink px-4 py-3 transition-colors hover:border-gold/50"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
                          <m.Icon width={20} height={20} />
                        </span>
                        <span>
                          <span className="block text-xs uppercase tracking-widest text-muted">
                            {m.label}
                          </span>
                          <span className="font-semibold text-cream group-hover:text-gold">
                            {m.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <VisitInfo />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
