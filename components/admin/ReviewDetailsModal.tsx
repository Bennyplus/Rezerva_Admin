"use client";

import { useEffect } from "react";
import { Review } from "@/data/admin-reviews";
import styles from "./ReviewDetailsModal.module.css";

interface ReviewDetailsModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
  onRemove: () => void;
}

export default function ReviewDetailsModal({ review, isOpen, onClose, onRemove }: ReviewDetailsModalProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>{review.customerName}</h2>
            <span className={`${styles.badge} ${review.status === "Published" ? styles.badgePublished : styles.badgeRemoved}`}>
              <span className={styles.badgeDot} />
              {review.status}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.sectionTitle}>Customer Details</h3>
          
          <div className={styles.grid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Name</span>
              <span className={styles.fieldValue}>{review.customerName}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Phone Number</span>
              <span className={styles.fieldValue}>{review.phone}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Date Posted</span>
              <span className={styles.fieldValue}>{review.datePosted}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Email</span>
              <span className={styles.fieldValue}>{review.email}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Rating</span>
              <span className={styles.fieldValue}>{review.starRating}</span>
            </div>
          </div>

          <div className={styles.reviewTextBlock}>
            <span className={styles.fieldLabel} style={{ display: "block", marginBottom: "8px" }}>Review</span>
            <p className={styles.reviewText}>{review.reviewText}</p>
          </div>

          {/* Related Booking */}
          <div className={styles.bookingSection}>
            <h3 className={styles.sectionTitle}>Related Booking</h3>
            <div className={styles.bookingGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Booking ID</span>
                <span className={styles.fieldValue}>{review.bookingId}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Booking Date</span>
                <span className={styles.fieldValue}>{review.bookingDate}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Vehicle Name</span>
                <span className={styles.fieldValue}>{review.vehicleName}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Booking Type</span>
                <span className={styles.fieldValue}>{review.bookingType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.removeBtn} onClick={onRemove}>
            Remove Review
          </button>
        </div>
      </div>
    </div>
  );
}
