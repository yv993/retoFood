import type { ReactNode } from "react";

/** Shared prose styling for legal / long-form pages (dark-gold theme). */
export default function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="space-y-4 leading-relaxed text-sand [&_a:hover]:underline [&_a]:text-goldlt [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:tracking-tightish [&_h2]:text-cream [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-cream [&_li]:marker:text-gold [&_strong]:text-cream [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
    >
      {children}
    </div>
  );
}
