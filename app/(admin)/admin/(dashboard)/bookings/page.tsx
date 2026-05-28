"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import BookingDetailView from "@/components/admin/BookingDetailView";
import CancelBookingModal from "@/components/admin/CancelBookingModal";
import { BOOKING_STATS_EMPTY, Booking } from "@/data/admin-bookings";
import FilterBar from "@/components/admin/FilterBar";
import Spinner from "@/components/admin/Spinner";
import { bookingsService } from "@/services/bookings-service";
import styles from "./bookings.module.css";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState(BOOKING_STATS_EMPTY);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;

  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

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

  const totalPages = Math.max(1, Math.ceil(bookings.length / resultsPerPage));
  const displayedBookings = useMemo(() => {
    const start = (currentPage - 1) * resultsPerPage;
    return bookings.slice(start, start + resultsPerPage);
  }, [bookings, currentPage, resultsPerPage]);

  const isEmpty = bookings.length === 0;

  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuIdx !== null) {
        setOpenMenuIdx(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuIdx]);

  const handleViewDetails = (bookingRaw: any) => {
    // We pass the raw booking reference or id to the detail view, which will fetch the full details
    setSelectedBooking(bookingRaw);
    setViewMode("detail");
    setOpenMenuIdx(null);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
    setOpenMenuIdx(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await bookingsService.exportBookings();
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookings_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export bookings:', error);
      alert('Failed to export bookings. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

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
          bookingId={selectedBooking.booking_id || selectedBooking.id || selectedBooking.reference || ''}
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

          {isEmpty ? (
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
                  <FilterBar />
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
                          <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.booking_id}>
                            {b.booking_id}
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
                                  <button className={styles.dropdownItem} onClick={() => handleViewDetails(b)}>View Details</button>
                                  <button className={styles.dropdownItem}>Modify Booking</button>
                                  <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={() => handleCancelBooking(b.booking_id)}>Cancel Booking</button>
                                  <button className={styles.dropdownItem}>Send Reminder</button>
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
        onConfirm={(reason) => {
          console.log(`Cancelling booking ${bookingToCancel} with reason: ${reason}`);
          setShowCancelModal(false);
        }}
      />
    </div>
  );
}

/* ─── Inline Icons ─── */
const s = 16;
const iconProps = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function MoreIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }

