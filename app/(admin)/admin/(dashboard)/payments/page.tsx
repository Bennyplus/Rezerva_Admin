"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ADMIN_TRANSACTIONS,
  ADMIN_PAYOUTS,
  PAYMENT_STATS,
  Transaction,
  Payout,
  TransactionStatus,
  PayoutStatus,
} from "@/data/admin-payments";
import Pagination from "@/components/admin/Pagination";
import styles from "./payments.module.css";

type Tab = "transactions" | "payouts";

export default function PaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("transactions");
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  const filteredTransactions = ADMIN_TRANSACTIONS.filter(
    (t) =>
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayouts = ADMIN_PAYOUTS.filter(
    (p) =>
      p.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fourthStatLabel =
    activeTab === "transactions" ? "Total Refunds" : "Total Commissions";
  const fourthStatValue =
    activeTab === "transactions"
      ? PAYMENT_STATS.totalRefunds
      : PAYMENT_STATS.totalCommissions;

  return (
    <div className={styles.page} onClick={() => setOpenKebab(null)}>
      {/* ─── Stats ─── */}
      <div className={styles.statsGrid}>
        {[
          { label: "Total Revenue", value: PAYMENT_STATS.totalRevenue },
          { label: "Total Payouts", value: PAYMENT_STATS.totalPayouts },
          { label: "Pending Transactions", value: PAYMENT_STATS.pendingTransactions },
          { label: fourthStatLabel, value: fourthStatValue },
        ].map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
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

      {isEmpty ? (
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
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="transactions-search"
              />
            </div>
            <button className={styles.toolBtn}><FilterIcon /> Filter</button>
            <button className={styles.toolBtn}><SortIcon /> Sort By</button>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input type="checkbox" className={styles.checkbox} aria-label="Select all" />
                  </th>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Transaction Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t, i) => (
                  <tr key={`${t.id}-${i}`}>
                    <td className={styles.checkCol}>
                      <input type="checkbox" className={styles.checkbox} aria-label={`Select ${t.customerName}`} />
                    </td>
                    <td>{t.id}</td>
                    <td>{t.customerName}</td>
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
                      />
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "#868C98" }}>
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            resultsPerPage={9}
            onPageChange={setCurrentPage}
            variant="table"
          />
        </div>
      ) : (
        /* ─── Payouts Table ─── */
        <div className={styles.tableCard} id="payouts-table">
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="payouts-search"
              />
            </div>
            <button className={styles.toolBtn}><FilterIcon /> Filter</button>
            <button className={styles.toolBtn}><SortIcon /> Sort By</button>
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
                {filteredPayouts.map((p, i) => (
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
                {filteredPayouts.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "#868C98" }}>
                      No payouts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            resultsPerPage={9}
            onPageChange={setCurrentPage}
            variant="table"
          />
        </div>
      )}

      {/* Dev toggle */}
      <div className={styles.devToggleWrap}>
        <button className={styles.stateToggle} onClick={() => setIsEmpty((v) => !v)} id="toggle-payments-state">
          {isEmpty ? "Show Populated State" : "Show Empty State"} →
        </button>
      </div>
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
  rowId, openKebab, setOpenKebab, onViewDetails,
}: {
  rowId: string;
  openKebab: string | null;
  setOpenKebab: (v: string | null) => void;
  onViewDetails: () => void;
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
          <button className={styles.kebabItem}>Mark As Successful</button>
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
function SearchIcon() { return <svg {...ip}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>; }
function FilterIcon() { return <svg {...ip}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>; }
function SortIcon() { return <svg {...ip}><line x1="11" y1="5" x2="19" y2="5" /><line x1="11" y1="9" x2="15" y2="9" /><line x1="11" y1="13" x2="19" y2="13" /><line x1="11" y1="17" x2="15" y2="17" /><path d="M4 17l4 4 4-4" /><path d="M8 3v18" /></svg>; }
function MoreIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }
