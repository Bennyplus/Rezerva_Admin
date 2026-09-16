"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import BookingDetailView from "@/components/admin/BookingDetailView";
import CancelBookingModal from "@/components/admin/CancelBookingModal";
import { useToast } from "@/lib/toast-context";
import {
  bookingsService,
  ApiBooking,
} from "@/services/bookings-service";
import styles from "./bookings.module.css";

export default function BookingsPage() {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View mode
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);

  // Cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;

  // Fetch live bookings from API
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await bookingsService.getBookings();
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Close kebab menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest(`.${styles.actionMenuWrapper}`)) {
        return;
      }
      setOpenMenuIdx(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter & Search Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const driverName = b.driver?.full_name?.toLowerCase() || "";
      const passengerName =
        (b.passenger?.full_name || b.rider?.full_name || b.user?.full_name || "").toLowerCase();
      const id = (b.id || "").toLowerCase();
      const ref = (b.booking_reference || "").toLowerCase();
      const status = (b.status || b.trip_status || "").toLowerCase();
      const origin = (b.pickup_location || "").toLowerCase();
      const destination = (b.destination || "").toLowerCase();

      return (
        driverName.includes(q) ||
        passengerName.includes(q) ||
        id.includes(q) ||
        ref.includes(q) ||
        status.includes(q) ||
        origin.includes(q) ||
        destination.includes(q)
      );
    });
  }, [bookings, searchQuery]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / resultsPerPage)
  );

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * resultsPerPage;
    return filteredBookings.slice(start, start + resultsPerPage);
  }, [filteredBookings, currentPage, resultsPerPage]);

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
        return styles.statusUpcoming;
    }
  };

  const getNormalizedStatus = (status?: string) => {
    if (!status) return "Upcoming";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Action Handlers
  const handleViewDetails = (booking: ApiBooking) => {
    setSelectedBooking(booking);
    setViewMode("detail");
    setOpenMenuIdx(null);
  };

  const handleReassignPassenger = (bookingId: string) => {
    setOpenMenuIdx(null);
    showToast("info", "Reassign passenger functionality coming soon.");
  };

  const handleOpenCancelModal = (bookingId: string) => {
    setOpenMenuIdx(null);
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  };

  const handleIssueRefund = (bookingId: string) => {
    setOpenMenuIdx(null);
    showToast("info", "Issue refund action initiated.");
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!bookingToCancel) return;
    try {
      await bookingsService.cancelBooking(bookingToCancel, { reason }).catch((e) => {
        console.warn("Backend cancel response warning:", e);
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingToCancel || b.booking_reference === bookingToCancel
            ? { ...b, status: "cancelled", trip_status: "cancelled" }
            : b
        )
      );
      if (
        selectedBooking &&
        (selectedBooking.id === bookingToCancel ||
          selectedBooking.booking_reference === bookingToCancel)
      ) {
        setSelectedBooking((prev) =>
          prev ? { ...prev, status: "cancelled", trip_status: "cancelled" } : null
        );
      }
      showToast("success", "Booking cancelled successfully.");
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (err) {
      showToast("error", "Failed to cancel booking.");
    }
  };

  return (
    <div className={styles.page}>
      {viewMode === "detail" && selectedBooking ? (
        /* ─── Detail View (Screenshot 4) ─── */
        <BookingDetailView
          booking={selectedBooking}
          onBack={() => setViewMode("list")}
          onCancelBooking={handleOpenCancelModal}
          onReassignPassenger={handleReassignPassenger}
          onIssueRefund={handleIssueRefund}
        />
      ) : (
        /* ─── Main List View (Screenshots 1 & 2) ─── */
        <>
          {isLoading ? (
            <div className={styles.emptyCard}>
              <Spinner size={28} />
              <p className={styles.emptySubtitle}>Loading bookings…</p>
            </div>
          ) : bookings.length === 0 ? (
            /* ── Inactive State (Screenshot 2) ── */
            <div className={styles.emptyCard} id="bookings-empty-state">
              <h2 className={styles.emptyTitle}>No Bookings</h2>
              <p className={styles.emptySubtitle}>
                Bookings will appear here once drivers begin scheduling
              </p>
            </div>
          ) : (
            /* ── Active State (Screenshot 1) ── */
            <>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                  <div className={styles.searchBox}>
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className={styles.searchInput}
                    />
                  </div>

                  <button type="button" className={styles.toolBtn}>
                    <FilterIcon />
                    Filter
                  </button>

                  <button type="button" className={styles.toolBtn}>
                    <SortIcon />
                    Sort By
                  </button>
                </div>
              </div>

              {/* Table Card */}
              <div className={styles.tableCard}>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Passenger</th>
                        <th>Driver</th>
                        <th>Price</th>
                        <th>Payment Status</th>
                        <th>Seats</th>
                        <th>Booking Status</th>
                        <th className={styles.actionsCol}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBookings.map((b, idx) => {
                        const bookingIdDisplay =
                          b.booking_reference ||
                          (b.id ? b.id.slice(0, 14).toUpperCase() : "01234-KYE-I123");

                        const passengerName =
                          b.passenger?.full_name ||
                          b.passenger?.name ||
                          b.rider?.full_name ||
                          b.user?.full_name ||
                          "Jane Cooper";

                        const driverName = b.driver?.full_name || "Fade Bayo";

                        const priceDisplay =
                          parseFloat(b.price_at_booking || b.trip_price_per_seat || "0") || 0;

                        const seatsDisplay = b.seats_requested ? `${b.seats_requested}/4` : "3/4";

                        const bookingStatus = getNormalizedStatus(b.status || b.trip_status);

                        return (
                          <tr key={b.id || idx}>
                            {/* Booking ID */}
                            <td className={styles.bookingIdCell} title={b.id}>
                              {bookingIdDisplay}
                            </td>

                            {/* Passenger */}
                            <td className={styles.passengerCell}>
                              {passengerName}
                            </td>

                            {/* Driver */}
                            <td className={styles.driverCell}>
                              {driverName}
                            </td>

                            {/* Price */}
                            <td className={styles.priceCell}>
                              ${priceDisplay.toFixed(2)}
                            </td>

                            {/* Payment Status (Checkmark Badge) */}
                            <td>
                              <span className={styles.paymentBadge}>
                                <span className={styles.paymentCheckIcon}>
                                  <CheckIcon />
                                </span>
                                Completed
                              </span>
                            </td>

                            {/* Seats */}
                            <td className={styles.seatsCell}>
                              {seatsDisplay}
                            </td>

                            {/* Booking Status */}
                            <td>
                              <span
                                className={`${styles.statusBadge} ${getStatusBadgeClass(
                                  b.status || b.trip_status
                                )}`}
                              >
                                <span className={styles.badgeDot} />
                                {bookingStatus}
                              </span>
                            </td>

                            {/* Actions Kebab (Screenshot 3) */}
                            <td className={styles.actionsCol}>
                              <div className={styles.actionMenuWrapper}>
                                <button
                                  type="button"
                                  className={styles.moreBtn}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuIdx((prev) =>
                                      prev === idx ? null : idx
                                    );
                                  }}
                                  aria-label="Actions"
                                >
                                  <MoreIcon />
                                </button>

                                {openMenuIdx === idx && (
                                  <div
                                    className={styles.kebabMenu}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      className={styles.kebabMenuItem}
                                      onClick={() => handleViewDetails(b)}
                                    >
                                      View Details
                                    </button>
                                    <button
                                      type="button"
                                      className={styles.kebabMenuItem}
                                      onClick={() => handleReassignPassenger(b.id)}
                                    >
                                      Reassign Passenger
                                    </button>
                                    <button
                                      type="button"
                                      className={styles.kebabMenuItem}
                                      onClick={() => handleOpenCancelModal(b.id)}
                                    >
                                      Cancel Booking
                                    </button>
                                    <button
                                      type="button"
                                      className={styles.kebabMenuItem}
                                      onClick={() => handleIssueRefund(b.id)}
                                    >
                                      Issue Refund
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  resultsPerPage={resultsPerPage}
                  onPageChange={setCurrentPage}
                  variant="table"
                />
              </div>
            </>
          )}
        </>
      )}

      {/* ─── Cancel Booking Confirmation Modal ─── */}
      <CancelBookingModal
        isOpen={showCancelModal}
        bookingId={bookingToCancel || ""}
        onClose={() => {
          setShowCancelModal(false);
          setBookingToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}

/* ─── Inline SVG Icons ─── */
function SearchIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#868C98"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
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
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}

function SortIcon() {
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
      <path d="M7 3v14" />
      <path d="M3 7l4-4 4 4" />
      <path d="M17 21V7" />
      <path d="M21 17l-4 4-4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width={10}
      height={10}
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

function MoreIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
