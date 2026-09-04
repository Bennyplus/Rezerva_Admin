"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import { useToast } from "@/lib/toast-context";
import { walletService, ApiWallet } from "@/services/wallet-service";
import CreditWalletModal from "./CreditWalletModal";
import FreezeWalletModal from "./FreezeWalletModal";
import WalletConfirmModal from "./WalletConfirmModal";
import styles from "./WalletDetailView.module.css";

export interface WalletDetailData {
  id: string;
  walletId: string;
  availableBalance: number;
  pendingBalance?: number;
  currency?: string;
  freezeReason?: string | null;
  updatedAt?: string;
  customerName: string;
  customerAvatar?: string;
  phone?: string;
  email?: string;
  referralPoints: number;
  referredCount?: number;
  lastActivity: string;
  lastActivityAmount?: number;
  lastActivityTimestamp?: string;
  status: "Active" | "Frozen" | string;
}

export interface WalletActivityItem {
  id: string;
  referenceId: string;
  transactionType: "Credit" | "Debit" | "Refund" | "Withdrawal";
  source: string;
  amount: number;
  isPositive: boolean;
  timestamp: string;
  status: "Completed" | "Pending" | "Failed" | "Reversed";
}

const SAMPLE_ACTIVITIES: WalletActivityItem[] = [
  {
    id: "act-1",
    referenceId: "MMVC7X",
    transactionType: "Credit",
    source: "Wallet Top-Up",
    amount: 980.69,
    isPositive: true,
    timestamp: "15 May 2020 9:00 PM",
    status: "Completed",
  },
  {
    id: "act-2",
    referenceId: "MMVC7X",
    transactionType: "Debit",
    source: "Points Redemption",
    amount: 164.48,
    isPositive: false,
    timestamp: "15 May 2020 5:00 AM",
    status: "Pending",
  },
  {
    id: "act-3",
    referenceId: "MMVC7X",
    transactionType: "Refund",
    source: "Ride Payment",
    amount: 400.89,
    isPositive: true,
    timestamp: "15 May 2020 8:00 AM",
    status: "Completed",
  },
  {
    id: "act-4",
    referenceId: "MMVC7X",
    transactionType: "Withdrawal",
    source: "Withdrawal",
    amount: 960.64,
    isPositive: false,
    timestamp: "15 May 2020 6:00 PM",
    status: "Failed",
  },
  {
    id: "act-5",
    referenceId: "MMVC7X",
    transactionType: "Credit",
    source: "Coupon",
    amount: 139.98,
    isPositive: true,
    timestamp: "15 May 2020 7:00 AM",
    status: "Reversed",
  },
];

interface WalletDetailViewProps {
  wallet: WalletDetailData;
  onBack: () => void;
  onDebit?: (data: {
    amount: number;
    reason: string;
    category: string;
  }) => Promise<void> | void;
  onCredit?: (data: {
    amount: number;
    reason: string;
    category: string;
  }) => Promise<void> | void;
  onFreeze?: (reason?: string) => Promise<void> | void;
}

