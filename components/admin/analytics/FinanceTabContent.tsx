"use client";

import { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/admin/Pagination";
import { AdminFinanceItem } from "@/services/analytics-services";
import styles from "./TripsTabContent.module.css";

interface FinanceTabContentProps {
  financeItems?: AdminFinanceItem[];
  isLoading?: boolean;
}

function formatMoney(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === "") return "$0";
  if (typeof val === "string" && val.startsWith("$")) return val;
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return `$${num.toLocaleString()}`;
}

export default function FinanceTabContent({
  financeItems = [],
}: FinanceTabContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"default" | "revenue_desc">("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenMenuId(null);
      setIsFilterOpen(false);
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const result = [...financeItems].filter((item) => {
      const matchQuery =
        !query ||
        item.period?.toLowerCase().includes(query) ||
        String(item.revenue).toLowerCase().includes(query) ||
        String(item.commission).toLowerCase().includes(query) ||
        String(item.payout).toLowerCase().includes(query);

      const matchYear =
        filterYear === "All" ||
        (item.period && item.period.includes(filterYear));
      return matchQuery && matchYear;
    });

    if (sortBy === "revenue_desc") {
      result.sort((a, b) => {
        const numA = Number(String(a.revenue).replace(/[^0-9.-]+/g, "")) || 0;
        const numB = Number(String(b.revenue).replace(/[^0-9.-]+/g, "")) || 0;
        return numB - numA;
      });
    }
    return result;
  }, [financeItems, searchQuery, filterYear, sortBy]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className={styles.container}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
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

        <button
          type="button"
          className={`${styles.toolBtn} ${sortBy === "revenue_desc" ? styles.toolBtnActive : ""}`}
          onClick={() => {
            setSortBy((prev) => (prev === "revenue_desc" ? "default" : "revenue_desc"));
            setIsFilterOpen(false);
          }}
        >
          <SortIcon />
          Sort By
        </button>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Period</th>
              <th>Revenue</th>
              <th>Commission</th>
              <th>Refund</th>
              <th>Payout</th>
              <th>Taxes</th>
              <th className={styles.actionsCol}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, idx) => {
              const itemId = item.id ?? idx;
              return (
                <tr key={itemId}>
                  <td>{item.period}</td>
                  <td>
                    <strong>{formatMoney(item.revenue)}</strong>
                  </td>
                  <td>
                    <strong>{formatMoney(item.commission)}</strong>
                  </td>
                  <td>
                    <strong>{formatMoney(item.refund)}</strong>
                  </td>
                  <td>
                    <strong>{formatMoney(item.payout)}</strong>
                  </td>
                  <td>
                    <strong>{formatMoney(item.taxes)}</strong>
                  </td>
                  <td className={styles.actionsCol}>
                    <div
                      className={styles.kebabWrapper}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className={styles.moreBtn}
                        aria-label="Actions"
                        onClick={() =>
                          setOpenMenuId(openMenuId === itemId ? null : itemId)
                        }
                      >
                        <MoreVerticalIcon />
                      </button>
                      {openMenuId === itemId && (
                        <div className={styles.kebabMenu}>
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => setOpenMenuId(null)}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => setOpenMenuId(null)}
                          >
                            Download Statement
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
                  No finance records found matching your search.
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
function MoreVerticalIcon() {
  return (<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={5} r={1} /><circle cx={12} cy={12} r={1} /><circle cx={12} cy={19} r={1} /></svg>);
}
