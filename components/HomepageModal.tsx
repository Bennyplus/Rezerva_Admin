"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./HomepageModal.module.css";

export default function HomepageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadLink, setDownloadLink] = useState("https://play.google.com/store/apps/details?id=com.drifully.app");

  useEffect(() => {
    // Open modal on homepage load
    setIsOpen(true);

    // Detect user OS for download link
    if (typeof window !== "undefined" && window.navigator) {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOS =
        /ipad|iphone|ipod/.test(userAgent) ||
        (window.navigator.maxTouchPoints &&
          window.navigator.maxTouchPoints > 2 &&
          /macintosh/.test(userAgent));
      if (isIOS) {
        setDownloadLink("https://apps.apple.com/ng/app/drifully/id6782419021");
      }
    }
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={() => setIsOpen(false)}
      role="presentation"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
        aria-describedby="modal-description"
      >
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={() => setIsOpen(false)}
          aria-label="Close modal"
        >
          <svg
            width="7"
            height="7"
            viewBox="0 0 7 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66667 0.333336L0.333336 6.66667M0.333336 0.333336L6.66667 6.66667"
              stroke="currentColor"
              strokeWidth="0.875"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Visual Mockup Section */}
        <div className={styles.visualCard} aria-hidden="true">
          <div className={styles.phonesWrapper}>
            {/* Background Phone */}
            <Image
              src="/images/iPhone 14 Pro-22.webp"
              alt="Drifully App Interface"
              width={270}
              height={540}
              priority
              className={styles.phoneBack}
            />

            {/* Foreground Phone */}
            <Image
              src="/images/iPhone 14 Pro.png"
              alt="Drifully Splash Screen"
              width={255}
              height={510}
              priority
              className={styles.phoneFront}
            />
          </div>
        </div>

        {/* Modal Content Group */}
        <div className={styles.contentGroup}>
          <h2 id="modal-heading" className={styles.heading}>
            Start Your Journey In Seconds
          </h2>

          <p id="modal-description" className={styles.description}>
            Book your next ride in seconds. Download the Drifully app for faster
            reservations, exclusive offers, and seamless rentals anytime,
            anywhere.
          </p>

          <a
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.downloadBtn}
          >
            Download App
          </a>
        </div>
      </div>
    </div>
  );
}
