"use client";

import Image from "next/image";
import { type Driver } from "@/data/admin-drivers";
import styles from "./DriverDetailView.module.css";

interface DriverDetailViewProps {
  driver: Driver;
  onBack: () => void;
  onSuspend: (id: string) => void;
}

export default function DriverDetailView({ driver, onBack, onSuspend }: DriverDetailViewProps) {
  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack} id="driver-detail-back" aria-label="Go back">
          <BackIcon />
        </button>
        <button
          className={styles.suspendBtn}
          onClick={() => onSuspend(driver.id)}
          id="driver-detail-suspend"
        >
          Suspend Driver
        </button>
      </div>

      {/* Main layout: left profile + right stats */}
      <div className={styles.layout}>
        {/* ─── Left Panel ─── */}
        <div className={styles.leftPanel}>
          {/* Driver photo */}
          <div className={styles.photoWrap}>
            <Image
              src={driver.avatar}
              alt={driver.name}
              width={340}
              height={260}
              className={styles.photo}
            />
          </div>

          {/* Basic info — 3-column grid */}
          <div className={styles.infoGrid}>
            {/* Row 1: Name | Phone Number | Availability badge */}
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Name</span>
              <span className={styles.infoValue}>{driver.name}</span>
            </div>
            <div className={styles.infoGroup}>
              <div className={styles.phoneRow}>
                <span className={styles.infoLabel}>Phone Number</span>
              </div>
              <span className={styles.infoValue}>{driver.phone}</span>
            </div>
            <div>
              {/* <span className={styles.infoLabel}>Availability</span> */}
              <AvailabilityBadge status={driver.availability} />
            </div>

            {/* Row 2: Email | License Number | License Status */}
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{driver.email}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>License Number</span>
              <span className={styles.infoValue}>{driver.licenseNo}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>License Status</span>
              <span className={`${styles.infoValue} ${driver.licenseStatus === "Expired" ? styles.expired : ""}`}>
                {driver.licenseStatus}
              </span>
            </div>

            {/* Row 3: Rating | Assigned Trips */}
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Rating</span>
              <span className={styles.ratingValue}>
                <StarIcon /> {driver.rating.toFixed(1)}
              </span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Assigned Trips</span>
              <span className={styles.infoValue}>{driver.assignedTrips}</span>
            </div>
            <div />
          </div>

          {/* Documents — label above each tile, 2×2 grid */}
          <div className={styles.docsSection}>
            <div className={styles.docsGrid}>
              {Object.values(driver.documents).map((doc, i) => (
                <div key={i} className={styles.docBlock}>
                  <span className={styles.docBlockLabel}>{doc.label}</span>
                  <div className={styles.docTile}>
                    <DocIcon />
                    <div className={styles.docInfo}>
                      <span className={styles.docName}>{doc.filename}</span>
                      <span className={styles.docMeta}>0 KB of {doc.size} •</span>
                    </div>
                  </div>
                </div>
              ))}
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
                <span className={styles.perfValue}>{driver.totalTrips}</span>
              </div>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>
                  Reports <InfoIcon />
                </span>
                <span className={styles.perfValue}>{driver.reports}</span>
              </div>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>Ratings</span>
                <span className={styles.perfValue}>{driver.rating.toFixed(1)}</span>
              </div>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>Current Booking</span>
                {driver.currentBooking ? (
                  <div className={styles.bookingId}>
                    <span className={styles.perfValue}>{driver.currentBooking}</span>
                    <button className={styles.copyBtn} aria-label="Copy booking ID">
                      <CopyIcon />
                    </button>
                  </div>
                ) : (
                  <span className={styles.perfValueMuted}>—</span>
                )}
              </div>
            </div>
          </section>

          {/* Booking History */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Booking History</h3>
            <div className={styles.historyList}>
              {driver.bookingHistory.length === 0 ? (
                <p className={styles.emptyHistory}>No booking history yet.</p>
              ) : (
                driver.bookingHistory.map((booking, i) => (
                  <div key={i} className={styles.historyItem}>
                    <div className={styles.historyTop}>
                      <div className={styles.historyIdWrap}>
                        <span className={styles.historyId}>{booking.id}</span>
                        <button className={styles.copyBtn} aria-label="Copy booking ID">
                          <CopyIcon />
                        </button>
                      </div>
                      <span className={styles.historyVehicle}>{booking.vehicle}</span>
                    </div>
                    <div className={styles.historyBottom}>
                      <div className={styles.historyDates}>
                        <span style={{ color: "#000", fontSize: "14px" }}>From {booking.fromDate}</span>
                        <ArrowIcon />
                        <span style={{ color: "#000", fontSize: "14px" }}>To {booking.toDate}</span>
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */
function AvailabilityBadge({ status }: { status: string }) {
  const cls =
    status === "Available" ? styles.availBadgeGreen :
      status === "On Trip" ? styles.availBadgeAmber :
        styles.availBadgeGray;
  return (
    <span className={`${styles.availBadge} ${cls}`}>
      <span className={styles.availDot} />
      {status}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const cls =
    status === "Completed" ? styles.bsBadgeGreen :
      status === "In Progress" ? styles.bsBadgeAmber :
        styles.bsBadgeRed;
  return <span className={`${styles.bsBadge} ${cls}`}>{status}</span>;
}

/* ─── Icons ─── */
function BackIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="#141413ff" stroke="#141413ff" strokeWidth={1}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <Image src="/images/admin/copy.svg" alt="Copy" width={14} height={14} />
  );
}

function InfoIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="12" y2="17" />
    </svg>
  );
}
