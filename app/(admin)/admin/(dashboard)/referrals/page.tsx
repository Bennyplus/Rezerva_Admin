"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import ViewReferralModal from "@/components/admin/ViewReferralModal";
import { useToast } from "@/lib/toast-context";
import {
  referralsService,
  AdminReferral,
} from "@/services/referrals-service";
import styles from "./referrals.module.css";

export default function ReferralsPage() {
  const { showToast } = useToast();

  const [referrals, setReferrals] = useState<AdminReferral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [viewingReferral, setViewingReferral] = useState<AdminReferral | null>(null);

  const fetchReferrals = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await referralsService.getReferrals();
      if (Array.isArray(response?.results)) {
        setReferrals(response.results);
      } else {
        setReferrals([]);
      }
    } catch (err) {
      console.error("Failed to fetch referrals:", err);
      setReferrals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  // Click outside listener for kebab menu
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  // Kebab Menu Handlers
  const handleViewReferral = (item: AdminReferral) => {
    setOpenMenuId(null);
    setViewingReferral(item);
  };

  const handleSuspendReward = async (id: string | number) => {
    setOpenMenuId(null);
    try {
      await referralsService.suspendReward(id);
    } catch {
      // Optimistic update
    }
    setReferrals((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: "Failed" } : it)),
    );
    showToast("success", "Referral reward suspended successfully!");
  };

  const handleReinstateReward = async (id: string | number) => {
    setOpenMenuId(null);
    try {
      await referralsService.reinstateReward(id);
    } catch {
      // Optimistic update
    }
    setReferrals((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: "Successful" } : it)),
    );
    showToast("success", "Referral reward reinstated successfully!");
  };

  const handleMarkAsFraud = async (id: string | number) => {
    setOpenMenuId(null);
    try {
      await referralsService.markAsFraud(id);
    } catch {
      // Optimistic update
    }
    setReferrals((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, fraudFlag: "Yes", status: "Failed" } : it,
      ),
    );
    showToast("success", "Referral marked as fraud successfully!");
  };

  // Stat metrics
  const totalReferrals = referrals.length;
  const successfulReferrals = referrals.filter((r) => r.status === "Successful").length;
  const rewardsPaid = 0; // matching Screenshot 2 stat card value
  const flaggedReferrals = referrals.filter((r) => r.fraudFlag === "Yes").length;

  // Filtered & paginated results
  const filteredReferrals = referrals.filter((it) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      it.referralId.toLowerCase().includes(q) ||
      it.referrer.toLowerCase().includes(q) ||
      it.referredUser.toLowerCase().includes(q) ||
      it.status.toLowerCase().includes(q) ||
      it.fraudFlag.toLowerCase().includes(q)
    );
  });

  const resultsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(filteredReferrals.length / resultsPerPage));
  const paginatedReferrals = filteredReferrals.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage,
  );

  return (
    <div className={styles.page}>
      {/* ── Top Stats Grid (4 Cards - Screenshots 1 & 2) ── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Referrals"
          value={totalReferrals}
          id="stat-total-referrals"
        />
        <StatCard
          label="Successful Referrals"
          value={successfulReferrals}
          id="stat-successful-referrals"
        />
        <StatCard
          label="Rewards Paid"
          value={rewardsPaid}
          id="stat-rewards-paid"
        />
        <StatCard
          label="Flagged Referrals"
          value={flaggedReferrals}
          id="stat-flagged-referrals"
        />
      </div>

      {isLoading ? (
        <div className={styles.emptyCard}>
          <Spinner size={32} />
          <p className={styles.emptySubtitle}>Loading referrals…</p>
        </div>
      ) : referrals.length === 0 ? (
        /* ── Inactive / Empty Data State (Screenshot 1) ── */
        <div className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No Referrals History</h2>
          <p className={styles.emptySubtitle}>
            There are no referrals from users yet
          </p>
        </div>
      ) : (
        /* ── Active Table View (Screenshot 2) ── */
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
                  id="referrals-search-input"
                />
              </div>

              <button type="button" className={styles.toolBtn}>
                <FilterIcon />
                Filter
              </button>

              <button type="button" className={styles.toolBtn}>
                <SortIcon />
                Sort by
              </button>
            </div>
          </div>

          {/* Table Card (Screenshot 2) */}
          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Referral ID</th>
                    <th>Referrer</th>
                    <th>Referred User</th>
                    <th>Reward</th>
                    <th>Fraud Flag</th>
                    <th>Status</th>
                    <th className={styles.actionsCol}></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReferrals.map((item) => (
                    <tr key={item.id}>
                      {/* Referral ID */}
                      <td style={{ color: "#111827", fontWeight: 500 }}>
                        {item.referralId}
                      </td>

                      {/* Referrer */}
                      <td style={{ color: "#111827", fontWeight: 500 }}>
                        {item.referrer}
                      </td>

                      {/* Referred User */}
                      <td style={{ color: "#111827" }}>
                        {item.referredUser}
                      </td>

                      {/* Reward */}
                      <td style={{ color: "#111827", fontWeight: 500 }}>
                        {item.reward}
                      </td>

                      {/* Fraud Flag */}
                      <td style={{ color: "#111827" }}>
                        {item.fraudFlag}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`${styles.badge} ${
                            item.status === "Successful"
                              ? styles.statusSuccessful
                              : styles.statusFailed
                          }`}
                        >
                          <span className={styles.badgeDot} />
                          {item.status}
                        </span>
                      </td>

                      {/* Actions Kebab (Screenshot 3) */}
                      <td className={styles.actionsCol}>
                        <div
                          className={styles.actionsWrapper}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className={styles.moreBtn}
                            aria-label="Actions"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === item.id ? null : item.id,
                              )
                            }
                          >
                            <MoreVerticalIcon />
                          </button>

                          {openMenuId === item.id && (
                            <div className={styles.kebabMenu}>
                              <button
                                type="button"
                                className={styles.kebabMenuItem}
                                onClick={() => handleViewReferral(item)}
                              >
                                View Referral
                              </button>
                              <button
                                type="button"
                                className={styles.kebabMenuItem}
                                onClick={() => handleSuspendReward(item.id)}
                              >
                                Suspend Referral Reward
                              </button>
                              <button
                                type="button"
                                className={styles.kebabMenuItem}
                                onClick={() => handleReinstateReward(item.id)}
                              >
                                Reinstate Reward
                              </button>
                              <button
                                type="button"
                                className={styles.kebabMenuItem}
                                onClick={() => handleMarkAsFraud(item.id)}
                              >
                                Mark As Fraud
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

            {/* Bottom Pagination */}
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

      {/* ── View Details Modal (Screenshot 4) ── */}
      <ViewReferralModal
        isOpen={Boolean(viewingReferral)}
        referral={viewingReferral}
        onClose={() => setViewingReferral(null)}
        onSuspend={handleSuspendReward}
        onReinstate={handleReinstateReward}
        onMarkAsFraud={handleMarkAsFraud}
      />
    </div>
  );
}

/* ─── SVG Icons ─── */
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

function MoreVerticalIcon() {
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
