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
  metadataBase: new URL("https://drifully.com"),
  title: {
    default: "Drifully – Rent a Car, Your Way. Anytime, Anywhere.",
    template: "%s | Drifully",
  },
  description:
    "Drive yourself or get a chauffeur. Book in seconds with Drifully — fast, flexible, and hassle-free car rentals for trips, events, and business.",
  keywords: ["car rental", "chauffeur", "ride booking", "self-drive", "Drifully"],
  authors: [{ name: "Drifully" }],
  creator: "Drifully",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drifully.com",
    siteName: "Drifully",
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
    description: "Book a car or chauffeur in seconds. Fast, flexible, hassle-free.",
    images: ["/og-cover.png"],
  },
  alternates: {
    canonical: "https://drifully.com",
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
  url: "https://drifully.com",
  logo: "https://drifully.com/logo.svg",
  sameAs: [],
  offers: {
    "@type": "Offer",
    description: "Car rentals and chauffeur services",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
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
