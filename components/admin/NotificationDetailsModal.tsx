"use client";

import Image from "next/image";
import styles from "./NotificationDetailsModal.module.css";

interface NotificationDetailsModalProps {
  onClose: () => void;
  notification: any;
}

export default function NotificationDetailsModal({ onClose, notification }: NotificationDetailsModalProps) {
  // We'll mock the missing details to match the design for now, since ADMIN_NOTIFICATIONS
  // doesn't have all these fields yet.
  const details = {
    title: notification.title || "Drifully Funfair",
    recipients: notification.recipients || "All Users",
    cta: "Sign Up Now",
    content: "Fun Games and Prizes to Win",
    channel: notification.channel === "Email" ? "Email Notification" : notification.channel,
    createdOn: notification.createdOn || "30 March 2026",
    createdBy: "Prosper Edward",
    updatedOn: "--",
    lastUpdatedBy: "--",
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{details.title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Content Box */}
        <div className={styles.contentBox}>
          {/* Hero Image */}
          <div className={styles.heroImage}>
            <Image 
              src="/images/admin/notification-hero.jpg" 
              alt="Notification Hero" 
              fill 
              style={{ objectFit: "cover" }} 
              onError={(e) => {
                // Fallback if image doesn't exist
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop";
              }}
            />
          </div>

          {/* Details Section */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionTitle}>Details</h3>
            
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Title</span>
                <span className={styles.detailValue}>{details.title}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Recipients</span>
                <span className={styles.detailValue}>{details.recipients}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Call To Action</span>
                <span className={styles.detailValue}>{details.cta}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Content</span>
                <span className={styles.detailValue}>
                  {details.content}
                  <button className={styles.viewContentBtn}>
                    <EyeIcon />
                  </button>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Delivery Channel</span>
                <span className={styles.detailValue}>{details.channel}</span>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className={styles.timelineSection}>
            <div className={styles.timelineHeader}>
              TIMELINE
            </div>
            <div className={styles.timelineBody}>
              <div className={styles.timelineGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created On:</span>
                  <span className={styles.detailValue}>{details.createdOn}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created By:</span>
                  <span className={styles.detailValue}>{details.createdBy}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Updated On:</span>
                  <span className={styles.detailValue}>{details.updatedOn}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Updated By:</span>
                  <span className={styles.detailValue}>{details.lastUpdatedBy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.deactivateBtn}>Deactivate</button>
          <div className={styles.footerRight}>
            <button className={styles.sendBtn}>Send Notification</button>
            <button className={styles.editBtn}>Edit Notification</button>
          </div>
        </div>

      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
