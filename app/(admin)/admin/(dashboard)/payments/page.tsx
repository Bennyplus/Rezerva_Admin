"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Transaction,
  Payout,
  TransactionStatus,
  PayoutStatus,
} from "@/data/admin-payments";
import Pagination from "@/components/admin/Pagination";
import FilterBar from "@/components/admin/FilterBar";
import Spinner from "@/components/admin/Spinner";
import StatCard from "@/components/admin/StatCard";
import styles from "./payments.module.css";
import { paymentsService } from "@/services/payments-service";

type Tab = "transactions" | "payouts";

export default function PaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("transactions");
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statsMetrics, setStatsMetrics] = useState<{
    total_revenue: number;
    total_payouts: number;
    pending_transactions: number;
    total_commissions: number;
  } | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (activeTab === "transactions") {
          const data = await paymentsService.getTransactions(currentPage, searchQuery);
          setTransactions(data || []);
        } else {
          const data = await paymentsService.getPayouts(currentPage, searchQuery);
          setPayouts(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch table data:", error);
        if (activeTab === "transactions") setTransactions([]);
        else setPayouts([]);
      }

      try {
        const statsData = await paymentsService.getPaymentStats();
        const m = statsData?.metrics;
        if (m) {
          setStatsMetrics({
            total_revenue: m.total_revenue ?? 0,
            total_payouts: m.total_payouts ?? 0,
            pending_transactions: m.pending_transactions ?? 0,
            total_commissions: m.total_commissions ?? 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch payment stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab]); // ← client-side pagination: only re-fetch when tab changes

  const handleMarkAsSuccessful = async (id: string) => {
    try {
      await paymentsService.markAsSuccessful(id);
      setTransactions((prev) => prev.map(t => t.id === id ? { ...t, status: "Completed" } : t));
    } catch (error) {
      console.error("Failed to mark payment as successful:", error);
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayouts = payouts.filter(
    (p) =>
      p.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to page 1 whenever search or tab changes
  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeTab]);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // const fourthStatLabel =
  //   activeTab === "transactions" ? "Total Refunds" : "Total Commissions";
  // const fourthStatValue =
  //   activeTab === "transactions"
  //     ? stats?.totalRefunds
  //     : stats?.totalCommissions;

  return (
    <div className={styles.page} onClick={() => setOpenKebab(null)}>
      {/* ─── Stats ─── */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Revenue" value={statsMetrics ? statsMetrics.total_revenue.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"} id="stat-revenue" />
        <StatCard label="Total Payouts" value={statsMetrics ? statsMetrics.total_payouts : "—"} id="stat-payouts" />
        <StatCard label="Pending Transactions" value={statsMetrics ? statsMetrics.pending_transactions : "—"} id="stat-pending" />
        <StatCard label="Total Commissions" value={statsMetrics ? statsMetrics.total_commissions : "—"} id="stat-fourth" />
      </div>

      {/* ─── Tabs ─── */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === "transactions" ? styles.tabActive : ""}`}
          onClick={() => { setActiveTab("transactions"); setSearchQuery(""); }}
          id="tab-transactions"
        >
          Transactions
        </button>
        <button
          className={`${styles.tab} ${activeTab === "payouts" ? styles.tabActive : ""}`}
          onClick={() => { setActiveTab("payouts"); setSearchQuery(""); }}
          id="tab-payouts"
        >
          Payouts
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <Spinner />
        </div>
      ) : isEmpty || (activeTab === "transactions" && transactions.length === 0) || (activeTab === "payouts" && payouts.length === 0) ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard} id="payments-empty-state">
          <div className={styles.illustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No transactions illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>
            {activeTab === "transactions" ? "No transactions found" : "No payouts found"}
          </h2>
          <p className={styles.emptySubtitle}>
            {activeTab === "transactions"
              ? "Customer transactions will appear here"
              : "Driver payouts will appear here"}
          </p>
        </div>
      ) : activeTab === "transactions" ? (
        /* ─── Transactions Table ─── */
        <div className={styles.tableCard} id="transactions-table">
          <div className={styles.toolbar} style={{ display: 'flex', alignItems: 'center' }}>
            <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input type="checkbox" className={styles.checkbox} aria-label="Select all" />
                  </th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Transaction Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((t, i) => (
                  <tr key={`${t.id}-${i}`}>
                    <td className={styles.checkCol}>
                      <input type="checkbox" className={styles.checkbox} aria-label={`Select ${t.customerName}`} />
                    </td>
                    <td>{t.id}</td>
                    <td>{t.amount}</td>
                    <td>{t.type}</td>
                    <td>{t.date}</td>
                    <td>
                      <TransactionBadge status={t.status} />
                    </td>
                    <td className={styles.actionsCol}>
                      <TransactionKebab
                        rowId={`${t.id}-${i}`}
                        openKebab={openKebab}
                        setOpenKebab={setOpenKebab}
                        onViewDetails={() => router.push(`/admin/payments/${t.customerId}`)}
                        onMarkAsSuccessful={() => handleMarkAsSuccessful(t.id)}
                      />
                    </td>
                  </tr>
                ))}
                {paginatedTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#868C98" }}>
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.max(1, Math.ceil(filteredTransactions.length / resultsPerPage))}
              resultsPerPage={resultsPerPage}
              onPageChange={setCurrentPage}
              variant="table"
            />
          )}
        </div>
      ) : (
        /* ─── Payouts Table ─── */
        <div className={styles.tableCard} id="payouts-table">
          <div className={styles.toolbar} style={{ display: 'flex', alignItems: 'center' }}>
            <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input type="checkbox" className={styles.checkbox} aria-label="Select all" />
                  </th>
                  <th>Payout ID</th>
                  <th>Driver</th>
                  <th>Amount</th>
                  <th>Transaction Reference</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {paginatedPayouts.map((p, i) => (
                  <tr key={`${p.id}-${i}`}>
                    <td className={styles.checkCol}>
                      <input type="checkbox" className={styles.checkbox} aria-label={`Select ${p.driverName}`} />
                    </td>
                    <td>{p.id}</td>
                    <td>{p.driverName}</td>
                    <td>{p.amount}</td>
                    <td>{p.transactionReference}</td>
                    <td>{p.date}</td>
                    <td>
                      <PayoutBadge status={p.status} />
                    </td>
                    <td className={styles.actionsCol}>
                      <PayoutKebab
                        rowId={`payout-${i}`}
                        openKebab={openKebab}
                        setOpenKebab={setOpenKebab}
                      />
                    </td>
                  </tr>
                ))}
                {paginatedPayouts.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#868C98" }}>
                      No payouts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredPayouts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.max(1, Math.ceil(filteredPayouts.length / resultsPerPage))}
              resultsPerPage={resultsPerPage}
              onPageChange={setCurrentPage}
              variant="table"
            />
          )}
        </div>
      )}

    </div>
  );
}

/* ─── Badge Components ─── */
function TransactionBadge({ status }: { status: TransactionStatus }) {
  const map: Record<TransactionStatus, string> = {
    Pending: styles.badgePending,
    Completed: styles.badgeCompleted,
    Failed: styles.badgeFailed,
    Reversed: styles.badgeReversed,
    Processing: styles.badgeProcessing,
  };
  return (
    <span className={`${styles.badge} ${map[status]}`}>
      <span className={styles.badgeDot} />
      {status}
    </span>
  );
}

function PayoutBadge({ status }: { status: PayoutStatus }) {
  const cls = status === "Completed" ? styles.badgeCompleted : styles.badgePending;
  return (
    <span className={`${styles.badge} ${cls}`}>
      <span className={styles.badgeDot} />
      {status}
    </span>
  );
}

/* ─── Kebab menus ─── */
function TransactionKebab({
  rowId, openKebab, setOpenKebab, onViewDetails, onMarkAsSuccessful
}: {
  rowId: string;
  openKebab: string | null;
  setOpenKebab: (v: string | null) => void;
  onViewDetails: () => void;
  onMarkAsSuccessful: () => void;
}) {
  return (
    <div className={styles.kebabWrap}>
      <button
        className={styles.moreBtn}
        aria-label="More actions"
        onClick={(e) => { e.stopPropagation(); setOpenKebab(openKebab === rowId ? null : rowId); }}
      >
        <MoreIcon />
      </button>
      {openKebab === rowId && (
        <div className={styles.kebabMenu}>
          <button className={styles.kebabItem} onClick={onViewDetails}>View Details</button>
          <button className={styles.kebabItem} onClick={onMarkAsSuccessful}>Mark As Successful</button>
        </div>
      )}
    </div>
  );
}

function PayoutKebab({
  rowId, openKebab, setOpenKebab,
}: {
  rowId: string;
  openKebab: string | null;
  setOpenKebab: (v: string | null) => void;
}) {
  return (
    <div className={styles.kebabWrap}>
      <button
        className={styles.moreBtn}
        aria-label="More actions"
        onClick={(e) => { e.stopPropagation(); setOpenKebab(openKebab === rowId ? null : rowId); }}
      >
        <MoreIcon />
      </button>
      {openKebab === rowId && (
        <div className={styles.kebabMenu}>
          <button className={styles.kebabItem}>View Details</button>
          <button className={styles.kebabItem}>Mark As Successful</button>
        </div>
      )}
    </div>
  );
}

/* ─── Inline Icons ─── */
const ip = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
function MoreIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }
