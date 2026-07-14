"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Spinner from "@/components/admin/Spinner";
import { bookingsService } from "@/services/bookings-service";
import styles from "./BookingDetailView.module.css";

interface BookingDetailViewProps {
  bookingId: string;
  onBack: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export default function BookingDetailView({ bookingId, onBack, onCancelBooking }: BookingDetailViewProps) {
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await bookingsService.getBookingDetail(bookingId);
        setDetailData(data);
      } catch (error) {
        console.error("Failed to fetch booking detail", error);
      } finally {
        setLoading(false);
      }
    };
    if (bookingId) fetchDetail();
  }, [bookingId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={onBack}>
              <BackIcon />
            </button>
            <div className={styles.headerTitle}>
              <p>Booking not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { booking_info, car_info, extras_info, booking_timeline } = detailData;

  //  "extras_info": {
  //       "extras": [
  //           {
  //               "extra": "Dashcam",
  //               "price": 6500
  //           },
  //           {
  //               "extra": "Airport Meet & Greet",
  //               "price": 20000
  //           }
  //       ],
  //       "extras_total": "26500.00"
  //   },
  const extras = extras_info?.extras || [];
  const extrasTotal = extras_info?.extras_total || 0;

  // Derive subtotal/total assuming we don't have detailed tax info
  const total = parseFloat(extrasTotal) || 0; // The mock only showed extras total, adjust as needed

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
              <h1 className={styles.bookingId}>{booking_info?.reference || booking_info?.id || 'N/A'}</h1>
              <button className={styles.copyBtn} aria-label="Copy ID" onClick={() => navigator.clipboard.writeText(booking_info?.reference || '')}>
                <CopyIcon />
              </button>
              <span className={`${styles.badge} ${styles[`status${booking_info?.status ? booking_info.status.charAt(0).toUpperCase() + booking_info.status.slice(1) : 'Scheduled'}`] || styles.statusUpcoming}`}>
                <span className={styles.badgeDot} />
                {booking_info?.status || 'Scheduled'}
              </span>
            </div>
            <p className={styles.dateRange}>
              Booked from <span className={styles.dateBold}>{booking_info?.pickup_date}</span> to <span className={styles.dateBold}>{booking_info?.dropoff_date}</span>
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.modifyBtn}>Modify Booking</button>
          <button className={styles.cancelBtn} onClick={() => onCancelBooking(booking_info?.id)}>Cancel Booking</button>
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
                <span className={styles.infoValue}>{booking_info?.customer || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{booking_info?.email || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone</span>
                <span className={styles.infoValue}>{booking_info?.phone_number || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Date Created</span>
                <span className={styles.infoValue}>{booking_timeline?.booking_confirmed || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Booking Type</span>
                <span className={styles.infoValue}>{"N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Payment Status</span>
                {booking_info?.payment_status?.toLowerCase() === 'paid' ? (
                  <span style={{ color: "rgba(1, 102, 48, 1)", fontWeight: "600" }}>
                    <span style={{ height: "7px", width: "7px", borderRadius: "50%", backgroundColor: "rgba(1, 102, 48, 1)", marginRight: "14px", display: "inline-block" }} />
                    Paid
                  </span>
                ) : (
                  <span style={{ color: "rgba(220, 38, 38, 1)", fontWeight: "600" }}>
                    <span style={{ height: "7px", width: "7px", borderRadius: "50%", backgroundColor: "rgba(220, 38, 38, 1)", marginRight: "14px", display: "inline-block" }} />
                    {booking_info?.payment_status || "Not Paid"}
                  </span>
                )}
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
                <span className={styles.infoValue}>{car_info?.vehicle_name || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Vehicle Category</span>
                <span className={styles.infoValue}>{car_info?.vehicle_category || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fuel Type</span>
                <span className={styles.infoValue}>{car_info?.fuel_type || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Transmission</span>
                <span className={styles.infoValue}>{car_info?.transmission || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Current Car Status</span>
                <span className={`${styles.badge} ${car_info?.car_status === 'Available' ? styles.statusAvailable : styles.statusBooked}`}>
                  <span className={styles.badgeDot} />
                  {car_info?.car_status || "N/A"}
                </span>
              </div>
            </div>
          </section>
          <div style={{ border: "1px solid rgba(226, 228, 233, 1)", margin: "0 20px" }} />

          {/* Extras */}
          {extras.length > 0 && (
            <>
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
                    {extras?.map((extra: any, i: number) => (
                      <tr key={i}>
                        <td>{extra.extra}</td>
                        <td className={styles.amount}>N{parseFloat(extra.price || '0').toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              <div style={{ border: "1px solid rgba(226, 228, 233, 1)", margin: "0 20px" }} />
            </>
          )}

          {/* Payment Summary */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Summary</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Extras Total</span>
                <span className={styles.infoValue}>N{total.toLocaleString()}</span>
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
              <TimelineItem label="Booking Confirmed" date={booking_timeline?.booking_confirmed} checked={!!booking_timeline?.booking_confirmed} />
              <TimelineItem label="Payment Completed" date={booking_timeline?.payment_completed} checked={!!booking_timeline?.payment_completed} />
              <TimelineItem label="Trip Started" date={booking_timeline?.trip_started} checked={!!booking_timeline?.trip_started} />
              <TimelineItem label="Trip Completed" date={booking_timeline?.trip_completed} checked={!!booking_timeline?.trip_completed} />
              <TimelineItem label="Vehicle Returned" date={booking_timeline?.vehicle_returned} checked={!!booking_timeline?.vehicle_returned} />
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

function TimelineItem({ label, date, checked = false }: { label: string; date?: string; checked?: boolean }) {
  return (
    <div className={styles.timelineItem}>
      <div className={`${styles.timelineCheck} ${checked ? styles.timelineCheckActive : ""}`}>
        {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </div>
      <div className={styles.timelineContent}>
        <span className={styles.timelineLabel}>{label}</span>
        <span className={styles.timelineDate}>{date || "-"}</span>
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

