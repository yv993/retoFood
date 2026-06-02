import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/primitives";
import ReservationForm from "@/components/ui/ReservationForm";
import VisitInfo from "@/components/ui/VisitInfo";
import Faq from "@/components/ui/Faq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description:
    "Book a table at BurgerHouse on Saryan Street, Yerevan. Reserve in under a minute — we'll confirm by phone.",
  alternates: { canonical: "/reserve" },
};

export default function ReservePage() {
  return (
    <>
      <PageHeader
        eyebrow="Find Us"
        title="Reserve your table"
        subtitle={`In the heart of ${SITE.contact.city} on ${SITE.contact.street}. Walk in, or book ahead for the weekend rush.`}
      />

      <section className="bg-ink pb-20 sm:pb-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <div className="rounded-3xl border border-line bg-ink p-7 sm:p-9">
                <ReservationForm />
              </div>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-2">
              <VisitInfo />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-char py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow text-gold">Good to know</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              Frequently asked
            </h2>
          </Reveal>
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </section>
    </>
  );
}
