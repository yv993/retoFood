import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import ClearCart from "@/components/cart/ClearCart";
import { getOrder } from "@/lib/db";
import { dram } from "@/lib/site";
import { Check, ArrowRight } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
  alternates: { canonical: "/checkout/success" },
};

type SP = { searchParams: Promise<{ ref?: string; session_id?: string }> };

const PAY_NEXT: Record<string, string> = {
  cash: "Please have cash ready — you'll pay the driver on delivery.",
  restaurant: "You'll pay when you collect your order at the restaurant.",
  online: "Your card payment was received. A receipt is on its way.",
};

export default async function CheckoutSuccessPage({ searchParams }: SP) {
  const { ref } = await searchParams;
  const order = ref ? await getOrder(ref) : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Thank you"
        title="Order confirmed"
        subtitle={order ? `Reference ${order.ref}` : "We've received your order."}
      />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <ClearCart />

          <div className="mx-auto max-w-md rounded-3xl border border-line bg-char p-8 text-center sm:p-10">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Check width={30} height={30} />
            </span>
            <h2 className="mt-5 font-display text-3xl text-cream">Order received 🎉</h2>

            {order ? (
              <>
                <p className="mt-3 text-sand">
                  Thanks{order.customerName ? `, ${order.customerName.split(" ")[0]}` : ""}! We&rsquo;ve got your
                  order and the kitchen is on it.
                </p>

                <div className="mt-6 rounded-2xl border border-line bg-ink p-5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Reference</span>
                    <span className="font-mono text-sm text-cream">{order.ref}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm text-muted">Fulfilment</span>
                    <span className="text-sm capitalize text-cream">{order.fulfillment}</span>
                  </div>
                  <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
                    {order.lines.map((l, i) => (
                      <li key={i} className="flex justify-between gap-3 text-sand">
                        <span>{l.name}{l.qty > 1 ? ` ×${l.qty}` : ""}</span>
                        <span className="whitespace-nowrap text-muted">{dram(l.price)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                    <span className="font-semibold text-cream">Total</span>
                    <span className="font-display text-xl text-gold">{dram(order.total)}</span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-muted">
                  {PAY_NEXT[order.paymentMethod ?? "cash"] ?? ""}{" "}
                  {order.email ? "A confirmation has been emailed to you." : "We'll confirm by phone shortly."}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sand">
                Thank you! Your order is confirmed and the kitchen is on it. If you left an email, a
                receipt is on its way.
              </p>
            )}

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/menu"
                className="btn-gold inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
              >
                Order more <ArrowRight width={16} height={16} />
              </Link>
              <Link href="/" className="text-sm text-muted hover:text-gold">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
