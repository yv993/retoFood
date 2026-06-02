import type { Metadata, Viewport } from "next";
import { Playfair_Display, Karla } from "next/font/google";
import "./globals.css";

import { SITE, unsplash, IMAGES, RATING, HOURS_TABLE } from "@/lib/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/chrome/Navbar";
import Footer from "@/components/chrome/Footer";
import Preloader from "@/components/chrome/Preloader";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import Cursor from "@/components/chrome/Cursor";
import MobileActionBar from "@/components/chrome/MobileActionBar";
import HappyHourBanner from "@/components/ui/HappyHourBanner";
import ToastProvider from "@/components/ui/ToastProvider";
import LangProvider from "@/components/providers/LangProvider";
import CartProvider from "@/lib/cart";
import CartDrawer from "@/components/cart/CartDrawer";
import CookieConsent from "@/components/chrome/CookieConsent";

// Only the weights/styles actually used on the site (keeps the font payload lean).
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  // Body font — don't preload so it doesn't compete with the LCP hero image.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "BurgerHouse · Gourmet Burgers · Yerevan",
    template: "%s · BurgerHouse Yerevan",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "burger",
    "Yerevan",
    "Armenia",
    "gourmet burger",
    "restaurant",
    "Saryan Street",
    "Angus beef",
  ],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: "BurgerHouse · Gourmet Burgers · Yerevan",
    description: SITE.description,
    images: [
      {
        url: unsplash(IMAGES.hero, 1200),
        width: 1200,
        height: 630,
        alt: "BurgerHouse — flame-grilled gourmet cheeseburger",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BurgerHouse · Gourmet Burgers · Yerevan",
    description: SITE.description,
    images: [unsplash(IMAGES.hero, 1200)],
  },
  icons: { icon: "/favicon.ico", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "dark",
};

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    image: unsplash(IMAGES.hero, 1600),
    servesCuisine: ["Burgers", "American", "Gourmet"],
    priceRange: "֏֏",
    telephone: SITE.contact.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.contact.street,
      addressLocality: SITE.contact.city,
      postalCode: SITE.contact.postal,
      addressCountry: "AM",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.contact.geo.lat,
      longitude: SITE.contact.geo.lng,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: RATING.value,
      reviewCount: RATING.count,
      bestRating: 5,
    },
    openingHoursSpecification: HOURS_TABLE.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.hours.split(" – ")[0],
      closes: h.hours.split(" – ")[1],
    })),
    hasMenu: `${SITE.url}/menu`,
    acceptsReservations: "True",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${karla.variable}`}>
      <body className="bg-ink font-sans text-cream antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-(--z-skiplink) focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>

        <LangProvider>
          <ToastProvider>
            <CartProvider>
              <Preloader />
              <ScrollProgress />
              <Cursor />

              <SmoothScroll>
                <Navbar />
                <main id="main">{children}</main>
                <HappyHourBanner />
                <Footer />
              </SmoothScroll>

              <MobileActionBar />
              <CartDrawer />
              <CookieConsent />
            </CartProvider>
          </ToastProvider>
        </LangProvider>
        <JsonLd />
      </body>
    </html>
  );
}
