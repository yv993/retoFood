import Link from "next/link";
import { Reveal, Magnetic } from "@/components/motion/primitives";
import VisitInfo from "@/components/ui/VisitInfo";
import { ArrowRight } from "@/components/ui/icons";
import { SITE } from "@/lib/site";

export default function Visit() {
  return (
    <section id="visit" className="relative border-t border-line bg-char py-24 sm:py-32">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <Reveal className="mb-14 text-center">
          <p className="eyebrow text-gold">Find Us</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
            Reserve your table
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sand">
            In the heart of {SITE.contact.city} on {SITE.contact.street}. Walk in, or book
            ahead for the weekend rush.
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="flex h-full flex-col justify-between gap-8 rounded-3xl border border-line bg-ink p-8 sm:p-10">
              <div>
                <h3 className="font-display text-3xl text-cream sm:text-4xl">
                  A table by the open kitchen?
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-sand">
                  Reserve in under a minute. Tell us the date, party size, and any special
                  occasion — we&rsquo;ll take care of the rest and confirm by phone.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Magnetic strength={0.3}>
                  <Link
                    href="/reserve"
                    className="btn-gold inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition-all duration-200"
                  >
                    Reserve a Table
                    <ArrowRight width={18} height={18} />
                  </Link>
                </Magnetic>
                <a
                  href={`tel:${SITE.contact.phoneHref}`}
                  className="btn-ghost inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold transition-all duration-200"
                >
                  Call {SITE.contact.phoneDisplay}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-2">
            <VisitInfo />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
