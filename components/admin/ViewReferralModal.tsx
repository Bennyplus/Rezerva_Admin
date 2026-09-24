"use client";

import { useEffect, useState } from "react";
import { AdminReferral } from "@/services/referrals-service";
import styles from "./ViewReferralModal.module.css";

interface ViewReferralModalProps {
  referral: AdminReferral | null;
  isOpen: boolean;
  onClose: () => void;
  onSuspend?: (id: string | number) => void;
  onReinstate?: (id: string | number) => void;
  onMarkAsFraud?: (id: string | number) => void;
}

export default function ViewReferralModal({
  referral,
  isOpen,
  onClose,
  onSuspend,
  onReinstate,
  onMarkAsFraud,
}: ViewReferralModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  if (!isOpen || !referral) return null;

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const referralCode = referral.referralCode || "ProsperEddy01";
  const referrerTxId = referral.referrerTxId || "KP-123-2344";
  const referredTxId = referral.referredTxId || "KP-123-2344";
  const isSuccessful = referral.status === "Successful";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-referral-title"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 id="modal-referral-title" className={styles.title}>
              {referral.referralId}
            </h2>
            <span
              className={`${styles.badge} ${
                isSuccessful ? styles.badgeSuccessful : styles.badgeFailed
              }`}
            >
              <span className={styles.badgeDot} />
              {referral.status}
            </span>
          </div>

          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <CircleCloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Section: Referral Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Referral Information</h3>

            <div className={styles.grid3}>
              {/* Row 1 */}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Referrer</span>
                <span className={styles.infoValue}>{referral.referrer}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Referred User</span>
                <span className={styles.infoValue}>{referral.referredUser}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Referral Code</span>
                <span className={styles.infoValue}>
                  {referralCode}
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy("refCode", referralCode)}
                    title={copiedKey === "refCode" ? "Copied!" : "Copy Referral Code"}
                    aria-label="Copy Referral Code"
                  >
                    {copiedKey === "refCode" ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </span>
              </div>

              {/* Row 2 */}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Referral Date</span>
                <span className={styles.infoValue}>
                  {referral.referralDate || "11 Jun 2026 11:12 PM"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fraud Flag</span>
                <span className={styles.infoValue}>{referral.fraudFlag}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Reward Amount</span>
                <span className={styles.infoValue}>
                  {referral.reward.replace("£", "N") || "N2000"}
                </span>
              </div>
            </div>
          </div>

          {/* Section Banner: TIMELINE */}
          <div className={styles.timelineBanner}>Timeline</div>

          {/* Section: Timeline Content */}
          <div className={styles.timelineContent}>
            <div className={styles.grid3}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Reward Credited On</span>
                <span className={styles.infoValue}>
                  {referral.rewardCreditedOn || "30 March 2026"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Transaction ID Referrer</span>
                <span className={styles.infoValue}>
                  {referrerTxId}
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy("refTx", referrerTxId)}
                    title={copiedKey === "refTx" ? "Copied!" : "Copy Transaction ID"}
                    aria-label="Copy Transaction ID Referrer"
                  >
                    {copiedKey === "refTx" ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Transaction ID Referred</span>
                <span className={styles.infoValue}>
                  {referredTxId}
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy("refUserTx", referredTxId)}
                    title={copiedKey === "refUserTx" ? "Copied!" : "Copy Transaction ID"}
                    aria-label="Copy Transaction ID Referred"
                  >
                    {copiedKey === "refUserTx" ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {isSuccessful ? (
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                if (onSuspend) onSuspend(referral.id);
                onClose();
              }}
            >
              Suspend Referral
            </button>
          ) : (
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                if (onReinstate) onReinstate(referral.id);
                onClose();
              }}
            >
              Reinstate Referral
            </button>
          )}

          <button
            type="button"
            className={styles.btnDark}
            onClick={() => {
              if (onMarkAsFraud) onMarkAsFraud(referral.id);
              onClose();
            }}
          >
            Mark As Fraud
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── SVG Icons ─── */
function CircleCloseIcon() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#12B76A"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
