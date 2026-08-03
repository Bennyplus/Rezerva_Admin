import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import HomepageModal from "@/components/HomepageModal";

export const metadata: Metadata = {
  title: "Drifully – Rent a Car, Your Way. Anytime, Anywhere.",
  description:
    "Drive yourself or get a chauffeur. Book in seconds with Drifully — fast, flexible, and hassle-free car rentals for trips, events, and business.",
};

export default function HomePage() {
  return (
    <main>
      <HomepageModal />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Reviews />
      <CtaSection />
      <Footer />
    </main>
  );
}
