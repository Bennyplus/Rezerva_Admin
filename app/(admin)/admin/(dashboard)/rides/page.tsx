"use client";

import React, { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import FilterBar from "@/components/admin/FilterBar";
import FilterDropdown from "@/components/admin/FilterDropdown";
import SortDropdown from "@/components/admin/SortDropdown";
import {
  ADMIN_RIDES,
  RIDE_STATS_EMPTY,
  RIDE_STATS_POPULATED,
  Ride,
  RideStat,
} from "@/data/admin-rides";
import { ridesService } from "@/services/rides-service";
import styles from "./rides.module.css";

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>(ADMIN_RIDES);
  const [stats, setStats] = useState<RideStat[]>(RIDE_STATS_POPULATED);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [sortOption, setSortOption] = useState<string>("default");

  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;

  // Fetch backend data if available, fallback to mock data
  useEffect(() => {
    async function loadData() {
      try {
        const [ridesData, metricsData] = await Promise.all([
          ridesService.getRides(),
          ridesService.getMetrics(),
        ]);

        if (ridesData && Array.isArray(ridesData)) {
          setRides(ridesData);
        } else if (ridesData?.results && Array.isArray(ridesData.results)) {
          setRides(ridesData.results);
        }

        if (metricsData?.metrics) {
          setStats([
            {
              id: "total-trips-created",
              label: "Total Trips Created",
              value: metricsData.metrics.total_trips || 0,
            },
            {
              id: "total-upcoming-trips",
              label: "Total Upcoming Trips",
              value: metricsData.metrics.upcoming_trips || 0,
            },
            {
              id: "total-completed",
              label: "Total Completed",
              value: metricsData.metrics.completed_trips || 0,
            },
            {
              id: "total-cancelled",
              label: "Total Cancelled",
              value: metricsData.metrics.cancelled_trips || 0,
            },
          ]);
        }
      } catch (err) {
        console.warn("Using local rides dataset:", err);
      }
    }
    loadData();
  }, []);

  // Close kebab menu on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuIdx !== null) {
        setOpenMenuIdx(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuIdx]);

  // Filtered and sorted dataset
  const filteredRides = useMemo(() => {
    return rides
      .filter((ride) => {
        // Status filter from activeFilters
        if (activeFilters.status && activeFilters.status.length > 0) {
          if (!activeFilters.status.includes(ride.status)) {
            return false;
          }
        }

        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          ride.driver.toLowerCase().includes(q) ||
          ride.origin.toLowerCase().includes(q) ||
          ride.destination.toLowerCase().includes(q) ||
          ride.departureTime.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortOption === "price_asc") return a.price - b.price;
        if (sortOption === "price_desc") return b.price - a.price;
        if (sortOption === "driver_asc") return a.driver.localeCompare(b.driver);
        if (sortOption === "driver_desc") return b.driver.localeCompare(a.driver);
        return 0;
      });
  }, [rides, searchQuery, activeFilters, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredRides.length / resultsPerPage));
  const paginatedRides = filteredRides.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const getStatusBadgeClass = (status: Ride["status"]) => {
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
        return styles.statusCompleted;
    }
  };

  const hasData = rides.length > 0;

  return (
    <div className={styles.container}>
      {/* ─── Stat Cards ─── */}
      <div className={styles.statsGrid}>
        {(hasData ? stats : RIDE_STATS_EMPTY).map((stat) => (
          <StatCard
            key={stat.id}
            id={stat.id}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      {/* ─── Main Content Area ─── */}
      {!hasData ? (
        /* Screen 1: Empty / Inactive State */
        <div className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No Trips Set Yet</h2>
          <p className={styles.emptySubtitle}>
            Trips will appear here once drivers begin scheduling
          </p>
        </div>
      ) : (
        /* Screen 2: Active / Populated State */
        <>
          {/* Toolbar */}
          <div className={styles.toolbar} id="rides-toolbar">
            <div className={styles.toolbarLeft}>
              <FilterBar
                searchValue={searchQuery}
                onSearchChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                filterDropdown={
                  <FilterDropdown
                    tabs={[
                      {
                        id: "status",
                        label: "Status",
                        options: ["Completed", "Upcoming", "Ongoing", "Cancelled"],
                      },
                    ]}
                    onApply={(filters) => {
                      setActiveFilters(filters);
                      setCurrentPage(1);
                    }}
                    initialFilters={activeFilters}
                  />
                }
                sortDropdown={
                  <SortDropdown
                    options={[
                      { label: "Driver A to Z", value: "driver_asc" },
                      { label: "Driver Z to A", value: "driver_desc" },
                      { label: "Price Low to High", value: "price_asc" },
                      { label: "Price High to Low", value: "price_desc" },
                    ]}
                    onSortSelect={(sort) => {
                      setSortOption(sort);
                      setCurrentPage(1);
                    }}
                  />
                }
              />
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
                  {paginatedRides.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "48px 16px", color: "#868C98" }}>
                        No matching rides found
                      </td>
                    </tr>
                  ) : (
                    paginatedRides.map((ride, idx) => (
                      <tr key={ride.id}>
                        <td className={styles.driverCell}>{ride.driver}</td>
                        <td className={styles.addressCell} title={ride.origin}>
                          {ride.origin}
                        </td>
                        <td className={styles.addressCell} title={ride.destination}>
                          {ride.destination}
                        </td>
                        <td className={styles.timeCell}>{ride.departureTime}</td>
                        <td className={styles.seatsCell}>{ride.availableSeats}</td>
                        <td className={styles.priceCell}>${ride.price.toFixed(2)}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${getStatusBadgeClass(
                              ride.status
                            )}`}
                          >
                            <span className={styles.badgeDot} />
                            {ride.status}
                          </span>
                        </td>
                        <td className={styles.actionsCol}>
                          <div className={styles.actionMenuWrapper}>
                            <button
                              className={styles.moreBtn}
                              aria-label="More actions"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuIdx(openMenuIdx === idx ? null : idx);
                              }}
                            >
                              <MoreDotsIcon />
                            </button>

                            {openMenuIdx === idx && (
                              <div
                                className={styles.kebabMenu}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className={styles.kebabMenuItem}
                                  onClick={() => {
                                    setOpenMenuIdx(null);
                                    alert(`Viewing details for ${ride.driver}'s ride`);
                                  }}
                                >
                                  View Details
                                </button>
                                <button
                                  className={styles.kebabMenuItem}
                                  onClick={() => {
                                    setOpenMenuIdx(null);
                                    alert(`Editing ride ${ride.id}`);
                                  }}
                                >
                                  Edit Ride
                                </button>
                                <button
                                  className={styles.kebabMenuItem}
                                  onClick={() => {
                                    setOpenMenuIdx(null);
                                    alert(`Cancel ride ${ride.id}`);
                                  }}
                                >
                                  Cancel Ride
                                </button>
                                <button
                                  className={styles.kebabMenuItem}
                                  onClick={() => {
                                    setOpenMenuIdx(null);
                                    alert(`Contacting driver: ${ride.driverPhone || ride.driver}`);
                                  }}
                                >
                                  Contact Driver
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              resultsPerPage={resultsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Inline SVG Icons ─── */
function MoreDotsIcon() {
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
      <circle cx={12} cy={12} r={1} />
      <circle cx={12} cy={5} r={1} />
      <circle cx={12} cy={19} r={1} />
    </svg>
  );
}
