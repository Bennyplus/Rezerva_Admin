"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast-context";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import MoreIcon from "@/components/admin/icons/MoreIcon";
import {
  PaymentTransaction,
  PaymentStats,
  Payout,
  PayoutRequest,
  PayoutHistory,
  paymentsService,
} from "@/services/payments-service";
import styles from "./payments.module.css";

type Tab =
  | "customer-transactions"
  | "driver-payouts"
  | "payout-request"
  | "transaction-history";

// Initial mock records for other tabs until backend provides endpoints
const INITIAL_PAYOUTS: Payout[] = [
  {
    id: "DRI-12XDJF-123",
    driverName: "Prosper Edward",
    amount: "$120.00",
    transactionReference: "EYH-728-HDU-28283",
    date: "30 Feb 2026",
    status: "Pending",
  },
  {
    id: "DRI-12XDJF-123",
    driverName: "Prosper Edward",
    amount: "$120.00",
    transactionReference: "EYH-728-HDU-28283",
    date: "30 Feb 2026",
    status: "Completed",
  },
];

const INITIAL_PAYOUT_REQUESTS: PayoutRequest[] = [
  {
    id: "PR-001",
    requestAmount: "$18,500",
    requestDated: "Jul 2026 10:45AM",
    bank: "Zenith",
    accountNumber: "*******0000",
    accountName: "Edith Ruben",
    currentBalance: "$42,000",
  },
  {
    id: "PR-002",
    requestAmount: "$18,500",
    requestDated: "Jul 2026 10:45AM",
    bank: "Zenith",
    accountNumber: "*******0000",
    accountName: "Edith Ruben",
    currentBalance: "$42,000",
  },
  {
    id: "PR-003",
    requestAmount: "$18,500",
    requestDated: "Jul 2026 10:45AM",
    bank: "Zenith",
    accountNumber: "*******0000",
    accountName: "Edith Ruben",
    currentBalance: "$42,000",
  },
  {
    id: "PR-004",
    requestAmount: "$18,500",
    requestDated: "Jul 2026 10:45AM",
    bank: "Zenith",
    accountNumber: "*******0000",
    accountName: "Edith Ruben",
    currentBalance: "$42,000",
  },
  {
    id: "PR-005",
    requestAmount: "$18,500",
    requestDated: "Jul 2026 10:45AM",
    bank: "Zenith",
    accountNumber: "*******0000",
    accountName: "Edith Ruben",
    currentBalance: "$42,000",
  },
];

const INITIAL_PAYOUT_HISTORY: PayoutHistory[] = [
  {
    id: "PH-001",
    date: "Jul 2026 10:45AM",
    amount: "$18,500",
    bank: "Zenith",
    reference: "RE-X243-DI87",
    status: "Paid",
  },
  {
    id: "PH-002",
    date: "Jul 2026 10:45AM",
    amount: "$18,500",
    bank: "Zenith",
    reference: "RE-X243-DI87",
    status: "Paid",
  },
  {
    id: "PH-003",
    date: "Jul 2026 10:45AM",
    amount: "$18,500",
    bank: "Zenith",
    reference: "RE-X243-DI87",
    status: "Rejected",
  },
  {
    id: "PH-004",
    date: "Jul 2026 10:45AM",
    amount: "$18,500",
    bank: "Zenith",
    reference: "RE-X243-DI87",
    status: "Paid",
  },
  {
    id: "PH-005",
    date: "Jul 2026 10:45AM",
    amount: "$18,500",
    bank: "Zenith",
    reference: "RE-X243-DI87",
    status: "Rejected",
  },
];

