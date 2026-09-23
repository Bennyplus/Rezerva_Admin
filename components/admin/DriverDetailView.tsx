"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { type Driver, driversService } from "@/services/drivers-service";
import SuspendDriverModal from "./SuspendDriverModal";
import ConfirmActionModal from "./ConfirmActionModal";
import styles from "./DriverDetailView.module.css";

interface DriverDetailViewProps {
  driver: Driver;
  onBack: () => void;
  onSuspend: (id: string) => void;
  onDeactivate?: (id: string) => void;
}

export default function DriverDetailView({
  driver,
  onBack,
  onSuspend,
  onDeactivate,
}: DriverDetailViewProps) {
  const [detailData, setDetailData] = useState<Driver>(driver);
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDetails() {
      try {
        setIsLoading(true);
        const data = await driversService.getDriverDetails(driver.id);
        if (isMounted && data) {
          setDetailData(data);
        }
      } catch (err) {
        console.error("Failed to load driver details:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [driver.id]);

  const current = detailData || driver;

  /* ─── Handlers ─── */
  const handleSuspendConfirm = async (reason: string) => {
    try {
      await driversService.suspendUser(current.id, reason);
      setDetailData((prev) => ({
        ...prev,
        status: "Suspended" as const,
      }));
      onSuspend(current.id);
      setIsSuspendOpen(false);
    } catch (err) {
      console.error("Failed to suspend user:", err);
      throw err;
    }
  };

  const handleVerifyConfirm = async () => {
    try {
      setIsActionLoading(true);
      await driversService.verifyUser(current.id);
      setDetailData((prev) => ({
        ...prev,
        verificationStatus: "Verified" as const,
        status: "Active" as const,
      }));
      setIsVerifyOpen(false);
    } catch (err) {
      console.error("Failed to verify user:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeclineConfirm = async () => {
    setIsActionLoading(true);
    setDetailData((prev) => ({
      ...prev,
      verificationStatus: "Unverified" as const,
      status: "Inactive" as const,
    }));
    setIsDeclineOpen(false);
    setIsActionLoading(false);
  };

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button
          className={styles.backBtn}
          onClick={onBack}
          id="driver-detail-back"
          aria-label="Go back"
        >
          <BackArrowIcon />
        </button>
        <div className={styles.topActions}>
          <button
            className={styles.deactivateBtn}
            onClick={() => onDeactivate && onDeactivate(current.id)}
            id="driver-detail-deactivate"
          >
            Deactivate Driver
          </button>
          <button
            className={styles.suspendBtn}
            onClick={() => setIsSuspendOpen(true)}
            id="driver-detail-suspend"
          >
            Suspend Driver
          </button>
        </div>
      </div>

      {/* Main layout: left profile + right stats */}
      <div className={styles.layout}>
        {/* ─── Left Panel ─── */}
        <div className={styles.leftPanel}>
          {/* Driver photo banner */}
          <div className={styles.photoWrap}>
            <Image
              src={current.avatar || "/images/man-img.png"}
              alt={current.name}
              width={500}
              height={300}
              className={styles.photo}
              priority
              unoptimized={Boolean(current.avatar?.startsWith("http"))}
            />
          </div>

          {/* Basic info — 3-column / 4-row grid */}
          <div className={styles.infoGrid}>
            {/* Row 1: Name | Phone Number | Account Status */}
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Name</span>
              <span className={styles.infoValue}>{current.name}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Phone Number</span>
              <span className={styles.infoValue}>{current.phone}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Account Status</span>
              <div>
                <DriverStatusBadge status={current.status} />
              </div>
            </div>

            {/* Row 2: Email | Verification Status | License Status */}
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{current.email}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Verification Status</span>
              <div>
                <VerificationStatusBadge status={current.verificationStatus} />
              </div>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>License Status</span>
              <span className={styles.infoValue}>{current.licenseStatus || "Valid"}</span>
            </div>

            {/* Row 3: Rating | Total Trips | Account Number */}
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Rating</span>
              <span className={styles.ratingValue}>
                <SolidBlueStarIcon /> {current.rating?.toFixed(1) || "4.5"}
              </span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Total Trips</span>
              <span className={styles.infoValue}>{current.totalTrips ?? 0}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Account Number</span>
              <span className={styles.infoValue}>
                {current.accountNumber || "123456789098"}
              </span>
            </div>

            {/* Row 4: Bank Name */}
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Bank Name</span>
              <span className={styles.infoValue}>{current.bankName || "Zenith"}</span>
            </div>
            <div />
            <div />
          </div>

          {/* Documents Section */}
          <div className={styles.docsSection}>
            <div className={styles.docsGrid}>
              {/* Drivers License */}
              <div className={styles.docBlock}>
                <span className={styles.docBlockLabel}>Drivers License</span>
                <div
                  className={styles.docTile}
                  onClick={() => {
                    if (current.documents?.driversLicense?.url) {
                      window.open(current.documents.driversLicense.url, "_blank");
                    }
                  }}
                >
                  <PdfBadgeIcon />
                  <div className={styles.docInfo}>
                    <span className={styles.docName}>
                      {current.documents?.driversLicense?.filename || "my-cv.pdf"}
                    </span>
                    <span className={styles.docMeta}>
                      0 KB of {current.documents?.driversLicense?.size || "120 KB"} •
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle Documents */}
              <div className={styles.docBlock}>
                <span className={styles.docBlockLabel}>Vehicle Documents</span>
                <div
                  className={styles.docTile}
                  onClick={() => {
                    if (current.documents?.vehicleDocuments?.url) {
                      window.open(current.documents.vehicleDocuments.url, "_blank");
                    }
                  }}
                >
                  <PdfBadgeIcon />
                  <div className={styles.docInfo}>
                    <span className={styles.docName}>
                      {current.documents?.vehicleDocuments?.filename || "my-cv.pdf"}
                    </span>
                    <span className={styles.docMeta}>
                      0 KB of {current.documents?.vehicleDocuments?.size || "120 KB"} •
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (Screenshot 2) */}
          <div className={styles.quickActionsSection}>
            <h4 className={styles.quickActionsTitle}>Quick Actions</h4>
            <div className={styles.quickActionsRow}>
              <button
                className={styles.verifyBtn}
                onClick={() => setIsVerifyOpen(true)}
                id="driver-verify-action-btn"
              >
                Verify Driver
              </button>
              <button
                className={styles.declineBtn}
                onClick={() => setIsDeclineOpen(true)}
                id="driver-decline-action-btn"
              >
                Decline
              </button>
            </div>
          </div>
        </div>

        {/* ─── Right Panel ─── */}
        <div className={styles.rightPanel}>
          {/* Performance */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Performance</h3>
            <div className={styles.perfGrid}>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>Total Trips</span>
                <span className={styles.perfValue}>{current.totalTrips ?? 0}</span>
              </div>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>
                  Reports <InfoIcon />
                </span>
                <span className={styles.perfValue}>{current.reports || 0}</span>
              </div>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>Ratings</span>
                <span className={styles.perfValue}>
                  {current.rating?.toFixed(1) || "4.5"}
                </span>
              </div>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>Total Earnings</span>
                <span className={styles.perfValue}>
                  {current.totalEarnings || "$0.00"}
                </span>
              </div>
            </div>
          </section>

          {/* Trips History */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Trips History</h3>
            <div className={styles.tripsScrollContainer}>
              <div className={styles.tripsList}>
                {!current.tripsHistory || current.tripsHistory.length === 0 ? (
                  <p className={styles.emptyHistory}>No trips history found.</p>
                ) : (
                  current.tripsHistory.map((trip, idx) => (
                    <div key={trip.id || idx} className={styles.tripCard}>
                      <div className={styles.tripRoute}>
                        <span>{trip.pickup || "Frebson Fitness Gym"}</span>
                        <RouteArrowIcon />
                        <span>{trip.destination || "CMS Bus Stop Lagos Island"}</span>
                      </div>
                      <div className={styles.tripMetaRow}>
                        <div className={styles.tripMetaLeft}>
                          <span className={styles.tripMetaItem}>
                            <CalendarIcon /> {trip.date || "30 Mar 2026"}
                          </span>
                          <span className={styles.tripMetaItem}>
                            <ClockIcon /> {trip.time || "10:30AM"}
                          </span>
                        </div>
                        <TripStatusBadge status={trip.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Confirmation Modals (Screenshots 1 & 3) */}
      <SuspendDriverModal
        isOpen={isSuspendOpen}
        onDismiss={() => setIsSuspendOpen(false)}
        onConfirm={handleSuspendConfirm}
      />

      <ConfirmActionModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        onConfirm={handleVerifyConfirm}
        title="Verify Driver"
        message="Are you sure you want to verify this driver?"
        confirmText="Verify Driver"
        variant="blue"
        isLoading={isActionLoading}
      />

      <ConfirmActionModal
        isOpen={isDeclineOpen}
        onClose={() => setIsDeclineOpen(false)}
        onConfirm={handleDeclineConfirm}
        title="Decline Driver"
        message="Are you sure you want to decline this driver?"
        confirmText="Decline Driver"
        variant="danger"
        isLoading={isActionLoading}
      />
    </div>
  );
}

/* ─── Status Badges ─── */
function DriverStatusBadge({ status }: { status: string }) {
  if (status === "Suspended") {
    return <span className={`${styles.badge} ${styles.badgeSuspended}`}>Suspended</span>;
  }
  if (status === "Deactivated") {
    return (
      <span className={`${styles.badge} ${styles.badgeDeactivated}`}>
        <span className={styles.badgeDot} />
        Deactivated
      </span>
    );
  }
  if (status === "Inactive") {
    return (
      <span className={`${styles.badge} ${styles.badgeInactive}`}>
        <span className={styles.badgeDot} />
        Inactive
      </span>
    );
  }
  return (
    <span className={`${styles.badge} ${styles.badgeActive}`}>
      <span className={styles.badgeDot} />
      Active
    </span>
  );
}

function VerificationStatusBadge({ status }: { status?: string }) {
  if (status === "Verified") {
    return (
      <span className={styles.verifiedBadge}>
        <CheckmarkIcon /> Verified
      </span>
    );
  }
  return (
    <span className={styles.pendingBadge}>
      <PendingCircleIcon /> Pending
    </span>
  );
}

function TripStatusBadge({ status }: { status: string }) {
  if (status === "Completed") {
    return <span className={styles.tripBadgeCompleted}>Completed</span>;
  }
  return <span className={styles.tripBadgeCancelled}>Cancelled</span>;
}

/* ─── SVG Icons ─── */
function BackArrowIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#344054" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function SolidBlueStarIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="#2F68FE" stroke="#2F68FE" strokeWidth={1}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#027A48" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PendingCircleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F79009" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="#F79009" stroke="none" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#868C98" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function RouteArrowIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PdfBadgeIcon() {
  return (
    <div className={styles.pdfBadge}>
      <span className={styles.pdfBadgeText}>PDF</span>
    </div>
  );
}
