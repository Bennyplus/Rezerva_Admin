"use client";

import { useEffect, useState } from "react";
import { AdminReview } from "@/services/reviews-service";
import styles from "./ViewReviewModal.module.css";

interface ViewReviewModalProps {
  review: AdminReview | null;
  isOpen: boolean;
  onClose: () => void;
  onRemove?: (id: string) => void;
  onFlag?: (id: string) => void;
}

export default function ViewReviewModal({
  review,
  isOpen,
  onClose,
  onRemove,
  onFlag,
}: ViewReviewModalProps) {
  const [copied, setCopied] = useState(false);

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

  if (!isOpen || !review) return null;

  const handleCopyTripId = async () => {
    try {
      await navigator.clipboard.writeText(review.tripId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy trip ID:", err);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>{review.reviewerName}</h2>
            <span
              className={`${styles.badge} ${
                review.status === "Active"
                  ? styles.badgeActive
                  : review.status === "Flagged"
                  ? styles.badgeFlagged
                  : styles.badgeRemoved
              }`}
            >
              <span className={styles.badgeDot} />
              {review.status}
            </span>
          </div>

          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
            id="close-view-review-modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.sectionTitle}>Review Details</h3>

          <div className={styles.detailsGrid}>
            {/* Row 1: Reviewer | Reviewed User | Trip ID */}
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Reviewer</span>
              <span className={styles.infoValue}>{review.reviewerName}</span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Reviewed User</span>
              <span className={styles.infoValue}>{review.reviewedUserName}</span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Trip ID</span>
              <span className={styles.infoValue}>
                {review.tripId}
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={handleCopyTripId}
                  title={copied ? "Copied!" : "Copy Trip ID"}
                  aria-label="Copy Trip ID"
                >
                  {copied ? <CheckmarkIcon /> : <CopyIcon />}
                </button>
              </span>
            </div>

            {/* Row 2: Reviewer User Type | Rating | Date Submitted */}
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Reviewer User Type</span>
              <span className={styles.infoValue}>{review.reviewerUserType}</span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Rating</span>
              <span className={styles.ratingValue}>
                <SolidBlueStarIcon /> {review.rating}
              </span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Date Submitted</span>
              <span className={styles.infoValue}>{review.dateSubmitted}</span>
            </div>
          </div>

          {/* Review Comment Section */}
          <div className={styles.commentSection}>
            <span className={styles.commentLabel}>Review Comment</span>
            <div className={styles.commentBox}>{review.reviewComment}</div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => {
              if (onRemove) onRemove(review.id);
            }}
            id="modal-remove-review-btn"
          >
            Remove Review
          </button>
          <button
            type="button"
            className={styles.flagBtn}
            onClick={() => {
              if (onFlag) onFlag(review.id);
            }}
            id="modal-flag-review-btn"
          >
            Flag Review
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── SVG Icons ─── */
function CloseIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SolidBlueStarIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="#2F68FE" stroke="#2F68FE" strokeWidth={1}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
