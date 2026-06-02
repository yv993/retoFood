import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/site";
import Year from "@/components/ui/Year";
import Newsletter from "@/components/ui/Newsletter";
import OpenStatusChip from "@/components/ui/OpenStatusChip";
import OrderOnline from "@/components/ui/OrderOnline";
import { Instagram, Facebook, TikTok, WhatsApp, Telegram } from "@/components/ui/icons";

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookie-policy", label: "Cookies" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/allergens", label: "Allergens" },
];

export default function Footer() {
  const socials = [
    { href: SITE.contact.social.instagram, label: "Instagram", Icon: Instagram },
    { href: SITE.contact.social.facebook, label: "Facebook", Icon: Facebook },
    { href: SITE.contact.social.tiktok, label: "TikTok", Icon: TikTok },
    { href: SITE.contact.whatsappHref, label: "WhatsApp", Icon: WhatsApp },
    { href: SITE.contact.telegramHref, label: "Telegram", Icon: Telegram },
  ];

  return (
    <footer className="border-t border-line bg-ink pb-28 pt-14 md:py-14">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display text-2xl font-bold text-cream">
              Burger<span className="text-gold">House</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Yerevan&rsquo;s gourmet burger house. Fire, craft, and the best burger
              you&rsquo;ll have all year.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <OpenStatusChip />
              <OrderOnline variant="ghost" align="left" label="Order via delivery apps" />
            </div>
          </div>

          {/* Nav */}
          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <span className="eyebrow text-muted">Explore</span>
            <Link href="/" className="text-sand hover:text-gold">
              Home
            </Link>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sand hover:text-gold">
                {l.label}
              </Link>
            ))}
            <Link href="/contact" className="text-sand hover:text-gold">
              Contact
            </Link>
          </nav>

          {/* Newsletter */}
          <div>
            <Newsletter />
          </div>
        </div>

        {/* Legal */}
        <nav
          aria-label="Legal"
          className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-6 text-xs text-muted"
        >
          {LEGAL.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gold">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted">
            © <Year /> {SITE.name} {SITE.contact.city}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line text-sand transition-colors duration-200 hover:border-gold hover:text-gold"
              >
                <Icon width={19} height={19} />
              </a>
            ))}
          </div>
          <p className="text-xs text-muted">Crafted with fire in {SITE.contact.city} 🇦🇲</p>
        </div>
      </div>
    </footer>
  );
}
