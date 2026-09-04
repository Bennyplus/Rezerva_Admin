"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import WalletDetailView, {
  WalletDetailData,
} from "@/components/admin/WalletDetailView";
import { walletService, ApiWallet } from "@/services/wallet-service";
import styles from "./wallet.module.css";

type CustomerWallet = WalletDetailData;

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

function mapApiToWallet(item: ApiWallet, index: number): CustomerWallet {
  const isSuspended =
    item.status?.toLowerCase() === "suspended" ||
    item.status?.toLowerCase() === "frozen";

  return {
    id: item.id || `wallet-${index}`,
    walletId: item.id || `RES-WA-${index}`,
    availableBalance: parseFloat(item.balance || "0") || 0,
    pendingBalance: parseFloat(item.pending_balance || "0") || 0,
    currency: item.currency || "NGN",
    status: isSuspended ? "Suspended" : "Active",
    freezeReason: item.freeze_reason || null,
    updatedAt: item.updated_at,
    customerName: item.username || `User ${item.user ?? index}`,
    customerAvatar: "/images/4th-img.png",
    referralPoints: 0,
    lastActivity: item.freeze_reason ? `Suspended: ${item.freeze_reason}` : "Active",
  };
}

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"driver" | "customer">("customer");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Data & API states
  const [wallets, setWallets] = useState<CustomerWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state: 'list' | 'details'
  const [view, setView] = useState<"list" | "details">("list");
  const [selectedWallet, setSelectedWallet] = useState<CustomerWallet | null>(
    null,
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchWallets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await walletService.getWallets();
      if (Array.isArray(data) && data.length > 0) {
        setWallets(data.map(mapApiToWallet));
      } else {
        setWallets([]);
      }
    } catch (err: any) {
      console.error("Failed to load wallets from API:", err);
      setError("Failed to load wallets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

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
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewDetails = (wallet: CustomerWallet) => {
    setOpenMenuId(null);
    setSelectedWallet(wallet);
    setView("details");
  };

  // Dynamic stats calculation
  const totalBalance = wallets.reduce((acc, w) => acc + w.availableBalance, 0);

  const filteredWallets = wallets.filter((w) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.walletId.toLowerCase().includes(q) ||
      (w.currency || "").toLowerCase().includes(q) ||
      (w.freezeReason || "").toLowerCase().includes(q) ||
      (w.status || "").toLowerCase().includes(q) ||
      w.availableBalance.toString().includes(q)
    );
  });

  const resultsPerPage = 9;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredWallets.length / resultsPerPage),
  );
  const paginatedWallets = filteredWallets.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage,
  );

  // If in details view, render the detail view screen
  if (view === "details" && selectedWallet) {
    return (
      <div className={styles.page}>
        <WalletDetailView
          wallet={selectedWallet}
          onBack={() => setView("list")}
          onCredit={async (data) => {
            try {
              await walletService.creditWallet(selectedWallet.walletId, data);
              const nextBalance = selectedWallet.availableBalance + data.amount;
              const updated: CustomerWallet = {
                ...selectedWallet,
                availableBalance: nextBalance,
                lastActivity: `Credit (${data.category})`,
                lastActivityAmount: data.amount,
                lastActivityTimestamp: "Just now",
              };
              setSelectedWallet(updated);
              setWallets((prev) =>
                prev.map((w) => (w.id === selectedWallet.id ? updated : w)),
              );
            } catch (e) {
              console.error("Credit API error:", e);
              throw e;
            }
          }}
          onDebit={async (data) => {
            try {
              const nextBalance = Math.max(
                0,
                selectedWallet.availableBalance - data.amount,
              );
              const updated: CustomerWallet = {
                ...selectedWallet,
                availableBalance: nextBalance,
                lastActivity: `Debit (${data.category})`,
                lastActivityAmount: data.amount,
                lastActivityTimestamp: "Just now",
              };
              setSelectedWallet(updated);
              setWallets((prev) =>
                prev.map((w) => (w.id === selectedWallet.id ? updated : w)),
              );
            } catch (e) {
              console.error("Debit API error:", e);
              throw e;
            }
          }}
          onFreeze={async (reason) => {
            try {
              const nextStatus: "Active" | "Frozen" =
                selectedWallet.status === "Frozen" ? "Active" : "Frozen";
              await walletService.freezeWallet(selectedWallet.walletId, {
                status: nextStatus === "Frozen" ? "suspended" : "active",
                reason,
              });
              const updated: CustomerWallet = {
                ...selectedWallet,
                status: nextStatus,
                ...(reason
                  ? {
                      lastActivity: `Frozen: ${reason}`,
                      lastActivityTimestamp: "Just now",
                    }
                  : {}),
              };
              setSelectedWallet(updated);
              setWallets((prev) =>
                prev.map((w) => (w.id === selectedWallet.id ? updated : w)),
              );
            } catch (e) {
              console.error("Freeze API error:", e);
              throw e;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Top Stats Grid ── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Balance"
          value={totalBalance.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
          id="stat-total-balance"
        />
        <StatCard label="Pending Balance" value={0} id="stat-pending-balance" />
        <StatCard label="Deposits" value={0} id="stat-deposits" />
        <StatCard label="Withdrawals" value={0} id="stat-withdrawals" />
      </div>

      {/* ── Tabs Navigation ── */}
      <div className={styles.tabsContainer}>
        <button
          type="button"
          className={`${styles.tabItem} ${
            activeTab === "driver" ? styles.tabItemActive : ""
          }`}
          onClick={() => {
            setActiveTab("driver");
            setCurrentPage(1);
          }}
        >
          Drivers Wallet
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${
            activeTab === "customer" ? styles.tabItemActive : ""
          }`}
          onClick={() => {
            setActiveTab("customer");
            setCurrentPage(1);
          }}
        >
          Customer Wallet
        </button>
      </div>

      {isLoading ? (
        <div className={styles.tableCard}>
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              color: "#868C98",
              fontSize: "14px",
            }}
          >
            Loading wallet records…
          </div>
        </div>
      ) : activeTab === "driver" ? (
        /* ── Drivers Wallet Tab ── */
        <div className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No Transactions Yet</h2>
          <p className={styles.emptySubtitle}>
            Driver transactions will appear here
          </p>
        </div>
      ) : filteredWallets.length === 0 ? (
        /* ── Empty State ── */
        <div className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No Transactions Yet</h2>
          <p className={styles.emptySubtitle}>
            Customer transactions will appear here
          </p>
        </div>
      ) : (
        <>
          {/* ── Toolbar ── */}
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

          {/* ── Customer Wallet Table ── */}
          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Wallet ID</th>
                    <th>Balance</th>
                    <th>Pending Balance</th>
                    <th>Currency</th>
                    <th>Freeze Reason</th>
                    <th>Updated At</th>
                    <th>Status</th>
                    <th className={styles.actionsCol}></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedWallets.map((w) => (
                    <tr key={w.id}>
                      {/* Wallet ID with copy button */}
                      <td>
                        <div className={styles.walletIdCell}>
                          <span>{w.walletId}</span>
                          <button
                            type="button"
                            className={styles.copyBtn}
                            onClick={() => handleCopy(w.walletId)}
                            title="Copy Wallet ID"
                          >
                            <CopyIcon />
                          </button>
                          {copiedId === w.walletId && (
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#059669",
                              }}
                            >
                              Copied!
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Balance */}
                      <td style={{ fontWeight: 600, color: "#111827" }}>
                        {w.currency} {w.availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Pending Balance */}
                      <td style={{ color: "#525866" }}>
                        {w.currency} {(w.pendingBalance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Currency */}
                      <td style={{ fontWeight: 500, color: "#111827" }}>
                        {w.currency}
                      </td>

                      {/* Freeze Reason */}
                      <td style={{ color: w.freezeReason ? "#DC2626" : "#868C98" }}>
                        {w.freezeReason || "—"}
                      </td>

                      {/* Updated At */}
                      <td style={{ color: "#6B7280", fontSize: "13px" }}>
                        {formatDate(w.updatedAt)}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`${styles.badge} ${
                            w.status === "Active"
                              ? styles.statusActive
                              : styles.statusFrozen
                          }`}
                        >
                          <span className={styles.badgeDot} />
                          {w.status}
                        </span>
                      </td>

                      {/* Actions kebab */}
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
                                openMenuId === w.id ? null : w.id,
                              )
                            }
                          >
                            <MoreIcon />
                          </button>

                          {openMenuId === w.id && (
                            <div className={styles.kebabMenu}>
                              <button
                                type="button"
                                className={styles.kebabMenuItem}
                                onClick={() => handleViewDetails(w)}
                              >
                                View Details
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

            {/* ── Pagination ── */}
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
