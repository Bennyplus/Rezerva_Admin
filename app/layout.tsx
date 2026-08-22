import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.drifullyrentals.com"),
  title: {
    default: "Rezerva – Rent a Car, Your Way. Anytime, Anywhere.",
    template: "%s | Rezerva",
  },
  description:
    "Drive yourself or get a chauffeur. Book in seconds with  Rezerva fast, flexible, and hassle-free car rentals for trips, events, and business.",
  keywords: [
    // Core Nigeria keywords
    "car rental in Nigeria",
    "rent a car in Nigeria",
    "rent car in Nigeria",
    "car rental services in Nigeria",
    "self drive rental in Nigeria",
    "self drive car Nigeria",
    "car hire Nigeria",
    "vehicle rental Nigeria",
    "affordable car rental Nigeria",
    // Airport & travel
    "airport car rental Nigeria",
    "airport pickup car hire Nigeria",
    "car rental for business travel Nigeria",
    // Duration-based
    "monthly car rental Nigeria",
    "weekly car rental Nigeria",
    "daily car rental Nigeria",
    "long-term car rental Nigeria",
    // Business & corporate
    "corporate car hire Nigeria",
    "car rental for road trips Nigeria",
    "car rental without driver Nigeria",
    "self-drive car hire Lagos",
    // Diaspora & tourists (high priority)
    "car rental Nigeria for tourists",
    "rent a car in Nigeria from USA",
    "Nigeria car rental for diaspora",
    "car hire for visitors in Nigeria",
    "international car rental Nigeria",
    // Online booking intent (high priority)
    "Nigeria car rental booking online",
    "book car rental Nigeria online",
    "car rental app Nigeria",
    "best car rental app Nigeria",
    // Brand
    "Drifully",
    "chauffeur",
    "ride booking",
    "self-drive",
  ],
  authors: [{ name: "Rezerva" }],
  creator: "Rezerva",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.drifullyrentals.com",
    siteName: "Rezerva",
    title: "Drifully – Rent a Car, Your Way. Anytime, Anywhere.",
    description:
      "Drive yourself or get a chauffeur. Book in seconds — fast, flexible, and hassle-free.",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Drifully – Car rental app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drifully – Rent a Car, Your Way.",
    description:
      "Book a car or chauffeur in seconds. Fast, flexible, hassle-free.",
    images: ["/og-cover.png"],
  },
  alternates: {
    canonical: "https://www.drifullyrentals.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icons/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Drifully",
  description:
    "Drive yourself or get a chauffeur. Book in seconds with Drifully — fast, flexible, and hassle-free car rentals.",
  url: "https://www.drifullyrentals.com",
  logo: "https://www.drifullyrentals.com/logo.svg",
  sameAs: [
    "https://www.facebook.com/share/1YiruGKukG/?mibextid=wwXIfr",
    "https://www.instagram.com/drifullycarrentals?utm_source=qr",
    "https://x.com/drifullyrentals?s=11",
    "https://www.linkedin.com/company/drifully-car-rentals",
  ],
  offers: {
    "@type": "Offer",
    description: "Car rentals and chauffeur services",
    priceCurrency: "NGN",
    availability: "https://schema.org/InStock",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={dmSans.variable}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
