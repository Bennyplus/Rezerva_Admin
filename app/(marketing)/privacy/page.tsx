import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Drifully",
  description: "Learn how Drifully collects, uses, and safeguards your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>PRIVACY POLICY</h1>
        <p className={styles.effectiveDate}>Effective Date: June 11, 2026</p>

        <div className={styles.intro}>
          <p className={styles.text}>
            <strong>Company Name:</strong> Drifully Global Technologies (“Company,” “we,” “us,” or “our”)<br />
            <strong>Platform Name:</strong> Drifully
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. INTRODUCTION</h2>
          <p className={styles.text}>
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the “Platform”).
          </p>
          <p className={styles.text}>
            By using the Platform, you consent to the practices described in this Policy.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. INFORMATION WE COLLECT</h2>

          <h3 className={styles.subSectionTitle}>2.1 Personal Information</h3>
          <p className={styles.text}>We may collect:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Full name, email address, phone number</li>
            <li className={styles.listItem}>Home address and billing address</li>
            <li className={styles.listItem}>Driver’s license information</li>
            <li className={styles.listItem}>Date of birth</li>
            <li className={styles.listItem}>Government-issued identification (if required)</li>
            <li className={styles.listItem}>Payment information (processed via secure third-party providers)</li>
          </ul>

          <h3 className={styles.subSectionTitle}>2.2 Vehicle & Rental Data</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Reservation details</li>
            <li className={styles.listItem}>Rental history</li>
            <li className={styles.listItem}>Vehicle preferences</li>
            <li className={styles.listItem}>Incident or claims information</li>
          </ul>

          <h3 className={styles.subSectionTitle}>2.3 Device & Technical Data</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>IP address</li>
            <li className={styles.listItem}>Browser type and device identifiers</li>
            <li className={styles.listItem}>Operating system</li>
            <li className={styles.listItem}>App usage data</li>
          </ul>

          <h3 className={styles.subSectionTitle}>2.4 Location Data</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Real-time or approximate location (if enabled)</li>
            <li className={styles.listItem}>Vehicle GPS/telematics data (for safety, theft prevention, and compliance)</li>
          </ul>

          <h3 className={styles.subSectionTitle}>2.5 Cookies & Tracking Data</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>See our Cookie Policy for details</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. HOW WE USE YOUR INFORMATION</h2>
          <p className={styles.text}>We use your information to:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Process bookings and payments</li>
            <li className={styles.listItem}>Verify identity and eligibility to rent</li>
            <li className={styles.listItem}>Provide customer support</li>
            <li className={styles.listItem}>Improve platform functionality and user experience</li>
            <li className={styles.listItem}>Prevent fraud and enhance security</li>
            <li className={styles.listItem}>Comply with legal and regulatory requirements</li>
            <li className={styles.listItem}>Send transactional and service-related communications</li>
          </ul>

          <p className={styles.text}>With your consent, we may also:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Send marketing communications</li>
            <li className={styles.listItem}>Offer promotions or recommendations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. LEGAL BASIS FOR PROCESSING (GDPR APPLICABLE USERS)</h2>
          <p className={styles.text}>If you are located in the EEA/UK, we process data based on:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Contractual necessity (e.g., rental transactions)</li>
            <li className={styles.listItem}>Legal obligations</li>
            <li className={styles.listItem}>Legitimate interests (fraud prevention, platform security)</li>
            <li className={styles.listItem}>Consent (marketing, cookies)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. SHARING OF INFORMATION</h2>
          <p className={styles.text}>We may share your information with:</p>

          <h3 className={styles.subSectionTitle}>5.1 Service Providers</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Payment processors (e.g., Stripe, PayPal)</li>
            <li className={styles.listItem}>Identity verification services</li>
            <li className={styles.listItem}>Cloud hosting providers (e.g., AWS)</li>
          </ul>

          <h3 className={styles.subSectionTitle}>5.2 Business Partners</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Vehicle owners (if peer-to-peer model)</li>
            <li className={styles.listItem}>Insurance providers</li>
            <li className={styles.listItem}>Roadside assistance providers</li>
          </ul>

          <h3 className={styles.subSectionTitle}>5.3 Legal Authorities</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Law enforcement or regulators when required by law</li>
            <li className={styles.listItem}>To enforce our Terms or protect rights and safety</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. DATA RETENTION</h2>
          <p className={styles.text}>We retain your information:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>As long as necessary for service delivery</li>
            <li className={styles.listItem}>To comply with legal obligations</li>
            <li className={styles.listItem}>To resolve disputes and enforce agreements</li>
          </ul>
          <p className={styles.text}>Retention periods may vary depending on:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Regulatory requirements</li>
            <li className={styles.listItem}>Fraud prevention needs</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. YOUR PRIVACY RIGHTS</h2>

          <h3 className={styles.subSectionTitle}>7.1 U.S. (California – CCPA/CPRA)</h3>
          <p className={styles.text}>If you are a California resident, you have the right to:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Know what personal data we collect</li>
            <li className={styles.listItem}>Request deletion of your data</li>
            <li className={styles.listItem}>Correct inaccurate data</li>
            <li className={styles.listItem}>Opt-out of “sale” or “sharing” of personal data (if applicable)</li>
            <li className={styles.listItem}>Limit use of sensitive personal information</li>
          </ul>
          <p className={styles.text}>To exercise rights:  privacy@drifully.com</p>

          <h3 className={styles.subSectionTitle}>7.2 GDPR (EEA/UK Users)</h3>
          <p className={styles.text}>You have the right to:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Access your data</li>
            <li className={styles.listItem}>Rectify inaccuracies</li>
            <li className={styles.listItem}>Erase your data (“right to be forgotten”)</li>
            <li className={styles.listItem}>Restrict or object to processing</li>
            <li className={styles.listItem}>Data portability</li>
            <li className={styles.listItem}>Withdraw consent</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. DATA SECURITY</h2>
          <p className={styles.text}>We implement industry-standard safeguards, including:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Encryption (in transit and at rest)</li>
            <li className={styles.listItem}>Secure authentication controls</li>
            <li className={styles.listItem}>Access restrictions</li>
          </ul>
          <p className={styles.text}>However, no system is 100% secure.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. CHILDREN’S PRIVACY</h2>
          <p className={styles.text}>Our services are not intended for individuals under 18. We do not knowingly collect data from minors.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. THIRD-PARTY LINKS</h2>
          <p className={styles.text}>Our Platform may contain links to third-party websites. We are not responsible for their privacy practices.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. INTERNATIONAL DATA TRANSFERS</h2>
          <p className={styles.text}>If you access our Platform outside the U.S., your data may be transferred and processed in the United States or other jurisdictions.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>12. CHANGES TO THIS POLICY</h2>
          <p className={styles.text}>We may update this Privacy Policy periodically. Changes will be posted with a revised “Effective Date.”</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>13. CONTACT US</h2>
          <div className={styles.contactInfo}>
            <p className={styles.text}>
              <strong>Company Name:</strong> Drifully Global Technologies<br />
              <strong>Email:</strong> privacy@drifully.com<br />
              <strong>Address:</strong> [Company Address]
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
