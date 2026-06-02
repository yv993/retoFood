import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Our commitment to an accessible BurgerHouse website.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader eyebrow="Commitment" title="Accessibility" subtitle="Last updated: June 2026" />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Prose>
            <p>
              We want everyone to be able to browse the menu and order with ease. We aim to meet{" "}
              <strong>WCAG 2.1 AA</strong> and keep improving.
            </p>
            <h2>What we&rsquo;ve built in</h2>
            <ul>
              <li>Keyboard-navigable menus, cart drawer and dialogs with visible gold focus rings and focus trapping.</li>
              <li>Semantic landmarks, labelled form fields, alt text on images and ARIA on icon-only buttons.</li>
              <li>Full <strong>prefers-reduced-motion</strong> support — all animations, the marquee, parallax and the custom cursor disable automatically.</li>
              <li>Colour contrast checked against the dark-gold palette for legibility.</li>
              <li>A skip-to-content link and responsive layouts down to small phones.</li>
            </ul>
            <h2>Found a barrier?</h2>
            <p>
              Tell us and we&rsquo;ll fix it. Email{" "}
              <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a> or call{" "}
              <a href={`tel:${SITE.contact.phoneHref}`}>{SITE.contact.phoneDisplay}</a>.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
