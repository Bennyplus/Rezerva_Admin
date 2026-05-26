"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_TICKETS, TicketStatus, TicketPriority } from "@/data/admin-tickets";
import AssignTicketModal from "@/components/admin/AssignTicketModal";
import ResolveTicketModal from "@/components/admin/ResolveTicketModal";
import styles from "./ticket-detail.module.css";

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Find matching ticket by id; fallback to first ticket for demo
  const ticket = ADMIN_TICKETS.find((t) => t.id === params.id) ?? ADMIN_TICKETS[0];

  const [adminNotes, setAdminNotes] = useState(ticket.adminNotes);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);

  const statusBadgeClass: Record<TicketStatus, string> = {
    "TO DO": styles.badgeTodo,
    "IN PROGRESS": styles.badgeInProgress,
    RESOLVED: styles.badgeResolved,
    CLOSED: styles.badgeClosed,
  };

  const priorityBadgeClass: Record<TicketPriority, string> = {
    Low: styles.priorityLow,
    Medium: styles.priorityMedium,
    High: styles.priorityHigh,
  };

  const initials = ticket.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

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

      {/* ─── Ticket ID + Assigned Admin ─── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, borderBottom: "1px solid #E2E4E9" }}>
        <div className={styles.ticketInfo}>
          <span className={styles.ticketIdLabel}>Ticket ID</span>
          <div className={styles.ticketIdRow}>
            <h1 className={styles.ticketId}>{ticket.id}</h1>
            <button className={styles.copyBtn} aria-label="Copy ticket ID">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <span className={`${styles.badge} ${statusBadgeClass[ticket.status]}`}>
              <span className={styles.badgeDot} />
              {ticket.status}
            </span>
            <span className={`${styles.priorityBadge} ${priorityBadgeClass[ticket.priority]}`}>
              <FlagIcon />
              {ticket.priority}
            </span>
          </div>
          <span className={styles.ticketDate}>On {ticket.date} 11:12AM</span>
        </div>

        <div className={styles.assignedRow} style={{ marginTop: "auto" }}>
          Assigned Admin:&nbsp;<span className={styles.assignedName}>{ticket.assignedAdmin}</span>
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
              <p className={styles.reportDesc}>{ticket.reportDescription}</p>
            </div>
            <div className={styles.attachment}>
              <div className={styles.attachmentIcon}>JPG</div>
              <div>
                <div className={styles.attachmentName}>{ticket.evidenceFileName}</div>
                <div className={styles.attachmentSize}>{ticket.evidenceFileSize} •</div>
              </div>
            </div>
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
          {/* Activity Timeline */}
          <div className={styles.sideCard}>
            <h2 className={styles.timelineTitle}>Activity Timeline</h2>
            <div className={styles.timeline}>
              {ticket.activities.map((activity, i) => (
                <div key={i} className={styles.timelineItem}>
                  <div className={styles.timelineIconWrap}>
                    <div className={styles.timelineIcon}>
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    {i < ticket.activities.length - 1 && (
                      <svg className={styles.timelineLineSvg} width="2" height="100%" preserveAspectRatio="none">
                        <line x1="1" y1="0" x2="1" y2="100%" stroke="#E2E4E9" strokeWidth="2" strokeDasharray="4 6" />
                      </svg>
                    )}
                  </div>
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineLabel}>{activity.label}</span>
                    <span className={styles.timelineMeta}>{activity.date}  {activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsGroup}>
            {[
              { label: "Assign Ticket", onClick: () => setIsAssignOpen(true) },
              { label: "Resolve Ticket", onClick: () => setIsResolveOpen(true) },
              { label: "Close Ticket", onClick: () => { } },
              { label: "Escalate", onClick: () => { } },
            ].map((action) => (
              <button key={action.label} className={styles.actionBtn} onClick={action.onClick}>
                {action.label}
                <ChevronIcon className={styles.actionChevron} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignTicketModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onAssign={(admin, notes) => {
          console.log("Assigned to", admin, notes);
          setIsAssignOpen(false);
        }}
      />
      <ResolveTicketModal
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
        onResolve={(notes, email) => {
          console.log("Resolved with", notes, email);
          setIsResolveOpen(false);
        }}
      />
    </div>
  );
}

/* ─── Inline Icons ─── */
function FlagIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
