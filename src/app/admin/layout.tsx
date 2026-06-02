import type { Metadata } from "next";

// Admin is private — never indexed, never in the sitemap.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-ink text-cream">{children}</div>;
}
