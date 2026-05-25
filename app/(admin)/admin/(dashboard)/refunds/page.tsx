"use client";

import { useState } from "react";
import Image from "next/image";
import { ADMIN_REFUNDS, Refund, RefundStatus } from "@/data/admin-refunds";
import Pagination from "@/components/admin/Pagination";
import FilterBar from "@/components/admin/FilterBar";
import styles from "./refunds.module.css";
import RefundDetailsModal from "@/components/admin/RefundDetailsModal";
import ProcessRefundModal from "@/components/admin/ProcessRefundModal";
import RejectRefundModal from "@/components/admin/RejectRefundModal";

export default function RefundsPage() {
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 16;

  // Modals state
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Toast state
  const [showToast, setShowToast] = useState(false);

  const filteredRefunds = ADMIN_REFUNDS.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProcessRefund = () => {
    setIsProcessOpen(false);
    if (isDetailsOpen) setIsDetailsOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRejectRefund = () => {
    setIsRejectOpen(false);
    if (isDetailsOpen) setIsDetailsOpen(false);
  };

  return (
    <div className={styles.page} onClick={() => setOpenKebab(null)}>
      {showToast && (
        <>
          <div className={styles.toastOverlay} />
          <div className={styles.toastWrapper}>
            <div className={styles.toastIconWrap}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#088537" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            Customer refund is being processed successfully
            <button className={styles.toastClose} onClick={() => setShowToast(false)}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </>
      )}

      {isEmpty ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard} id="refunds-empty-state">
          <div className={styles.illustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No refunds illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>No refunds found</h2>
          <p className={styles.emptySubtitle}>
            Customer refund requests will appear here
          </p>
        </div>
      ) : (
        /* ─── Refunds Table ─── */
        <div className={styles.tableCard} id="refunds-table">
          <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} />

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input type="checkbox" className={styles.checkbox} aria-label="Select all" />
                  </th>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date Requested</th>
                  <th>Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {filteredRefunds.map((r, i) => (
                  <tr key={`${r.bookingId}-${i}`}>
                    <td className={styles.checkCol}>
                      <input type="checkbox" className={styles.checkbox} aria-label={`Select ${r.customerName}`} />
                    </td>
                    <td>{r.bookingId}</td>
                    <td>{r.customerName}</td>
                    <td>{r.amount}</td>
                    <td>{r.dateRequested}</td>
                    <td>
                      <RefundBadge status={r.status} />
                    </td>
                    <td className={styles.actionsCol}>
                      <RefundKebab
                        rowId={`${r.bookingId}-${i}`}
                        openKebab={openKebab}
                        setOpenKebab={setOpenKebab}
                        onViewDetails={() => {
                          setSelectedRefund(r);
                          setIsDetailsOpen(true);
                        }}
                        onProcess={() => {
                          setSelectedRefund(r);
                          setIsProcessOpen(true);
                        }}
                        onReject={() => {
                          setSelectedRefund(r);
                          setIsRejectOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
                {filteredRefunds.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#868C98" }}>
                      No refunds found matching your search.
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
        <button className={styles.stateToggle} onClick={() => setIsEmpty((v) => !v)} id="toggle-refunds-state">
          {isEmpty ? "Show Populated State" : "Show Empty State"} →
        </button>
      </div>

      {/* Modals */}
      <RefundDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        refund={selectedRefund}
        onReject={() => setIsRejectOpen(true)}
        onProcess={() => setIsProcessOpen(true)}
      />

      <ProcessRefundModal
        isOpen={isProcessOpen}
        onClose={() => setIsProcessOpen(false)}
        onProcess={handleProcessRefund}
      />

      <RejectRefundModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onReject={handleRejectRefund}
      />
    </div>
  );
}

/* ─── Badge Components ─── */
function RefundBadge({ status }: { status: RefundStatus }) {
  const map: Record<RefundStatus, string> = {
    Pending: styles.badgePending,
    Completed: styles.badgeCompleted,
    Rejected: styles.badgeRejected,
    Processing: styles.badgeProcessing,
  };
  return (
    <span className={`${styles.badge} ${map[status]}`}>
      <span className={styles.badgeDot} />
      {status}
    </span>
  );
}

/* ─── Kebab menu ─── */
function RefundKebab({
  rowId, openKebab, setOpenKebab, onViewDetails, onProcess, onReject
}: {
  rowId: string;
  openKebab: string | null;
  setOpenKebab: (v: string | null) => void;
  onViewDetails: () => void;
  onProcess: () => void;
  onReject: () => void;
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
          <button className={styles.kebabItem} onClick={(e) => { e.stopPropagation(); setOpenKebab(null); onViewDetails(); }}>View Details</button>
          <button className={styles.kebabItem} onClick={(e) => { e.stopPropagation(); setOpenKebab(null); onProcess(); }}>Process Refund</button>
          <button className={styles.kebabItem} onClick={(e) => { e.stopPropagation(); setOpenKebab(null); onReject(); }}>Reject Refund</button>
        </div>
      )}
    </div>
  );
}

/* ─── Inline Icons ─── */
const ip = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
function MoreIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }
