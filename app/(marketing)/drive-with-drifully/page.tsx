import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Become a Driver | Drifully",
  description: "Join Drifully and earn on your own schedule. Apply to become a driver today.",
};

export default function DriveWithDrifullyPage() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src="/images/drivers-hero.jpg"
            alt="Drifully Driver"
            fill
            priority
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Become a<br />Drifully Driver</h1>
          <p className={styles.heroSubtitle}>
            Join Drifully and earn on your own terms. Enjoy flexible hours, competitive pay, and the support you need to succeed.
          </p>
          <ul className={styles.heroList}>
            <li>Flexible schedule and earnings</li>
            <li>Real-time intelligent routing support</li>
            <li>Transparent weekly payouts</li>
            <li>Round-the-clock driver support</li>
          </ul>
          <Link href="/driver-application" className={styles.heroButton}>
            Apply Now
          </Link>
        </div>
      </section>

      {/* Why Drive Section */}
      <section className={styles.whySection}>
        <div className={`${styles.container} ${styles.whyLayout}`}>
          <div className={styles.whyHeader}>
            <h2 className={styles.whyTitle}>Why Drive with Drifully</h2>
            <p className={styles.whyDesc}>
              Join a platform that values professionalism, <strong>choose the assignments</strong> you want, deliver exceptional service, and <strong>earn with confidence</strong> after every completed trip.
            </p>
          </div>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.61101 9.83L17.261 16.78C19.291 18.62 19.001 22 15.241 22H8.76101C5.00101 22 4.71101 18.62 6.74101 16.78L17.261 7.22C19.291 5.38 19.001 2 15.241 2H8.76101C5.00101 2 4.71101 5.38 6.74101 7.22" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Flexible working hours</h3>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.9099 11.1203C20.9099 16.0103 17.3599 20.5903 12.5099 21.9303C12.1799 22.0203 11.8198 22.0203 11.4898 21.9303C6.63984 20.5903 3.08984 16.0103 3.08984 11.1203V6.73028C3.08984 5.91028 3.70986 4.98028 4.47986 4.67028L10.0498 2.39031C11.2998 1.88031 12.7098 1.88031 13.9598 2.39031L19.5298 4.67028C20.2898 4.98028 20.9199 5.91028 20.9199 6.73028L20.9099 11.1203Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Secure and trusted platform</h3>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V5" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V5" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.5 9.08984H20.5" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 19C22 19.75 21.79 20.46 21.42 21.06C20.73 22.22 19.46 23 18 23C16.99 23 16.07 22.63 15.37 22C15.06 21.74 14.79 21.42 14.58 21.06C14.21 20.46 14 19.75 14 19C14 16.79 15.79 15 18 15C19.2 15 20.27 15.53 21 16.36C21.62 17.07 22 17.99 22 19Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.4414 18.9995L17.4314 19.9895L19.5614 18.0195" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 8.5V16.36C20.27 15.53 19.2 15 18 15C15.79 15 14 16.79 14 19C14 19.75 14.21 20.46 14.58 21.06C14.79 21.42 15.06 21.74 15.37 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.9945 13.7002H12.0035" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.29529 13.7002H8.30427" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.29529 16.7002H8.30427" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Reliable booking opportunities</h3>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>No vehicle ownership required</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Stages Section */}
      <section className={styles.verificationSection}>
        <div className={styles.container}>
          <div className={styles.verificationHeader}>
          <h2 className={styles.verificationTitle}>
            At Drifully, safety comes first. Every driver must successfully complete multiple verification stages before being approved to drive on the platform.
          </h2>
        </div>
        <div className={styles.verificationGrid}>
          <div className={styles.verifyCard}>
            <div className={styles.verifyIcon}>👤</div>
            <h3 className={styles.verifyCardTitle}>Identity Verification</h3>
            <ul className={styles.verifyList}>
              <li>Validate government-issued IDs</li>
              <li>Face identity matching to prevent impersonation</li>
            </ul>
          </div>
          <div className={styles.verifyCard}>
            <div className={styles.verifyIcon}>📄</div>
            <h3 className={styles.verifyCardTitle}>Document Verification</h3>
            <ul className={styles.verifyList}>
              <li>Driver&apos;s license validation</li>
              <li>Vehicle ownership and insurance verification (where applicable)</li>
            </ul>
          </div>
          <div className={styles.verifyCard}>
            <div className={styles.verifyIcon}>🔍</div>
            <h3 className={styles.verifyCardTitle}>Background Check</h3>
            <ul className={styles.verifyList}>
              <li>Comprehensive criminal background screening</li>
              <li>Motor vehicle record check to ensure clean driving history</li>
            </ul>
          </div>
          <div className={styles.verifyCard}>
            <div className={styles.verifyIcon}>🛡️</div>
            <h3 className={styles.verifyCardTitle}>Criminal Record Screening</h3>
            <ul className={styles.verifyList}>
              <li>Daily support and monitoring to ensure ongoing safety compliance</li>
            </ul>
          </div>
          <div className={styles.verifyCard}>
            <div className={styles.verifyIcon}>🚗</div>
            <h3 className={styles.verifyCardTitle}>Physical Inspection</h3>
            <ul className={styles.verifyList}>
              <li>In-person or virtual vehicle inspection to verify condition</li>
              <li>Verification of safety standards</li>
            </ul>
          </div>
          <div className={styles.verifyCard}>
            <div className={styles.verifyIcon}>✅</div>
            <h3 className={styles.verifyCardTitle}>Final Approval</h3>
            <ul className={styles.verifyList}>
              <li>Account activation</li>
              <li>Approval to accept ride requests on the platform</li>
            </ul>
          </div>
        </div>
        </div>
      </section>

      {/* Start Earning Section */}
      <section className={styles.earnSection}>
        <div className={styles.container}>
          <h2 className={styles.earnTitle}>Start Earning With Drifully</h2>
        <p className={styles.earnDesc}>Follow these simple steps to get started</p>
        
        <div className={styles.earnGrid}>
          <div className={styles.earnCard}>
            <div className={styles.earnImagePlaceholder}>
              Image Placeholder
            </div>
            <div className={styles.earnStep}>01</div>
            <h3 className={styles.earnCardTitle}>Register</h3>
            <p className={styles.earnCardDesc}>
              Create an account online and complete the registration form.
            </p>
          </div>

          <div className={styles.earnCard}>
            <div className={styles.earnImagePlaceholder}>
              Image Placeholder
            </div>
            <div className={styles.earnStep}>02</div>
            <h3 className={styles.earnCardTitle}>Submit required valid documents and personal information for verification.</h3>
            <ul className={styles.earnList}>
              <li>Driver&apos;s License</li>
              <li>Proof of Identity</li>
              <li>Vehicle Registration</li>
              <li>Insurance Details</li>
            </ul>
          </div>

          <div className={styles.earnCard}>
            <div className={styles.earnImagePlaceholder}>
              Image Placeholder
            </div>
            <div className={styles.earnStep}>03</div>
            <h3 className={styles.earnCardTitle}>Get approved &amp; start driving</h3>
            <p className={styles.earnCardDesc}>
              Download or sign in to the Drifully app, complete your driver profile, begin applying for or accepting bookings.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.faqHeader}>
          <h2 className={styles.faqTitle}>Got questions about becoming a driver?</h2>
          <h2 className={styles.faqTitle}>We&apos;ve got answers.</h2>
        </div>
        <div className={styles.faqGrid}>
          <div className={styles.faqCard}>
            <div className={styles.faqQ}><span>01</span> Can I rent a vehicle?</div>
            <p className={styles.faqA}>
              Yes, if you don&apos;t have your own car, we have partnerships that allow you to rent vehicles to drive on our platform.
            </p>
          </div>
          <div className={styles.faqCard}>
            <div className={styles.faqQ}><span>02</span> Do you offer insurance?</div>
            <p className={styles.faqA}>
              Yes, all active rides come with standard liability and collision insurance coverage to protect you while driving.
            </p>
          </div>
          <div className={styles.faqCard}>
            <div className={styles.faqQ}><span>03</span> How do I get paid?</div>
            <p className={styles.faqA}>
              You will get paid directly to your bank account securely, with fast weekly payouts for all completed rides.
            </p>
          </div>
          <div className={styles.faqCard}>
            <div className={styles.faqQ}><span>04</span> Is my personal data secure?</div>
            <p className={styles.faqA}>
              Yes, we use secure, industry-standard encryption to ensure your personal information and documents are fully protected.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p className={styles.ctaDesc}>
            Apply today and start earning with Drifully.
          </p>
          <div className={styles.ctaImages}>
            <Image src="/images/ready-1.png" alt="Ready 1" width={150} height={50} className={styles.ctaImage} />
            <Image src="/images/ready-2.png" alt="Ready 2" width={150} height={50} className={styles.ctaImage} />
          </div>
          <Link href="/driver-application" className={styles.heroButton}>
            Apply To Drive
          </Link>
        </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
