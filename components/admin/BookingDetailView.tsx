"use client";

import React from "react";
import { ApiBooking } from "@/services/bookings-service";
import styles from "./BookingDetailView.module.css";

interface BookingDetailViewProps {
  booking: ApiBooking;
  onBack: () => void;
  onCancelBooking: (bookingId: string) => void;
  onReassignPassenger?: (bookingId: string) => void;
  onIssueRefund?: (bookingId: string) => void;
}

export default function BookingDetailView({
  booking,
  onBack,
  onCancelBooking,
  onReassignPassenger,
  onIssueRefund,
}: BookingDetailViewProps) {
  const getStatusBadgeClass = (status?: string) => {
    const norm = (status || "").toLowerCase();
    switch (norm) {
      case "completed":
        return styles.statusCompleted;
      case "upcoming":
        return styles.statusUpcoming;
      case "ongoing":
        return styles.statusOngoing;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusOngoing;
    }
  };

  const getNormalizedStatusText = (status?: string) => {
    if (!status) return "Ongoing";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Format timeline date if present
  const formatTimelineDate = () => {
    if (booking.start_date) {
      try {
        const d = new Date(booking.start_date);
        return d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {}
      return booking.start_date;
    }
    return "11 May 2026 11:34AM";
  };

  const isCancelled = (booking.status || "").toLowerCase() === "cancelled";

  // Vehicle title / ID representation matching Screenshot 4
  const bookingVehicleTitle = booking.vehicle?.brand
    ? `${booking.vehicle.brand} ${booking.vehicle.model || ""} 2026`.trim()
    : booking.booking_reference || (booking.id ? `Booking #${booking.id.slice(0, 8).toUpperCase()}` : "Toyota HighLander 2026");

  const passengerName =
    booking.passenger?.full_name ||
    booking.passenger?.name ||
    booking.rider?.full_name ||
    booking.user?.full_name ||
    "Jane Cooper";

  const passengerEmail =
    booking.passenger?.email ||
    booking.rider?.email ||
    booking.user?.email ||
    "jane@gmail.com";

  const passengerPhone =
    booking.passenger?.phone_number ||
    booking.rider?.phone_number ||
    booking.user?.phone_number ||
    "+234801234573";

  const driverName = booking.driver?.full_name || "Jane Cooper";
  const driverEmail = booking.driver?.email || "jane@gmail.com";
  const driverPhone = booking.driver?.phone_number || "+234801234573";
  const driverLicense = booking.driver?.license_status || "Valid";

  return (
    <div className={styles.container}>
      {/* ─── Top Action Bar ─── */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Back to bookings list"
          id="booking-detail-back"
        >
          <ChevronLeftIcon />
        </button>

        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.reassignBtn}
            onClick={() =>
              onReassignPassenger ? onReassignPassenger(booking.id) : null
            }
            id="booking-detail-reassign"
          >
            Reassign Passenger
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => onCancelBooking(booking.id)}
            disabled={isCancelled}
            id="booking-detail-cancel"
          >
            {isCancelled ? "Booking Cancelled" : "Cancel Booking"}
          </button>
        </div>
      </div>

      {/* ─── 2-Column Main Layout (Screenshot 4) ─── */}
      <div className={styles.mainLayout}>
        {/* Left Column: Details Card */}
        <div className={styles.leftCard}>
          {/* Section 1: Ride Details */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Ride Details</h3>

            {/* Row 1: Booking ID | Destination | Origin */}
            <div className={styles.infoGrid3}>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Booking ID</span>
                <span className={styles.value}>{bookingVehicleTitle}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Destination</span>
                <span className={styles.value}>
                  {booking.destination || "Jeep"}
                </span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Origin</span>
                <span className={styles.value}>
                  {booking.pickup_location || "Petrol"}
                </span>
              </div>
            </div>

            {/* Row 2: Available Seats | Seats Booked | Booking Status */}
            <div className={styles.infoGrid3}>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Available Seats</span>
                <span className={styles.value}>Automatic</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Seats Booked</span>
                <span className={styles.value}>
                  {booking.seats_requested ? `${booking.seats_requested}` : "Automatic"}
                </span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Booking Status</span>
                <span
                  className={`${styles.statusBadge} ${getStatusBadgeClass(
                    booking.status || booking.trip_status
                  )}`}
                >
                  <span className={styles.badgeDot} />
                  {getNormalizedStatusText(booking.status || booking.trip_status)}
                </span>
              </div>
            </div>

            {/* Row 3: Payment Status */}
            <div className={styles.infoGrid3} style={{ marginBottom: 0 }}>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Payment Status</span>
                <span className={styles.paymentBadge}>
                  <CheckIcon />
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Section 2: Passenger Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Passenger Information</h3>
            <div className={styles.infoGrid3} style={{ marginBottom: 0 }}>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>{passengerName}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{passengerEmail}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Phone</span>
                <span className={styles.value}>{passengerPhone}</span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Section 3: Driver Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Driver Information</h3>
            <div className={styles.infoGrid4}>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>{driverName}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{driverEmail}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.label}>Phone</span>
                <span className={styles.value}>{driverPhone}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.label}>License Status</span>
                <span className={styles.value}>{driverLicense}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Quick Actions */}
        <div className={styles.rightColumn}>
          {/* Card 1: Timeline */}
          <div className={styles.rightCard}>
            <h4 className={styles.rightCardTitle}>Timeline</h4>
            <div className={styles.timeline}>
              {/* Step 1: Active */}
              <div className={styles.timelineItem}>
                <div className={styles.timelineTrack}>
                  <div className={styles.timelineIconActive}>
                    <SmallCheckIcon />
                  </div>
                  <div className={styles.timelineLine} />
                </div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineTitle}>Booking Request Placed</p>
                  <p className={styles.timelineTime}>{formatTimelineDate()}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={styles.timelineItem}>
                <div className={styles.timelineTrack}>
                  <div className={styles.timelineIconInactive} />
                  <div className={styles.timelineLine} />
                </div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineTitleInactive}>
                    Booking Approved/Declined
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={styles.timelineItem}>
                <div className={styles.timelineTrack}>
                  <div className={styles.timelineIconInactive} />
                  <div className={styles.timelineLine} />
                </div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineTitleInactive}>Trip Started</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className={styles.timelineItem}>
                <div className={styles.timelineTrack}>
                  <div className={styles.timelineIconInactive} />
                </div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineTitleInactive}>Trip Ended</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Quick Actions */}
          <div className={styles.rightCard}>
            <h4 className={styles.rightCardTitle}>Quick Actions</h4>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => (onIssueRefund ? onIssueRefund(booking.id) : null)}
            >
              <span>Issue Refund</span>
              <div className={styles.actionChevron}>
                <ChevronRightIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Inline SVG Icons ─── */
function ChevronLeftIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
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
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SmallCheckIcon() {
  return (
    <svg
      width={11}
      height={11}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
