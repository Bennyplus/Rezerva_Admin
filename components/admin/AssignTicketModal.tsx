"use client";

import { useEffect, useState } from "react";
import styles from "./TicketModals.module.css";
import CustomSelect from "./CustomSelect";
import { ticketsService } from "@/services/tickets-service";

interface AssignTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (admin: string, notes: string) => void;
}

export default function AssignTicketModal({
  isOpen,
  onClose,
  onAssign,
}: AssignTicketModalProps) {
  const [admin, setAdmin] = useState("");
  const [notes, setNotes] = useState("");
  const [adminOptions, setAdminOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);

  // Fetch real admin users when modal opens
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }

    document.body.style.overflow = "hidden";
    setAdmin("");
    setNotes("");

    const fetchAdmins = async () => {
      setIsLoadingAdmins(true);
      try {
        const users = await ticketsService.getAdmins();
        const mapped = users.map((u: any) => ({
          value: String(u?.id || ""),
          label: u?.user_name || u?.user_email || `Admin ${u?.id}`,
        })).filter((o: any) => o.value !== "");
        setAdminOptions(mapped);
      } catch {
        setAdminOptions([]);
      } finally {
        setIsLoadingAdmins(false);
      }
    };

    fetchAdmins();

    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isValid = admin.trim().length > 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Assign Ticket</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Admin</label>
            {isLoadingAdmins ? (
              <p style={{ fontSize: 13, color: "#868C98" }}>Loading admins…</p>
            ) : (
              <CustomSelect
                name="admin"
                value={admin}
                placeholder="Select an admin"
                options={adminOptions.length > 0 ? adminOptions : [{ value: "", label: "No admins available" }]}
                onChange={(_, v) => setAdmin(v)}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Admin Notes</label>
            <textarea
              className={styles.textarea}
              placeholder="Notes related to the case"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.submitBtn}
            disabled={!isValid || isLoadingAdmins}
            onClick={() => isValid && onAssign(admin, notes)}
          >
            Assign Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
