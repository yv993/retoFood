import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import CheckoutView from "@/components/cart/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your BurgerHouse order.",
  alternates: { canonical: "/checkout" },
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Almost there"
        title="Checkout"
        subtitle="Choose delivery or pickup, add your details, and place your order."
      />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <CheckoutView />
        </div>
      </section>
    </>
  );
}
