import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BurgerHouse collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: June 2026" />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Prose>
            <p>
              This policy explains what personal data {SITE.name} (“we”) collects when you use
              this website, why, and your rights. It&rsquo;s a plain-language template — please
              have it reviewed by counsel before launch.
            </p>
            <h2>What we collect</h2>
            <ul>
              <li><strong>Form details</strong> — name, phone, email and message when you make a reservation, catering or contact request, or sign up to our list.</li>
              <li><strong>Order details</strong> — items, amounts and fulfilment choice when you check out. Payments are processed by Stripe; we never see your full card number.</li>
              <li><strong>Local storage</strong> — your cart and language preference live in your browser, not on our servers.</li>
              <li><strong>Analytics</strong> — only if you accept cookies (see our <Link href="/cookie-policy">Cookie Policy</Link>), we collect privacy-friendly, aggregate usage stats.</li>
            </ul>
            <h2>How we use it</h2>
            <ul>
              <li>To confirm reservations and orders and reply to your messages.</li>
              <li>To process payments via Stripe and prevent fraud/abuse.</li>
              <li>To improve the site. We do not sell your data.</li>
            </ul>
            <h2>Your rights</h2>
            <p>
              You can request access to, correction or deletion of your data, and unsubscribe at
              any time. Email <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.
            </p>
            <h2>Contact</h2>
            <p>
              {SITE.name}, {SITE.contact.addressLine}. Email{" "}
              <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
