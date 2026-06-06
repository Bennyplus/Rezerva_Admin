"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import BookingDetailView from "@/components/admin/BookingDetailView";
import CancelBookingModal from "@/components/admin/CancelBookingModal";
import SendReminderModal from "@/components/admin/SendReminderModal";
import OTPVerificationModal from "@/components/admin/OTPVerificationModal";
import { BOOKING_STATS_EMPTY, Booking } from "@/data/admin-bookings";
import FilterBar from "@/components/admin/FilterBar";
import Spinner from "@/components/admin/Spinner";
import { bookingsService } from "@/services/bookings-service";
import BookingsFilterDropdown from "@/components/admin/bookings/BookingsFilterDropdown";
import BookingsSortDropdown from "@/components/admin/bookings/BookingsSortDropdown";
import styles from "./bookings.module.css";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState(BOOKING_STATS_EMPTY);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;

  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  
  const [showSendReminderModal, setShowSendReminderModal] = useState(false);
  const [bookingToSendReminder, setBookingToSendReminder] = useState<string | null>(null);

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [bookingForOTP, setBookingForOTP] = useState<string | null>(null);

  const [isExporting, setIsExporting] = useState(false);




  const [sortOption, setSortOption] = useState<string>("Newest to Oldest");
  const [activeFilters, setActiveFilters] = useState<any>({});


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsData, metricsData] = await Promise.all([
          bookingsService.getBookings(),
          bookingsService.getMetrics()
        ]);

        if (Array.isArray(bookingsData)) {
          setBookings(bookingsData);
        } else if (bookingsData?.results) {
          setBookings(bookingsData.results);
        }

        if (metricsData?.metrics) {
          setStats([
            { id: "total-bookings", label: "Total Bookings", value: metricsData.metrics.total_bookings || 0 },
            { id: "ongoing-trips", label: "Ongoing Trips", value: metricsData.metrics.ongoing_trips || 0 },
            { id: "completed-trips", label: "Completed Trips", value: metricsData.metrics.completed_trips || 0 },
            { id: "cancelled-bookings", label: "Cancelled Bookings", value: metricsData.metrics.cancelled_bookings || 0 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching bookings data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuIdx !== null) {
        setOpenMenuIdx(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuIdx]);

  const handleViewDetails = (bookingRef: string) => {
    const booking = bookings.find((b) => b.booking_reference === bookingRef);
    setSelectedBooking(booking);
    setViewMode("detail");
    setOpenMenuIdx(null);
  };
  const handleModifyBooking = (bookingRef: string) => {
    // TODO: Implement modify booking functionality
  }

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.booking_reference === bookingId);
    if (!booking) return;
    setBookingToCancel(booking.booking_reference);
    setShowCancelModal(true);
    setOpenMenuIdx(null);
  };

  const submitCancelBooking = async (bookingId: string, reason: string) => {
    try {
      await bookingsService.cancelBooking(bookingId, { reason });
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_reference === bookingId ? { ...b, booking_status: "Cancelled" } : b
        )
      );
    } catch (error) {
      console.error(`Failed to cancel booking ${bookingId}:`, error);
      throw error; // Propagate the error so the modal can catch it
    }
  };

  const handleSendReminderClick = (bookingId: string) => {
    const booking = bookings.find((b) => b.booking_reference === bookingId);
    if (!booking) return;
    setBookingToSendReminder(booking.booking_reference);
    setShowSendReminderModal(true);
    setOpenMenuIdx(null);
  };

  const submitSendReminder = async (bookingId: string, reason: string) => {
    try {
      await bookingsService.sendReminder(bookingId, { reason });
    } catch (error) {
      console.error(`Failed to send reminder for booking ${bookingId}:`, error);
      throw error;
    }
  };

  const handleConfirmPickup = (bookingId: string) => {
    const booking = bookings.find((b) => b.booking_reference === bookingId);
    if (!booking) return;
    setBookingForOTP(booking.booking_reference);
    setShowOTPModal(true);
    setOpenMenuIdx(null);
  };

  const submitOTPVerification = async (bookingId: string, otp: string) => {
    try {
      await bookingsService.confirmPickup(bookingId, { otp });
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_reference === bookingId ? { ...b, booking_status: "Confirmed" } : b
        )
      );
    } catch (error) {
      console.error(`Failed to confirm booking ${bookingId} with OTP:`, error);
      throw error;
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const response = await bookingsService.exportBookings();

      const blob = new Blob(
        [response.data],
        {
          type:
            (response.headers["content-type"] as string) ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const url = window.URL.createObjectURL(blob);
      let filename = "bookings.xlsx";
      const disposition = response.headers["content-disposition"];

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const applyFiltersAndSort = (data: any[]) => {
    let result = [...data];

    // Apply filters
    if (activeFilters.status && activeFilters.status.length > 0) {
      result = result.filter(b => activeFilters.status.includes(b.booking_status));
    }

    // Apply sort
    if (sortOption === "Newest to Oldest") {
      result.sort((a, b) => new Date(b.created_at || b.pickup_date || 0).getTime() - new Date(a.created_at || a.pickup_date || 0).getTime());
    } else if (sortOption === "Oldest to Newest") {
      result.sort((a, b) => new Date(a.created_at || a.pickup_date || 0).getTime() - new Date(b.created_at || b.pickup_date || 0).getTime());
    } else if (sortOption === "Amount Highest to Lowest") {
      result.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (sortOption === "Amount Lowest to Highest") {
      result.sort((a, b) => (a.amount || 0) - (b.amount || 0));
    }

    return result;
  };

  const processedBookings = useMemo(() => applyFiltersAndSort(bookings), [bookings, activeFilters, sortOption]);
  const totalPages = Math.max(1, Math.ceil(processedBookings.length / resultsPerPage));
  const displayedBookings = useMemo(() => {
    const start = (currentPage - 1) * resultsPerPage;
    return processedBookings.slice(start, start + resultsPerPage);
  }, [processedBookings, currentPage, resultsPerPage]);

  const isEmpty = processedBookings.length === 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {viewMode === "detail" && selectedBooking ? (
        <BookingDetailView
          bookingId={selectedBooking.booking_reference || selectedBooking.booking_id || selectedBooking.id || selectedBooking.reference || ''}
          onBack={() => setViewMode("list")}
          onCancelBooking={handleCancelBooking}
        />
      ) : (
        <>
          {/* Stat Cards */}
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                id={`stat-${stat.id}`}
              />
            ))}
          </div>

          {bookings.length === 0 ? (
            /* ─── Empty State ─── */
            <div className={styles.emptyCard} id="bookings-empty-state">
              <div className={styles.illustration} aria-hidden="true">
                <Image
                  src="/images/admin/Items.png"
                  alt="No bookings illustration"
                  width={460}
                  height={380}
                  className={styles.illustrationImg}
                />
              </div>
              <h2 className={styles.emptyTitle}>No bookings found</h2>
              <p className={styles.emptySubtitle}>Reservations will appear here once users begin booking</p>
            </div>
          ) : (
            /* ─── Populated State ─── */
            <>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                  <FilterBar
                    filterDropdown={<BookingsFilterDropdown onClose={() => { }} onApply={setActiveFilters} />}
                    sortDropdown={<BookingsSortDropdown onClose={() => { }} onSortSelect={setSortOption} />}
                  />
                </div>

                <div className={styles.toolbarRight}>
                  <button
                    className={styles.exportBtn}
                    onClick={handleExport}
                    disabled={isExporting}
                  >
                    {isExporting ? 'Exporting...' : 'Export Bookings'}
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className={styles.tableCard}>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.checkCol}>
                          <input type="checkbox" className={styles.checkbox} aria-label="Select all bookings" />
                        </th>
                        <th>Booking ID</th>
                        <th>Customer Name</th>
                        <th>Vehicle</th>
                        <th>Booking Type</th>
                        <th>Pickup Date</th>
                        <th>Return Date</th>
                        <th>Booking Status</th>
                        <th className={styles.actionsCol}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedBookings.map((b, idx) => (
                        <tr key={idx}>
                          <td className={styles.checkCol}>
                            <input type="checkbox" className={styles.checkbox} aria-label={`Select booking ${b.booking_reference}`} />
                          </td>
                          <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.booking_reference}>
                            {b.booking_reference}
                          </td>
                          <td>{b.customer_name}</td>
                          <td>{b.vehicle}</td>
                          <td>{b.booking_type || "N/A"}</td>
                          <td>{b.pickup_date}</td>
                          <td>{b.return_date}</td>
                          <td>
                            <span className={`${styles.badge} ${styles[`status${b.booking_status}`]}`}>
                              <span className={styles.badgeDot} />
                              {b.booking_status}
                            </span>
                          </td>
                          <td className={styles.actionsCol}>
                            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                              <button
                                className={styles.moreBtn}
                                onClick={() => setOpenMenuIdx(openMenuIdx === idx ? null : idx)}
                              >
                                <MoreIcon />
                              </button>

                              {openMenuIdx === idx && (
                                <div className={styles.dropdown}>
                                  <button className={styles.dropdownItem} onClick={() => handleViewDetails(b.booking_reference)}>View Details</button>
                                  <button className={styles.dropdownItem} onClick={() => handleModifyBooking(b.booking_reference)}>Modify Booking</button>
                                  <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={() => handleCancelBooking(b.booking_reference)}>Cancel Booking</button>
                                  <button className={styles.dropdownItem} onClick={() => handleSendReminderClick(b.booking_reference)}>Send Reminder</button>
                                  <button className={styles.dropdownItem} onClick={() => handleConfirmPickup(b.booking_reference)}>Confirm Pickup</button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    resultsPerPage={resultsPerPage}
                    onPageChange={setCurrentPage}
                    variant="table"
                  />
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        bookingId={bookingToCancel || ""}
        onConfirm={async (reason) => {
          if (bookingToCancel) {
            await submitCancelBooking(bookingToCancel, reason);
          }
        }}
      />

      {/* Send Reminder Modal */}
      <SendReminderModal
        isOpen={showSendReminderModal}
        onClose={() => setShowSendReminderModal(false)}
        bookingId={bookingToSendReminder || ""}
        onConfirm={async (reason) => {
          if (bookingToSendReminder) {
            await submitSendReminder(bookingToSendReminder, reason);
          }
        }}
      />

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={async (otp) => {
          if (bookingForOTP) {
            await submitOTPVerification(bookingForOTP, otp);
          }
        }}
      />
    </div>
  );
}

/* ─── Inline Icons ─── */
const s = 16;
const iconProps = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function MoreIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }

