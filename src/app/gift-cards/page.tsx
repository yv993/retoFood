import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/primitives";
import GiftCard from "@/components/ui/GiftCard";

export const metadata: Metadata = {
  title: "Gift Cards",
  description:
    "Give the best burger in Yerevan. BurgerHouse gift cards never expire and work in-store and on delivery — delivered instantly by email.",
  alternates: { canonical: "/gift-cards" },
};

export default function GiftCardsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gift Cards"
        title="Give the perfect bite"
        subtitle="A BurgerHouse gift card is always the right size. Pick an amount, add a note, send it in seconds."
      />

      <section className="bg-ink py-16 sm:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Reveal>
            <div className="rounded-3xl border border-line bg-char p-7 sm:p-10">
              <GiftCard />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-char py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="eyebrow text-gold">Corporate gifting</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tightish text-cream sm:text-4xl">
              Buying in bulk?
            </h2>
            <p className="mt-4 text-sand">
              Reward a whole team or thank your clients. We do branded, bulk gift cards with
              custom amounts — reach out via our{" "}
              <a href="/catering" className="text-goldlt underline-offset-4 hover:underline">
                events team
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
