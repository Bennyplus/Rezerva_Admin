"use client";

import { useState } from "react";
import Image from "next/image";
import { SupportTicket } from "@/services/support-center-service";
import styles from "./SupportTicketDetailView.module.css";

interface SupportTicketDetailViewProps {
  ticket: SupportTicket;
  onBack: () => void;
  onUpdateStatus?: (status: string) => void;
  onExport?: () => void;
  onOpenAssignModal: (ticket: SupportTicket) => void;
  onOpenResolveModal: (ticket: SupportTicket) => void;
  onOpenCloseModal: (ticket: SupportTicket) => void;
  onOpenEscalateModal: (ticket: SupportTicket) => void;
}

function getString(val: any, fallback = "—"): string {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "object") return val.name || val.location || val.address || val.title || JSON.stringify(val);
  return String(val);
}

export default function SupportTicketDetailView({
  ticket,
  onBack,
  onUpdateStatus,
  onExport,
  onOpenAssignModal,
  onOpenResolveModal,
  onOpenCloseModal,
  onOpenEscalateModal,
}: SupportTicketDetailViewProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [adminNote, setAdminNote] = useState(ticket.adminNotes || "");

  const handleCopy = (text: string) => {
    if (!text || text === "—") return;
    navigator.clipboard.writeText(text);
    if (typeof (window as any).__showAdminToast === "function") {
      (window as any).__showAdminToast("success", "Ticket ID copied to clipboard");
    }
  };

  const getStatusStyle = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("progress")) return styles.statusInProgress;
    if (s.includes("closed")) return styles.statusClosed;
    if (s.includes("resolve")) return styles.statusResolved;
    return styles.statusPending;
  };

  const priorityColor =
    ticket.priority === "High" || ticket.priority === "Critical" ? "#DC2626" : ticket.priority === "Medium" ? "#EA580C" : "#2563EB";

  const timelineItems = ticket.timeline && ticket.timeline.length > 0 ? ticket.timeline : [
    { title: "Ticket Submitted", timestamp: ticket.createdOn || "11 May 2026 11:34AM", completed: true },
    { title: `Assigned to Admin ${ticket.assignedAdmin || "Prosper Edward"}`, timestamp: ticket.createdOn || "11 May 2026 11:34AM", completed: true },
    { title: "Refund Investigation Started", timestamp: "12 June 2026 11:45AM", completed: true },
  ];

  return (
    <div className={styles.container}>
      {/* ── Top Action Bar ── */}
      <div className={styles.headerRow}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Go back">
          <ArrowLeftIcon />
        </button>

        <div className={styles.headerActions}>
          <div className={styles.statusDropdownWrap}>
            <button
              type="button"
              className={styles.statusDropdownBtn}
              onClick={() => setIsStatusOpen((v) => !v)}
            >
              Update Status
              <ChevronDownIcon />
            </button>
            {isStatusOpen && (
              <div className={styles.statusMenu}>
                {["Pending", "In Progress", "Resolved", "Closed", "Escalated"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={styles.statusMenuItem}
                    onClick={() => {
                      setIsStatusOpen(false);
                      onUpdateStatus?.(st);
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className={styles.exportBtn}
            onClick={() => onExport?.() || alert("Exporting ticket log...")}
          >
            Export Log
          </button>
        </div>
      </div>

      {/* ── Subheader / Ticket Metadata ── */}
      <div className={styles.metadataRow}>
        <div className={styles.ticketMetaLeft}>
          <span className={styles.ticketIdLabel}>Ticket ID</span>
          <div className={styles.ticketTitleRow}>
            <span className={styles.ticketIdLarge}>{getString(ticket.ticketId)}</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => handleCopy(ticket.ticketId)}
              title="Copy Ticket ID"
            >
              <CopyIcon />
            </button>
            <span className={`${styles.statusBadge} ${getStatusStyle(ticket.status)}`}>
              <span className={styles.statusDot} />
              {ticket.status || "In Progress"}
            </span>
            <span className={styles.priorityFlag} style={{ color: priorityColor }}>
              <FlagIcon fill={priorityColor} />
              {ticket.priority || "Low"}
            </span>
          </div>
          <span className={styles.ticketDate}>On {getString(ticket.createdOn, "22 Apr 2026 11:12AM")}</span>
        </div>

        <div className={styles.assignedBadge}>
          Assigned Admin : <strong>{getString(ticket.assignedAdmin, "Prosper Edward")}</strong>
        </div>
      </div>

      {/* ── 2-Column Main Layout ── */}
      <div className={styles.mainLayout}>
        <div className={styles.leftCol}>
          {/* Card 1: Customer Details */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Customer Details</h3>
            <div className={styles.customerProfileRow}>
              <div className={styles.avatarWrap}>
                {ticket.customerAvatar ? (
                  <Image
                    src={ticket.customerAvatar}
                    alt={ticket.user || "Customer"}
                    width={72}
                    height={72}
                    className={styles.avatarImg}
                  />
                ) : (
                  <span>{(ticket.user || "SJ").slice(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className={styles.customerFields}>
                <div className={styles.customerField}>
                  <span className={styles.customerLabel}>Name</span>
                  <span className={styles.customerValue}>{getString(ticket.customerName || ticket.user, "Sarah Johnson")}</span>
                </div>
                <div className={styles.customerField}>
                  <span className={styles.customerLabel}>Phone number</span>
                  <span className={styles.customerValue}>{getString(ticket.customerPhone, "+2348034567865")}</span>
                </div>
                <div className={styles.customerField}>
                  <span className={styles.customerLabel}>Email</span>
                  <span className={styles.customerValue}>{getString(ticket.customerEmail, "sarahjohnson@gmail.com")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Customer Report */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Customer Report</h3>
            <div className={styles.reportBox}>
              <span className={styles.reportCategory}>{getString(ticket.category || ticket.ticketType, "Payment Issues")}</span>
              <p className={styles.reportText}>{getString(ticket.description, "Customer reported duplicate charge")}</p>
              <p className={styles.reportText}>{getString(ticket.resolutionNotes, "Full refund approved after payment verification")}</p>
            </div>

            <div className={styles.evidenceCard}>
              <div className={styles.evidenceIcon}>JPG</div>
              <div className={styles.evidenceInfo}>
                <span className={styles.evidenceName}>{getString(ticket.evidenceName, "Screenshot-Evidence")}</span>
                <span className={styles.evidenceSize}>{getString(ticket.evidenceSize, "0 KB of 120 KB •")}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Admin Notes */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Admin Notes</h3>
            <textarea
              className={styles.adminNotesArea}
              placeholder="Please enter your notes here"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.rightCol}>
          {/* Card 1: Activity Timeline */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Activity Timeline</h3>
            <div className={styles.timelineList}>
              {timelineItems.map((step, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  {idx < timelineItems.length - 1 && <div className={styles.timelineLine} />}
                  <div className={`${styles.timelineCheck} ${step.completed ? styles.timelineCheckDone : styles.timelineCheckPending}`}>
                    {step.completed && <CheckIcon />}
                  </div>
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineTitle}>{step.title}</span>
                    <span className={styles.timelineTime}>{step.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Quick Actions */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
            <div className={styles.actionsList}>
              <button type="button" className={styles.actionBtn} onClick={() => onOpenAssignModal(ticket)}>
                <span>Assign Ticket</span>
                <ChevronRightIcon />
              </button>
              <button type="button" className={styles.actionBtn} onClick={() => onOpenResolveModal(ticket)}>
                <span>Resolve Ticket</span>
                <ChevronRightIcon />
              </button>
              <button type="button" className={styles.actionBtn} onClick={() => onOpenCloseModal(ticket)}>
                <span>Close Ticket</span>
                <ChevronRightIcon />
              </button>
              <button type="button" className={styles.actionBtn} onClick={() => onOpenEscalateModal(ticket)}>
                <span>Escalate</span>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return (<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>);
}
function ChevronDownIcon() {
  return (<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>);
}
function ChevronRightIcon() {
  return (<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>);
}
function FlagIcon({ fill = "#2563EB" }: { fill?: string }) {
  return (<svg width={14} height={14} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth={1}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>);
}
function CopyIcon() {
  return (<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>);
}
function CheckIcon() {
  return (<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}
