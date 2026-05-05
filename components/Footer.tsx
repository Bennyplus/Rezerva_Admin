"use client";

import Link from "next/link";
import DownloadButtons from "./DownloadButtons";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles['footer']} aria-labelledby="footer-logo">
      {/* Background Watermark */}
      <div className={styles['footer__watermark']} aria-hidden="true">
        DRIFULLY
      </div>

      <div className={`container ${styles['footer__container']}`}>
        {/* Main Grid */}
        <div className={styles['footer__grid']}>
          {/* Brand & Apps column */}
          <div className={styles['footer__brand-col']} style={{ minWidth: "403px" }}>
            <Link href="/" className={styles['footer__logo-link']}>
              <span className={styles['footer__logo']} id="footer-logo">
                DRIFULLY
              </span>
            </Link>
            <p className={styles['footer__tagline']}>
              Wherever you&apos;re going, start with Drifully. <br />
              Download the app and take control of your next journey.
            </p>

            <DownloadButtons variant="footer" />
          </div>

          {/* Link columns */}
          <div className={styles['footer__column__grid']}>
            <div className={styles['footer__nav-col']}>
              <h3 className={styles['footer__col-title']}>Company</h3>
              <ul className={styles['footer__links']}>
                <li><Link href="/" className={styles['footer__link']}>Home</Link></li>
                <li><Link href="/about-us" className={styles['footer__link']}>About Us</Link></li>
                <li><Link href="/our-fleet" className={styles['footer__link']}>Our Fleet</Link></li>
                <li><Link href="/blog" className={styles['footer__link']}>Blog</Link></li>
                <li><Link href="/contact-us" className={styles['footer__link']}>Contact Us</Link></li>
              </ul>
            </div>

            <div className={styles['footer__nav-col']}>
              <h3 className={styles['footer__col-title']}>Legal</h3>
              <ul className={styles['footer__links']}>
                <li><Link href="/privacy" className={styles['footer__link']}>Privacy Policy</Link></li>
                <li><Link href="/terms" className={styles['footer__link']}>Terms & Conditions</Link></li>
                <li><Link href="/cancellation" className={styles['footer__link']}>Cancellation Policy</Link></li>
              </ul>
            </div>
          </div>


          {/* Newsletter column */}
          <div className={styles['footer__newsletter-col']}>
            <h3 className={styles['footer__col-title']}>Newsletter</h3>
            <p className={styles['footer__newsletter-text']}>
              Join our newsletter for exclusive offers and updates.
            </p>
            <form className={styles['footer__newsletter-form']} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email to get notified"
                className={styles['footer__newsletter-input']}
                required
              />
              <button type="submit" className={styles['footer__newsletter-btn']}>Join Now</button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar outside container for full-width background */}
      <div className={styles['footer__bottom']}>
        <div className={`container ${styles['footer__bottom-container']}`}>
          <p className={styles['footer__copy']}>
            © {year} Drifully. All rights reserved.
          </p>

          <div className={styles['footer__socials']}>
            <Link href="#" className={styles['footer__social-link']} aria-label="X">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>
            </Link>
            <Link href="#" className={styles['footer__social-link']} aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </Link>
            <Link href="#" className={styles['footer__social-link']} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.75 2h8.5C19.425 2 22 4.575 22 7.75v8.5c0 3.175-2.575 5.75-5.75 5.75h-8.5C4.575 22 2 19.425 2 16.25v-8.5C2 4.575 4.575 2 7.75 2zm0 1.5C5.405 3.5 3.5 5.405 3.5 7.75v8.5c0 2.345 1.905 4.25 4.25 4.25h8.5c2.345 0 4.25-1.905 4.25-4.25v-8.5c0-2.345-1.905-4.25-4.25-4.25h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

