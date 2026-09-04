"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import { useToast } from "@/lib/toast-context";
import {
  referralsService,
  ReferralDashboardResponse,
  ReferralHistoryItem,
} from "@/services/referrals-service";
import styles from "./referrals.module.css";

interface TableReferralItem {
  id: string | number;
  referralId: string;
  referrer: string;
  referredUser: string;
  reward: string;
  fraudFlag: "Yes" | "No";
  status: "Successful" | "Failed";
  dateJoined: string;
}

function mapHistoryToTable(
  item: ReferralHistoryItem,
  index: number,
  referralCode?: string,
): TableReferralItem {
  const isFailed = item.status?.toLowerCase() === "failed" || item.is_fraud;
  const referralId =
    item.referral_id ||
    (referralCode ? `${referralCode}-${item.referred_user_id}` : `RXD-00${index + 1}-EAL1`);

  return {
    id: item.referred_user_id || `ref-${index}`,
    referralId,
    referrer: item.referrer_name || "Arlene McCoy",
    referredUser: item.full_name || `User ${item.referred_user_id}`,
    reward: typeof item.reward_amount === "number"
      ? `£${item.reward_amount.toFixed(2)}`
      : item.reward_amount
      ? `£${item.reward_amount}`
      : "£194.00",
    fraudFlag: item.is_fraud ? "Yes" : "No",
    status: isFailed ? "Failed" : "Successful",
    dateJoined: item.date_joined,
  };
}

export default function ReferralsPage() {
  const { showToast } = useToast();

  const [dashboardData, setDashboardData] =
    useState<ReferralDashboardResponse | null>(null);
  const [items, setItems] = useState<TableReferralItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal state for View Referral
  const [viewingItem, setViewingItem] = useState<TableReferralItem | null>(null);

  const fetchReferrals = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await referralsService.getReferralsDashboard();
      setDashboardData(data);
      if (Array.isArray(data?.history) && data.history.length > 0) {
        setItems(
          data.history.map((h, i) => mapHistoryToTable(h, i, data.referral_code)),
        );
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error("Failed to load referrals dashboard:", err);
      // Fallback empty data
      setDashboardData({
        reward_points: 0,
        no_of_referrals: 0,
        referral_code: "RES-EP-60794",
        history: [],
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast("success", "Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Kebab Action Handlers
  const handleViewReferral = (item: TableReferralItem) => {
    setOpenMenuId(null);
    setViewingItem(item);
  };

  const handleSuspendReward = async (item: TableReferralItem) => {
    setOpenMenuId(null);
    try {
      await referralsService.suspendReward(item.id);
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: "Failed" } : it)),
      );
      showToast("success", `Referral reward for ${item.referredUser} suspended.`);
    } catch {
      showToast("error", "Failed to suspend referral reward.");
    }
  };

  const handleReinstateReward = async (item: TableReferralItem) => {
    setOpenMenuId(null);
    try {
      await referralsService.reinstateReward(item.id);
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: "Successful" } : it)),
      );
      showToast("success", `Referral reward for ${item.referredUser} reinstated.`);
    } catch {
      showToast("error", "Failed to reinstate referral reward.");
    }
  };

  const handleMarkAsFraud = async (item: TableReferralItem) => {
    setOpenMenuId(null);
    try {
      await referralsService.markAsFraud(item.id);
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, fraudFlag: "Yes", status: "Failed" } : it,
        ),
      );
      showToast("success", `Referral ${item.referralId} marked as fraud.`);
    } catch {
      showToast("error", "Failed to mark referral as fraud.");
    }
  };

  // Stat Card Metrics
  const totalReferrals = dashboardData?.total_referrals ?? dashboardData?.no_of_referrals ?? items.length;
  const successfulReferrals =
    dashboardData?.successful_referrals ??
    items.filter((i) => i.status === "Successful").length;
  const rewardsPaid =
    dashboardData?.rewards_paid ?? dashboardData?.reward_points ?? 0;
  const flaggedReferrals =
    dashboardData?.flagged_referrals ??
    items.filter((i) => i.fraudFlag === "Yes").length;

  // Search filter & pagination
  const filteredItems = items.filter((it) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      it.referralId.toLowerCase().includes(q) ||
      it.referrer.toLowerCase().includes(q) ||
      it.referredUser.toLowerCase().includes(q) ||
      it.status.toLowerCase().includes(q)
    );
  });

  const resultsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / resultsPerPage));
  const paginatedItems = filteredItems.slice(
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
          <Spinner size={28} />
          <p className={styles.emptySubtitle}>Loading referrals…</p>
        </div>
      ) : items.length === 0 ? (
        /* ── Empty State (Screenshot 1) ── */
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

          {/* Table Card */}
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
                  {paginatedItems.map((item) => (
                    <tr key={item.id}>
                      {/* Referral ID */}
                      <td>
                        <div className={styles.referralIdCell}>
                          <span>{item.referralId}</span>
                          <button
                            type="button"
                            className={styles.copyBtn}
                            onClick={() => handleCopy(item.referralId)}
                            title="Copy Referral ID"
                          >
                            <CopyIcon />
                          </button>
                          {copiedId === item.referralId && (
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#059669",
                                fontWeight: 500,
                              }}
                            >
                              Copied!
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Referrer */}
                      <td style={{ fontWeight: 500, color: "#111827" }}>
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
                      <td style={{ color: item.fraudFlag === "Yes" ? "#EF4444" : "#111827" }}>
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
                            <MoreIcon />
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
                                onClick={() => handleSuspendReward(item)}
                              >
                                Suspend Referral Reward
                              </button>
                              <button
                                type="button"
                                className={styles.kebabMenuItem}
                                onClick={() => handleReinstateReward(item)}
                              >
                                Reinstate Reward
                              </button>
                              <button
                                type="button"
                                className={styles.kebabMenuItem}
                                onClick={() => handleMarkAsFraud(item)}
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

      {/* ── View Referral Detail Modal ── */}
      {viewingItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setViewingItem(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              width: "440px",
              maxWidth: "90vw",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "12px",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>
                Referral Details
              </h3>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#868C98",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13.5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#868C98" }}>Referral ID:</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>{viewingItem.referralId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#868C98" }}>Referrer:</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>{viewingItem.referrer}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#868C98" }}>Referred User:</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>{viewingItem.referredUser}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#868C98" }}>Reward:</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>{viewingItem.reward}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#868C98" }}>Fraud Flag:</span>
                <span style={{ fontWeight: 600, color: viewingItem.fraudFlag === "Yes" ? "#EF4444" : "#111827" }}>
                  {viewingItem.fraudFlag}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#868C98" }}>Status:</span>
                <span style={{ fontWeight: 600, color: viewingItem.status === "Successful" ? "#059669" : "#EF4444" }}>
                  {viewingItem.status}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewingItem(null)}
              style={{
                height: "40px",
                background: "#111827",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
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

function CopyIcon() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
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
