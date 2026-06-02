import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft } from "@/components/ui/icons";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sand hover:text-gold"
    >
      <ChevronLeft width={16} height={16} /> {label}
    </Link>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  if (children == null || children === "" || children === "—") return null;
  return (
    <div className="border-b border-line py-3 last:border-0 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-semibold text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-cream sm:col-span-2 sm:mt-0">{children}</dd>
    </div>
  );
}

export function DetailCard({ children }: { children: ReactNode }) {
  return <dl className="rounded-2xl border border-line bg-char p-6">{children}</dl>;
}
