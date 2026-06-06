"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./NotificationDetailsModal.module.css";
import { notificationsService } from "@/services/notifications-services";

interface NotificationDetailsModalProps {
  onClose: () => void;
  notificationId: string;
}

export default function NotificationDetailsModal({ onClose, notificationId }: NotificationDetailsModalProps) {
  const [notification, setNotification] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const data = await notificationsService.getNotificationById(notificationId);
        setNotification(data);
      } catch (error) {
        console.error("Failed to fetch notification details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [notificationId]);

  const details = {
    title: notification?.title || "--",
    recipients: notification?.recipient_count?.toString() || "0",
    cta: notification?.call_to_action || "None",
    content: notification?.message || "--",
    channel: notification?.delivery_channel === "email" ? "Email Notification" : "Push Notification",
    createdOn: notification?.created_at ? new Date(notification.created_at).toLocaleDateString('en-GB') : "--",
    createdBy: notification?.created_by_name || "--",
    updatedOn: notification?.updated_at ? new Date(notification.updated_at).toLocaleDateString('en-GB') : "--",
    lastUpdatedBy: "--",
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isLoading ? <div className={styles.skeletonText} style={{ width: '200px', height: '28px' }} /> : details.title}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Content Box */}
        <div className={styles.contentBox}>
          {isLoading ? (
            <div className={styles.skeletonContainer}>
              <div className={styles.skeletonBox} style={{ height: '160px', marginBottom: '24px' }} />
              <div className={styles.skeletonText} style={{ width: '100px', height: '24px', marginBottom: '16px' }} />
              <div className={styles.skeletonText} style={{ width: '100%', height: '20px', marginBottom: '12px' }} />
              <div className={styles.skeletonText} style={{ width: '100%', height: '20px', marginBottom: '12px' }} />
              <div className={styles.skeletonText} style={{ width: '80%', height: '20px', marginBottom: '24px' }} />
            </div>
          ) : (
            <>
              {/* Hero Image */}
              {notification?.media_attachment && (
                <div className={styles.heroImage}>
                  <Image 
                    src={notification.media_attachment} 
                    alt="Notification Hero" 
                    fill 
                    style={{ objectFit: "cover" }} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop";
                    }}
                  />
                </div>
              )}

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
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.deactivateBtn} disabled={isLoading}>Deactivate</button>
          <div className={styles.footerRight}>
            <button className={styles.sendBtn} disabled={isLoading}>Send Notification</button>
            <button className={styles.editBtn} disabled={isLoading}>Edit Notification</button>
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
