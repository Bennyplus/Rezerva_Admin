import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Terms of Use | Drifully",
  description: "Drifully Terms of Use and Agreement",
};

export default function TermsOfUsePage() {
  return (
    <main>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>TERMS OF USE</h1>
        <p className={styles.effectiveDate}>Effective Date: 04-07-2026</p>

        <div className={styles.intro}>
          <p className={styles.text}>
            <strong>Company Name:</strong> Drifully Global Technologies<br />
            <strong>Platform Name:</strong> Drifully
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. ACCEPTANCE OF TERMS</h2>
          <p className={styles.text}>
            By accessing or using our platform, mobile application, or services (collectively, the &quot;Platform&quot;), you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree, you must not use the Platform.
          </p>
          <p className={styles.text}>You represent that:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>You are at least 18 years old (or 21/25 where required by law)</li>
            <li className={styles.listItem}>You have a valid driver’s license</li>
            <li className={styles.listItem}>You have the legal authority to enter into this agreement</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. DESCRIPTION OF SERVICES</h2>
          <p className={styles.text}>The Platform enables users to:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Search, reserve, and rent vehicles</li>
            <li className={styles.listItem}>Manage bookings and payments</li>
            <li className={styles.listItem}>Access rental-related services</li>
          </ul>
          <p className={styles.text}>We act as:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>A direct vehicle rental provider</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. USER ACCOUNT REQUIREMENTS</h2>
          <p className={styles.text}>To use certain features, you must:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Create an account with accurate and complete information</li>
            <li className={styles.listItem}>Maintain the confidentiality of your login credentials</li>
            <li className={styles.listItem}>Notify us immediately of unauthorized access</li>
          </ul>
          <p className={styles.text}>We reserve the right to suspend or terminate accounts that:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Provide false information</li>
            <li className={styles.listItem}>Violate laws or these Terms</li>
            <li className={styles.listItem}>Engage in fraudulent or abusive behavior</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. ELIGIBILITY TO RENT VEHICLES</h2>
          <p className={styles.text}>You must:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Hold a valid, government-issued driver’s license</li>
            <li className={styles.listItem}>Meet minimum age requirements (varies by jurisdiction)</li>
            <li className={styles.listItem}>Provide valid payment method</li>
            <li className={styles.listItem}>Pass identity and eligibility verification checks</li>
          </ul>
          <p className={styles.text}>We may deny rentals based on:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Driving history</li>
            <li className={styles.listItem}>Insurance eligibility</li>
            <li className={styles.listItem}>Fraud or risk indicators</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. VEHICLE USE RESTRICTIONS</h2>
          <p className={styles.text}>You agree NOT to:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Use the vehicle for illegal purposes</li>
            <li className={styles.listItem}>Drive under the influence of drugs or alcohol</li>
            <li className={styles.listItem}>Allow unauthorized drivers</li>
            <li className={styles.listItem}>Use the vehicle for racing, towing (unless permitted), or off-road use</li>
            <li className={styles.listItem}>Transport hazardous materials</li>
            <li className={styles.listItem}>Exceed geographic or mileage restrictions</li>
          </ul>
          <p className={styles.text}>Violation may result in:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Immediate termination of rental</li>
            <li className={styles.listItem}>Additional fees and liability</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. BOOKING, PAYMENTS, AND FEES</h2>

          <h3 className={styles.subSectionTitle}>6.1 Pricing</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Rental rates, taxes, and fees are displayed at checkout</li>
            <li className={styles.listItem}>Prices may vary based on demand, location, and duration</li>
          </ul>

          <h3 className={styles.subSectionTitle}>6.2 Payment</h3>
          <p className={styles.text}>You authorize us to charge your payment method for:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Rental fees</li>
            <li className={styles.listItem}>Deposits</li>
            <li className={styles.listItem}>Damages, fines, tolls, and penalties</li>
          </ul>

          <h3 className={styles.subSectionTitle}>6.3 Deposits</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>A refundable security deposit may be required (exotic vehicles)</li>
          </ul>

          <h3 className={styles.subSectionTitle}>6.4 Additional Charges</h3>
          <p className={styles.text}>You are responsible for:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Late return fees</li>
            <li className={styles.listItem}>Fuel charges (if not returned as agreed)</li>
            <li className={styles.listItem}>Cleaning fees (excessive dirt/smoking)</li>
            <li className={styles.listItem}>Traffic violations, tolls, parking tickets</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. CANCELLATION AND REFUNDS</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>Cancellation policies will be disclosed at booking</li>
            <li className={styles.listItem}>Refund eligibility depends on timing and rental terms</li>
            <li className={styles.listItem}>No-shows may be charged full or partial fees</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. INSURANCE AND LIABILITY</h2>

          <h3 className={styles.subSectionTitle}>8.1 Insurance Coverage</h3>
          <p className={styles.text}>Depending on your selection or jurisdiction:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Basic coverage may be included or required</li>
            <li className={styles.listItem}>Optional protection plans may be offered</li>
          </ul>

          <h3 className={styles.subSectionTitle}>8.2 User Responsibility</h3>
          <p className={styles.text}>You are responsible for:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Damage, theft, or loss of the vehicle</li>
            <li className={styles.listItem}>Third-party damages not covered by insurance</li>
          </ul>

          <h3 className={styles.subSectionTitle}>8.3 Claims</h3>
          <p className={styles.text}>All incidents must be reported:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Immediately or within required timeframe</li>
            <li className={styles.listItem}>With police report (if applicable)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. VEHICLE CONDITION AND RETURN</h2>
          <p className={styles.text}>You agree to:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Inspect the vehicle before use</li>
            <li className={styles.listItem}>Return the vehicle:</li>
            <ul className={styles.list}>
              <li className={styles.listItem}>On time</li>
              <li className={styles.listItem}>In the same condition (normal wear excepted)</li>
              <li className={styles.listItem}>With agreed fuel level</li>
            </ul>
          </ul>
          <p className={styles.text}>Failure may result in additional charges.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. PROHIBITED CONDUCT ON PLATFORM</h2>
          <p className={styles.text}>You may not:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Use bots, scraping tools, or automation</li>
            <li className={styles.listItem}>Attempt to hack, disrupt, or reverse engineer the Platform</li>
            <li className={styles.listItem}>Submit false claims or disputes</li>
            <li className={styles.listItem}>Harass, abuse, or harm other users or staff</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. PRIVACY AND DATA PROTECTION</h2>
          <p className={styles.text}>We process personal data in accordance with:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Our Privacy Policy</li>
            <li className={styles.listItem}>Applicable laws including:</li>
            <ul className={styles.list}>
              <li className={styles.listItem}>CCPA/CPRA (California)</li>
              <li className={styles.listItem}>GDPR (if applicable)</li>
              <li className={styles.listItem}>Other state and federal privacy laws</li>
            </ul>
          </ul>
          <p className={styles.text}>We may collect:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Identity and contact information</li>
            <li className={styles.listItem}>Driver’s license details</li>
            <li className={styles.listItem}>Payment information</li>
            <li className={styles.listItem}>Location and usage data</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>12. COMPLIANCE WITH LAWS</h2>
          <p className={styles.text}>You agree to comply with:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>All traffic laws and regulations</li>
            <li className={styles.listItem}>Local, state, and federal laws</li>
            <li className={styles.listItem}>Rental and insurance requirements</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>13. INTELLECTUAL PROPERTY</h2>
          <p className={styles.text}>All Platform content, including:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Logos, trademarks, software, and design</li>
          </ul>
          <p className={styles.text}>Are owned by or licensed to the Company and may not be used without permission.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>14. DISCLAIMER OF WARRANTIES</h2>
          <p className={styles.text}>The Platform and services are provided &quot;AS IS&quot; and &quot;AS AVAILABLE.&quot;</p>
          <p className={styles.text}>We do not guarantee:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Continuous availability</li>
            <li className={styles.listItem}>Error-free operation</li>
            <li className={styles.listItem}>Vehicle availability at all times</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>15. LIMITATION OF LIABILITY</h2>
          <p className={styles.text}>To the maximum extent permitted by law, we are not liable for:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Indirect, incidental, or consequential damages</li>
            <li className={styles.listItem}>Loss of profits, data, or business</li>
          </ul>
          <p className={styles.text}>Our total liability shall not exceed:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>The total amount paid for the rental in question</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>16. INDEMNIFICATION</h2>
          <p className={styles.text}>
            You agree to indemnify and hold harmless the Company from:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Claims arising from your use of the Platform</li>
            <li className={styles.listItem}>Violations of these Terms</li>
            <li className={styles.listItem}>Damage caused during rental</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>17. TERMINATION</h2>
          <p className={styles.text}>We may suspend or terminate your access:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>For violations of these Terms</li>
            <li className={styles.listItem}>For legal or risk-related reasons</li>
          </ul>
          <p className={styles.text}>You may stop using the Platform at any time.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>18. DISPUTE RESOLUTION</h2>

          <h3 className={styles.subSectionTitle}>18.1 Governing Law</h3>
          <p className={styles.text}>These Terms are governed by the laws of:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>State of Lagos, Nigeria</li>
          </ul>

          <h3 className={styles.subSectionTitle}>18.2 Arbitration</h3>
          <p className={styles.text}>Any disputes shall be resolved through:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Binding arbitration under applicable local laws</li>
          </ul>
          <p className={styles.text}>You waive the right to:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Jury trial</li>
            <li className={styles.listItem}>Class action lawsuits</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>19. CHANGES TO TERMS</h2>
          <p className={styles.text}>We may update these Terms at any time. Continued use of the Platform constitutes acceptance of changes.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>20. CONTACT INFORMATION</h2>
          <div className={styles.contactInfo}>
            <p className={styles.text}>
              <strong>Company Name:</strong> Drifully Global Technologies<br />
              <strong>Email:</strong> drifully@gmail.com<br />
              <strong>Website:</strong> www.drifullyrentals.com<br />
              <strong>Phone:</strong> +234 7039344411
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
