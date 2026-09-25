"use client";

import { useState, useEffect, useMemo } from "react";
import AnalyticsEmptyState from "./AnalyticsEmptyState";
import Pagination from "@/components/admin/Pagination";
import { AdminDriverItem } from "@/services/analytics-services";
import styles from "./TripsTabContent.module.css";

interface DriversTabContentProps {
  drivers?: AdminDriverItem[];
  isLoading?: boolean;
}

export default function DriversTabContent({ drivers = [] }: DriversTabContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "trips" | "earnings" | "rating">("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenMenuId(null);
      setIsSortOpen(false);
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  const filteredDrivers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const result = [...(drivers || [])].filter((d) => {
      return (
        !query ||
        d.full_name?.toLowerCase().includes(query) ||
        d.email?.toLowerCase().includes(query)
      );
    });

    if (sortBy === "trips") {
      result.sort((a, b) => (b.trips ?? 0) - (a.trips ?? 0));
    } else if (sortBy === "earnings") {
      result.sort((a, b) => (b.earnings ?? 0) - (a.earnings ?? 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    return result;
  }, [drivers, searchQuery, sortBy]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage) || 1;
  const paginatedDrivers = filteredDrivers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!drivers || drivers.length === 0) {
    return <AnalyticsEmptyState title="No Drivers Data" subtitle="No drivers data is available for now" />;
  }

  return (
    <div className={styles.container}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search driver by name or email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.toolBtnWrap} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => setIsSortOpen((v) => !v)}
          >
            <SortIcon />
            Sort By
          </button>
          {isSortOpen && (
            <div className={styles.popover}>
              {[
                { label: "Default", val: "default" },
                { label: "Most Trips", val: "trips" },
                { label: "Highest Earnings", val: "earnings" },
                { label: "Highest Rating", val: "rating" },
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
              <th>Driver</th>
              <th>Ratings</th>
              <th>Acceptance Rate</th>
              <th>Cancellation Rate</th>
              <th>Trips</th>
              <th>Earnings</th>
              <th className={styles.actionsCol}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedDrivers.map((driver) => (
              <tr key={driver.id}>
                <td>
                  <div className={styles.entityCell}>
                    <span className={styles.entityName}>{driver.full_name}</span>
                    <span className={styles.entitySub}>{driver.email}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.starRating}>
                    <StarIcon />
                    <span>{driver.rating != null ? driver.rating : "-"}</span>
                  </div>
                </td>
                <td>{driver.acceptance_rate != null ? `${driver.acceptance_rate}%` : "-"}</td>
                <td>{driver.cancellation_rate != null ? `${driver.cancellation_rate}%` : "-"}</td>
                <td>{driver.trips ?? 0}</td>
                <td>${driver.earnings ?? 0}</td>
                <td className={styles.actionsCol}>
                  <div className={styles.kebabWrapper} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className={styles.moreBtn}
                      aria-label="Actions"
                      onClick={() => setOpenMenuId(openMenuId === driver.id ? null : driver.id)}
                    >
                      <MoreVerticalIcon />
                    </button>
                    {openMenuId === driver.id && (
                      <div className={styles.kebabMenu}>
                        <button type="button" className={styles.kebabMenuItem} onClick={() => setOpenMenuId(null)}>
                          View Details
                        </button>
                        <button type="button" className={styles.kebabMenuItem} onClick={() => setOpenMenuId(null)}>
                          Export Driver
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredDrivers.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
                  No drivers found matching your search.
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
function SortIcon() {
  return (<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M7 3v14" /><path d="M3 7l4-4 4 4" /><path d="M17 21V7" /><path d="M21 17l-4 4-4-4" /></svg>);
}
function StarIcon() {
  return (<svg width={14} height={14} viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth={1}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
}
function MoreVerticalIcon() {
  return (<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={5} r={1} /><circle cx={12} cy={12} r={1} /><circle cx={12} cy={19} r={1} /></svg>);
}
