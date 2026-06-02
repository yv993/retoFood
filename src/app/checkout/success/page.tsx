import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import CheckoutSuccess from "@/components/cart/CheckoutSuccess";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
  alternates: { canonical: "/checkout/success" },
};

export default function CheckoutSuccessPage() {
  return (
    <>
      <PageHeader eyebrow="Thank you" title="Order confirmed" subtitle="Your payment was successful." />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <CheckoutSuccess />
        </div>
      </section>
    </>
  );
}
