"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import RideDetailView from "@/components/admin/RideDetailView";
import CancelRideModal from "@/components/admin/CancelRideModal";
import { useToast } from "@/lib/toast-context";
import { Ride } from "@/data/admin-rides";
import {
  ridesService,
  RideDashboardData,
  ApiTrip,
} from "@/services/rides-service";
import styles from "./rides.module.css";

function formatTime(timeStr?: string) {
  if (!timeStr) return "—";
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

function mapApiTripToRide(item: ApiTrip): Ride {
  const statusRaw = (item.status || "").toLowerCase();
  let statusNorm: "Completed" | "Upcoming" | "Ongoing" | "Cancelled" =
    "Upcoming";
  if (statusRaw === "completed") statusNorm = "Completed";
  else if (statusRaw === "ongoing") statusNorm = "Ongoing";
  else if (statusRaw === "cancelled") statusNorm = "Cancelled";

  const parsedPrice =
    parseFloat(String(item.price_per_seat || "0").replace(/[^0-9.]/g, "")) || 0;

  return {
    id: item.id,
    driver: item.driver || "—",
    origin: item.origin || "—",
    destination: item.destination || "—",
    departureTime: formatTime(item.departure_time),
    availableSeats: `${item.available_seats}`,
    price: parsedPrice,
    status: statusNorm,
  };
}

export default function RidesPage() {
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedTripId, setSelectedTripId] = useState<number | string | null>(
    null,
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [tripToCancel, setTripToCancel] = useState<number | string | null>(
    null,
  );
  const [detailRefreshKey, setDetailRefreshKey] = useState(0);

  const [rides, setRides] = useState<Ride[]>([]);
  const [dashboardMetrics, setDashboardMetrics] =
    useState<RideDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("default");
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;

  // Fetch live dashboard metrics and trips list from API
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metrics, tripsData] = await Promise.all([
        ridesService.getDashboard().catch((e) => {
          console.error("Dashboard error:", e);
          return null;
        }),
        ridesService.getTrips().catch((e) => {
          console.error("Trips error:", e);
          return null;
        }),
      ]);

      if (metrics) {
        setDashboardMetrics(metrics);
      }

      if (Array.isArray(tripsData) && tripsData.length > 0) {
        setRides(tripsData.map(mapApiTripToRide));
      } else {
        setRides([]);
      }
    } catch (error) {
      console.error("Failed to fetch ride data:", error);
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
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        ride.driver.toLowerCase().includes(q) ||
        ride.origin.toLowerCase().includes(q) ||
        ride.destination.toLowerCase().includes(q) ||
        ride.status.toLowerCase().includes(q)
      );
    });
  }, [rides, searchQuery]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRides.length / resultsPerPage),
  );
  const paginatedRides = useMemo(() => {
    const start = (currentPage - 1) * resultsPerPage;
    return filteredRides.slice(start, start + resultsPerPage);
  }, [filteredRides, currentPage, resultsPerPage]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
        return styles.statusCompleted;
      case "Upcoming":
        return styles.statusUpcoming;
      case "Ongoing":
        return styles.statusOngoing;
      case "Cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusUpcoming;
    }
  };

  // Metrics from dashboard endpoint (or 0 if not loaded)
  const totalTripsCreated = dashboardMetrics?.total_trips ?? 0;
  const totalUpcomingTrips = dashboardMetrics?.trips_today ?? 0;
  const totalCompleted = dashboardMetrics?.completed_trips ?? 0;
  const totalCancelled = dashboardMetrics?.cancelled_trips ?? 0;

  // Action Handlers
  const handleViewDetails = (tripId: number | string) => {
    setSelectedTripId(tripId);
    setViewMode("detail");
    setOpenMenuIdx(null);
  };

  const handleEditRide = (tripId: number | string) => {
    setOpenMenuIdx(null);
    showToast("info", `Edit ride #${tripId} feature coming soon.`);
  };

  const handleOpenCancelModal = (tripId: number | string) => {
    setOpenMenuIdx(null);
    setTripToCancel(tripId);
    setShowCancelModal(true);
  };

  const handleContactDriver = (ride: Ride) => {
    setOpenMenuIdx(null);
    if (ride.driverPhone) {
      window.location.href = `tel:${ride.driverPhone}`;
    } else {
      showToast("info", `Driver: ${ride.driver}`);
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!tripToCancel) return;
    await ridesService.cancelTrip(tripToCancel, reason);
    showToast("success", "Ride cancelled successfully.");
    setShowCancelModal(false);
    setTripToCancel(null);
    setDetailRefreshKey((k) => k + 1);
    await loadData();
  };

  return (
    <div className={styles.container}>
      {viewMode === "detail" && selectedTripId ? (
        <RideDetailView
          key={detailRefreshKey}
          tripId={selectedTripId}
          onBack={() => setViewMode("list")}
          onCancel={handleOpenCancelModal}
          onEdit={handleEditRide}
        />
      ) : (
        <>
          {/* ─── Top 4 Stat Cards (Screenshots 1 & 2) ─── */}
          <div className={styles.statsGrid}>
            <StatCard
              id="stat-total-trips"
              label="Total Trips Created"
              value={totalTripsCreated}
            />
            <StatCard
              id="stat-upcoming-trips"
              label="Total Upcoming Trips"
              value={totalUpcomingTrips}
            />
            <StatCard
              id="stat-completed-trips"
              label="Total Completed"
              value={totalCompleted}
            />
            <StatCard
              id="stat-cancelled-trips"
              label="Total Cancelled"
              value={totalCancelled}
            />
          </div>

          {/* ─── Content: Loading vs Inactive (Screenshot 1) vs Active (Screenshot 2) ─── */}
          {isLoading ? (
            <div className={styles.emptyCard}>
              <Spinner size={28} />
              <p className={styles.emptySubtitle}>Loading trips…</p>
            </div>
          ) : rides.length === 0 ? (
            /* ── Inactive / Empty State ── */
            <div className={styles.emptyCard} id="rides-empty-state">
              <h2 className={styles.emptyTitle}>No Trips Set Yet</h2>
              <p className={styles.emptySubtitle}>
                Trips will appear here once drivers begin scheduling
              </p>
            </div>
          ) : (
            /* ── Active Dashboard State ── */
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
                        <th>Driver</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Departure Time</th>
                        <th>Available Seats</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th className={styles.actionsCol}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRides.map((ride, idx) => (
                        <tr key={ride.id ?? idx}>
                          {/* Driver */}
                          <td className={styles.driverCell}>{ride.driver}</td>

                          {/* Origin */}
                          <td
                            className={styles.addressCell}
                            title={ride.origin}
                          >
                            {ride.origin}
                          </td>

                          {/* Destination */}
                          <td
                            className={styles.addressCell}
                            title={ride.destination}
                          >
                            {ride.destination}
                          </td>

                          {/* Departure Time */}
                          <td className={styles.timeCell}>
                            {ride.departureTime}
                          </td>

                          {/* Available Seats */}
                          <td className={styles.seatsCell}>
                            {ride.availableSeats}
                          </td>

                          {/* Price */}
                          <td className={styles.priceCell}>
                            $
                            {typeof ride.price === "number"
                              ? ride.price.toFixed(2)
                              : ride.price}
                          </td>

                          {/* Status Badge */}
                          <td>
                            <span
                              className={`${styles.statusBadge} ${getStatusBadgeClass(ride.status)}`}
                            >
                              <span className={styles.badgeDot} />
                              {ride.status}
                            </span>
                          </td>

                          {/* Actions Kebab  */}
                          <td className={styles.actionsCol}>
                            <div className={styles.actionMenuWrapper}>
                              <button
                                type="button"
                                className={styles.moreBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuIdx((prev) =>
                                    prev === idx ? null : idx,
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
                                    onClick={() => handleViewDetails(ride.id)}
                                  >
                                    View Details
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.kebabMenuItem}
                                    onClick={() => handleEditRide(ride.id)}
                                  >
                                    Edit Ride
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.kebabMenuItem}
                                    onClick={() =>
                                      handleOpenCancelModal(ride.id)
                                    }
                                  >
                                    Cancel Ride
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.kebabMenuItem}
                                    onClick={() => handleContactDriver(ride)}
                                  >
                                    Contact Driver
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
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

      {/* ─── Cancel Ride Confirmation Modal (Screenshot 3) ─── */}
      <CancelRideModal
        isOpen={showCancelModal}
        tripId={tripToCancel}
        onClose={() => {
          setShowCancelModal(false);
          setTripToCancel(null);
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