export default function PaymentsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("customer-transactions");
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live data states
  const [stats, setStats] = useState<PaymentStats>({
    total_revenue: "0.00",
    total_refunds: "0.00",
    pending_transactions: 0,
    total_payouts: "0.00",
    total_commissions: "0.00",
  });
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>(INITIAL_PAYOUTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch live payments and stats
  useEffect(() => {
    const fetchPaymentsData = async () => {
      try {
        setIsLoading(true);
        const [paymentsRes, statsRes] = await Promise.allSettled([
          paymentsService.getPayments(),
          paymentsService.getPaymentStats(),
        ]);

        // Prioritize dedicated stats endpoint administration/payments/stats/
        if (statsRes.status === "fulfilled" && statsRes.value) {
          const s = statsRes.value;
          setStats({
            total_revenue: s.total_revenue ?? "0.00",
            total_refunds: s.total_refunds ?? "0.00",
            pending_transactions: s.pending_transactions ?? 0,
            total_payouts: s.total_payouts ?? "0.00",
            total_commissions: s.total_commissions ?? "0.00",
          });
        } else if (paymentsRes.status === "fulfilled" && paymentsRes.value?.stats) {
          const s = paymentsRes.value.stats;
          setStats({
            total_revenue: s.total_revenue ?? "0.00",
            total_refunds: s.total_refunds ?? "0.00",
            pending_transactions: s.pending_transactions ?? 0,
            total_payouts: s.total_payouts ?? "0.00",
            total_commissions: s.total_commissions ?? "0.00",
          });
        }

        if (paymentsRes.status === "fulfilled" && Array.isArray(paymentsRes.value?.transactions)) {
          setTransactions(paymentsRes.value.transactions);
        }
      } catch (err) {
        console.error("Failed to load live payments:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPaymentsData();
  }, []);

  // Formatting helpers
  const formatAmount = (val: string | number) => {
    const n = parseFloat(String(val || "0"));
    if (isNaN(n)) return "$0.00";
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Mark as successful handler
  const handleMarkTxSuccessful = async (index: number, id: string) => {
    try {
      await paymentsService.markAsSuccessful(id);
      setTransactions((prev) =>
        prev.map((t, i) => (i === index ? { ...t, status: "successful" } : t))
      );
      showToast("success", `Payment ${id} marked as successful`);
    } catch (error: any) {
      console.error("Failed to mark payment as successful:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to mark payment as successful";
      showToast("error", errMsg);
    }
  };

  const handleMarkPayoutSuccessful = (index: number, id: string) => {
    setPayouts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, status: "Completed" } : p))
    );
    showToast("success", `Payout ${id} marked as successful`);
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;

  // Selection states
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);
  const [selectedPayoutIds, setSelectedPayoutIds] = useState<string[]>([]);

  // Copy helper
  const handleCopyAccount = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filtered customer transactions
  const filteredTransactions = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    const custName = t.customer?.full_name?.toLowerCase() || "";
    const id = t.id?.toLowerCase() || "";
    const method = t.method?.toLowerCase() || "";
    const ref = t.provider_reference?.toLowerCase() || "";
    return custName.includes(q) || id.includes(q) || method.includes(q) || ref.includes(q);
  });

  // Filtered driver payouts
  const filteredPayouts = payouts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.driverName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.transactionReference.toLowerCase().includes(q)
    );
  });

  // Checkbox helpers
  const handleToggleSelectAllTx = () => {
    if (selectedTxIds.length === filteredTransactions.length) {
      setSelectedTxIds([]);
    } else {
      setSelectedTxIds(filteredTransactions.map((_, i) => `tx-${i}`));
    }
  };

  const handleToggleTx = (id: string) => {
    setSelectedTxIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllPayouts = () => {
    if (selectedPayoutIds.length === filteredPayouts.length) {
      setSelectedPayoutIds([]);
    } else {
      setSelectedPayoutIds(filteredPayouts.map((_, i) => `po-${i}`));
    }
  };

  const handleTogglePayout = (id: string) => {
    setSelectedPayoutIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.page} onClick={() => setOpenKebab(null)}>
      {/* ─── 1. Dynamic 4 Stat Cards ─── */}
      <div className={styles.statsGrid}>
        {activeTab === "customer-transactions" ? (
          <>
            <StatCard label="Total Revenue" value={formatAmount(stats.total_revenue)} id="stat-revenue" />
            <StatCard label="Total Payouts" value={formatAmount(stats.total_payouts)} id="stat-payouts" />
            <StatCard label="Pending Transactions" value={stats.pending_transactions} id="stat-pending" />
            <StatCard label="Total Refunds" value={formatAmount(stats.total_refunds)} id="stat-refunds" />
          </>
        ) : activeTab === "driver-payouts" ? (
          <>
            <StatCard label="Total Revenue" value={formatAmount(stats.total_revenue)} id="stat-revenue" />
            <StatCard label="Total Payouts" value={formatAmount(stats.total_payouts)} id="stat-payouts" />
            <StatCard label="Pending Transactions" value={stats.pending_transactions} id="stat-pending" />
            <StatCard label="Total Commissions" value={formatAmount(stats.total_commissions || "0.00")} id="stat-commissions" />
          </>
        ) : (
          /* Tab 3 & 4: Payout Request & Transaction History */
          <>
            <StatCard label="Available Earnings" value="0" id="stat-earnings" />
            <StatCard label="Pending Withdrawals" value="0" id="stat-pending-w" />
            <StatCard label="Total Withdrawn" value="0" id="stat-withdrawn" />
            <StatCard label="Last Withdrawn" value="0" id="stat-last-w" />
          </>
        )}
      </div>

      {/* ─── 2. Tab Bar Header with All 4 Tabs & Action Button ─── */}
      <div className={styles.tabBarContainer}>
        <nav className={styles.tabBar} aria-label="Payments tabs">
          <button
            className={`${styles.tab} ${
              activeTab === "customer-transactions" ? styles.tabActive : ""
            }`}
            onClick={() => {
              setActiveTab("customer-transactions");
              setSearchQuery("");
            }}
            id="tab-customer-transactions"
          >
            Customer Transactions
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "driver-payouts" ? styles.tabActive : ""
            }`}
            onClick={() => {
              setActiveTab("driver-payouts");
              setSearchQuery("");
            }}
            id="tab-driver-payouts"
          >
            Driver Payouts
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "payout-request" ? styles.tabActive : ""
            }`}
            onClick={() => {
              setActiveTab("payout-request");
              setSearchQuery("");
            }}
            id="tab-payout-request"
          >
            Payout Request
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "transaction-history" ? styles.tabActive : ""
            }`}
            onClick={() => {
              setActiveTab("transaction-history");
              setSearchQuery("");
            }}
            id="tab-transaction-history"
          >
            Transaction History
          </button>
        </nav>

        <div className={styles.tabActions}>
          <button
            className={styles.devSwitchBtn}
            onClick={() => setIsEmpty((prev) => !prev)}
            title="Toggle between populated and empty states"
          >
            {isEmpty ? "View Active State" : "View Inactive / Empty"}
          </button>

          {(activeTab === "payout-request" ||
            activeTab === "transaction-history") && (
            <button
              className={styles.exportBtn}
              onClick={() => showToast("info", "Exporting payout report...")}
              id="export-payout-btn"
            >
              Export Payout
            </button>
          )}
        </div>
      </div>

      {/* ─── 3. Main Content Views ─── */}
      {isLoading && activeTab === "customer-transactions" ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "360px" }}>
          <Spinner size={36} color="#375DFB" />
        </div>
      ) : isEmpty || (activeTab === "customer-transactions" && filteredTransactions.length === 0) ? (
        /* Empty State (Screenshot 1) */
        <div className={styles.emptyCard} id="payments-empty-state">
          <h2 className={styles.emptyTitle}>
            {activeTab === "customer-transactions"
              ? "No transactions found"
              : activeTab === "driver-payouts"
              ? "No payouts found"
              : activeTab === "payout-request"
              ? "No payout requests found"
              : "No transaction history found"}
          </h2>
          <p className={styles.emptySubtitle}>
            {activeTab === "customer-transactions"
              ? "Customer transactions will appear here"
              : activeTab === "driver-payouts"
              ? "Driver payouts will appear here"
              : activeTab === "payout-request"
              ? "Payout requests will appear here"
              : "Transaction history will appear here"}
          </p>
        </div>
      ) : activeTab === "customer-transactions" ? (
        /* ─── TAB 1: Customer Transactions (Screenshot 2) ─── */
        <div className={styles.tableCard} id="customer-transactions-view">
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <SearchIcon className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={styles.toolBtn}>
              <FilterIcon />
              Filter
            </button>
            <button className={styles.toolBtn}>
              <SortIcon />
              Sort By
            </button>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={
                        selectedTxIds.length === filteredTransactions.length &&
                        filteredTransactions.length > 0
                      }
                      onChange={handleToggleSelectAllTx}
                      aria-label="Select all transactions"
                    />
                  </th>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, idx) => {
                  const rowKey = `tx-${idx}`;
                  const isChecked = selectedTxIds.includes(rowKey);
                  const displayMethod = tx.method
                    ? tx.method.charAt(0).toUpperCase() + tx.method.slice(1)
                    : "Card";

                  return (
                    <tr key={rowKey}>
                      <td className={styles.checkCol}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={isChecked}
                          onChange={() => handleToggleTx(rowKey)}
                          aria-label={`Select transaction ${tx.id}`}
                        />
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: "12.5px" }}>
                        {tx.id}
                      </td>
                      <td>{tx.customer?.full_name || "N/A"}</td>
                      <td style={{ fontWeight: 500 }}>{formatAmount(tx.amount)}</td>
                      <td>{displayMethod}</td>
                      <td>{formatDate(tx.initiated_at)}</td>
                      <td>
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className={styles.actionsCol}>
                        <KebabMenu
                          rowId={rowKey}
                          openKebab={openKebab}
                          setOpenKebab={setOpenKebab}
                          actions={[
                            {
                              label: "View Details",
                              onClick: () => router.push(`/admin/payments/${tx.id}`),
                            },
                            {
                              label: "Mark As Successful",
                              onClick: () => handleMarkTxSuccessful(idx, tx.id),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredTransactions.length / resultsPerPage))}
            resultsPerPage={resultsPerPage}
            onPageChange={setCurrentPage}
            variant="table"
          />
        </div>
      ) : activeTab === "driver-payouts" ? (
        /* ─── TAB 2: Driver Payouts (Screenshot 3) ─── */
        <div className={styles.tableCard} id="driver-payouts-view">
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <SearchIcon className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={styles.toolBtn}>
              <FilterIcon />
              Filter
            </button>
            <button className={styles.toolBtn}>
              <SortIcon />
              Sort By
            </button>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={
                        selectedPayoutIds.length === filteredPayouts.length &&
                        filteredPayouts.length > 0
                      }
                      onChange={handleToggleSelectAllPayouts}
                      aria-label="Select all driver payouts"
                    />
                  </th>
                  <th>Payout ID</th>
                  <th>Driver</th>
                  <th>Earnings</th>
                  <th>Transaction Reference</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map((po, idx) => {
                  const rowKey = `po-${idx}`;
                  const isChecked = selectedPayoutIds.includes(rowKey);

                  return (
                    <tr key={rowKey}>
                      <td className={styles.checkCol}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={isChecked}
                          onChange={() => handleTogglePayout(rowKey)}
                          aria-label={`Select payout ${po.id}`}
                        />
                      </td>
                      <td>{po.id}</td>
                      <td>{po.driverName}</td>
                      <td>{po.amount}</td>
                      <td>{po.transactionReference}</td>
                      <td>{po.date}</td>
                      <td>
                        <StatusBadge status={po.status} />
                      </td>
                      <td className={styles.actionsCol}>
                        <KebabMenu
                          rowId={rowKey}
                          openKebab={openKebab}
                          setOpenKebab={setOpenKebab}
                          actions={[
                            {
                              label: "View Details",
                              onClick: () => router.push(`/admin/payments/${po.id}`),
                            },
                            {
                              label: "Mark As Successful",
                              onClick: () => handleMarkPayoutSuccessful(idx, po.id),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "payout-request" ? (
        /* ─── TAB 3: Payout Request (Screenshot 4) ─── */
        <div className={styles.tableCard} id="payout-requests-view">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Request Amount</th>
                  <th>Request Dated</th>
                  <th>Bank</th>
                  <th>Account Number</th>
                  <th>Account Name</th>
                  <th>Current Balance</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {INITIAL_PAYOUT_REQUESTS.map((pr, idx) => {
                  const rowKey = `pr-${idx}`;

                  return (
                    <tr key={rowKey}>
                      <td style={{ fontWeight: 500 }}>{pr.requestAmount}</td>
                      <td>{pr.requestDated}</td>
                      <td>{pr.bank}</td>
                      <td>
                        <div className={styles.accountCell}>
                          <span>{pr.accountNumber}</span>
                          <button
                            className={styles.copyBtn}
                            onClick={() => handleCopyAccount(rowKey, "0123456789")}
                            title="Copy account number"
                            aria-label="Copy account number"
                          >
                            <CopyIcon />
                            {copiedId === rowKey && (
                              <span className={styles.copiedToast}>Copied!</span>
                            )}
                          </button>
                        </div>
                      </td>
                      <td>{pr.accountName}</td>
                      <td style={{ fontWeight: 500 }}>{pr.currentBalance}</td>
                      <td className={styles.actionsCol}>
                        <KebabMenu
                          rowId={rowKey}
                          openKebab={openKebab}
                          setOpenKebab={setOpenKebab}
                          actions={[
                            {
                              label: "Approve Payout",
                              onClick: () => showToast("success", "Payout request approved"),
                            },
                            {
                              label: "Decline Payout",
                              onClick: () => showToast("info", "Payout request declined"),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ─── TAB 4: Transaction History (Screenshot 5) ─── */
        <div className={styles.tableCard} id="transaction-history-view">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Bank</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {INITIAL_PAYOUT_HISTORY.map((ph, idx) => {
                  const rowKey = `ph-${idx}`;

                  return (
                    <tr key={rowKey}>
                      <td>{ph.date}</td>
                      <td style={{ fontWeight: 500 }}>{ph.amount}</td>
                      <td>{ph.bank}</td>
                      <td>{ph.reference}</td>
                      <td>
                        <StatusBadge status={ph.status} />
                      </td>
                      <td className={styles.actionsCol}>
                        <KebabMenu
                          rowId={rowKey}
                          openKebab={openKebab}
                          setOpenKebab={setOpenKebab}
                          actions={[
                            {
                              label: "Download Receipt",
                              onClick: () => showToast("info", `Downloading receipt for ${ph.reference}`),
                            },
                            {
                              label: "View Details",
                              onClick: () => router.push(`/admin/payments/${ph.id}`),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Status Badge Component ─── */
function StatusBadge({
  status,
}: {
  status: string;
}) {
  const s = (status || "").toLowerCase();
  let label = "Pending";
  let cls = styles.badgePending;

  if (s === "successful" || s === "completed" || s === "paid") {
    label = s === "paid" ? "Paid" : "Completed";
    cls = styles.badgeCompleted;
  } else if (s === "failed" || s === "rejected") {
    label = s === "rejected" ? "Rejected" : "Failed";
    cls = styles.badgeFailed;
  } else if (s === "reversed") {
    label = "Reversed";
    cls = styles.badgeReversed;
  } else if (s === "processing") {
    label = "Processing";
    cls = styles.badgeProcessing;
  }

  return (
    <span className={`${styles.badge} ${cls}`}>
      <span className={styles.badgeDot} />
      {label}
    </span>
  );
}

/* ─── Kebab Menu Component ─── */
function KebabMenu({
  rowId,
  openKebab,
  setOpenKebab,
  actions,
}: {
  rowId: string;
  openKebab: string | null;
  setOpenKebab: (v: string | null) => void;
  actions: { label: string; onClick: () => void }[];
}) {
  return (
    <div className={styles.kebabWrap}>
      <button
        className={styles.moreBtn}
        aria-label="More actions"
        onClick={(e) => {
          e.stopPropagation();
          setOpenKebab(openKebab === rowId ? null : rowId);
        }}
      >
        <MoreIcon />
      </button>
      {openKebab === rowId && (
        <div className={styles.kebabMenu}>
          {actions.map((act, i) => (
            <button
              key={i}
              className={styles.kebabItem}
              onClick={(e) => {
                e.stopPropagation();
                setOpenKebab(null);
                act.onClick();
              }}
            >
              {act.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SVG Icons ─── */
function SearchIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
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
      <line x1={4} y1={6} x2={20} y2={6} />
      <line x1={7} y1={12} x2={17} y2={12} />
      <line x1={10} y1={18} x2={14} y2={18} />
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
      <path d="M7 15l5 5 5-5" />
      <path d="M7 9l5-5 5 5" />
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
      <rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
