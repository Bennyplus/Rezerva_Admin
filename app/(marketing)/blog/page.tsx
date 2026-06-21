"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./blog.module.css";

const heroImages = [
  "/images/blog-hero-image.jpg",
  "/images/blog-hero/Property 1=Frame 1984079717.png",
  "/images/blog-hero/Property 1=Frame 1984079718.png",
  "/images/blog-hero/Property 1=Frame 1984079719.png",
];

export default function BlogPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className={styles.heroContainer}>
          <div className={styles.hero}>
            {heroImages.map((img, index) => (
              <Image
                key={img}
                src={img}
                alt="Drifully blog hero"
                fill
                className={styles.heroImage}
                style={{
                  opacity: currentSlide === index ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                }}
                priority={index === 0}
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
        </section>

        <div className="container">
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Top Blogs</h2>
              <p className={styles.sectionDesc}>A curated selection of must-read articles to help you move smarter and travel better</p>
            </div>

            <div className={styles.topBlogsGrid}>
              <Link href="/blog/how-to-get-started" className={`${styles.card} ${styles.mainBlogCard}`}>
                <div className={styles.cardImageWrapper}>
                  <Image
                    src="/images/blog-1st-image.jpg"
                    alt="Getting started with Drifully"
                    fill
                    className={styles.cardImage}
                  />
                </div>
                <h3 className={styles.cardTitle}>Getting started with Drifully</h3>
                <p className={styles.cardDesc}>New to Drifully? Here's a quick guide to help you book your first ride with ease</p>
                <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
              </Link>

              <div className={styles.sideBlogCards}>
                <Link href="#" className={styles.horizontalCard}>
                  <div className={styles.cardImageWrapper}>
                    <Image
                      src="/images/blog-2nd-image.jpg"
                      alt="The easiest way to get from the airport without stress"
                      fill
                      className={styles.cardImage}
                    />
                  </div>
                  <div className={styles.horizontalCardContent}>
                    <h3 className={styles.cardTitle}>The easiest way to get from the airport without stress</h3>
                    <p className={styles.cardDesc}>Skip the confusion and long waits—here's how to arrive smoothly and comfortably.</p>
                    <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
                  </div>
                </Link>

                <Link href="#" className={styles.horizontalCard}>
                  <div className={styles.cardImageWrapper}>
                    <Image
                      src="/images/blog-3rd-image.jpg"
                      alt="Everything you need to know before your first self-drive"
                      fill
                      className={styles.cardImage}
                    />
                  </div>
                  <div className={styles.horizontalCardContent}>
                    <h3 className={styles.cardTitle}>Everything you need to know before your first self-drive</h3>
                    <p className={styles.cardDesc}>From picking the right car to hitting the road with confidence, here's how to make your first self-drive smooth and stress-free.</p>
                    <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          <section className={styles.section} style={{ paddingTop: '240px' }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Insights for every journey</h2>
              <p className={styles.sectionDesc}>Explore travel tips, driving guides, and smarter ways to move — designed to make every trip easier and more enjoyable</p>
            </div>

            <div className={styles.insightsGrid}>
              <Link href="#" className={`${styles.card} ${styles.insightCard}`}>
                <div className={styles.cardImageWrapper}>
                  <Image src="/images/blog-4th-image.jpg" alt="What to expect when booking a chauffeur" fill className={styles.cardImage} />
                </div>
                <h3 className={styles.cardTitle}>What to expect when booking a chauffeur</h3>
                <p className={styles.cardDesc}>Enjoy a seamless, comfortable ride with a professional driver—here's how it works from start to finish.</p>
                <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
              </Link>

              <Link href="#" className={`${styles.card} ${styles.insightCard}`}>
                <div className={styles.cardImageWrapper}>
                  <Image src="/images/blog-5th-image.jpg" alt="Drive yourself vs chauffeur services on Drifully" fill className={styles.cardImage} />
                </div>
                <h3 className={styles.cardTitle}>Drive yourself vs chauffeur services on Drifully</h3>
                <p className={styles.cardDesc}>Take control of the wheel or sit back and enjoy the ride—Drifully gives you both, effortlessly.</p>
                <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
              </Link>

              <Link href="#" className={`${styles.card} ${styles.insightCard}`}>
                <div className={styles.cardImageWrapper}>
                  <Image src="/images/blog-6th-image.jpg" alt="Top places to go in the UK" fill className={styles.cardImage} />
                </div>
                <h3 className={styles.cardTitle}>Top places to go in the UK</h3>
                <p className={styles.cardDesc}>A curated guide to the UK's must-visit spots, where every stop is worth the journey.</p>
                <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
              </Link>

              <Link href="#" className={`${styles.card} ${styles.insightCard}`}>
                <div className={styles.cardImageWrapper}>
                  <Image src="/images/blog-7th-image.jpg" alt="How to plan a smooth and stress-free road trip" fill className={styles.cardImage} />
                </div>
                <h3 className={styles.cardTitle}>How to plan a smooth and stress-free road trip</h3>
                <p className={styles.cardDesc}>A few simple steps can turn your trip into a seamless and enjoyable experience from start to finish.</p>
                <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
              </Link>

              <Link href="#" className={`${styles.card} ${styles.insightCard}`}>
                <div className={styles.cardImageWrapper}>
                  <Image src="/images/blog-8th-image.jpg" alt="How to book a car in minutes with Drifully" fill className={styles.cardImage} />
                </div>
                <h3 className={styles.cardTitle}>How to book a car in minutes with Drifully</h3>
                <p className={styles.cardDesc}>No long processes—just a fast, simple way to get the ride you need, when you need it.</p>
                <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
              </Link>

              <Link href="#" className={`${styles.card} ${styles.insightCard}`}>
                <div className={styles.cardImageWrapper}>
                  <Image src="/images/blog-9th-image.jpg" alt="Why professionals choose chauffeur services" fill className={styles.cardImage} />
                </div>
                <h3 className={styles.cardTitle}>Why professionals choose chauffeur services</h3>
                <p className={styles.cardDesc}>From convenience to presentation, here's why it's the smarter way to move for business.</p>
                <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
