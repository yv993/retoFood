import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false, follow: false },
  alternates: { canonical: "/checkout/cancel" },
};

export default function CheckoutCancelPage() {
  return (
    <>
      <PageHeader
        eyebrow="No charge"
        title="Payment cancelled"
        subtitle="Your card was not charged — your cart is still saved."
      />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-md rounded-3xl border border-line bg-char p-8 text-center sm:p-10">
          <p className="text-sand">
            Changed your mind, or just need a moment? Your items are waiting whenever
            you&rsquo;re ready.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/checkout"
              className="btn-gold inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
            >
              Back to checkout
            </Link>
            <Link href="/menu" className="text-sm text-muted hover:text-gold">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
