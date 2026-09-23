"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { type Passenger, passengersService } from "@/services/passengers-service";
import SuspendDriverModal from "./SuspendDriverModal";
import ConfirmActionModal from "./ConfirmActionModal";
import FilterDropdown from "./FilterDropdown";
import SortDropdown from "./SortDropdown";
import MoreIcon from "./icons/MoreIcon";
import styles from "./PassengerDetailView.module.css";

interface PassengerDetailViewProps {
  passenger: Passenger;
  onBack: () => void;
  onSuspend?: (id: string) => void;
  onDeactivate?: (id: string) => void;
}

export interface PassengerBooking {
  id: string;
  bookingCode: string;
  vehicle: string;
  pickUp: string;
  dropOff: string;
  amountPaid: string;
  status: "Ongoing" | "Completed" | "Cancelled";
}

const SAMPLE_BOOKINGS: PassengerBooking[] = [
  {
    id: "bk-1",
    bookingCode: "(252) 555-0126",
    vehicle: "Toyota HighLander",
    pickUp: "Ajao Estate",
    dropOff: "Mile 2",
    amountPaid: "$1,200,000.00",
    status: "Ongoing",
  },
];

type TabType = "user-details" | "bookings";

export default function PassengerDetailView({
  passenger,
  onBack,
  onSuspend,
  onDeactivate,
}: PassengerDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("user-details");
  const [current, setCurrent] = useState<Passenger>(passenger);

  // Modals state
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Bookings Tab State
  const [bookings] = useState<PassengerBooking[]>(SAMPLE_BOOKINGS);
  const [bookingSearch, setBookingSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<"filter" | "sort" | null>(null);
  const [activeBookingFilters, setActiveBookingFilters] = useState<{ status: string[] }>({
    status: [],
  });
  const [bookingSort, setBookingSort] = useState<string>("");
  const [openKebab, setOpenKebab] = useState<string | null>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenKebab(null);
      setActiveDropdown(null);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  /* ─── Handlers ─── */
  const handleSuspendConfirm = async (reason: string) => {
    try {
      await passengersService.suspendPassenger(current.id, reason);
      setCurrent((prev) => ({ ...prev, status: "Suspended" }));
      if (onSuspend) onSuspend(current.id);
      setIsSuspendOpen(false);
    } catch (err) {
      console.error("Failed to suspend passenger:", err);
      throw err;
    }
  };

  const handleDeactivateConfirm = async () => {
    try {
      setIsActionLoading(true);
      await passengersService.deactivatePassenger(current.id);
      setCurrent((prev) => ({ ...prev, status: "Deactivated" }));
      if (onDeactivate) onDeactivate(current.id);
      setIsDeactivateOpen(false);
    } catch (err) {
      console.error("Failed to deactivate passenger:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  /* ─── Filter & Sort Bookings ─── */
  const filteredBookings = (() => {
    let result = bookings.filter(
      (b) =>
        b.bookingCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.vehicle.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.pickUp.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.dropOff.toLowerCase().includes(bookingSearch.toLowerCase())
    );

    if (activeBookingFilters.status && activeBookingFilters.status.length > 0) {
      result = result.filter((b) => activeBookingFilters.status.includes(b.status));
    }

    if (bookingSort === "vehicle_az") {
      result.sort((a, b) => a.vehicle.localeCompare(b.vehicle));
    } else if (bookingSort === "amount_high") {
      result.sort(
        (a, b) =>
          parseFloat(b.amountPaid.replace(/[^0-9.-]+/g, "")) -
          parseFloat(a.amountPaid.replace(/[^0-9.-]+/g, ""))
      );
    }

    return result;
  })();

  return (
    <div className={styles.page}>
      {/* Top Action Bar */}
      <div className={styles.topBar}>
        <button
          className={styles.backBtn}
          onClick={onBack}
          id="passenger-detail-back"
          aria-label="Go back"
        >
          <BackArrowIcon />
        </button>

        {activeTab === "user-details" && (
          <div className={styles.topActions}>
            <button
              className={styles.deactivateBtn}
              onClick={() => setIsDeactivateOpen(true)}
              id="passenger-detail-deactivate"
            >
              Deactivate Account
            </button>
            <button
              className={styles.suspendBtn}
              onClick={() => setIsSuspendOpen(true)}
              id="passenger-detail-suspend"
            >
              Suspend User
            </button>
          </div>
        )}
      </div>

      {/* Sub-tabs Navigation */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === "user-details" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("user-details")}
          id="tab-user-details"
        >
          User Details
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "bookings" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("bookings")}
          id="tab-bookings"
        >
          Bookings
        </button>
      </div>

      {activeTab === "user-details" ? (
        /* Main layout: Left Profile + Right Stats */
        <div className={styles.layout}>
          {/* ─── Left Panel (Profile Card) ─── */}
          <div className={styles.leftPanel}>
            {/* Passenger photo banner */}
            <div className={styles.photoWrap}>
              <Image
                src={
                  current.avatar && current.avatar !== "/images/admin/profile-Avatar.svg"
                    ? current.avatar
                    : "/images/reliableandsecure-female.png"
                }
                alt={current.name}
                width={500}
                height={300}
                className={styles.photo}
                priority
                unoptimized={Boolean(current.avatar?.startsWith("http"))}
              />
            </div>

            {/* Basic Info Grid */}
            <div className={styles.infoGrid}>
              {/* Row 1: Name | Phone Number | Rating */}
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Name</span>
                <span className={styles.infoValue}>{current.name}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Phone Number</span>
                <span className={styles.infoValue}>{current.phone}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Rating</span>
                <span className={styles.ratingValue}>
                  <SolidBlueStarIcon /> {current.rating?.toFixed(1) || "4.5"}
                </span>
              </div>

              {/* Row 2: Email | Emergency Contact */}
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{current.email}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Emergency Contact</span>
                <span className={styles.infoValue}>
                  {current.emergencyContact || "+2342398472047"}
                </span>
              </div>
              <div />

              {/* Row 3: Address */}
              <div className={styles.addressGroup}>
                <span className={styles.infoLabel}>Address</span>
                <span className={styles.infoValue}>
                  {current.address || "42 Montgomery Road Yaba, Lagos , Nigeria 100254"}
                </span>
              </div>
            </div>
          </div>

          {/* ─── Right Panel (Stats & Flags) ─── */}
          <div className={styles.rightPanel}>
            {/* 2×2 Performance Cards */}
            <div className={styles.perfGrid}>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>Completed Trips</span>
                <span className={styles.perfValue}>{current.completedTrips ?? 0}</span>
              </div>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>
                  Reports <InfoIcon />
                </span>
                <span className={styles.perfValue}>{current.reportsReceived ?? 0}</span>
              </div>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>Ratings</span>
                <span className={styles.perfValue}>
                  {current.rating?.toFixed(1) || "4.5"}
                </span>
              </div>
              <div className={styles.perfCard}>
                <span className={styles.perfLabel}>Cancelled Trips</span>
                <span className={styles.perfValue}>{current.cancelledTrips ?? 0}</span>
              </div>
            </div>

            {/* Flags And Reports Section */}
            <div className={styles.flagsSection}>
              <div className={styles.flagsHeader}>
                <h3 className={styles.flagsTitle}>Flags And Reports</h3>
                <span className={styles.flagsBadge}>
                  <WarningHexIcon /> {current.flagsCount || 2} New Flags
                </span>
              </div>
              <div className={styles.flagsCard} />
            </div>
          </div>
        </div>
      ) : (
        /* ─── Bookings Tab Data State (User Screenshot) ─── */
        <div className={styles.bookingsContainer} id="passenger-bookings-view">
          {/* Toolbar */}
          <div className={styles.bookingsToolbar} id="passenger-bookings-toolbar">
            <div className={styles.searchBox}>
              <SearchGlassIcon />
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
              />
            </div>

            <div className={styles.actionsWrap}>
              {/* Filter */}
              <div
                className={styles.popoverWrapper}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.toolBtn}
                  onClick={() =>
                    setActiveDropdown((prev) => (prev === "filter" ? null : "filter"))
                  }
                  id="bookings-filter-btn"
                >
                  <FilterIcon />
                  Filter
                </button>
                {activeDropdown === "filter" && (
                  <div className={styles.dropdownContainer}>
                    <FilterDropdown
                      tabs={[
                        {
                          id: "status",
                          label: "Status",
                          options: ["Ongoing", "Completed", "Cancelled"],
                        },
                      ]}
                      onApply={(filters) => {
                        setActiveBookingFilters({ status: filters.status || [] });
                        setActiveDropdown(null);
                      }}
                      onClose={() => setActiveDropdown(null)}
                    />
                  </div>
                )}
              </div>

              {/* Sort by */}
              <div
                className={styles.popoverWrapper}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.toolBtn}
                  onClick={() =>
                    setActiveDropdown((prev) => (prev === "sort" ? null : "sort"))
                  }
                  id="bookings-sort-btn"
                >
                  <SortIcon />
                  Sort by
                </button>
                {activeDropdown === "sort" && (
                  <div className={styles.dropdownContainer}>
                    <SortDropdown
                      options={[
                        { label: "Amount: High to Low", value: "amount_high" },
                        { label: "Vehicle A to Z", value: "vehicle_az" },
                      ]}
                      onSortSelect={(val) => {
                        setBookingSort(val);
                        setActiveDropdown(null);
                      }}
                      onClose={() => setActiveDropdown(null)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bookings Data Table */}
          <div className={styles.tableCard} id="passenger-bookings-table">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Vehicle</th>
                    <th>Pick Up</th>
                    <th>Drof Off</th>
                    <th>Amount Paid</th>
                    <th>Status</th>
                    <th className={styles.actionsCol} />
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className={styles.tableRow}>
                      <td className={styles.bookingCodeCell}>{b.bookingCode}</td>
                      <td className={styles.vehicleCell}>{b.vehicle}</td>
                      <td className={styles.locationCell}>{b.pickUp}</td>
                      <td className={styles.locationCell}>{b.dropOff}</td>
                      <td className={styles.amountCell}>{b.amountPaid}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            b.status === "Ongoing"
                              ? styles.badgeOngoing
                              : b.status === "Completed"
                              ? styles.badgeCompleted
                              : styles.badgeCancelled
                          }`}
                        >
                          <span className={styles.badgeDot} />
                          {b.status}
                        </span>
                      </td>
                      <td
                        className={styles.actionsCol}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className={styles.kebabWrap}>
                          <button
                            className={styles.moreBtn}
                            onClick={() =>
                              setOpenKebab((prev) => (prev === b.id ? null : b.id))
                            }
                            aria-label="Actions"
                          >
                            <MoreIcon />
                          </button>
                          {openKebab === b.id && (
                            <div className={styles.kebabMenu}>
                              <button
                                className={styles.kebabItem}
                                onClick={() => setOpenKebab(null)}
                              >
                                View Details
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className={styles.emptyRow}>
                        No bookings found for this passenger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <SuspendDriverModal
        isOpen={isSuspendOpen}
        onDismiss={() => setIsSuspendOpen(false)}
        onConfirm={handleSuspendConfirm}
      />

      <ConfirmActionModal
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Account"
        message="Are you sure you want to deactivate this account? The user will not be able to log in or request rides."
        confirmText="Deactivate Account"
        variant="danger"
        isLoading={isActionLoading}
      />
    </div>
  );
}

/* ─── SVG Icons ─── */
function BackArrowIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#344054" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function SearchGlassIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#344054" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#344054" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function SolidBlueStarIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="#2F68FE" stroke="#2F68FE" strokeWidth={1}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#868C98" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function WarningHexIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 2 7.86 7.86 2" fill="#D97706" />
      <line x1="12" y1="8" x2="12" y2="12" stroke="#ffffff" />
      <line x1="12" y1="16" x2="12.01" y2="16" stroke="#ffffff" />
    </svg>
  );
}
