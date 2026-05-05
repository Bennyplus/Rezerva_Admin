import Link from "next/link";
import DownloadButtons from "./DownloadButtons";
import Image from "next/image";
import styles from "./CtaSection.module.css";

export default function CtaSection() {
  return (
    <div className="container">
      <section
        id="download"
        className={styles['cta-section']}
        aria-labelledby="cta-heading"
      >
        {/* Decorative Cubes */}
        <img
          src="/images/1stcube.png"
          alt=""
          className={`${styles['cta-section__cube']} ${styles['cta-section__cube--1']}`}
          aria-hidden="true"
        />
        <img
          src="/images/2ndcube.png"
          alt=""
          className={`${styles['cta-section__cube']} ${styles['cta-section__cube--2']}`}
          aria-hidden="true"
        />

        {/* Copy */}
        <div className={styles['cta-section__content']}>
          <h2 id="cta-heading" className={styles['cta-section__heading']}>
            Your ride is just a tap away
          </h2>
          <p className={styles['cta-section__sub']}>
            Download Drifully and start your journey today.
          </p>
          <DownloadButtons
            variant="cta"
            playIconSrc="/images/google-play.svg"
            appIconSrc="/images/apple.svg"
          />
        </div>

        {/* Phone visuals */}
        <div className={styles['cta-section__visual']} aria-hidden="true">
          {/* Back phone — app screen */}
          <img
            src="/images/first-iphone-image.png"
            alt="Drifully App Interface"
            className={`${styles['cta-phone-img']} ${styles['cta-phone-img--back']}`}
          />

          {/* Front phone — splash screen */}
          <img
            src="/images/second-iphone-image.png"
            alt="Drifully Splash Screen"
            className={`${styles['cta-phone-img']} ${styles['cta-phone-img--front']}`}
          />
        </div>
      </section>
    </div>
  );
}

function GooglePlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.18 23.76a2 2 0 0 0 2.25-.43l12.84-7.41-3.23-3.23L3.18 23.76zM21.37 10.22l-2.8-1.62-3.61 3.61 3.61 3.61 2.82-1.63a2.01 2.01 0 0 0 0-3.97zM2.01 1.15A2 2 0 0 0 2 2v20a2 2 0 0 0 .01.85l11.27-11.27L2.01 1.15zM18.27 2.66 5.43.06a2 2 0 0 0-2.25.44l11.66 11.66 3.43-3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
