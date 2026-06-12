"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionStatus } from "@/data/admin-payments";
import styles from "./payment-details.module.css";
import { paymentsService } from "@/services/payments-service";
import Spinner from "@/components/admin/Spinner";

export default function PaymentDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const data = await paymentsService.getPaymentDetails(params.id);
        setTx(data);
      } catch (error) {
        console.error("Failed to fetch payment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!tx) {
    return <div style={{ padding: "24px" }}>Payment not found.</div>;
  }

  const statusStr = String(tx.status || tx.transaction_status || "Pending");
  let mappedStatus = "Pending";
  if (statusStr.toLowerCase().includes("success") || statusStr.toLowerCase() === "completed") mappedStatus = "Completed";
  else if (statusStr.toLowerCase() === "failed") mappedStatus = "Failed";
  else if (statusStr.toLowerCase() === "reversed") mappedStatus = "Reversed";
  else if (statusStr.toLowerCase() === "processing") mappedStatus = "Processing";

  const isPending = mappedStatus === "Pending" || mappedStatus === "Processing";

  return (
    <div className={styles.page}>
      {/* ─── Action Bar ─── */}
      <div className={styles.actionBar}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <BackIcon />
        </button>
        <div className={styles.actionBtns}>
          {isPending && (
            <button className={styles.btnOutline}>Mark As Successful</button>
          )}
          <button className={styles.btnFill}>Download Receipt</button>
        </div>
      </div>

      {/* ─── Header ─── */}
      <div className={styles.pageHeader}>
        <div className={styles.transactionIdRow}>
          <h1 className={styles.transactionId}>{tx.id || tx.transaction_id || params.id}</h1>
          <button className={styles.copyBtn} aria-label="Copy transaction ID" onClick={() => navigator.clipboard.writeText(tx.id || tx.transaction_id || params.id)}>
            <CopyIcon />
          </button>
          <StatusBadge status={mappedStatus as TransactionStatus} />
        </div>
        <p className={styles.headerDate}>{tx.paymentInitiated || tx.created_at || tx.payment_initiated || "N/A"}</p>
      </div>

      {/* ─── Two-Column Layout ─── */}
      <div className={styles.layout}>
        {/* Left: Info Cards */}
        <div className={styles.cardsCol}>
          {/* Customer Information */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Customer Information</h2>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <span className={styles.fieldValue}>{tx.customerName || tx.customer_name || "N/A"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <span className={styles.fieldValue}>{tx.customerEmail || tx.customer_email || "N/A"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Phone</span>
                <span className={styles.fieldValue}>{tx.customerPhone || tx.customer_phone || "N/A"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Date Created</span>
                <span className={styles.fieldValue}>{tx.dateCreated || tx.created_at || "N/A"}</span>
              </div>
            </div>
            <div className={styles.field} style={{ marginTop: "20px" }}>
              <span className={styles.fieldLabel}>Booking Type</span>
              <span className={styles.fieldValue}>{tx.bookingType || tx.booking_type || "N/A"}</span>
            </div>
          </div>

          {/* Payment Information */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Payment Information</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Transaction ID</span>
                <span className={styles.fieldValue}>
                  {tx.id || tx.transaction_id || params.id}
                  <button className={styles.inlineCopyBtn} onClick={() => navigator.clipboard.writeText(tx.id || tx.transaction_id || params.id)} aria-label="Copy">
                    <CopySmIcon />
                  </button>
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Booking ID</span>
                <span className={styles.fieldValue}>
                  {tx.bookingId || tx.booking_id || "N/A"}
                  <button className={styles.inlineCopyBtn} onClick={() => navigator.clipboard.writeText(tx.bookingId || tx.booking_id || "")} aria-label="Copy">
                    <CopySmIcon />
                  </button>
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Amount</span>
                <span className={styles.fieldValue}>{tx.amount || "$0.00"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Fees</span>
                <span className={styles.fieldValue}>{tx.fees || "$0.00"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Taxes</span>
                <span className={styles.fieldValue}>{tx.taxes || "$0.00"}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Payment Details</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Payment Method</span>
                <span className={styles.fieldValue}>{tx.paymentMethod || tx.payment_method || "N/A"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Reference Number</span>
                <span className={styles.fieldValue}>
                  {tx.referenceNumber || tx.reference_number || "N/A"}
                  <button className={styles.inlineCopyBtn} onClick={() => navigator.clipboard.writeText(tx.referenceNumber || tx.reference_number || "")} aria-label="Copy">
                    <CopySmIcon />
                  </button>
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Payment Initiated</span>
                <span className={styles.fieldValue}>{tx.paymentInitiated || tx.payment_initiated || "N/A"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Payment Received</span>
                <span className={styles.fieldValue}>{tx.paymentReceived || tx.payment_received || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Payment Status Timeline */}
        <div className={styles.statusCard}>
          <h2 className={styles.statusTitle}>Payment Status</h2>
          <div className={styles.timeline}>
            {/* Step 1: Payment Initiated */}
            <div className={styles.timelineStep}>
              <div className={`${styles.stepIndicator} ${styles.stepIndicatorDone}`}>
                <CheckIcon />
              </div>
              <div className={styles.stepContent}>
                <p className={styles.stepLabel}>Payment Initiated</p>
                <p className={styles.stepDate}>{tx.paymentInitiatedAt || tx.payment_initiated_at || tx.created_at || "N/A"}</p>
              </div>
            </div>

            {/* Step 2: Payment Completed */}
            <div className={styles.timelineStep}>
              <div className={`${styles.stepIndicator} ${(tx.paymentCompletedAt || tx.payment_completed_at || mappedStatus === "Completed") ? styles.stepIndicatorDone : ""}`}>
                {(tx.paymentCompletedAt || tx.payment_completed_at || mappedStatus === "Completed") && <CheckIcon />}
              </div>
              <div className={styles.stepContent}>
                <p className={styles.stepLabel}>Payment Completed</p>
                {(tx.paymentCompletedAt || tx.payment_completed_at) && (
                  <p className={styles.stepDate}>{tx.paymentCompletedAt || tx.payment_completed_at}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: TransactionStatus }) {
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

/* ─── Inline Icons ─── */
function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function CopySmIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
