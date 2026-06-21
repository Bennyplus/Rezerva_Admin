"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "@/app/(marketing)/blog/blog.module.css";

const heroImages = [
  "/images/blog-hero-image.jpg",
  "/images/blog-hero/Property 1=Frame 1984079717.png",
  "/images/blog-hero/Property 1=Frame 1984079718.png",
  "/images/blog-hero/Property 1=Frame 1984079719.png",
];

export default function BlogHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.hero}>
      {heroImages.map((img, index) => (
        <Image
          key={img}
          src={img}
          alt="Drifully blog hero"
          fill
          sizes="100vw"
          className={styles.heroImage}
          style={{
            opacity: currentSlide === index ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
          priority={index === 0}
          fetchPriority={index === 0 ? "high" : "auto"}
        />
      ))}
      <div className={styles.heroOverlay} />

      <div className="container" style={{ position: 'relative', width: '100%' }}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Stories, tips, and smarter ways to move</h1>
          <p className={styles.heroSubtitle}>Explore travel ideas, driving tips, and everything you need for a smoother ride.</p>

          <div className={styles.heroButtons}>
            <Link href="#" className={`${styles.appBtn} ${styles.googlePlayBtn}`}>
              <span className={styles.btnTextDesktop}>Get it on Google Play</span>
              <span className={styles.btnTextMobile}>Get it on Playstore</span>
              <Image src="/images/blog-google-play.png" alt="" width={18} height={18} />
            </Link>
            <Link href="#" className={`${styles.appBtn} ${styles.appStoreBtn}`}>
              Download on App Store <Image src="/images/blog-apple-store.png" alt="" width={18} height={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
