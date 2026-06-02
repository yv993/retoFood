"use client";

import { useCart, type AddPayload } from "@/lib/cart";
import { useToast } from "@/components/ui/ToastProvider";
import { flyToCart } from "@/lib/flyToCart";
import { Bag } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/** Primary "Add to order" button — adds to cart, toasts, and flies to the cart icon. */
export default function AddToCartButton({
  getPayload,
  label = "Add to order",
  className,
  flyFrom,
  beam = true,
}: {
  getPayload: () => AddPayload;
  label?: string;
  className?: string;
  flyFrom?: () => HTMLElement | null;
  beam?: boolean;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();

  return (
    <button
      type="button"
      onClick={() => {
        const p = getPayload();
        addItem(p);
        toast({
          title: "Added to cart 🛒",
          desc: `${p.qty && p.qty > 1 ? `${p.qty} × ` : ""}${p.name} added to your order.`,
        });
        flyToCart(flyFrom?.());
      }}
      className={cn(
        "btn-gold inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition-all duration-200",
        beam && "beam",
        className,
      )}
    >
      <Bag width={18} height={18} /> {label}
    </button>
  );
}
