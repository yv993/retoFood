import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Which cookies and local storage BurgerHouse uses, and how to control them.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Cookie Policy" subtitle="Last updated: June 2026" />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Prose>
            <p>
              We keep cookies to a minimum. Here&rsquo;s exactly what we use and how to control
              it.
            </p>
            <h2>Strictly necessary (always on)</h2>
            <ul>
              <li><strong>Cart &amp; language</strong> — stored in your browser&rsquo;s local storage so your basket and chosen language persist. No tracking.</li>
              <li><strong>Cookie choice</strong> — we remember whether you accepted or declined analytics.</li>
            </ul>
            <h2>Analytics (only with consent)</h2>
            <p>
              If you accept, we load privacy-friendly, cookieless-where-possible analytics to
              understand aggregate usage. We never sell this data. You can decline and the site
              works exactly the same.
            </p>
            <h2>Managing your choice</h2>
            <p>
              Use the cookie banner to accept or decline. To change your mind, clear this
              site&rsquo;s storage in your browser settings and reload — the banner will appear
              again.
            </p>
            <h2>Contact</h2>
            <p>
              {SITE.name} — <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
