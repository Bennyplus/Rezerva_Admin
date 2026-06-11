import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Cookie Policy | Drifully",
  description: "Learn how Drifully uses cookies to improve your experience.",
};

export default function CookiePolicyPage() {
  return (
    <main>
      <Navbar />
      
      <div className={styles.container}>
        <h1 className={styles.title}>COOKIE POLICY</h1>
        <p className={styles.effectiveDate}>Effective Date: June 11, 2026</p>
        
        <div className={styles.intro}>
          <p className={styles.text}>
            <strong>Company Name:</strong> Drifully Global Technologies<br />
            <strong>Platform Name:</strong> Drifully
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. WHAT ARE COOKIES</h2>
          <p className={styles.text}>
            Cookies are small text files stored on your device when you visit a website. They help improve functionality, performance, and user experience.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. TYPES OF COOKIES WE USE</h2>
          
          <h3 className={styles.subSectionTitle}>2.1 Essential Cookies</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Required for platform functionality</li>
            <li className={styles.listItem}>Enable login, booking, and security features</li>
          </ul>

          <h3 className={styles.subSectionTitle}>2.2 Performance & Analytics Cookies</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Help us understand how users interact with the Platform</li>
            <li className={styles.listItem}>Example: page visits, session duration</li>
            <li className={styles.listItem}>Tools may include: Google Analytics (or similar)</li>
          </ul>

          <h3 className={styles.subSectionTitle}>2.3 Functional Cookies</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Remember your preferences</li>
            <li className={styles.listItem}>Save login sessions and settings</li>
          </ul>

          <h3 className={styles.subSectionTitle}>2.4 Advertising & Marketing Cookies</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Deliver relevant ads and promotions</li>
            <li className={styles.listItem}>Track effectiveness of campaigns</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. HOW WE USE COOKIES</h2>
          <p className={styles.text}>We use cookies to:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Authenticate users</li>
            <li className={styles.listItem}>Process bookings</li>
            <li className={styles.listItem}>Analyze traffic and improve performance</li>
            <li className={styles.listItem}>Personalize user experience</li>
            <li className={styles.listItem}>Detect fraud and enhance security</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. THIRD-PARTY COOKIES</h2>
          <p className={styles.text}>We may allow third-party services to place cookies, including:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Analytics providers</li>
            <li className={styles.listItem}>Advertising networks</li>
            <li className={styles.listItem}>Payment processors</li>
          </ul>
          <p className={styles.text}>These third parties have their own privacy policies.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. YOUR COOKIE CHOICES</h2>
          
          <h3 className={styles.subSectionTitle}>5.1 Browser Settings</h3>
          <p className={styles.text}>You can:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Block or delete cookies via your browser settings</li>
            <li className={styles.listItem}>Set preferences for certain cookie types</li>
          </ul>

          <h3 className={styles.subSectionTitle}>5.2 Cookie Consent Banner (Recommended)</h3>
          <p className={styles.text}>When required by law (e.g., GDPR), we provide:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Cookie consent banner</li>
            <li className={styles.listItem}>Option to accept/reject non-essential cookies</li>
          </ul>

          <h3 className={styles.subSectionTitle}>5.3 Opt-Out Tools</h3>
          <p className={styles.text}>You can opt out of targeted advertising via:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Network Advertising Initiative (NAI)</li>
            <li className={styles.listItem}>Digital Advertising Alliance (DAA)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. DO NOT TRACK SIGNALS</h2>
          <p className={styles.text}>
            Some browsers send “Do Not Track” signals. We may not respond to these signals consistently.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. CHANGES TO THIS COOKIE POLICY</h2>
          <p className={styles.text}>
            We may update this policy periodically. Changes will be reflected with an updated effective date.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. CONTACT US</h2>
          <div className={styles.contactInfo}>
            <p className={styles.text}>
              <strong>Company Name:</strong> Drifully Global Technologies<br />
              <strong>Email:</strong> Drifully@gmail.com
            </p>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}
