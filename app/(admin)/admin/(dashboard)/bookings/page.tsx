"use client";

import { useState } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import BookingDetailView from "@/components/admin/BookingDetailView";
import CancelBookingModal from "@/components/admin/CancelBookingModal";
import { ADMIN_BOOKINGS, BOOKING_STATS_EMPTY, BOOKING_STATS_POPULATED, Booking } from "@/data/admin-bookings";
import FilterBar from "@/components/admin/FilterBar";
import styles from "./bookings.module.css";

export default function BookingsPage() {
  const [isEmpty, setIsEmpty] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const stats = isEmpty ? BOOKING_STATS_EMPTY : BOOKING_STATS_POPULATED;
  const totalPages = 16;
  const resultsPerPage = 9;

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewMode("detail");
    setOpenMenuIdx(null);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
    setOpenMenuIdx(null);
  };

  return (
    <div className={styles.page}>
      {viewMode === "detail" && selectedBooking ? (
        <BookingDetailView
          booking={selectedBooking}
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
                  <button className={styles.exportBtn}>Export Bookings</button>
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
                      {ADMIN_BOOKINGS.map((b, idx) => (
                        <tr key={idx}>
                          <td>{b.id}</td>
                          <td>{b.customerName}</td>
                          <td>{b.vehicle}</td>
                          <td>{b.bookingType}</td>
                          <td>{b.pickupDate}</td>
                          <td>{b.returnDate}</td>
                          <td>
                            <span className={`${styles.badge} ${styles[`status${b.status}`]}`}>
                              <span className={styles.badgeDot} />
                              {b.status}
                            </span>
                          </td>
                          <td className={styles.actionsCol}>
                            <div style={{ position: 'relative' }}>
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
                                  <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={() => handleCancelBooking(b.id)}>Cancel Booking</button>
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

          {/* State toggle for dev */}
          <div className={styles.devToggleWrap}>
            <button
              className={styles.stateToggle}
              onClick={() => setIsEmpty(!isEmpty)}
            >
              {isEmpty ? "Show Populated State" : "Show Empty State"}
            </button>
          </div>
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
