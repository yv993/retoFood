"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/cn";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";
import LangSwitcher from "@/components/ui/LangSwitcher";
import CartButton from "@/components/cart/CartButton";
import { useLang } from "@/components/providers/LangProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-(--z-navbar)">
      <div
        className={cn(
          "mx-auto mt-3 flex max-w-content items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-6",
          scrolled
            ? "border-line bg-char/85 shadow-lg shadow-black/30 backdrop-blur"
            : "border-transparent",
        )}
      >
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tightish text-cream sm:text-2xl"
        >
          Burger<span className="text-gold">House</span>
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium text-sand xl:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={isActive(l.href)}
              className="navlink hover:text-cream"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartButton withId />
          <LangSwitcher />

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line text-cream xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <CloseIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn("nav-mobile mx-3 mt-2 xl:hidden", open && "open")}
      >
        <div>
          <nav
            className="flex flex-col rounded-2xl border border-line bg-char/95 p-2 text-base backdrop-blur"
            aria-label="Mobile"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sand hover:bg-panel hover:text-cream"
              >
                {t(l.key)}
              </Link>
            ))}
            <Link
              href="/reserve"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="btn-gold mt-1 rounded-xl px-4 py-3 text-center font-bold"
            >
              {t("cta.reserve")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
