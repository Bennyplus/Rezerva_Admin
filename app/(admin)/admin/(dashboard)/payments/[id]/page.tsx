"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/lib/toast-context";
import { paymentsService } from "@/services/payments-service";
import Spinner from "@/components/admin/Spinner";
import styles from "./payment-details.module.css";

export default function PaymentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = (params?.id as string) || "28574c8f-109d-4d1a-b580-f082afad8278";
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("successful");

  // Initial details fallback
  const [details, setDetails] = useState({
    customerName: "Jane Cooper",
    customerEmail: "jane@gmail.com",
    customerPhone: "+234801234573",
    dateCreated: "11 May 2026",
    transactionId: paymentId,
    bookingId: "FNVID-123323-232KD",
    amount: "$10,000",
    fees: "$5,000",
    paymentMethod: "Stripe",
    referenceNumber: "123-123323-232KD",
    paymentInitiated: "11 May 2026  11:12PM",
    paymentReceived: "--",
    timelineInitiatedDate: "11 May 2026  11:34AM",
  });

  // Helpers
  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return "--";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return (
        d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
        "  " +
        d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      return dateStr;
    }
  };

  const formatAmount = (amt: string | number | null | undefined) => {
    if (amt === null || amt === undefined) return "$0.00";
    const n = parseFloat(String(amt));
    if (isNaN(n)) return "$0.00";
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Fetch live payment details from administration/payments/?payment_id={payment_id}
  useEffect(() => {
    const fetchPayment = async () => {
      if (!paymentId) return;
      try {
        setIsLoading(true);
        const live = await paymentsService.getPaymentDetails(paymentId);
        if (live) {
          const displayMethod = live.method
            ? live.method.charAt(0).toUpperCase() + live.method.slice(1)
            : "Card";

          setDetails({
            customerName: live.customer?.full_name || "N/A",
            customerEmail: live.customer?.email || "N/A",
            customerPhone: live.customer?.phone_number || "N/A",
            dateCreated: formatDateTime(live.initiated_at),
            transactionId: live.id || paymentId,
            bookingId: live.booking_id || "N/A",
            amount: formatAmount(live.amount),
            fees: live.fees ? formatAmount(live.fees) : "$0.00",
            paymentMethod: displayMethod,
            referenceNumber: live.provider_reference || "N/A",
            paymentInitiated: formatDateTime(live.initiated_at),
            paymentReceived: live.paid_at ? formatDateTime(live.paid_at) : "--",
            timelineInitiatedDate: formatDateTime(live.initiated_at),
          });
          if (live.status) {
            setStatus(live.status);
          }
        }
      } catch (err) {
        console.error("Failed to load payment details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayment();
  }, [paymentId]);

  const handleCopy = (fieldKey: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleMarkAsSuccessful = async () => {
    try {
      await paymentsService.markAsSuccessful(paymentId);
      setStatus("successful");
      showToast("success", "Payment marked as successful");
    } catch (error: any) {
      console.error("Failed to mark payment as successful:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to mark payment as successful";
      showToast("error", errMsg);
    }
  };

  const handleDownloadReceipt = () => {
    showToast("info", "Downloading payment receipt...");
  };

  const handleRetryTransaction = () => {
    showToast("info", "Retrying transaction...");
  };

  const handleIssueRefund = () => {
    showToast("info", "Opening refund process...");
  };

  const isCompleted =
    status.toLowerCase() === "completed" ||
    status.toLowerCase() === "successful" ||
    status.toLowerCase() === "paid";

  return (
    <div className={styles.page}>
      {/* ─── Top Action Bar ─── */}
      <div className={styles.actionBar}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/admin/payments")}
          aria-label="Back to Payments"
          title="Back to Payments"
        >
          <BackIcon />
        </button>

        <div className={styles.actionBtns}>
          <button className={styles.btnOutline} onClick={handleMarkAsSuccessful}>
            Mark As Successful
          </button>
          <button className={styles.btnFill} onClick={handleDownloadReceipt}>
            Download Receipt
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "360px" }}>
          <Spinner size={36} color="#375DFB" />
        </div>
      ) : (
        /* ─── Two-Column Layout ─── */
        <div className={styles.layout}>
          {/* ─── Left Column: Single Unified Card with Dividers ─── */}
          <div className={styles.mainCard}>
            {/* Section 1: Customer Information */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Customer Information</h2>
              <div className={styles.grid4}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Name</span>
                  <span className={styles.fieldValue}>{details.customerName}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Email</span>
                  <span className={styles.fieldValue}>{details.customerEmail}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Phone</span>
                  <span className={styles.fieldValue}>{details.customerPhone}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Date Created</span>
                  <span className={styles.fieldValue}>{details.dateCreated}</span>
                </div>
              </div>
            </section>

            <hr className={styles.divider} />

            {/* Section 2: Payment Information */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Payment Information</h2>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Transaction ID</span>
                  <span className={styles.fieldValue}>
                    {details.transactionId}
                    <button
                      className={styles.inlineCopyBtn}
                      onClick={() => handleCopy("txId", details.transactionId)}
                      title="Copy Transaction ID"
                      aria-label="Copy Transaction ID"
                    >
                      <CopySmIcon />
                      {copiedField === "txId" && (
                        <span className={styles.copiedToast}>Copied!</span>
                      )}
                    </button>
                  </span>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Booking ID</span>
                  <span className={styles.fieldValue}>
                    {details.bookingId}
                    <button
                      className={styles.inlineCopyBtn}
                      onClick={() => handleCopy("bookingId", details.bookingId)}
                      title="Copy Booking ID"
                      aria-label="Copy Booking ID"
                    >
                      <CopySmIcon />
                      {copiedField === "bookingId" && (
                        <span className={styles.copiedToast}>Copied!</span>
                      )}
                    </button>
                  </span>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Amount</span>
                  <span className={styles.fieldValue}>{details.amount}</span>
                </div>
              </div>

              <div className={styles.field} style={{ marginTop: "24px" }}>
                <span className={styles.fieldLabel}>Fees</span>
                <span className={styles.fieldValue}>{details.fees}</span>
              </div>
            </section>

            <hr className={styles.divider} />

            {/* Section 3: Payment Details */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Payment Details</h2>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Payment Method</span>
                  <span className={styles.fieldValue}>{details.paymentMethod}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Reference Number</span>
                  <span className={styles.fieldValue}>
                    {details.referenceNumber}
                    <button
                      className={styles.inlineCopyBtn}
                      onClick={() => handleCopy("refNum", details.referenceNumber)}
                      title="Copy Reference Number"
                      aria-label="Copy Reference Number"
                    >
                      <CopySmIcon />
                      {copiedField === "refNum" && (
                        <span className={styles.copiedToast}>Copied!</span>
                      )}
                    </button>
                  </span>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Payment Initated</span>
                  <span className={styles.fieldValue}>{details.paymentInitiated}</span>
                </div>
              </div>

              <div className={styles.grid3} style={{ marginTop: "24px" }}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Payment Received</span>
                  <span className={styles.fieldValue}>{details.paymentReceived}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Payment Status</span>
                  <span
                    className={`${styles.badge} ${
                      isCompleted ? styles.badgeCompleted : styles.badgePending
                    }`}
                  >
                    <span className={styles.badgeDot} />
                    {isCompleted ? "Completed" : status}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* ─── Right Column: Timeline & Quick Actions ─── */}
          <div className={styles.sideCol}>
            {/* Card 1: Payment Status */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Payment Status</h3>
              <div className={styles.timeline}>
                {/* Step 1: Payment Initiated */}
                <div className={styles.timelineStep}>
                  <div className={styles.checkboxIndicatorActive}>
                    <CheckIcon />
                  </div>
                  <div className={styles.stepContent}>
                    <span className={styles.stepLabel}>Payment Initated</span>
                    <span className={styles.stepDate}>{details.timelineInitiatedDate}</span>
                  </div>
                </div>

                {/* Connector line */}
                <div className={styles.connectorLine} />

                {/* Step 2: Payment Completed */}
                <div className={styles.timelineStep}>
                  {isCompleted ? (
                    <div className={styles.checkboxIndicatorActive}>
                      <CheckIcon />
                    </div>
                  ) : (
                    <div className={styles.checkboxIndicatorPending} />
                  )}
                  <div className={styles.stepContent}>
                    <span className={styles.stepLabel}>Payment Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Quick Actions */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Quick Actions</h3>
              <div className={styles.quickActionsList}>
                <button className={styles.quickActionBtn} onClick={handleRetryTransaction}>
                  <span>Retry Transaction</span>
                  <ChevronRightIcon />
                </button>
                <button className={styles.quickActionBtn} onClick={handleIssueRefund}>
                  <span>Issue Refund</span>
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Icons ─── */
function BackIcon() {
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
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function CopySmIcon() {
  return (
    <svg
      width={14}
      height={14}
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

function CheckIcon() {
  return (
    <svg
      width={11}
      height={11}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
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
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
