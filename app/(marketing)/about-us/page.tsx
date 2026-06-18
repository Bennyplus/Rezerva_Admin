"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { marketingService } from "@/services/marketing-service";
import { Faq } from "@/types/faq";
import styles from "./page.module.css";

export default function AboutUsPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await marketingService.getFaqs();
        setFaqs(data);
      } catch (err: any) {
        setError("Failed to load FAQs.");
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Split FAQs into two columns
  const midpoint = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, midpoint);
  const rightColumn = faqs.slice(midpoint);

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className={styles['about-hero']}>
          <div className={`container ${styles['about-hero__container']}`}>
            <div className={styles['about-hero__content']}>
              <h1 className={styles['about-hero__title']}>Move freely. <br />Arrive effortlessly.</h1>
              <p className={styles['about-hero__desc']}>
                Every journey matters, whether it's a quick ride across town, a family trip, or a moment that needs to feel just right.
                <br />
                Drifully exists to make every move simple, smooth, and entirely yours.
              </p>
              <div className={styles['about-hero__actions']}>
                <Link
                  href="/download"
                  className={`btn ${styles['about-hero__download-btn']}`}
                >
                  Download The App
                </Link>
                <Link href="#story" className="btn btn-ghost-white" style={{ padding: '10px', fontWeight: '500' }}>
                  Learn About Drifully
                </Link>
              </div>
              <p className={styles['about-hero__meta']}>Safe, reliable, and always there when you need us</p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="story" className={styles['about-story']}>
          <div className="container">
            <div className={styles['about-story__grid']}>
              {/* Left Column */}
              <div className={styles['about-story__left-col']}>
                <h2 className={styles['about-story__title']}>Our Story</h2>
                <p className="about-story__lead">
                  Getting around shouldn't feel <span className={styles['about-story__muted-text']}>complicated</span>.<br />
                  It shouldn't involve <span className={styles['about-story__muted-text']}>stress, uncertainty, or wasted time.</span>
                </p>
                <Image
                  src="/images/our-story-img1.jpg"
                  alt="Woman with coffee checking her phone"
                  width={500}
                  height={400}
                  className={styles['about-story__main-img']}
                  priority
                />
                <p className={styles['about-story__bottom-text']}>No compromises. Just options that fit your life.</p>
              </div>

              {/* Right Column */}
              <div className={styles['about-story__right-col']}>
                <p className={`${styles['about-story__text']} ${styles['about-story__text--top-margin']}`}>
                  Drifully was built on a simple idea:<br />
                  <strong>You deserve a better</strong> way to move. A way that gives you control when you want it, and <strong>comfort</strong> when you need it.
                </p>

                <div className={styles['about-story__composite']}>
                  <div className={styles['about-story__composite-left']}>
                    <Image
                      src="/images/our-story-img2.jpg"
                      alt="Happy friends in a car"
                      width={350}
                      height={250}
                      className={styles['about-story__composite-img']}
                    />
                  </div>
                  <div className={styles['about-story__composite-right']}>
                    <p className={styles['about-story__composite-text']}>
                      Some days, you want the wheel. Other days, you just want to sit back and enjoy the ride.
                    </p>
                    <Image
                      src="/images/our-story-img3.jpg"
                      alt="Family road trip"
                      width={250}
                      height={150}
                      className={styles['about-story__composite-img-small']}
                    />
                  </div>
                </div>

                <div className={styles['about-story__text-wrapper']}>
                  <p className={`${styles['about-story__text']} ${styles['about-story__text--spaced-margin']}`}>
                    With Drifully, <strong>you choose</strong>.
                  </p>
                  <ul className={styles['about-arrival__list']} style={{ marginTop: 0 }}>
                    <li className={styles['about-arrival__list-item']}>Drive yourself when you want freedom and control</li>
                    <li className={styles['about-arrival__list-item']}>Ride with a chauffeur when you want ease and peace of mind</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className={styles['about-mission']}>
          <div className="container">
            <div className={styles['about-mission__grid']}>
              <h2 className={styles['about-mission__title']}>OUR MISSION</h2>
              <div className={styles['about-mission__content']}>
                <p>
                  To remove the friction from moving, and replace it with freedom, confidence, and ease. We believe getting from one place to another should feel effortless. Not stressful. Not complicated. Not uncertain.
                </p>
                <p>
                  So we're building a platform where every detail is considered, from the moment you book, to the moment you arrive. Where you don't have to think twice about availability, worry about reliability, or second-guess your choice.
                </p>
                <p className={styles['about-mission__highlight']}>
                  Just open the app, choose your ride, and go.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Arrival & Trust Section */}
        <section className={styles['about-arrival']}>
          <div className="container">
            <div className={styles['about-arrival__grid']}>
              <div className={styles['about-arrival__img-composite']}>
                <Image
                  src="/images/handsome-man-w.png"
                  alt="Man in suit opening car door"
                  width={300}
                  height={500}
                  className={styles['about-arrival__img-large']}
                />
                <div className={styles['about-arrival__img-stack']}>
                  <Image
                    src="/images/couple-w.png"
                    alt="Couple enjoying a ride"
                    width={240}
                    height={245}
                    className={styles['about-arrival__img-small']}
                  />
                  <Image
                    src="/images/last-car-img-w.png"
                    alt="Premium car in garage"
                    width={240}
                    height={245}
                    className={styles['about-arrival__img-small']}
                  />
                </div>
              </div>

              <div className={styles['about-arrival__content']}>
                <div>
                  <h2 className={styles['about-arrival__section-title']}>From Arrival To Anywhere</h2>
                  <p className={styles['about-story__text']}>
                    Travel should feel seamless from the moment you land.
                    <br />
                    <strong>We make that possible.</strong>
                  </p>
                  <p className={`${styles['about-story__text']} ${styles['about-story__text--muted']}`}>
                    Step out of the airport and into a clean, ready vehicle, fully fueled and waiting, so you can go straight to where you need to be.
                  </p>
                  <p className={`${styles['about-story__text']} ${styles['about-story__text--tight-margin']}`}>
                    No delays. No confusion. Just movement.
                  </p>
                </div>

                <div>
                  <h2 className={styles['about-arrival__section-title']}>Built With Trust</h2>
                  <p className={styles['about-story__text']}>
                    We know what matters:
                  </p>
                  <ul className={styles['about-arrival__list']}>
                    <li className={styles['about-arrival__list-item']}>A car that's ready when you are</li>
                    <li className={styles['about-arrival__list-item']}>A process that doesn't waste your time</li>
                    <li className={styles['about-arrival__list-item']}>A service you can rely on, every single time</li>
                  </ul>
                  <p className={`${styles['about-story__text']} ${styles['about-story__text--base-margin']}`}>
                    So we've built Drifully to be exactly that, <span style={{ fontWeight: 600, color: "var(--color-primary)" }}> simple, dependable, and always ready</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles['about-faq']}>
          <div className="container">
            <div className={styles['about-faq__header']}>
              <h2 className={styles['about-faq__title']}>Frequently Asked Questions</h2>
              <p className={styles['about-faq__subtitle']}>Got Questions? We've Got Clear Answers.</p>
            </div>

            {loading ? (
              <div className={styles['loading-container']}>
                <div className={styles.spinner}></div>
              </div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : faqs.length === 0 ? (
              <div className={styles.empty}>No FAQs available.</div>
            ) : (
              <div className={styles['about-faq__grid']}>
                {/* Left Column */}
                <div className={styles['about-faq__col']}>
                  {leftColumn.map((item, index) => {
                    const globalIndex = index;
                    const isOpen = openFaqIndex === globalIndex;
                    return (
                      <div
                        key={item.id}
                        className={styles['about-faq__item']}
                        data-open={isOpen ? "true" : "false"}
                      >
                        <button
                          className={styles['about-faq__question']}
                          onClick={() => toggleFaq(globalIndex)}
                          aria-expanded={isOpen}
                        >
                          {item.question}
                          <span className={styles['about-faq__icon']}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </button>
                        <div className={styles['about-faq__answer']}>
                          <div className={styles['about-faq__answer-inner']}>
                            <p className={styles['about-faq__answer-text']}>{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column */}
                <div className={styles['about-faq__col']}>
                  {rightColumn.map((item, index) => {
                    const globalIndex = index + midpoint;
                    const isOpen = openFaqIndex === globalIndex;
                    return (
                      <div
                        key={item.id}
                        className={styles['about-faq__item']}
                        data-open={isOpen ? "true" : "false"}
                      >
                        <button
                          className={styles['about-faq__question']}
                          onClick={() => toggleFaq(globalIndex)}
                          aria-expanded={isOpen}
                        >
                          {item.question}
                          <span className={styles['about-faq__icon']}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </button>
                        <div className={styles['about-faq__answer']}>
                          <div className={styles['about-faq__answer-inner']}>
                            <p className={styles['about-faq__answer-text']}>{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles['about-faq__cta']}>
              <p>
                Still have questions? Our support team is ready to help
              </p>
              <Link href="/contact-us" className={`btn btn-primary ${styles['contact-btn']}`}>
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main >

      <Footer />
    </>
  );
}
