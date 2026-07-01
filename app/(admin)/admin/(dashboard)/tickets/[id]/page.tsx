"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { TicketStatus } from "@/data/admin-tickets";
import AssignTicketModal from "@/components/admin/AssignTicketModal";
import ResolveTicketModal from "@/components/admin/ResolveTicketModal";
import EscalateTicketModal from "@/components/admin/EscalateTicketModal";
import Spinner from "@/components/admin/Spinner";
import { ticketsService } from "@/services/tickets-service";
import styles from "./ticket-detail.module.css";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const ticketId = unwrappedParams.id;

  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      setIsLoading(true);
      try {
        const data = await ticketsService.getTicketDetails(ticketId);
        setTicket(data);
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
        setTicket(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  const handleAssign = async (adminId: string) => {
    setIsAssigning(true);
    try {
      await ticketsService.assignTicket(ticketId, adminId);
      setTicket((prev: any) => prev ? { ...prev, status: "In Progress" as TicketStatus } : prev);
    } catch (error) {
      console.error("Failed to assign ticket:", error);
    } finally {
      setIsAssignOpen(false);
      setIsAssigning(false);
    }
  };

  const handleEscalate = async (reason: string) => {
    setIsEscalating(true);
    try {
      await ticketsService.escalateTicket(ticketId, reason);
      setTicket((prev: any) => prev ? { ...prev, status: "Escalated", priority: "High" } : prev);
    } catch (error) {
      console.error("Failed to escalate ticket:", error);
    } finally {
      setIsEscalateOpen(false);
      setIsEscalating(false);
    }
  };

  const handleResolve = async (notes: string) => {
    setIsResolving(true);
    try {
      await ticketsService.resolveTicket(ticketId, notes);
      setTicket((prev: any) => prev ? { ...prev, status: "Resolved" as TicketStatus } : prev);
    } catch (error) {
      console.error("Failed to resolve ticket:", error);
    } finally {
      setIsResolveOpen(false);
      setIsResolving(false);
    }
  };

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending": return styles.badgeTodo;
      case "In Progress": return styles.badgeInProgress;
      case "Resolved": return styles.badgeResolved;
      case "Escalated": return styles.badgeEscalated;
      case "Closed": return styles.badgeClosed;
      default: return styles.badgeTodo;
    }
  };

  const initials = ticket?.customerName
    ? ticket.customerName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Spinner />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <p style={{ padding: "32px", color: "#868C98", textAlign: "center" }}>Ticket not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ─── Top Bar ─── */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className={styles.topBarRight}>
          <button className={styles.updateStatusBtn}>
            Update Status
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button className={styles.exportBtn}>Export Log</button>
        </div>
      </div>

      {/* ─── Ticket ID Header ─── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, borderBottom: "1px solid #E2E4E9" }}>
        <div className={styles.ticketInfo}>
          <span className={styles.ticketIdLabel}>Ticket ID</span>
          <div className={styles.ticketIdRow}>
            <h1 className={styles.ticketId}>{ticket.ticketNumber}</h1>
            <button className={styles.copyBtn} aria-label="Copy ticket ID">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <span className={`${styles.badge} ${statusBadgeClass(ticket.status)}`}>
              <span className={styles.badgeDot} />
              {ticket.status}
            </span>
            <span className={styles.naLabel}>Priority: {ticket.priority}</span>
          </div>
          <span className={styles.ticketDate}>Created: {ticket.date}</span>
        </div>
        <div className={styles.assignedRow} style={{ marginTop: "auto" }}>
          Assigned Admin:&nbsp;<span className={styles.assignedName}>{ticket.assigned_admin}</span>
        </div>
      </div>

      {/* ─── Main Layout ─── */}
      <div className={styles.layout}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Customer Details */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Customer Details</h2>
            <div className={styles.customerRow}>
              <div className={styles.customerAvatarPlaceholder}>{initials}</div>
              <div className={styles.customerFields}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Name</span>
                  <span className={styles.fieldValue}>{ticket.customerName}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Phone number</span>
                  <span className={styles.fieldValue}>{ticket.customerPhone}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Email</span>
                  <span className={styles.fieldValue}>{ticket.customerEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Report */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Customer Report</h2>
            <div className={styles.reportBox}>
              <span className={styles.reportCategory}>{ticket.category}</span>
              <p className={styles.reportDesc}>{ticket.description}</p>
            </div>

            {/* Attachments from API */}
            {ticket.attachments?.length > 0 ? (
              ticket.attachments.map((att: any) => {
                const ext = att.file?.split('.').pop()?.split('?')[0]?.toUpperCase() || "FILE";
                const name = att.file?.split('/').pop()?.split('?')[0] || "attachment";
                return (
                  <a
                    key={att.id}
                    href={att.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.attachment}
                    style={{ textDecoration: "none" }}
                  >
                    <div className={styles.attachmentIcon}>{ext.slice(0, 3)}</div>
                    <div>
                      <div className={styles.attachmentName}>{name}</div>
                      <div className={styles.attachmentSize}>Uploaded: {att.uploaded_at ? new Date(att.uploaded_at).toLocaleDateString() : "N/A"}</div>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className={styles.attachment} style={{ color: "#868C98", fontSize: 13 }}>
                No attachments
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Admin Notes</h2>
            <textarea
              className={styles.notesTextarea}
              placeholder="Please enter your notes here"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Activity Timeline — not in API yet */}
          <div className={styles.sideCard}>
            <h2 className={styles.timelineTitle}>Activity Timeline</h2>
            <p style={{ fontSize: 13, color: "#868C98", padding: "8px 0" }}>
              N/A — activity timeline not returned by API
            </p>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsGroup}>
            {[
              { label: "Assign Ticket", onClick: () => setIsAssignOpen(true) },
              { label: "Resolve Ticket", onClick: () => setIsResolveOpen(true) },
              { label: "Close Ticket", onClick: () => { } },
              { label: "Escalate", onClick: () => setIsEscalateOpen(true) },
            ].map((action) => (
              <button key={action.label} className={styles.actionBtn} onClick={action.onClick}>
                {action.label}
                <ChevronIcon className={styles.actionChevron} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Modals ─── */}
      <AssignTicketModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onAssign={(adminId, _notes) => handleAssign(adminId)}
        isLoading={isAssigning}
      />
      <ResolveTicketModal
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
        onResolve={(notes, _email) => handleResolve(notes)}
        isLoading={isResolving}
      />
      <EscalateTicketModal
        isOpen={isEscalateOpen}
        onClose={() => setIsEscalateOpen(false)}
        onEscalate={handleEscalate}
        isLoading={isEscalating}
      />
    </div>
  );
}

/* ─── Inline Icons ─── */
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
