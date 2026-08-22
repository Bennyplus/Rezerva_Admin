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
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Helper to strip HTML tags from a string
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").trim();
  };

  // Helper to truncate to the first 6 words
  const getTruncatedContent = (html: string) => {
    const plainText = stripHtml(html);
    const words = plainText.split(/\s+/);
    if (words.length <= 6) return plainText;
    return words.slice(0, 6).join(" ") + "...";
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "--";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "--";
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "--";
    }
  };

  const formatRecipients = (type?: string, count?: number) => {
    if (!type) return count ? `${count} Users` : "All Users";
    switch (type.toLowerCase()) {
      case "all_users":
        return "All Users";
      case "drivers":
        return "Drivers";
      case "customers":
        return "Customers";
      case "specific_users":
      case "specific":
        return count ? `${count} Users` : "Specific Users";
      default:
        return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const formatChannel = (channel?: string) => {
    if (!channel) return "Email Notification";
    switch (channel.toLowerCase()) {
      case "email":
        return "Email Notification";
      case "push":
        return "Push Notification";
      case "in_app":
        return "In-App Notification";
      default:
        return channel.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

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

  const handleSend = async () => {
    if (!notificationId) return;
    setIsSending(true);
    try {
      await notificationsService.sendNotification(notificationId);
      onClose();
    } catch (error) {
      console.error("Failed to send notification:", error);
    } finally {
      setIsSending(false);
    }
  };

  const details = {
    title: notification?.title || "--",
    recipients: formatRecipients(notification?.recipient_type, notification?.recipient_count),
    cta: notification?.call_to_action || "None",
    content: notification?.message || "--",
    channel: formatChannel(notification?.delivery_channel),
    createdOn: formatDate(notification?.created_at),
    createdBy: notification?.created_by_name || "--",
    updatedOn: formatDate(notification?.updated_at),
    lastUpdatedBy: notification?.last_updated_by || "--",
  };

  const bannerImageSrc =
    notification?.media_attachment ||
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isLoading ? <div className={styles.skeletonText} style={{ width: '200px', height: '24px' }} /> : details.title}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Content Box */}
        <div className={styles.contentBox}>
          {isLoading ? (
            <div className={styles.skeletonContainer}>
              <div className={styles.skeletonBox} style={{ height: '180px', marginBottom: '24px' }} />
              <div className={styles.skeletonText} style={{ width: '100px', height: '20px', marginBottom: '16px' }} />
              <div className={styles.skeletonText} style={{ width: '100%', height: '18px', marginBottom: '12px' }} />
              <div className={styles.skeletonText} style={{ width: '100%', height: '18px', marginBottom: '12px' }} />
              <div className={styles.skeletonText} style={{ width: '80%', height: '18px', marginBottom: '24px' }} />
            </div>
          ) : (
            <>
              {/* Hero Banner Image */}
              <div className={styles.heroImage}>
                <Image 
                  src={bannerImageSrc} 
                  alt="Notification Media Banner" 
                  fill 
                  priority
                  style={{ objectFit: "cover" }} 
                  unoptimized={bannerImageSrc.startsWith("http")}
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
                  <div className={styles.detailItem} style={isContentExpanded ? { gridColumn: '1 / -1' } : {}}>
                    <span className={styles.detailLabel}>Content</span>
                    <div className={styles.detailValue} style={{ alignItems: isContentExpanded ? 'flex-start' : 'center' }}>
                      <div style={isContentExpanded ? { flex: 1, overflow: 'hidden' } : {}}>
                        {isContentExpanded ? (
                          <div dangerouslySetInnerHTML={{ __html: details.content }} />
                        ) : (
                          getTruncatedContent(details.content)
                        )}
                      </div>
                      <button 
                        className={styles.viewContentBtn}
                        onClick={() => setIsContentExpanded(!isContentExpanded)}
                        title={isContentExpanded ? "Collapse preview" : "Expand preview"}
                        aria-label="Toggle preview"
                      >
                        <EyeIcon />
                      </button>
                    </div>
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
          <button className={styles.deactivateBtn} onClick={onClose} disabled={isLoading || isSending}>
            Deactivate
          </button>
          <div className={styles.footerRight}>
            <button className={styles.sendBtn} onClick={handleSend} disabled={isLoading || isSending}>
              {isSending ? "Sending..." : "Send Notification"}
            </button>
            <button className={styles.editBtn} onClick={onClose} disabled={isLoading || isSending}>
              Edit Notification
            </button>
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
