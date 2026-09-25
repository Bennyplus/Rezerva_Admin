"use client";

import { useState, useEffect, useMemo } from "react";
import AnalyticsEmptyState from "./AnalyticsEmptyState";
import Pagination from "@/components/admin/Pagination";
import { AdminTripItem } from "@/services/analytics-services";
import styles from "./TripsTabContent.module.css";

interface TripsTabContentProps {
  trips?: AdminTripItem[];
  isLoading?: boolean;
}

export default function TripsTabContent({ trips = [] }: TripsTabContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"default" | "driver" | "status">("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenMenuId(null);
      setIsFilterOpen(false);
      setIsSortOpen(false);
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  const filteredTrips = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const result = [...(trips || [])].filter((t) => {
      const matchQuery =
        !query ||
        t.origin?.toLowerCase().includes(query) ||
        t.destination?.toLowerCase().includes(query) ||
        t.driver?.toLowerCase().includes(query) ||
        t.email?.toLowerCase().includes(query) ||
        t.passengers?.some((p) => p.full_name?.toLowerCase().includes(query));
      const matchStatus = statusFilter === "All" || t.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchQuery && matchStatus;
    });

    if (sortBy === "driver") {
      result.sort((a, b) => (a.driver || "").localeCompare(b.driver || ""));
    } else if (sortBy === "status") {
      result.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    }
    return result;
  }, [trips, searchQuery, statusFilter, sortBy]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage) || 1;
  const paginatedTrips = filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!trips || trips.length === 0) {
    return <AnalyticsEmptyState title="No Trips Data" subtitle="No trips data is available for now" />;
  }

  return (
    <div className={styles.container}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by route, driver, passenger..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.toolBtnWrap} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`${styles.toolBtn} ${statusFilter !== "All" ? styles.toolBtnActive : ""}`}
            onClick={() => { setIsFilterOpen((v) => !v); setIsSortOpen(false); }}
          >
            <FilterIcon />
            {statusFilter === "All" ? "Filter" : statusFilter}
          </button>
          {isFilterOpen && (
            <div className={styles.popover}>
              {["All", "completed", "upcoming", "cancelled"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`${styles.popoverItem} ${statusFilter.toLowerCase() === status.toLowerCase() ? styles.popoverItemActive : ""}`}
                  onClick={() => { setStatusFilter(status); setIsFilterOpen(false); setCurrentPage(1); }}
                >
                  {status === "All" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.toolBtnWrap} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => { setIsSortOpen((v) => !v); setIsFilterOpen(false); }}
          >
            <SortIcon />
            Sort By
          </button>
          {isSortOpen && (
            <div className={styles.popover}>
              {[
                { label: "Default", val: "default" },
                { label: "Driver Name", val: "driver" },
                { label: "Status", val: "status" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  className={`${styles.popoverItem} ${sortBy === opt.val ? styles.popoverItemActive : ""}`}
                  onClick={() => { setSortBy(opt.val as any); setIsSortOpen(false); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Route</th>
              <th>Driver</th>
              <th>Departure</th>
              <th>Seats</th>
              <th>Price</th>
              <th>Passengers</th>
              <th>Status</th>
              <th className={styles.actionsCol}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrips.map((trip) => {
              const statusKey = trip.status?.toLowerCase();
              const statusClass =
                statusKey === "completed"
                  ? styles.statusCompleted
                  : statusKey === "upcoming"
                  ? styles.statusUpcoming
                  : statusKey === "cancelled"
                  ? styles.statusCancelled
                  : styles.statusDefault;

              return (
                <tr key={trip.id}>
                  <td>
                    <div className={styles.routeCell}>
                      <span className={styles.routeText} title={trip.origin}>{trip.origin}</span>
                      <span className={styles.routeArrow}><ArrowRightIcon /></span>
                      <span className={styles.routeText} title={trip.destination}>{trip.destination}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.entityCell}>
                      <span className={styles.entityName}>{trip.driver}</span>
                      <span className={styles.entitySub}>{trip.phone_number || trip.email}</span>
                    </div>
                  </td>
                  <td>{trip.departure_time || "-"}</td>
                  <td>{trip.available_seats || "-"}</td>
                  <td>${trip.price_per_seat || "0.00"}</td>
                  <td>
                    <span className={styles.passengersBadge} title={trip.passengers?.map((p) => p.full_name).join(", ")}>
                      {trip.passengers?.length ?? 0} passenger{trip.passengers?.length === 1 ? "" : "s"}
                    </span>
                  </td>
                  <td>
                    <span className={statusClass}>
                      <span className={styles.statusDot} />
                      {trip.status || "Unknown"}
                    </span>
                  </td>
                  <td className={styles.actionsCol}>
                    <div className={styles.kebabWrapper} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={styles.moreBtn}
                        aria-label="Actions"
                        onClick={() => setOpenMenuId(openMenuId === trip.id ? null : trip.id)}
                      >
                        <MoreVerticalIcon />
                      </button>
                      {openMenuId === trip.id && (
                        <div className={styles.kebabMenu}>
                          <button type="button" className={styles.kebabMenuItem} onClick={() => setOpenMenuId(null)}>
                            View Details
                          </button>
                          <button type="button" className={styles.kebabMenuItem} onClick={() => setOpenMenuId(null)}>
                            Export Trip
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredTrips.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.emptyRow}>
                  No trips found matching your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          resultsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

function SearchIcon() {
  return (<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#868C98" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2={16.65} y2={16.65} /></svg>);
}
function FilterIcon() {
  return (<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={4} y1={6} x2={20} y2={6} /><line x1={7} y1={12} x2={17} y2={12} /><line x1={10} y1={18} x2={14} y2={18} /></svg>);
}
function SortIcon() {
  return (<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M7 3v14" /><path d="M3 7l4-4 4 4" /><path d="M17 21V7" /><path d="M21 17l-4 4-4-4" /></svg>);
}
function ArrowRightIcon() {
  return (<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={5} y1={12} x2={19} y2={12} /><polyline points="12 5 19 12 12 19" /></svg>);
}
function MoreVerticalIcon() {
  return (<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={5} r={1} /><circle cx={12} cy={12} r={1} /><circle cx={12} cy={19} r={1} /></svg>);
}
