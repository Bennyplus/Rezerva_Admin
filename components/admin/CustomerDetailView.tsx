"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Pagination from "@/components/admin/Pagination";
import { type Customer, type CustomerBooking } from "@/data/admin-customers";
import { customersService } from "@/services/customers-service";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import SuspendUserModal from "@/components/admin/SuspendUserModal";
import Spinner from "@/components/admin/Spinner";
import styles from "./CustomerDetailView.module.css";

type DetailTab = "user-details" | "bookings" | "reviews" | "activity-log";

interface CustomerDetailViewProps {
  customer: Customer; // Base row data
  onBack: (refresh?: boolean) => void;
  showToast: (msg: string) => void;
}

export default function CustomerDetailView({
  customer,
  onBack,
  showToast
}: CustomerDetailViewProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("user-details");

  // Data states
  const [detailData, setDetailData] = useState<Customer>(customer);
  const [detailLoading, setDetailLoading] = useState(true);
  const [bookingsData, setBookingsData] = useState<CustomerBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsFetched, setBookingsFetched] = useState(false);
  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsFetched, setReviewsFetched] = useState(false);

  // Pagination & Search
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingPage, setBookingPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);

  // Modal & action states
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch full details on mount
  useEffect(() => {
    if (customer.userId) {
      fetchDetails(customer.userId);
    } else {
      setDetailLoading(false); // mock data fallback
    }
  }, [customer.userId]);

  const fetchDetails = async (userId: number) => {
    setDetailLoading(true);
    try {
      const data = await customersService.getCustomerInfo(userId);
      setDetailData(prev => ({
        ...prev,
        emergencyContact: data?.emergency_contact?.[0] ? `${data.emergency_contact[0].name} (${data.emergency_contact[0].phone_number})` : prev.emergencyContact,
        address: data?.address || prev.address,
      }));
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // Fetch bookings lazily when tab is clicked
  useEffect(() => {
    if (activeTab === "bookings" && !bookingsFetched && customer.userId) {
      fetchBookings(customer.userId);
    }
  }, [activeTab, bookingsFetched, customer.userId]);

  const fetchBookings = async (userId: number) => {
    setBookingsLoading(true);
    try {
      const data = await customersService.getCustomerBookings(userId);
      const mappedBookings: CustomerBooking[] = (data || []).map((b: any) => ({
        id: b.booking_id,
        vehicle: b.vehicle,
        startDate: b.start_date || "",
        endDate: b.end_date || "",
        amountPaid: b.amount_paid,
        bookingType: b.booking_type,
        status: b.status === "scheduled" ? "Active" : b.status === "completed" ? "Completed" : "Cancelled"
      }));
      setBookingsData(mappedBookings);
      setBookingsFetched(true);
    } catch (error) {
      console.error("Failed to fetch customer bookings:", error);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Fetch reviews lazily
  useEffect(() => {
    if (activeTab === "reviews" && !reviewsFetched && customer.userId) {
      fetchReviews(customer.userId);
    }
  }, [activeTab, reviewsFetched, customer.userId]);

  const fetchReviews = async (userId: number) => {
    setReviewsLoading(true);
    try {
      const data = await customersService.getCustomerReviews(userId);
      setReviewsData(data || []);
      setReviewsFetched(true);
    } catch (error) {
      console.error("Failed to fetch customer reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSuspend = async (reason: string) => {
    if (!customer.userId) return;
    setIsActionLoading(true);
    try {
      await customersService.suspendCustomer(customer.userId, { reason });
      showToast(`${customer.name} suspended successfully.`);
      setIsSuspendModalOpen(false);
      onBack(true); // Return and refresh list
    } catch (error) {
      console.error("Suspend failed:", error);
      showToast(`Error: Failed to suspend ${customer.name}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!customer.userId) return;
    setIsActionLoading(true);
    try {
      await customersService.deactivateCustomer(customer.userId);
      showToast(`${customer.name} deactivated successfully.`);
      setIsDeactivateModalOpen(false);
      onBack(true); // Return and refresh list
    } catch (error) {
      console.error("Deactivate failed:", error);
      showToast(`Error: Failed to deactivate ${customer.name}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredBookings = bookingsData.filter(
    (b) =>
      b.vehicle.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.id.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => onBack(false)} id="customer-detail-back" aria-label="Go back">
          <BackIcon />
        </button>
        <div className={styles.topBarActions}>
          <button
            className={styles.deactivateBtn}
            onClick={() => setIsDeactivateModalOpen(true)}
            disabled={isActionLoading}
            id="customer-deactivate-btn"
          >
            Deactivate Account
          </button>
          <button
            className={styles.suspendBtn}
            onClick={() => setIsSuspendModalOpen(true)}
            disabled={isActionLoading}
            id="customer-suspend-btn"
          >
            Suspend User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabBar}>
        {(["user-details", "bookings", "reviews", "activity-log"] as DetailTab[]).map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab)}
            id={`customer-tab-${tab}`}
          >
            {tab === "user-details" ? "User Details" : tab === "bookings" ? "Bookings" : tab === "reviews" ? "Reviews" : "Activity Log"}
          </button>
        ))}
      </div>

      {/* ─── User Details Tab ─── */}
      {activeTab === "user-details" && (
        <div className={styles.detailLayout}>
          {/* Left: profile + info */}
          <div className={styles.leftPanel}>
            {/* Photo */}
            <div className={styles.photoWrap}>
              <Image
                src={detailData.avatar}
                alt={detailData.name}
                width={320}
                height={200}
                className={styles.photo}
              />
            </div>

            {/* Info grid */}
            <div className={styles.infoGrid}>
              {/* Name + Phone side by side */}
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Name</span>
                <span className={styles.infoValue}>{detailData.name}</span>
              </div>
              <div className={styles.infoGroup}>
                <div className={styles.phoneHeader}>
                  <span className={styles.infoLabel}>Phone Number</span>
                  <VerificationBadge status={detailData.verificationStatus} />
                </div>
                <span className={styles.infoValue}>{detailData.phone}</span>
              </div>

              {/* Email + Emergency Contact */}
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{detailData.email}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Emergency Contact</span>
                <span className={styles.infoValue}>
                  {detailLoading ? (
                    <Spinner size={16} color="#868C98" />
                  ) : (
                    detailData.emergencyContact || "—"
                  )}
                </span>
              </div>

              {/* License Status */}
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Verification Status</span>
                <span className={`${styles.infoValue} ${detailData.licenseStatus === "Expired" ? styles.expiredText : ""}`}>
                  {detailData.licenseStatus}
                </span>
              </div>
              <div className={styles.infoGroupFull}>
                <span className={styles.infoLabel}>Address</span>
                <span className={styles.infoValue}>
                  {detailLoading ? (
                    <Spinner size={16} color="#868C98" />
                  ) : (
                    detailData.address || "—"
                  )}
                </span>
              </div>
            </div>

            {/* Documents */}
            <div className={styles.docsSection}>
              <div className={styles.docsGrid}>
                <div className={styles.docBlock}>
                  <p className={styles.docLabel}>Drivers License</p>
                  <div className={styles.docTile}>
                    <PdfIcon />
                    <div className={styles.docInfo}>
                      <span className={styles.docName}>{detailData.documents.driversLicense.filename || "No document"}</span>
                      <span className={styles.docMeta}>0 KB of {detailData.documents.driversLicense.size || "0 KB"} •</span>
                    </div>
                  </div>
                </div>
                <div className={styles.docBlock}>
                  <p className={styles.docLabel}>Citizenship Document</p>
                  <div className={styles.docTile}>
                    <PdfIcon />
                    <div className={styles.docInfo}>
                      <span className={styles.docName}>{detailData.documents.citizenshipDocument.filename || "No document"}</span>
                      <span className={styles.docMeta}>0 KB of {detailData.documents.citizenshipDocument.size || "0 KB"} •</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: flags & reports */}
          <div className={styles.rightPanel}>
            <div className={styles.flagsCard}>
              <div className={styles.flagsHeader}>
                <h3 className={styles.flagsTitle}>Flags And Reports</h3>
                {detailData.flagsCount > 0 && (
                  <span className={styles.flagsBadge}>
                    <FlagIcon />
                    {detailData.flagsCount} New Flag{detailData.flagsCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {detailData.flagsCount === 0 ? (
                <p className={styles.flagsEmpty}>No flags or reports for this user.</p>
              ) : (
                <div className={styles.flagsList}>
                  {Array.from({ length: detailData.flagsCount }).map((_, i) => (
                    <div key={i} className={styles.flagItem}>
                      <WarningIcon />
                      <div className={styles.flagContent}>
                        <span className={styles.flagTitle}>Flag #{i + 1}</span>
                        <span className={styles.flagDesc}>Reported for suspicious activity</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Bookings Tab ─── */}
      {activeTab === "bookings" && (
        <div className={styles.tableCard}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <div className={styles.searchBox}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.searchInput}
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  id="bookings-search"
                />
              </div>
              <button className={styles.toolBtn} id="bookings-filter-btn">
                <FilterIcon /> Filter
              </button>
              <button className={styles.toolBtn} id="bookings-sort-btn">
                <SortIcon /> Sort by
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Vehicle</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Amount Paid</th>
                  <th>Booking Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookingsLoading ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "40px" }}>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredBookings.map((booking, i) => (
                      <BookingRow key={i} booking={booking} />
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={8} className={styles.emptyRow}>No bookings found.</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={bookingPage}
            totalPages={Math.max(1, Math.ceil(filteredBookings.length / 9))}
            resultsPerPage={9}
            onPageChange={setBookingPage}
            variant="table"
          />
        </div>
      )}

      {/* ─── Reviews Tab ─── */}
      {activeTab === "reviews" && (
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date Posted</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {reviewsLoading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "40px" }}>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {reviewsData.slice((reviewPage - 1) * 9, reviewPage * 9).map((review, i) => (
                      <tr key={i}>
                        <td className={styles.dateCell}>{review.date_posted || "—"}</td>
                        <td>{review.rating ? `${review.rating} ⭐` : "—"}</td>
                        <td>
                          <span className={`${styles.badge} ${review.status === 'Active' ? styles.bsBadgeGreen : styles.bsBadgeGray}`}>
                            <span className={styles.badgeDot} />
                            {review.status || "—"}
                          </span>
                        </td>
                        <td>{review.review || "—"}</td>
                      </tr>
                    ))}
                    {reviewsData.length === 0 && (
                      <tr>
                        <td colSpan={4} className={styles.emptyRow}>No reviews found.</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={reviewPage}
            totalPages={Math.max(1, Math.ceil(reviewsData.length / 9))}
            resultsPerPage={9}
            onPageChange={setReviewPage}
            variant="table"
          />
        </div>
      )}

      {/* ─── Activity Log Tab ─── */}
      {activeTab === "activity-log" && (
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {detailData.activityLog.map((entry) => (
                  <tr key={entry.id}>
                    <td className={styles.activityAction}>{entry.action}</td>
                    <td>{entry.details}</td>
                    <td className={styles.dateCell}>{entry.timestamp}</td>
                  </tr>
                ))}
                {detailData.activityLog.length === 0 && (
                  <tr>
                    <td colSpan={3} className={styles.emptyRow}>No activity yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {isSuspendModalOpen && (
        <SuspendUserModal
          isOpen={isSuspendModalOpen}
          onClose={() => setIsSuspendModalOpen(false)}
          onSubmit={handleSuspend}
          userName={customer.name}
          isLoading={isActionLoading}
        />
      )}

      {isDeactivateModalOpen && (
        <ConfirmActionModal
          isOpen={isDeactivateModalOpen}
          title="Deactivate Account"
          message={`Are you sure you want to deactivate ${customer.name}'s account? They will not be able to log in until the account is reactivated.`}
          confirmText="Deactivate"
          onConfirm={handleDeactivate}
          onClose={() => setIsDeactivateModalOpen(false)}
          isLoading={isActionLoading}
          isDanger
        />
      )}
    </div>
  );
}

/* ─── Booking row sub-component ─── */
function BookingRow({ booking }: { booking: CustomerBooking }) {
  const badgeCls =
    booking.status === "Active" ? styles.bsBadgeGreen :
      booking.status === "Completed" ? styles.bsBadgeGray :
        styles.bsBadgeRed;

  return (
    <tr>
      <td>{booking.id}</td>
      <td>{booking.vehicle}</td>
      <td className={styles.dateCell}>{booking.startDate}</td>
      <td className={styles.dateCell}>{booking.endDate}</td>
      <td>{booking.amountPaid}</td>
      <td>{booking.bookingType}</td>
      <td>
        <span className={`${styles.badge} ${badgeCls}`}>
          <span className={styles.badgeDot} />
          {booking.status}
        </span>
      </td>
    </tr>
  );
}

/* ─── Verification Badge ─── */
function VerificationBadge({ status }: { status: string }) {
  if (status !== "Verified") return null;
  return (
    <span className={styles.verifiedBadge}>
      <span className={styles.verifiedDot} />
      Verified
    </span>
  );
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

function PdfIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" strokeWidth={1}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <line x1="4" y1="6" x2="13" y2="6" /><line x1="4" y1="12" x2="10" y2="12" /><line x1="4" y1="18" x2="7" y2="18" /><line x1="18" y1="6" x2="18" y2="18" /><polyline points="15 15 18 18 21 15" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  );
}
