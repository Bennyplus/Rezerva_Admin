"use client";

import { useState } from "react";
import styles from "./SendReminderModal.module.css";

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  bookingId?: string;
}

export default function SendReminderModal({ isOpen, onClose, onConfirm, bookingId }: SendReminderModalProps) {
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (reason.trim()) {
      setStatus("submitting");
      setErrorMsg("");
      try {
        await onConfirm(reason);
        setStatus("success");
      } catch (error: any) {
        setStatus("idle");
        setErrorMsg(error?.response?.data?.message || error?.message || "An error occurred while sending the reminder. Please try again.");
      }
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStatus("idle");
      setReason("");
      setErrorMsg("");
    }, 300);
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{status === "success" ? "Reminder Sent" : "Send Reminder"}</h2>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {status === "success" ? (
          <div className={styles.body} style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <p className={styles.message} style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>
              The reminder has been sent successfully.
            </p>
            <div className={styles.footer} style={{ justifyContent: "center", borderTop: "none", marginTop: 24 }}>
              <button className={styles.confirmBtn} onClick={handleClose} style={{ width: "100%" }}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.body}>
              <p className={styles.message}>
                Are you sure you want to send a reminder for this booking? Please provide a reason.
              </p>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Reason <span className={styles.required}>*</span>
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="Please provide reason for action"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  disabled={status === "submitting"}
                />
              </div>
              {errorMsg && (
                <p style={{ color: "#EF4444", fontSize: "13px", marginTop: "12px" }}>
                  {errorMsg}
                </p>
              )}
            </div>

            <div className={styles.footer}>
              <button className={styles.dismissBtn} onClick={handleClose} disabled={status === "submitting"}>Dismiss</button>
              <button
                className={`${styles.confirmBtn} ${reason.trim() ? styles.confirmBtnActive : ""}`}
                onClick={handleConfirm}
                disabled={!reason.trim() || status === "submitting"}
              >
                {status === "submitting" ? "Sending..." : "Send Reminder"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
