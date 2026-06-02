"use client";

import { useCart, type AddPayload } from "@/lib/cart";
import { useToast } from "@/components/ui/ToastProvider";
import { flyToCart } from "@/lib/flyToCart";
import { Plus } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/** Small "+" overlay for cards. Adds 1 to cart without navigating. */
export default function QuickAddButton({
  payload,
  className,
}: {
  payload: AddPayload;
  className?: string;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();

  return (
    <button
      type="button"
      aria-label={`Quick add ${payload.name} to cart`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(payload);
        toast({ title: "Added to cart 🛒", desc: `${payload.name} added.` });
        const img = e.currentTarget
          .closest("[data-card]")
          ?.querySelector("img") as HTMLElement | null;
        flyToCart(img);
      }}
      className={cn(
        "btn-gold absolute right-3 top-3 z-30 grid h-10 w-10 cursor-pointer place-items-center rounded-full shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-110 active:scale-95",
        className,
      )}
    >
      <Plus width={20} height={20} />
    </button>
  );
}
