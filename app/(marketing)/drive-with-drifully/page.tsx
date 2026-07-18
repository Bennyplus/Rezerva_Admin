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
            src="/images/drivers-hero.png"
            alt="Drifully Driver"
            fill
            priority
            quality={100}
            unoptimized
          />
        </div>
        <div className={styles.heroBackground2} />
        {/* <div className={styles.heroBackground3}>
          <Image
            src="/images/man-img.png"
            alt="Drifully Driver"
            fill
            priority
          />
        </div> */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Become a <br /> Drifully Driver</h1>
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

          <div className={styles.heroTrusted}>
            <svg width="88" height="16" viewBox="0 0 88 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.23916 2.34164C7.47864 1.60459 8.52136 1.60459 8.76085 2.34164L9.6165 4.97508C9.7236 5.3047 10.0308 5.52786 10.3773 5.52786H13.1463C13.9213 5.52786 14.2435 6.51956 13.6165 6.97508L11.3764 8.60263C11.096 8.80635 10.9787 9.16744 11.0858 9.49706L11.9414 12.1305C12.1809 12.8675 11.3373 13.4804 10.7104 13.0249L8.47023 11.3974C8.18984 11.1937 7.81016 11.1937 7.52977 11.3974L5.28963 13.0249C4.66266 13.4804 3.81908 12.8675 4.05856 12.1305L4.91422 9.49706C5.02132 9.16744 4.90399 8.80635 4.6236 8.60263L2.38346 6.97508C1.75649 6.51956 2.07872 5.52786 2.85369 5.52786H5.62265C5.96924 5.52786 6.2764 5.3047 6.3835 4.97508L7.23916 2.34164Z" fill="#FFB86A" />
              <path d="M25.2392 2.34164C25.4786 1.60459 26.5214 1.60459 26.7608 2.34164L27.6165 4.97508C27.7236 5.3047 28.0308 5.52786 28.3773 5.52786H31.1463C31.9213 5.52786 32.2435 6.51956 31.6165 6.97508L29.3764 8.60263C29.096 8.80635 28.9787 9.16744 29.0858 9.49706L29.9414 12.1305C30.1809 12.8675 29.3373 13.4804 28.7104 13.0249L26.4702 11.3974C26.1898 11.1937 25.8102 11.1937 25.5298 11.3974L23.2896 13.0249C22.6627 13.4804 21.8191 12.8675 22.0586 12.1305L22.9142 9.49706C23.0213 9.16744 22.904 8.80635 22.6236 8.60263L20.3835 6.97508C19.7565 6.51956 20.0787 5.52786 20.8537 5.52786H23.6227C23.9692 5.52786 24.2764 5.3047 24.3835 4.97508L25.2392 2.34164Z" fill="#FFB86A" />
              <path d="M43.2392 2.34164C43.4786 1.60459 44.5214 1.60459 44.7608 2.34164L45.6165 4.97508C45.7236 5.3047 46.0308 5.52786 46.3773 5.52786H49.1463C49.9213 5.52786 50.2435 6.51956 49.6165 6.97508L47.3764 8.60263C47.096 8.80635 46.9787 9.16744 47.0858 9.49706L47.9414 12.1305C48.1809 12.8675 47.3373 13.4804 46.7104 13.0249L44.4702 11.3974C44.1898 11.1937 43.8102 11.1937 43.5298 11.3974L41.2896 13.0249C40.6627 13.4804 39.8191 12.8675 40.0586 12.1305L40.9142 9.49706C41.0213 9.16744 40.904 8.80635 40.6236 8.60263L38.3835 6.97508C37.7565 6.51956 38.0787 5.52786 38.8537 5.52786H41.6227C41.9692 5.52786 42.2764 5.3047 42.3835 4.97508L43.2392 2.34164Z" fill="#FFB86A" />
              <path d="M61.2392 2.34164C61.4786 1.60459 62.5214 1.60459 62.7608 2.34164L63.6165 4.97508C63.7236 5.3047 64.0308 5.52786 64.3773 5.52786H67.1463C67.9213 5.52786 68.2435 6.51956 67.6165 6.97508L65.3764 8.60263C65.096 8.80635 64.9787 9.16744 65.0858 9.49706L65.9414 12.1305C66.1809 12.8675 65.3373 13.4804 64.7104 13.0249L62.4702 11.3974C62.1898 11.1937 61.8102 11.1937 61.5298 11.3974L59.2896 13.0249C58.6627 13.4804 57.8191 12.8675 58.0586 12.1305L58.9142 9.49706C59.0213 9.16744 58.904 8.80635 58.6236 8.60263L56.3835 6.97508C55.7565 6.51956 56.0787 5.52786 56.8537 5.52786H59.6227C59.9692 5.52786 60.2764 5.3047 60.3835 4.97508L61.2392 2.34164Z" fill="#FFB86A" />
              <path d="M79.2392 2.34164C79.4786 1.60459 80.5214 1.60459 80.7608 2.34164L81.6165 4.97508C81.7236 5.3047 82.0308 5.52786 82.3773 5.52786H85.1463C85.9213 5.52786 86.2435 6.51956 85.6165 6.97508L83.3764 8.60263C83.096 8.80635 82.9787 9.16744 83.0858 9.49706L83.9414 12.1305C84.1809 12.8675 83.3373 13.4804 82.7104 13.0249L80.4702 11.3974C80.1898 11.1937 79.8102 11.1937 79.5298 11.3974L77.2896 13.0249C76.6627 13.4804 75.8191 12.8675 76.0586 12.1305L76.9142 9.49706C77.0213 9.16744 76.904 8.80635 76.6236 8.60263L74.3835 6.97508C73.7565 6.51956 74.0787 5.52786 74.8537 5.52786H77.6227C77.9692 5.52786 78.2764 5.3047 78.3835 4.97508L79.2392 2.34164Z" fill="url(#paint0_linear_4227_92566)" />
              <path d="M79.2392 2.34164C79.4786 1.60459 80.5214 1.60459 80.7608 2.34164L81.6165 4.97508C81.7236 5.3047 82.0308 5.52786 82.3773 5.52786H85.1463C85.9213 5.52786 86.2435 6.51956 85.6165 6.97508L83.3764 8.60263C83.096 8.80635 82.9787 9.16744 83.0858 9.49706L83.9414 12.1305C84.1809 12.8675 83.3373 13.4804 82.7104 13.0249L80.4702 11.3974C80.1898 11.1937 79.8102 11.1937 79.5298 11.3974L77.2896 13.0249C76.6627 13.4804 75.8191 12.8675 76.0586 12.1305L76.9142 9.49706C77.0213 9.16744 76.904 8.80635 76.6236 8.60263L74.3835 6.97508C73.7565 6.51956 74.0787 5.52786 74.8537 5.52786H77.6227C77.9692 5.52786 78.2764 5.3047 78.3835 4.97508L79.2392 2.34164Z" fill="#B3B3B3" fillOpacity={0.2} />
              <defs>
                <linearGradient id="paint0_linear_4227_92566" x1="74" y1="6" x2="80" y2="6" gradientUnits="userSpaceOnUse">
                  <stop offset="0.9999" stopColor="#FFB86A" />
                  <stop offset="1" stopColor="white" />
                </linearGradient>
              </defs>
            </svg>
            <p className={styles.heroTrustedText}>Trusted by professional chauffeurs</p>
          </div>
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
                  <path d="M9.61101 9.83L17.261 16.78C19.291 18.62 19.001 22 15.241 22H8.76101C5.00101 22 4.71101 18.62 6.74101 16.78L17.261 7.22C19.291 5.38 19.001 2 15.241 2H8.76101C5.00101 2 4.71101 5.38 6.74101 7.22" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Flexible working hours</h3>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.9099 11.1203C20.9099 16.0103 17.3599 20.5903 12.5099 21.9303C12.1799 22.0203 11.8198 22.0203 11.4898 21.9303C6.63984 20.5903 3.08984 16.0103 3.08984 11.1203V6.73028C3.08984 5.91028 3.70986 4.98028 4.47986 4.67028L10.0498 2.39031C11.2998 1.88031 12.7098 1.88031 13.9598 2.39031L19.5298 4.67028C20.2898 4.98028 20.9199 5.91028 20.9199 6.73028L20.9099 11.1203Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Secure and trusted platform</h3>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V5" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 2V5" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.5 9.08984H20.5" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 19C22 19.75 21.79 20.46 21.42 21.06C20.73 22.22 19.46 23 18 23C16.99 23 16.07 22.63 15.37 22C15.06 21.74 14.79 21.42 14.58 21.06C14.21 20.46 14 19.75 14 19C14 16.79 15.79 15 18 15C19.2 15 20.27 15.53 21 16.36C21.62 17.07 22 17.99 22 19Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.4414 18.9995L17.4314 19.9895L19.5614 18.0195" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 8.5V16.36C20.27 15.53 19.2 15 18 15C15.79 15 14 16.79 14 19C14 19.75 14.21 20.46 14.58 21.06C14.79 21.42 15.06 21.74 15.37 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.9945 13.7002H12.0035" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.29529 13.7002H8.30427" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.29529 16.7002H8.30427" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Reliable booking opportunities</h3>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
              <div className={styles.verifyIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.9987 2.33301C10.942 2.33301 8.45703 4.81801 8.45703 7.87467C8.45703 10.873 10.802 13.2997 13.8587 13.4047C13.952 13.393 14.0454 13.393 14.1154 13.4047C14.1387 13.4047 14.1504 13.4047 14.1737 13.4047C14.1854 13.4047 14.1854 13.4047 14.197 13.4047C17.1837 13.2997 19.5287 10.873 19.5404 7.87467C19.5404 4.81801 17.0554 2.33301 13.9987 2.33301Z" fill="#FB2C36" />
                  <path d="M19.9252 16.5084C16.6702 14.3384 11.3618 14.3384 8.08349 16.5084C6.60182 17.5 5.78516 18.8417 5.78516 20.2767C5.78516 21.7117 6.60182 23.0417 8.07182 24.0217C9.70516 25.1184 11.8518 25.6667 13.9985 25.6667C16.1452 25.6667 18.2918 25.1184 19.9252 24.0217C21.3952 23.03 22.2118 21.7 22.2118 20.2534C22.2002 18.8184 21.3952 17.4884 19.9252 16.5084Z" fill="#FB2C36" />
                </svg>
              </div>
              <h3 className={styles.verifyCardTitle}>Identity Verification</h3>
              <ul className={styles.verifyList}>
                <li>Verification of government-issued identification.</li>
                <li>Validation of personal information and submitted documents.</li>
              </ul>
            </div>
            <div className={styles.verifyCard}>
              <div className={styles.verifyIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.23036 11.6663C2.7287 11.6663 2.33203 11.2697 2.33203 10.768V8.07301C2.33203 4.91134 4.91036 2.33301 8.07203 2.33301H10.767C11.2687 2.33301 11.6654 2.72967 11.6654 3.23134C11.6654 3.73301 11.2687 4.12967 10.767 4.12967H8.07203C5.89036 4.12967 4.1287 5.90301 4.1287 8.07301V10.768C4.1287 11.2697 3.72036 11.6663 3.23036 11.6663Z" fill="#2B7FFF" />
                  <path d="M24.767 11.6663C24.277 11.6663 23.8687 11.2697 23.8687 10.768V8.07301C23.8687 5.89134 22.0954 4.12967 19.9254 4.12967H17.2304C16.7287 4.12967 16.332 3.72134 16.332 3.23134C16.332 2.74134 16.7287 2.33301 17.2304 2.33301H19.9254C23.087 2.33301 25.6654 4.91134 25.6654 8.07301V10.768C25.6654 11.2697 25.2687 11.6663 24.767 11.6663Z" fill="#2B7FFF" />
                  <path d="M19.9262 25.6663H18.3046C17.8146 25.6663 17.4062 25.2696 17.4062 24.768C17.4062 24.278 17.8029 23.8696 18.3046 23.8696H19.9262C22.1079 23.8696 23.8696 22.0963 23.8696 19.9263V18.3163C23.8696 17.8263 24.2662 17.418 24.7679 17.418C25.2579 17.418 25.6663 17.8146 25.6663 18.3163V19.9263C25.6663 23.088 23.0879 25.6663 19.9262 25.6663Z" fill="#2B7FFF" />
                  <path d="M10.767 25.6663H8.07203C4.91036 25.6663 2.33203 23.088 2.33203 19.9263V17.2313C2.33203 16.7297 2.7287 16.333 3.23036 16.333C3.73203 16.333 4.1287 16.7297 4.1287 17.2313V19.9263C4.1287 22.108 5.90203 23.8697 8.07203 23.8697H10.767C11.257 23.8697 11.6654 24.2663 11.6654 24.768C11.6654 25.2697 11.2687 25.6663 10.767 25.6663Z" fill="#2B7FFF" />
                  <path d="M21.5381 13.1016H19.9514H8.05141H6.46474C5.96307 13.1016 5.56641 13.5099 5.56641 13.9999C5.56641 14.4899 5.96307 14.8982 6.46474 14.8982H8.05141H19.9514H21.5381C22.0397 14.8982 22.4364 14.4899 22.4364 13.9999C22.4364 13.5099 22.0397 13.1016 21.5381 13.1016Z" fill="#2B7FFF" />
                  <path d="M8.05078 16.2636V16.6486C8.05078 18.5852 9.61411 20.1486 11.5508 20.1486H16.4508C18.3874 20.1486 19.9508 18.5852 19.9508 16.6486V16.2636C19.9508 16.1236 19.8458 16.0186 19.7058 16.0186H8.29578C8.15578 16.0186 8.05078 16.1236 8.05078 16.2636Z" fill="#2B7FFF" />
                  <path d="M8.05078 11.7366V11.3516C8.05078 9.4149 9.61411 7.85156 11.5508 7.85156H16.4508C18.3874 7.85156 19.9508 9.4149 19.9508 11.3516V11.7366C19.9508 11.8766 19.8458 11.9816 19.7058 11.9816H8.29578C8.15578 11.9816 8.05078 11.8766 8.05078 11.7366Z" fill="#2B7FFF" />
                </svg>

              </div>
              <h3 className={styles.verifyCardTitle}>Document Verification</h3>
              <ul className={styles.verifyList}>
                <li>Driver&apos;s license validation</li>
                <li>Required supporting documents are reviewed for authenticity.</li>
              </ul>
            </div>
            <div className={styles.verifyCard}>
              <div className={styles.verifyIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.5816 4.79471L15.7599 2.61305C14.7916 2.25138 13.2049 2.25138 12.2366 2.61305L6.4149 4.79471C5.07323 5.29638 3.97656 6.88305 3.97656 8.30638V16.9747C3.97656 18.3514 4.88656 20.1597 5.9949 20.988L11.0116 24.733C12.6566 25.9697 15.3632 25.9697 17.0082 24.733L22.0249 20.988C23.1332 20.1597 24.0432 18.3514 24.0432 16.9747V8.30638C24.0199 6.88305 22.9232 5.29638 21.5816 4.79471ZM13.9166 8.20138C15.2932 8.20138 16.4132 9.32138 16.4132 10.698C16.4132 12.0514 15.3516 13.1364 14.0099 13.183H13.9866H13.9632C13.9399 13.183 13.9166 13.183 13.8932 13.183C12.4932 13.1364 11.4432 12.0514 11.4432 10.698C11.4316 9.32138 12.5516 8.20138 13.9166 8.20138ZM16.5532 19.0864C15.8416 19.553 14.9199 19.798 13.9982 19.798C13.0766 19.798 12.1432 19.5647 11.4432 19.0864C10.7782 18.643 10.4166 18.0364 10.4049 17.3714C10.4049 16.718 10.7782 16.088 11.4432 15.6447C12.8549 14.7114 15.1532 14.7114 16.5649 15.6447C17.2299 16.088 17.6032 16.6947 17.6032 17.3597C17.5916 18.013 17.2182 18.643 16.5532 19.0864Z" fill="#FF6900" />
                </svg>

              </div>
              <h3 className={styles.verifyCardTitle}>Background Check</h3>
              <ul className={styles.verifyList}>
                <li>Comprehensive background screening.</li>
                <li>Verification of employment or driving history where applicable.</li>
              </ul>
            </div>
            <div className={styles.verifyCard}>
              <div className={styles.verifyIcon}>
                <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g filter="url(#filter0_ddd_4258_86305)">
                    <rect x="0.875" y="0.583008" width="28" height="28" rx="5.83333" fill="white" />
                    <rect x="0.875" y="0.583008" width="28" height="28" rx="5.83333" fill="url(#pattern0_4258_86305)" />
                  </g>
                  <defs>
                    <filter id="filter0_ddd_4258_86305" x="-5.96046e-08" y="-0.000325561" width="29.75" height="31.2083" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feMorphology radius="0.583333" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_4258_86305" />
                      <feOffset />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.0901961 0 0 0 0 0.0901961 0 0 0 0 0.0901961 0 0 0 0.02 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4258_86305" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feMorphology radius="0.291667" operator="erode" in="SourceAlpha" result="effect2_dropShadow_4258_86305" />
                      <feOffset dy="0.583333" />
                      <feGaussianBlur stdDeviation="0.291667" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.0901961 0 0 0 0 0.0901961 0 0 0 0 0.0901961 0 0 0 0.06 0" />
                      <feBlend mode="normal" in2="effect1_dropShadow_4258_86305" result="effect2_dropShadow_4258_86305" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feMorphology radius="0.875" operator="erode" in="SourceAlpha" result="effect3_dropShadow_4258_86305" />
                      <feOffset dy="1.75" />
                      <feGaussianBlur stdDeviation="0.875" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.0901961 0 0 0 0 0.0901961 0 0 0 0 0.0901961 0 0 0 0.06 0" />
                      <feBlend mode="normal" in2="effect2_dropShadow_4258_86305" result="effect3_dropShadow_4258_86305" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_4258_86305" result="shape" />
                    </filter>
                    <pattern id="pattern0_4258_86305" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlinkHref="#image0_4258_86305" transform="scale(0.00195312)" />
                    </pattern>
                    <image id="image0_4258_86305" width="512" height="512" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
                  </defs>
                </svg>

              </div>
              <h3 className={styles.verifyCardTitle}>Criminal Record Screening</h3>
              <ul className={styles.verifyList}>
                <li>Every applicant must have *zero verified criminal activity* to qualify for approval.</li>
              </ul>
            </div>
            <div className={styles.verifyCard}>
              <div className={styles.verifyIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.3352 22.47H12.7535C12.2285 22.47 11.7969 22.0383 11.7969 21.5133C11.7969 20.9883 12.2285 20.5566 12.7535 20.5566H23.3352C23.8602 20.5566 24.2919 20.9883 24.2919 21.5133C24.2919 22.05 23.8602 22.47 23.3352 22.47Z" fill="#868C98" />
                  <path d="M23.3352 15.1321H12.7535C12.2285 15.1321 11.7969 14.7004 11.7969 14.1754C11.7969 13.6504 12.2285 13.2188 12.7535 13.2188H23.3352C23.8602 13.2188 24.2919 13.6504 24.2919 14.1754C24.2919 14.7004 23.8602 15.1321 23.3352 15.1321Z" fill="#868C98" />
                  <path d="M23.3352 7.78247H12.7535C12.2285 7.78247 11.7969 7.35081 11.7969 6.82581C11.7969 6.30081 12.2285 5.86914 12.7535 5.86914H23.3352C23.8602 5.86914 24.2919 6.30081 24.2919 6.82581C24.2919 7.35081 23.8602 7.78247 23.3352 7.78247Z" fill="#868C98" />
                  <path d="M5.72927 9.36792C5.4726 9.36792 5.2276 9.26292 5.0526 9.08792L3.99094 8.02625C3.6176 7.65292 3.6176 7.04625 3.99094 6.67292C4.36427 6.29958 4.97094 6.29958 5.34427 6.67292L5.72927 7.05792L8.22594 4.56125C8.59927 4.18792 9.20594 4.18792 9.57927 4.56125C9.9526 4.93458 9.9526 5.54125 9.57927 5.91458L6.40594 9.08792C6.21927 9.26292 5.98594 9.36792 5.72927 9.36792Z" fill="#868C98" />
                  <path d="M5.72927 16.7175C5.48427 16.7175 5.23927 16.6242 5.0526 16.4375L3.99094 15.3759C3.6176 15.0025 3.6176 14.3959 3.99094 14.0225C4.36427 13.6492 4.97094 13.6492 5.34427 14.0225L5.72927 14.4075L8.22594 11.9109C8.59927 11.5375 9.20594 11.5375 9.57927 11.9109C9.9526 12.2842 9.9526 12.8909 9.57927 13.2642L6.40594 16.4375C6.21927 16.6242 5.97427 16.7175 5.72927 16.7175Z" fill="#868C98" />
                  <path d="M5.72927 23.7175C5.48427 23.7175 5.23927 23.6242 5.0526 23.4375L3.99094 22.3759C3.6176 22.0025 3.6176 21.3959 3.99094 21.0225C4.36427 20.6492 4.97094 20.6492 5.34427 21.0225L5.72927 21.4075L8.22594 18.9109C8.59927 18.5375 9.20594 18.5375 9.57927 18.9109C9.9526 19.2842 9.9526 19.8909 9.57927 20.2642L6.40594 23.4375C6.21927 23.6242 5.97427 23.7175 5.72927 23.7175Z" fill="#868C98" />
                </svg>

              </div>
              <h3 className={styles.verifyCardTitle}>Physical Inspection</h3>
              <ul className={styles.verifyList}>
                <li>Applicants attend an in-person interview conducted by the Drifully Operations team.</li>
                <li>Professionalism, communication skills, and customer service readiness are assessed.</li>
              </ul>
            </div>
            <div className={styles.verifyCard}>
              <div className={styles.verifyIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.9987 2.33301C7.57036 2.33301 2.33203 7.57134 2.33203 13.9997C2.33203 20.428 7.57036 25.6663 13.9987 25.6663C20.427 25.6663 25.6654 20.428 25.6654 13.9997C25.6654 7.57134 20.427 2.33301 13.9987 2.33301ZM19.5754 11.3163L12.9604 17.9313C12.797 18.0947 12.5754 18.188 12.342 18.188C12.1087 18.188 11.887 18.0947 11.7237 17.9313L8.42203 14.6297C8.0837 14.2913 8.0837 13.7313 8.42203 13.393C8.76036 13.0547 9.32036 13.0547 9.6587 13.393L12.342 16.0763L18.3387 10.0797C18.677 9.74134 19.237 9.74134 19.5754 10.0797C19.9137 10.418 19.9137 10.9663 19.5754 11.3163Z" fill="#00C950" />
                </svg>

              </div>
              <h3 className={styles.verifyCardTitle}>Final Approval</h3>
              <ul className={styles.verifyList}>
                <li>Applicants who successfully pass all verification stages are approved to join the platform.</li>
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
                <div style={{ position: 'relative', width: '100%', flex: 1 }}>
                  <Image src="/images/earning-1.png" alt="Register" fill style={{ objectFit: 'contain', borderRadius: '8px' }} />
                </div>
              </div>
              <div className={styles.earnStep} style={{ color: '#3b82f6' }}>01</div>
              <div style={{ color: '#111', fontSize: '0.9rem' }}>Register</div>
              <h3 className={styles.earnCardTitle}>Visit the Driver Registration <Link href="/driver-application" target="_blank" style={{ color: "#868C98" }}> Portal</Link> and complete the registration form.</h3>
            </div>

            <div className={styles.earnCard}>
              <div className={styles.earnImagePlaceholder}>
                <div style={{ position: 'relative', width: '271px', height: '179px', margin: '0 auto' }}>
                  <Image src="/images/earning-2.png" alt="Upload Your Documents" fill style={{ objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              </div>
              <div className={styles.earnStep} style={{ color: '#3b82f6' }}>02</div>
              <div style={{ color: '#111', fontSize: '0.9rem' }}>Upload Your Documents</div>
              <h3 className={styles.earnCardTitle}>Provide all required valid documents and personal information for verification.</h3>
              <ul className={styles.earnList}>
                <li>Government-issued ID</li>
                <li>Valid driver&apos;s licence</li>
                <li>Proof of address (if required)</li>
                <li>Any additional documents requested during registration</li>
              </ul>
            </div>

            <div className={styles.earnCard}>
              <div className={`${styles.earnImagePlaceholder} ${styles.earnImagePlaceholderFill}`}>
                <div style={{ position: 'relative', width: '100%', flex: 1 }}>
                  <Image src="/images/earning-3.png" alt="Attend Your Physical Interview" fill style={{ objectFit: 'cover', borderRadius: '10px' }} />
                </div>
              </div>
              <div className={styles.earnStep} style={{ color: '#8A2BE2' }}>03</div>
              <div style={{ color: '#111', fontSize: '0.9rem' }}>Attend Your Physical Interview</div>
              <h3 className={styles.earnCardTitle}>Eligible applicants will receive an invitation for an in-person interview after their documents have been reviewed.</h3>
            </div>

            <div className={styles.earnCard}>
              <div className={`${styles.earnImagePlaceholder} ${styles.earnImagePlaceholderFill}`}>
                <div style={{ position: 'relative', width: '100%', flex: 1 }}>
                  <Image src="/images/earning-4.png" alt="Get Verified & Start Driving" fill style={{ objectFit: 'cover', borderRadius: '10px' }} />
                </div>
              </div>
              <div className={styles.earnStep} style={{ color: '#8A2BE2' }}>04</div>
              <div style={{ color: '#111', fontSize: '0.9rem' }}>Get Verified &amp; Start Driving</div>
              <h3 className={styles.earnCardTitle}>Download or sign in to the Drifully Drivers app, complete your driver profile. Begin applying for available driving bookings.</h3>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.faqHeader}>
            <h2 className={styles.faqTitle}>
              Got questions about becoming a driver? We&apos;ve got answers.
            </h2>
          </div>
          <div className={styles.faqGrid}>
            <div className={styles.faqCard}>
              <div className={styles.faqNumber}>01</div>
              <div className={styles.faqContent}>
                <h3 className={styles.faqQ}>Can I cancel anytime?</h3>
                <p className={styles.faqA}>
                  Yes — you can cancel your subscription at any time. Your access will remain active until the billing cycle ends, and no additional charges will be applied.
                </p>
              </div>
            </div>
            <div className={styles.faqCard}>
              <div className={styles.faqNumber}>02</div>
              <div className={styles.faqContent}>
                <h3 className={styles.faqQ}>Do you offer discounts?</h3>
                <p className={styles.faqA}>
                  Yes — drivers receive a 30% discount on all plans. Verification is required with a valid enrollment document, and the discount is applied immediately.
                </p>
              </div>
            </div>
            <div className={styles.faqCard}>
              <div className={styles.faqNumber}>03</div>
              <div className={styles.faqContent}>
                <h3 className={styles.faqQ}>Is my data kept secure?</h3>
                <p className={styles.faqA}>
                  Yes — all customer data is encrypted and stored safely. We follow strict compliance standards, with regular audits to keep your information protected.
                </p>
              </div>
            </div>
            <div className={styles.faqCard}>
              <div className={styles.faqNumber}>04</div>
              <div className={styles.faqContent}>
                <h3 className={styles.faqQ}>Can I change my plan anytime?</h3>
                <p className={styles.faqA}>
                  Yes — you can upgrade or downgrade your plan anytime. The changes take effect immediately, and billing adjustments happen automatically.
                </p>
              </div>
            </div>
            <div className={styles.faqCard}>
              <div className={styles.faqNumber}>05</div>
              <div className={styles.faqContent}>
                <h3 className={styles.faqQ}>Do you provide onboarding guidance?</h3>
                <p className={styles.faqA}>
                  Yes — every customer receives onboarding guidance. Interactive demos and instructions are included to make setup smooth and easy.
                </p>
              </div>
            </div>
            <div className={styles.faqCard}>
              <div className={styles.faqNumber}>06</div>
              <div className={styles.faqContent}>
                <h3 className={styles.faqQ}>Is customer support available 24/7?</h3>
                <p className={styles.faqA}>
                  Yes — our support team is available around the clock. You can reach us by live chat or email anytime, with fast response times every single day.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.faqFooter}>
            <p className={styles.faqFooterText}>Still have questions? Our support team is ready to help</p>
            <Link href="/contact-us" className={styles.faqContactButton}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBackground}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, filter: "blur(46px)" }}>
            <Image src="/images/ready-1.png" alt="Background Layer 1" fill style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, filter: "blur(46px)" }}>
            <Image src="/images/ready-2.png" alt="Background Layer 2" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.ctaReadyBlur}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
            <p className={styles.ctaDesc}>
              Take the first step toward becoming a trusted Drifully driver today.
            </p>
            <Link href="/driver-application" className={styles.ctaButton}>
              Become A Driver
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
