"use client";

import Image from "next/image";
import { Booking } from "@/data/admin-bookings";
import styles from "./BookingDetailView.module.css";

interface BookingDetailViewProps {
  booking: Booking;
  onBack: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export default function BookingDetailView({ booking, onBack, onCancelBooking }: BookingDetailViewProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft} style={{ display: "block" }}>
          <button className={styles.backBtn} onClick={onBack} aria-label="Go back">
            <BackIcon />
          </button>
          <div className={styles.headerTitle}>
            <p className={styles.headerTitleText}>Booking ID</p>
            <div className={styles.idRow}>
              <h1 className={styles.bookingId}>DRI-1234234-LLY</h1>
              <button className={styles.copyBtn} aria-label="Copy ID">
                <CopyIcon />
              </button>
              <span className={`${styles.badge} ${styles.statusUpcoming}`}>
                <span className={styles.badgeDot} />
                Upcoming
              </span>
            </div>
            <p className={styles.dateRange}>
              Booked from <span className={styles.dateBold}>12 Jun 2026 at 11:45 AM</span> to <span className={styles.dateBold}>22 Apr 2026 12:00 PM</span>
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.modifyBtn}>Modify Booking</button>
          <button className={styles.cancelBtn} onClick={() => onCancelBooking(booking.id)}>Cancel Booking</button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Booking Information */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Booking Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Name</span>
                <span className={styles.infoValue}>{booking.customerName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{booking.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone</span>
                <span className={styles.infoValue}>{booking.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Date Created</span>
                <span className={styles.infoValue}>{booking.dateCreated}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Booking Type</span>
                <span className={styles.infoValue}>{booking.bookingType}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Payment Status</span>
                <span style={{ color: "rgba(1, 102, 48, 1)", fontWeight: "600" }}>
                  <span style={{ height: "7px", width: "7px", borderRadius: "50%", backgroundColor: "rgba(1, 102, 48, 1)", marginRight: "14px", display: "inline-block" }} />
                  Paid
                </span>
              </div>
            </div>
          </section>
          <div style={{ border: "1px solid rgba(226, 228, 233, 1)", margin: "0 20px" }} />

          {/* Car Details */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Car Details</h2>
            <div className={styles.infoGrids}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Vehicle Name</span>
                <span className={styles.infoValue}>{booking.vehicle} 2026</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Vehicle Category</span>
                <span className={styles.infoValue}>{booking.vehicleCategory}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fuel Type</span>
                <span className={styles.infoValue}>{booking.fuelType}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Transmission</span>
                <span className={styles.infoValue}>{booking.transmission}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Current Car Status</span>
                <span className={`${styles.badge} ${styles.statusAvailable}`}>
                  <span className={styles.badgeDot} />
                  Available
                </span>
              </div>
            </div>
          </section>
          <div style={{ border: "1px solid rgba(226, 228, 233, 1)", margin: "0 20px" }} />

          {/* Extras */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Extras</h2>
            <table className={styles.extrasTable}>
              <thead>
                <tr>
                  <th>Extra</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {booking.extras.map((extra, i) => (
                  <tr key={i}>
                    <td>{extra.name}</td>
                    <td className={styles.amount}>N{extra.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <div style={{ border: "1px solid rgba(226, 228, 233, 1)", margin: "0 20px" }} />

          {/* Payment Summary */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Summary</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Subtotal</span>
                <span className={styles.infoValue}>N{booking.paymentSummary.subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tax</span>
                <span className={styles.infoValue}>N{booking.paymentSummary.tax.toLocaleString()}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Total</span>
                <span className={styles.infoValue}>N{booking.paymentSummary.total.toLocaleString()}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Booking Status Timeline */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Booking Status</h2>
            <div className={styles.timeline}>
              <TimelineItem label="Booking Confirmed" date="11 May 2026 11:34AM" checked />
              <TimelineItem label="Payment Completed" date="11 May 2026 11:34AM" checked />
              <TimelineItem label="Trip Started" date="12 June 2026 11:45AM" />
              <TimelineItem label="Trip Completed" date="12 June 2026 11:45AM" />
              <TimelineItem label="Vehicle Returned" date="12 June 2026 11:45AM" />
            </div>
          </section>

          {/* Quick Actions */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionList}>
              <ActionButton label="Send Reminder" />
              <ActionButton label="Approve Extension" />
              <ActionButton label="Issue Refund" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function TimelineItem({ label, date, checked = false }: { label: string; date: string; checked?: boolean }) {
  return (
    <div className={styles.timelineItem}>
      <div className={`${styles.timelineCheck} ${checked ? styles.timelineCheckActive : ""}`}>
        {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </div>
      <div className={styles.timelineContent}>
        <span className={styles.timelineLabel}>{label}</span>
        <span className={styles.timelineDate}>{date}</span>
      </div>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className={styles.actionBtn}>
      {label}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
    </button>
  );
}

/* ─── Icons ─── */
function BackIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(134, 140, 152, 1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>; }
function CopyIcon() {
  return <Image src="/images/admin/copy.svg" alt="Copy" width={16} height={16} />;
}
