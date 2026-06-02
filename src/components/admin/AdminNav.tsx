"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/catering", label: "Catering" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/gift-cards", label: "Gift cards" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
      {ITEMS.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
              active ? "bg-gold/10 text-gold" : "text-sand hover:bg-char hover:text-cream",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