export default function WalletDetailView({
  wallet,
  onBack,
  onDebit,
  onCredit,
  onFreeze,
}: WalletDetailViewProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"userDetails" | "activity">(
    "userDetails",
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live API data state from getWallet
  const [liveWallet, setLiveWallet] = useState<ApiWallet | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);

  // Activity search state & kebab menu state
  const [activitySearch, setActivitySearch] = useState("");
  const [activities, setActivities] =
    useState<WalletActivityItem[]>(SAMPLE_ACTIVITIES);
  const [openActivityMenuId, setOpenActivityMenuId] = useState<string | null>(
    null,
  );

  // Modal states
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditModalMode, setCreditModalMode] = useState<"credit" | "debit">(
    "credit",
  );
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);

  // Confirmation Modal state for Credit & Debit
  const [pendingConfirm, setPendingConfirm] = useState<{
    mode: "credit" | "debit";
    data: { amount: number; reason: string; category: string };
  } | null>(null);

  // Fetch single wallet details from API
  useEffect(() => {
    let isMounted = true;
    const fetchWalletDetails = async () => {
      setIsLoadingWallet(true);
      try {
        const res = await walletService.getWallet(wallet.walletId);

        if (isMounted) {
          setLiveWallet(res);
        }
      } catch (err: any) {
        console.error("Failed to load wallet details from API:", err);
      } finally {
        if (isMounted) {
          setIsLoadingWallet(false);
        }
      }
    };

    if (wallet.walletId) {
      fetchWalletDetails();
    }
    return () => {
      isMounted = false;
    };
  }, [wallet.walletId]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (openActivityMenuId !== null) {
        setOpenActivityMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openActivityMenuId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast("success", "Wallet ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCredit = () => {
    setCreditModalMode("credit");
    setIsCreditModalOpen(true);
  };

  const handleOpenDebit = () => {
    setCreditModalMode("debit");
    setIsCreditModalOpen(true);
  };

  const handleOpenFreeze = () => {
    setIsFreezeModalOpen(true);
  };

  const handleCreditDebitSubmit = async (data: {
    amount: number;
    reason: string;
    category: string;
  }) => {
    setIsCreditModalOpen(false);
    setPendingConfirm({ mode: creditModalMode, data });
  };

  const handleConfirmAction = async () => {
    if (!pendingConfirm) return;
    if (pendingConfirm.mode === "credit") {
      if (onCredit) await onCredit(pendingConfirm.data);
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          referenceId: wallet.walletId,
          transactionType: "Credit",
          source: pendingConfirm.data.category,
          amount: pendingConfirm.data.amount,
          isPositive: true,
          timestamp: "Just now",
          status: "Completed",
        },
        ...prev,
      ]);
    } else {
      if (onDebit) await onDebit(pendingConfirm.data);
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          referenceId: wallet.walletId,
          transactionType: "Debit",
          source: pendingConfirm.data.category,
          amount: pendingConfirm.data.amount,
          isPositive: false,
          timestamp: "Just now",
          status: "Completed",
        },
        ...prev,
      ]);
    }
    setPendingConfirm(null);
  };

  const handleFreezeConfirm = async (reason: string) => {
    if (onFreeze) await onFreeze(reason);
  };

  // Kebab Menu Handlers for Activity Table
  const handleDownloadReceipt = (act: WalletActivityItem) => {
    setOpenActivityMenuId(null);
    showToast("info", `Downloading receipt for ${act.referenceId}…`);
  };

  const handleRetryTransaction = (act: WalletActivityItem) => {
    setOpenActivityMenuId(null);
    setActivities((prev) =>
      prev.map((item) =>
        item.id === act.id ? { ...item, status: "Completed" } : item,
      ),
    );
    showToast(
      "success",
      `Transaction ${act.referenceId} retried successfully.`,
    );
  };

  const handleApplyBonus = (act: WalletActivityItem) => {
    setOpenActivityMenuId(null);
    handleOpenCredit();
  };

  const filteredActivities = activities.filter((act) => {
    if (!activitySearch) return true;
    const q = activitySearch.toLowerCase();
    return (
      act.referenceId.toLowerCase().includes(q) ||
      act.transactionType.toLowerCase().includes(q) ||
      act.source.toLowerCase().includes(q) ||
      act.status.toLowerCase().includes(q)
    );
  });

  // Derived values merged with live API response
  const displayCurrency = liveWallet?.currency || wallet.currency || "NGN";
  const displayBalance =
    liveWallet?.balance !== undefined
      ? parseFloat(liveWallet.balance)
      : wallet.availableBalance;
  const displayStatus = liveWallet?.status
    ? liveWallet.status.toLowerCase() === "suspended" ||
      liveWallet.status.toLowerCase() === "frozen"
      ? "Frozen"
      : "Active"
    : wallet.status;
  const displayCustomerName = liveWallet?.username || wallet.customerName;

  return (
    <div className={styles.container}>
      {/* ── Top Bar with Back Button & Actions ── */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Back to wallets list"
        >
          <BackArrowIcon />
        </button>

        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.debitBtn}
            onClick={handleOpenDebit}
          >
            Debit Wallet
          </button>
          <button
            type="button"
            className={styles.freezeBtn}
            onClick={handleOpenFreeze}
          >
            {displayStatus === "Frozen" ? "Unfreeze Wallet" : "Freeze Wallet"}
          </button>
        </div>
      </div>

      {/* ── Balance Header ── */}
      <div className={styles.balanceHeader}>
        <span className={styles.balanceLabel}>Available Balance</span>
        <div className={styles.balanceAmount}>
          {isLoadingWallet ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontSize: "20px",
                color: "#868C98",
              }}
            >
              <Spinner size={20} /> Loading live balance…
            </span>
          ) : (
            `${displayCurrency} ${displayBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          )}
        </div>
        <div className={styles.walletMeta}>
          <div className={styles.walletIdTag}>
            <span>{wallet.walletId}</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => handleCopy(wallet.walletId)}
              title="Copy Wallet ID"
            >
              <CopyIcon />
            </button>
            {copiedId === wallet.walletId && (
              <span
                style={{ fontSize: "11px", color: "#059669", fontWeight: 500 }}
              >
                Copied!
              </span>
            )}
          </div>

          <span
            className={`${styles.badge} ${
              displayStatus === "Active"
                ? styles.statusActive
                : styles.statusFrozen
            }`}
          >
            <span className={styles.badgeDot} />
            {displayStatus}
          </span>
        </div>
      </div>

      {/* ── Detail Tabs ── */}
      <div className={styles.tabsContainer}>
        <button
          type="button"
          className={`${styles.tabItem} ${
            activeTab === "userDetails" ? styles.tabItemActive : ""
          }`}
          onClick={() => setActiveTab("userDetails")}
        >
          User Details
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${
            activeTab === "activity" ? styles.tabItemActive : ""
          }`}
          onClick={() => setActiveTab("activity")}
        >
          Wallet Activity
        </button>
      </div>

      {activeTab === "userDetails" ? (
        /* ============================================================
           TAB 1: USER DETAILS (SPLIT LAYOUT)
           ============================================================ */
        <div className={styles.mainGrid}>
          {/* Left Passenger Details & Activity */}
          <div className={styles.detailsCard}>
            {/* Passenger Details Section */}
            <div>
              <h2 className={styles.sectionTitle}>Passenger Details</h2>
              <div className={styles.passengerRow}>
                <Image
                  src={wallet.customerAvatar || "/images/4th-img.png"}
                  alt={displayCustomerName}
                  width={96}
                  height={96}
                  className={styles.passengerAvatar}
                />

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Passenger Name</span>
                    <span className={styles.infoValue}>
                      {displayCustomerName}
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone Number</span>
                    <span className={styles.infoValue}>
                      {wallet.phone || "+1 234 2345 123"}
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>
                      {wallet.email ||
                        `${displayCustomerName.toLowerCase().replace(/\s+/g, "")}@gmail.com`}
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Referral Points</span>
                    <span className={styles.infoValue}>
                      {wallet.referralPoints}pts
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      No Of Users Referred
                    </span>
                    <span className={styles.infoValue}>
                      {wallet.referredCount ?? 10}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Activity Section */}
            <div className={styles.activitySection}>
              <h3 className={styles.activityTitle}>Last Activity</h3>
              <div className={styles.activityBox}>
                <span className={styles.activityType}>
                  {wallet.lastActivity || "Withdrawal"}
                </span>
                <div className={styles.activityRow}>
                  <div className={styles.activityCol}>
                    <span className={styles.activityColLabel}>Amount:</span>
                    <span className={styles.activityColValue}>
                      ${(wallet.lastActivityAmount ?? 12).toFixed(2)}
                    </span>
                  </div>

                  <div className={styles.activityCol}>
                    <span className={styles.activityColLabel}>Timestamp:</span>
                    <span className={styles.activityColValue}>
                      {wallet.lastActivityTimestamp || "12 Jul 2024 12:04 AM"}
                    </span>
                  </div>

                  <div className={styles.activityCol}>
                    <span className={styles.activityColLabel}>Status</span>
                    <span className={styles.statusSuccess}>
                      <span className={styles.statusSuccessDot} />
                      Successful
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Quick Actions Card */}
          <div className={styles.quickActionsCard}>
            <h2 className={styles.quickActionsTitle}>Quick Actions</h2>
            <div className={styles.actionList}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={handleOpenCredit}
              >
                <span>Credit Wallet</span>
                <ChevronRightIcon />
              </button>

              <button
                type="button"
                className={styles.actionButton}
                onClick={handleOpenDebit}
              >
                <span>Debit Wallet</span>
                <ChevronRightIcon />
              </button>

              <button
                type="button"
                className={styles.actionButton}
                onClick={handleOpenFreeze}
              >
                <span>Freeze Wallet</span>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================
           TAB 2: WALLET ACTIVITY (STATS, TOOLBAR & TABLE)
           ============================================================ */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Top Stats Grid */}
          <div className={styles.activityStatsGrid}>
            <StatCard label="Total Balance" value={0} id="act-stat-total" />
            <StatCard label="Withdrawals" value={0} id="act-stat-withdrawals" />
            <StatCard label="Deposits" value={0} id="act-stat-deposits" />
            <StatCard label="Referral Points" value={0} id="act-stat-points" />
          </div>

          {/* Toolbar */}
          <div className={styles.activityToolbar}>
            <div className={styles.toolbarLeft}>
              <div className={styles.searchBox}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
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

            <button
              type="button"
              className={styles.exportBtn}
              onClick={() =>
                showToast("info", "Exporting Wallet Activity CSV…")
              }
            >
              Export CSV
            </button>
          </div>

          {/* Activity Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Reference ID</th>
                    <th>Transaction Type</th>
                    <th>Source</th>
                    <th>Amount</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                    <th className={styles.actionsCol}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map((act) => (
                    <tr key={act.id}>
                      {/* Reference ID */}
                      <td>
                        <div className={styles.refCell}>
                          <span>{act.referenceId}</span>
                          <button
                            type="button"
                            className={styles.copyBtn}
                            onClick={() => handleCopy(act.referenceId)}
                            title="Copy Reference ID"
                          >
                            <CopyIcon />
                          </button>
                          {copiedId === act.referenceId && (
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

                      {/* Transaction Type */}
                      <td>{act.transactionType}</td>

                      {/* Source */}
                      <td>{act.source}</td>

                      {/* Amount */}
                      <td>
                        <span
                          className={
                            act.isPositive
                              ? styles.amountPositive
                              : styles.amountNegative
                          }
                        >
                          {act.isPositive
                            ? `+ $${act.amount.toFixed(2)}`
                            : `-$${act.amount.toFixed(2)}`}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td>{act.timestamp}</td>

                      {/* Status */}
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            act.status === "Completed"
                              ? styles.statusCompleted
                              : act.status === "Pending"
                                ? styles.statusPending
                                : act.status === "Failed"
                                  ? styles.statusFailed
                                  : styles.statusReversed
                          }`}
                        >
                          <span className={styles.badgeDot} />
                          {act.status}
                        </span>
                      </td>

                      {/* Actions Kebab */}
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
                              setOpenActivityMenuId(
                                openActivityMenuId === act.id ? null : act.id,
                              )
                            }
                          >
                            <MoreIcon />
                          </button>

                          {openActivityMenuId === act.id && (
                            <div className={styles.kebabMenu}>
                              <button
                                type="button"
                                className={styles.kebabMenuItem}
                                onClick={() => handleDownloadReceipt(act)}
                              >
                                Download Receipt
                              </button>
                              <button
                                type="button"
                                className={styles.kebabMenuItem}
                                onClick={() => handleRetryTransaction(act)}
                              >
                                Retry Transaction
                              </button>
                              <button
                                type="button"
                                className={styles.kebabMenuItem}
                                onClick={() => handleApplyBonus(act)}
                              >
                                Bonus
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
          </div>
        </div>
      )}

      {/* ── Credit / Debit Wallet Form Modal ── */}
      <CreditWalletModal
        isOpen={isCreditModalOpen}
        mode={creditModalMode}
        onClose={() => setIsCreditModalOpen(false)}
        onSubmit={handleCreditDebitSubmit}
      />

      {/* ── Confirmation Modal for Credit & Debit ── */}
      {pendingConfirm && (
        <WalletConfirmModal
          isOpen={!!pendingConfirm}
          mode={pendingConfirm.mode}
          amount={pendingConfirm.data.amount}
          customerName={displayCustomerName}
          onClose={() => setPendingConfirm(null)}
          onConfirm={handleConfirmAction}
        />
      )}

      {/* ── Freeze Wallet Modal ── */}
      <FreezeWalletModal
        isOpen={isFreezeModalOpen}
        customerName={displayCustomerName}
        onClose={() => setIsFreezeModalOpen(false)}
        onConfirm={handleFreezeConfirm}
      />
    </div>
  );
}

/* ─── Inline SVG Icons ─── */
function BackArrowIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ChevronRightIcon() {
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
      <polyline points="9 18 15 12 9 6" />
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
