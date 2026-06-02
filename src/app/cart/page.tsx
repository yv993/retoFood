import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your BurgerHouse order before checkout.",
  alternates: { canonical: "/cart" },
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Your order" title="Cart" subtitle="Review your items, then head to checkout." />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <CartView />
        </div>
      </section>
    </>
  );
}
