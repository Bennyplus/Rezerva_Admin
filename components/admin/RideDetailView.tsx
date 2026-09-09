"use client";

import React, { useState, useEffect } from "react";
import Spinner from "@/components/admin/Spinner";
import {
  ridesService,
  ApiTripDetail,
  ApiPassenger,
} from "@/services/rides-service";
import styles from "./RideDetailView.module.css";

interface RideDetailViewProps {
  tripId: number | string;
  onBack: () => void;
  onCancel: (tripId: number | string) => void;
  onEdit?: (tripId: number | string) => void;
}

function formatTime(timeStr?: string) {
  if (!timeStr) return "—";
  if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
  try {
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      const hour = parseInt(parts[0], 10);
      const min = parts[1];
      const ampm = hour >= 12 ? "PM" : "AM";
      const h12 = hour % 12 || 12;
      return `${String(h12).padStart(2, "0")}:${min} ${ampm}`;
    }
  } catch {}
  return timeStr;
}

export default function RideDetailView({
  tripId,
  onBack,
  onCancel,
  onEdit,
}: RideDetailViewProps) {
  const [detail, setDetail] = useState<ApiTripDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadDetail() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const data = await ridesService.getTripById(tripId);
        if (isMounted) {
          if (data) {
            setDetail(data);
          } else {
            setErrorMsg("Trip not found");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to load trip details:", err);
          setErrorMsg(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load trip details."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (tripId) {
      loadDetail();
    }
    return () => {
      isMounted = false;
    };
  }, [tripId]);

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

  const formatPrice = (priceStr?: string) => {
    if (!priceStr) return "Automatic";
    const cleaned = priceStr.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    if (!isNaN(num)) {
      return `$${num.toFixed(2)}`;
    }
    return priceStr;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBack}
            aria-label="Back"
          >
            <ChevronLeftIcon />
          </button>
        </div>
        <div className={styles.stateCard}>
          <Spinner size={32} />
          <p style={{ color: "#868C98", marginTop: 12, fontSize: 14 }}>
            Loading trip details…
          </p>
        </div>
      </div>
    );
  }

  if (errorMsg || !detail) {
    return (
      <div className={styles.container}>
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBack}
            aria-label="Back"
          >
            <ChevronLeftIcon />
          </button>
        </div>
        <div className={styles.stateCard}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>
            Unable to display ride
          </h3>
          <p style={{ color: "#868C98", fontSize: 13.5, margin: "0 0 16px" }}>
            {errorMsg || "Trip details could not be found."}
          </p>
          <button
            type="button"
            className={styles.editBtn}
            onClick={onBack}
          >
            Return to Rides
          </button>
        </div>
      </div>
    );
  }

  const isCancelled = (detail.status || "").toLowerCase() === "cancelled";
  const passengers: ApiPassenger[] = Array.isArray(detail.passengers)
    ? detail.passengers
    : [];

  const seatsBooked =
    detail.seats_booked ??
    (passengers.length > 0 ? passengers.length : "—");

  return (
    <div className={styles.container}>
      {/* ─── Top Action Bar ─── */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Back to rides list"
          id="ride-detail-back"
        >
          <ChevronLeftIcon />
        </button>

        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => (onEdit ? onEdit(detail.id) : null)}
            id="ride-detail-edit"
          >
            Edit Ride
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => onCancel(detail.id)}
            disabled={isCancelled}
            id="ride-detail-cancel"
          >
            {isCancelled ? "Ride Cancelled" : "Cancel Ride"}
          </button>
        </div>
      </div>

      {/* ─── Details Card (Screenshot 2) ─── */}
      <div className={styles.detailsCard}>
        {/* Section 1: Driver Information */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Driver Information</h3>
          <div className={styles.infoGrid4}>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Name</span>
              <span className={styles.value}>{detail.driver || "—"}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{detail.email || "—"}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{detail.phone_number || "—"}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.label}>License Status</span>
              <span className={styles.value}>
                {detail.license_status || "Valid"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Section 2: Ride Details */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Ride Details</h3>

          {/* Row 1: Origin | Destination | Departure Time */}
          <div className={styles.infoGrid3}>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Origin</span>
              <span className={styles.value}>{detail.origin || "—"}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Destination</span>
              <span className={styles.value}>{detail.destination || "—"}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Departure Time</span>
              <span className={styles.value}>
                {formatTime(detail.departure_time)}
              </span>
            </div>
          </div>

          {/* Row 2: Available Seats | Seats Booked | Trip Status */}
          <div className={styles.infoGrid3}>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Available Seats</span>
              <span className={styles.value}>{detail.available_seats ?? "—"}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Seats Booked</span>
              <span className={styles.value}>{seatsBooked}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Trip Status</span>
              <span
                className={`${styles.statusBadge} ${getStatusBadgeClass(
                  detail.status
                )}`}
              >
                <span className={styles.badgeDot} />
                {getNormalizedStatusText(detail.status)}
              </span>
            </div>
          </div>

          {/* Row 3: Price */}
          <div className={styles.infoGrid3} style={{ marginBottom: 0 }}>
            <div className={styles.infoGroup}>
              <span className={styles.label}>Price</span>
              <span className={styles.value}>{formatPrice(detail.price_per_seat)}</span>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Section 3: Passengers */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Passengers</h3>
          {passengers.length > 0 ? (
            <div className={styles.passengersList}>
              {passengers.map((p, idx) => (
                <div key={p.id ?? idx} className={styles.passengerItem}>
                  <span className={styles.passengerName}>
                    {p.name || p.full_name || `Passenger ${idx + 1}`}
                  </span>
                  <div className={styles.passengerArrow}>
                    <ArrowRightIcon />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noPassengers}>
              No passengers booked for this ride.
            </p>
          )}
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

function ArrowRightIcon() {
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
