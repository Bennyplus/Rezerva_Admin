"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { marketingService } from "@/services/marketing-service";
import { Faq } from "@/types/faq";
import styles from "@/app/(marketing)/about-us/page.module.css";

export default function AboutFaq() {
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

  const midpoint = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, midpoint);
  const rightColumn = faqs.slice(midpoint);

  return (
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
  );
}
