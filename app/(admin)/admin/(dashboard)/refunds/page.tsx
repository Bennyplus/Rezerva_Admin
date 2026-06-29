"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Refund, formatAmount, formatDate, getStatusDisplay } from "@/data/admin-refunds";
import { refundsService } from "@/services/refunds-service";
import Pagination from "@/components/admin/Pagination";
import FilterBar from "@/components/admin/FilterBar";
import MoreIcon from "@/components/admin/icons/MoreIcon";
import styles from "./refunds.module.css";
import RefundDetailsModal from "@/components/admin/RefundDetailsModal";
import ProcessRefundModal from "@/components/admin/ProcessRefundModal";
import RejectRefundModal from "@/components/admin/RejectRefundModal";

const PAGE_SIZE = 9;

export default function RefundsPage() {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Modal state ───────────────────────────────────────────────────────────────
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // ── Toast state ───────────────────────────────────────────────────────────────
  const [showToast, setShowToast] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────────
  const fetchRefunds = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await refundsService.getRefunds();
      setRefunds(res.results);
      setTotalCount(res.count);
    } catch {
      setError("Failed to load refunds. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleProcessRefund = () => {
    setIsProcessOpen(false);
    if (isDetailsOpen) setIsDetailsOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    fetchRefunds();
  };

  const handleRejectRefund = () => {
    setIsRejectOpen(false);
    if (isDetailsOpen) setIsDetailsOpen(false);
    fetchRefunds();
  };


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // ── Derived ───────────────────────────────────────────────────────────────────
  const searchLower = searchQuery.toLowerCase();
  const filteredRefunds = refunds.filter((refund) => {
    if (!searchQuery) return true;
    return (
      refund.reference.toLowerCase().includes(searchLower) ||
      (refund.initiated_by?.full_name || "").toLowerCase().includes(searchLower) ||
      (refund.initiated_by?.email || "").toLowerCase().includes(searchLower) ||
      refund.amount.includes(searchLower)
    );
  });

  const isEmpty = !isLoading && !error && refunds.length === 0;
  const totalPages = Math.max(1, Math.ceil(filteredRefunds.length / PAGE_SIZE));
  const paginatedRefunds = filteredRefunds.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className={styles.page} onClick={() => setOpenKebab(null)}>
      {/* Toast */}
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

      {/* Loading skeleton */}
      {isLoading && (
        <div className={styles.tableCard}>
          <div style={{ padding: "48px", textAlign: "center", color: "#868C98" }}>
            Loading refunds…
          </div>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className={styles.tableCard}>
          <div style={{ padding: "48px", textAlign: "center", color: "#E53E3E" }}>
            {error}
            <br />
            <button
              style={{ marginTop: 12, cursor: "pointer", color: "#2563EB", background: "none", border: "none" }}
              onClick={fetchRefunds}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && isEmpty && (
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
      )}

      {/* Populated table */}
      {!isLoading && !error && !isEmpty && (
        <div className={styles.tableCard} id="refunds-table">
          <FilterBar searchValue={searchQuery} onSearchChange={handleSearch} />

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input type="checkbox" className={styles.checkbox} aria-label="Select all" />
                  </th>
                  <th>Reference</th>
                  <th>Initiated By</th>
                  <th>Amount</th>
                  <th>Date Requested</th>
                  <th>Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {paginatedRefunds.map((r) => (
                  <tr key={r.id}>
                    <td className={styles.checkCol}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        aria-label={`Select ${r.reference}`}
                      />
                    </td>
                    <td>{r.reference}</td>
                    <td>
                      {r.initiated_by?.full_name || r.initiated_by?.email || "—"}
                    </td>
                    <td>{formatAmount(r.amount)}</td>
                    <td>{formatDate(r.created_at)}</td>
                    <td>
                      <RefundBadge status={r.status} />
                    </td>
                    <td className={styles.actionsCol}>
                      <RefundKebab
                        rowId={r.id}
                        openKebab={openKebab}
                        setOpenKebab={setOpenKebab}
                        status={r.status}
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
                {paginatedRefunds.length === 0 && (
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
            resultsPerPage={PAGE_SIZE}
            onPageChange={setCurrentPage}
            variant="table"
          />
        </div>
      )}

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
        refundId={selectedRefund?.id}
      />

      <RejectRefundModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onReject={handleRejectRefund}
        refundId={selectedRefund?.id}
      />
    </div>
  );
}

/* ─── Badge ─── */
function RefundBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: styles.badgePending,
    processing: styles.badgeProcessing,
    success: styles.badgeCompleted,
    rejected: styles.badgeRejected,
    failed: styles.badgeRejected,
  };
  const cls = map[status?.toLowerCase()] ?? styles.badgePending;
  const label = getStatusDisplay(status);
  return (
    <span className={`${styles.badge} ${cls}`}>
      <span className={styles.badgeDot} />
      {label}
    </span>
  );
}

/* ─── Kebab menu ─── */
function RefundKebab({
  rowId,
  openKebab,
  setOpenKebab,
  status,
  onViewDetails,
  onProcess,
  onReject,
}: {
  rowId: string;
  openKebab: string | null;
  setOpenKebab: (v: string | null) => void;
  status: string;
  onViewDetails: () => void;
  onProcess: () => void;
  onReject: () => void;
}) {
  const isPending = status === "pending";
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
          <button
            className={styles.kebabItem}
            onClick={(e) => {
              e.stopPropagation();
              setOpenKebab(null);
              onViewDetails();
            }}
          >
            View Details
          </button>
          {isPending && (
            <>
              <button
                className={styles.kebabItem}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenKebab(null);
                  onProcess();
                }}
              >
                Process Refund
              </button>
              <button
                className={styles.kebabItem}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenKebab(null);
                  onReject();
                }}
              >
                Reject Refund
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
