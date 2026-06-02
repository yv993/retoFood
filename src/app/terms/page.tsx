import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you order from or use the BurgerHouse website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" subtitle="Last updated: June 2026" />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Prose>
            <p>
              By using this website and placing orders you agree to these terms. This is a
              template — have it reviewed by counsel before launch.
            </p>
            <h2>Orders &amp; pricing</h2>
            <ul>
              <li>All prices are shown in Armenian Dram (֏) and include applicable VAT where stated.</li>
              <li>Orders are confirmed once payment is completed via Stripe. We may refuse or cancel an order (e.g. items unavailable) and refund you.</li>
              <li>Delivery times and fees are estimates and may vary.</li>
            </ul>
            <h2>Reservations</h2>
            <p>
              Reservation requests are confirmed by our team and are subject to availability.
              Submitting a request does not guarantee a table until we confirm.
            </p>
            <h2>Allergens</h2>
            <p>
              Please read our <Link href="/allergens">allergen information</Link> and tell staff
              about allergies before ordering. Dishes are prepared in a kitchen that handles
              gluten, dairy, egg, nuts and other allergens.
            </p>
            <h2>Intellectual property &amp; liability</h2>
            <p>
              All content is owned by {SITE.name}. To the extent permitted by law, our liability
              is limited to the value of your order. These terms are governed by the laws of
              Armenia.
            </p>
            <h2>Contact</h2>
            <p>
              Questions? Email <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
