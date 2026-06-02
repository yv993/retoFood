import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/primitives";
import Faq from "@/components/ui/Faq";
import CateringExperience from "@/components/catering/CateringExperience";
import { CATERING, SITE } from "@/lib/site";
import { Phone, WhatsApp, Check, Download } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Catering & Events",
  description:
    "BurgerHouse catering for birthdays, corporate events and private parties in Yerevan. Three packages, a live flame station, group set-menus — flame-grilled on-site or delivered.",
  alternates: { canonical: "/catering" },
};

type SP = { searchParams: Promise<{ deposit?: string }> };

export default async function CateringPage({ searchParams }: SP) {
  const { deposit } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Catering & Events"
        title="Feed the whole party"
        subtitle="From boardroom lunches to backyard birthdays — flame-grilled and handled end to end, anywhere in Yerevan."
      />

      {deposit === "success" && (
        <div className="bg-gold/10 py-3 text-center text-sm text-gold">
          ✓ Deposit received — your date is on hold. Our events team will confirm by email.
        </div>
      )}
      {deposit === "cancel" && (
        <div className="border-y border-line bg-char py-3 text-center text-sm text-sand">
          Deposit cancelled — no charge was made. You can still send your inquiry below.
        </div>
      )}

      {/* Packages + live estimator + form */}
      <CateringExperience />

      {/* How it works */}
      <section className="border-t border-line bg-ink py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Reveal className="mb-14 text-center">
            <p className="eyebrow text-gold">How it works</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              From inquiry to event day
            </h2>
          </Reveal>
          <ol className="grid gap-6 md:grid-cols-4">
            {CATERING.process.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.06}>
                <li className="relative h-full rounded-3xl border border-line bg-char p-7">
                  <span className="font-display text-4xl text-gold/30">{s.step}</span>
                  <h3 className="mt-3 font-display text-xl text-cream">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-t border-line bg-char py-14">
        <div className="mx-auto max-w-content px-4 sm:px-6 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Trusted by teams across Yerevan</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {CATERING.trustedBy.map((name) => (
              <span key={name} className="font-display text-xl text-sand/70">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-line bg-ink py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow text-gold">Kind words</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              Events we&rsquo;ve fed
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {CATERING.testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <figure className="flex h-full flex-col rounded-3xl border border-line bg-char p-7">
                  <span aria-hidden className="font-display text-5xl leading-none text-gold/40">“</span>
                  <blockquote className="mt-2 flex-1 text-sand">{t.quote}</blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4">
                    <span className="block font-semibold text-cream">{t.name}</span>
                    <span className="block text-sm text-muted">{t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-char py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow text-gold">Good to know</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              Catering FAQ
            </h2>
          </Reveal>
          <Faq items={CATERING.faqs} />
        </div>
      </section>

      {/* Events-team CTA + PDF */}
      <section className="border-t border-line bg-ink py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tightish text-cream sm:text-4xl">
              Talk to the events team
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sand">
              Prefer to chat it through? Message us on WhatsApp or call — we plan {CATERING.minGuests}+ guest events with at least {CATERING.minLeadLabel} lead time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={SITE.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
              >
                <WhatsApp width={18} height={18} /> WhatsApp the team
              </a>
              <a
                href={`tel:${SITE.contact.phoneHref}`}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-bold text-cream transition-colors hover:border-gold hover:text-gold"
              >
                <Phone width={18} height={18} /> {SITE.contact.phoneDisplay}
              </a>
              <a
                href={CATERING.menuPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-bold text-cream transition-colors hover:border-gold hover:text-gold"
              >
                <Download width={18} height={18} /> Download catering menu (PDF)
              </a>
            </div>
            <ul className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <li className="inline-flex items-center gap-1.5"><Check width={14} height={14} className="text-gold" /> Halal &amp; veg in every package</li>
              <li className="inline-flex items-center gap-1.5"><Check width={14} height={14} className="text-gold" /> Invoiced for businesses</li>
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
