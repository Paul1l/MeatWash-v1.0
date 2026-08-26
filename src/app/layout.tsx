import type { Metadata, Viewport } from "next";
import { Unbounded, Onest, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BRANCHES, SITE } from "@/data/site";
import { BookingProvider } from "@/components/Booking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealRoot from "@/components/RevealRoot";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import PageTransition from "@/components/PageTransition";

// Unbounded carries the display voice: its wide, fully geometric bowls are
// the closest type gets to the monogram's capsules and droplets, so the
// wordmark reads as one object instead of a logo pasted onto a font.
const unbounded = Unbounded({
  variable: "--font-display-face",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Onest carries running text — Unbounded is too wide to read in paragraphs.
const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Technical counterpoint for labels, prices and indices.
const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "автомойка Москва",
    "детейлинг Москва",
    "мойка Мясницкая",
    "детейлинг Технопарк",
    "химчистка салона",
    "керамика кузова",
    "полировка кузова",
    "Meat Wash",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/img/hero-rangerover.jpg", width: 1170, height: 772 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/img/hero-rangerover.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": BRANCHES.map((b) => ({
    "@type": "AutoWash",
    "@id": `${SITE.url}/#${b.id}`,
    name: b.name,
    image: `${SITE.url}${b.image}`,
    telephone: b.phone,
    priceRange: "1150–300000 ₽",
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressLocality: "Москва",
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: b.coords[0],
      longitude: b.coords[1],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: b.rating,
      reviewCount: b.reviews,
      bestRating: 5,
    },
    url: SITE.url,
    sameAs: [b.mapUrl],
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable} ${mono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BookingProvider>
          <SmoothScroll />
          <RevealRoot />
          <PageTransition />
          <Cursor />
          <span className="grain-layer" aria-hidden="true" />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </BookingProvider>
      </body>
    </html>
  );
}
