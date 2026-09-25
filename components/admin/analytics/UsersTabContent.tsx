"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import AnalyticsEmptyState from "./AnalyticsEmptyState";
import Pagination from "@/components/admin/Pagination";
import { AdminUserItem } from "@/services/analytics-services";
import styles from "./UsersTabContent.module.css";

interface UsersTabContentProps {
  users?: AdminUserItem[];
  isLoading?: boolean;
}

export default function UsersTabContent({ users = [] }: UsersTabContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Verified" | "Not Verified">("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "trips" | "rating">("newest");
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

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const result = [...(users || [])].filter((u) => {
      const matchQuery =
        !query ||
        u.full_name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.phone_number?.toLowerCase().includes(query) ||
        u.referral_code?.toLowerCase().includes(query);
      const matchStatus = statusFilter === "All" || u.is_verified === statusFilter;
      return matchQuery && matchStatus;
    });

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.date_joined).getTime() - new Date(a.date_joined).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.date_joined).getTime() - new Date(b.date_joined).getTime());
    } else if (sortBy === "trips") {
      result.sort((a, b) => (b.total_trips ?? 0) - (a.total_trips ?? 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    return result;
  }, [users, searchQuery, statusFilter, sortBy]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!users || users.length === 0) {
    return <AnalyticsEmptyState title="No Users Data" subtitle="No users data is available for now" />;
  }

  return (
    <div className={styles.container}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name, email, phone, code..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
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
              {(["All", "Verified", "Not Verified"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`${styles.popoverItem} ${statusFilter === status ? styles.popoverItemActive : ""}`}
                  onClick={() => { setStatusFilter(status); setIsFilterOpen(false); setCurrentPage(1); }}
                >
                  {status}
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
                { label: "Newest Joined", val: "newest" },
                { label: "Oldest Joined", val: "oldest" },
                { label: "Most Trips", val: "trips" },
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
              <th>User</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Rating</th>
              <th>Total Trips</th>
              <th>Status</th>
              <th>Joined</th>
              <th className={styles.actionsCol}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => {
              const isVerified = u.is_verified === "Verified";
              const initials = u.full_name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "U";
              return (
                <tr key={u.id}>
                  <td>
                    <div className={styles.userCell}>
                      {u.profile_picture ? (
                        <Image src={u.profile_picture} alt={u.full_name} width={36} height={36} className={styles.avatar} unoptimized />
                      ) : (
                        <div className={styles.avatarFallback}>{initials}</div>
                      )}
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>{u.full_name}</span>
                        <span className={styles.userCode}>{u.referral_code || "N/A"}</span>
                      </div>
                    </div>
                  </td>
                  <td>{u.phone_number || "-"}</td>
                  <td>{u.email || "-"}</td>
                  <td>{u.gender || "-"}</td>
                  <td>
                    <div className={styles.ratingWrap}>
                      <StarIcon />
                      <span>{u.rating ?? 0}</span>
                    </div>
                  </td>
                  <td>{u.total_trips ?? 0}</td>
                  <td>
                    <span className={isVerified ? styles.badgeVerified : styles.badgeUnverified}>
                      <span className={styles.statusDot} />
                      {u.is_verified || "Not Verified"}
                    </span>
                  </td>
                  <td>{formatDate(u.date_joined)}</td>
                  <td className={styles.actionsCol}>
                    <div className={styles.kebabWrapper} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={styles.moreBtn}
                        aria-label="Actions"
                        onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                      >
                        <MoreVerticalIcon />
                      </button>
                      {openMenuId === u.id && (
                        <div className={styles.kebabMenu}>
                          <button type="button" className={styles.kebabMenuItem} onClick={() => setOpenMenuId(null)}>
                            View Details
                          </button>
                          <button type="button" className={styles.kebabMenuItem} onClick={() => setOpenMenuId(null)}>
                            Export User
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={9} className={styles.emptyRow}>
                  No users found matching your search or filters.
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

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
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
function StarIcon() {
  return (<svg width={14} height={14} viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth={1}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
}
function MoreVerticalIcon() {
  return (<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={5} r={1} /><circle cx={12} cy={12} r={1} /><circle cx={12} cy={19} r={1} /></svg>);
}
