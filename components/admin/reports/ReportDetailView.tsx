"use client";

import { useState } from "react";
import { ReportTicket } from "@/services/reports-service";
import styles from "./ReportDetailView.module.css";

interface ReportDetailViewProps {
  report: ReportTicket;
  onBack: () => void;
  onUpdateStatus?: (status: string) => void;
  onExport?: () => void;
  onContactReporter?: () => void;
  onContactReportedUser?: () => void;
  onEscalate?: () => void;
  onCloseTicket?: () => void;
}

function getString(val: any, fallback = "—"): string {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "object") return val.name || val.location || val.address || val.title || JSON.stringify(val);
  return String(val);
}

export default function ReportDetailView({
  report,
  onBack,
  onUpdateStatus,
  onExport,
  onContactReporter,
  onContactReportedUser,
  onEscalate,
  onCloseTicket,
}: ReportDetailViewProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const handleCopy = (text: string, fieldName: string) => {
    if (!text || text === "—") return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    if (typeof (window as any).__showAdminToast === "function") {
      (window as any).__showAdminToast("success", `${fieldName} copied to clipboard`);
    }
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusClass = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("review")) return styles.statusUnderReview;
    if (s.includes("closed")) return styles.statusClosed;
    return styles.statusResolved;
  };

  const priorityColor =
    report.priority === "High" ? "#DC2626" : report.priority === "Medium" ? "#EA580C" : "#2563EB";

  const timelineItems = report.timeline && report.timeline.length > 0 ? report.timeline : [
    { title: "Passenger submitted report", timestamp: report.date || "11 May 2026 11:34AM", completed: true },
    { title: "Case assigned to Sarah", timestamp: report.date || "11 May 2026 11:34AM", completed: true },
    { title: "Driver suspended", timestamp: report.date || "12 June 2026 11:45AM", completed: true },
    { title: "Driver suspended", timestamp: report.date || "12 June 2026 11:45AM", completed: false },
  ];

  return (
    <div className={styles.container}>
      {/* ── Top Bar ── */}
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
                {["Under Review", "Active Investigation", "Resolved", "Closed"].map((st) => (
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
            onClick={() => onExport?.() || alert("Exporting report log...")}
          >
            Export Log
          </button>
        </div>
      </div>

      {/* ── 2-Column Content ── */}
      <div className={styles.mainLayout}>
        {/* ── Left Column ── */}
        <div className={styles.leftCol}>
          {/* Card 1: Report Details */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Report Details</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Report ID</span>
                <span className={styles.fieldValue}>{getString(report.reportId)}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Report Status</span>
                <span className={`${styles.statusBadge} ${getStatusClass(report.status)}`}>
                  <span className={styles.statusDot} />
                  {report.status || "Under Review"}
                </span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Report Date</span>
                <span className={styles.fieldValue}>{getString(report.date)}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Priority</span>
                <span className={styles.priorityFlag} style={{ color: priorityColor }}>
                  <FlagIcon fill={priorityColor} />
                  {report.priority || "Low"}
                </span>
              </div>

              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Victim</span>
                <span className={styles.fieldValue}>{getString(report.victim || report.reportedUser)}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Booking ID</span>
                <span className={styles.fieldValue}>
                  {getString(report.bookingId, "01234-KYE-1123")}
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy(report.bookingId || "01234-KYE-1123", "Booking ID")}
                    title="Copy Booking ID"
                  >
                    <CopyIcon />
                  </button>
                </span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Reported User</span>
                <span className={styles.fieldValue}>{getString(report.reportedUser)}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Category</span>
                <span className={styles.fieldValue}>{getString(report.category)}</span>
              </div>

              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Pick Up</span>
                <span className={styles.fieldValue}>{getString(report.pickUp, "Frebson Fitness")}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Drop-Off</span>
                <span className={styles.fieldValue}>{getString(report.dropOff, "10 Obe Street")}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Trip</span>
                <span className={styles.fieldValue}>{getString(report.trip, "One-Time")}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Trip Status</span>
                <span className={`${styles.statusBadge} ${styles.statusResolved}`}>
                  <span className={styles.statusDot} />
                  {getString(report.tripStatus, "Completed")}
                </span>
              </div>

              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Driver ID</span>
                <span className={styles.fieldValue}>
                  {getString(report.driverId, "01234-KYE-1123")}
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy(report.driverId || "01234-KYE-1123", "Driver ID")}
                    title="Copy Driver ID"
                  >
                    <CopyIcon />
                  </button>
                </span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Passenger ID</span>
                <span className={styles.fieldValue}>
                  {getString(report.passengerId, "01234-KYE-1123")}
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy(report.passengerId || "01234-KYE-1123", "Passenger ID")}
                    title="Copy Passenger ID"
                  >
                    <CopyIcon />
                  </button>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Victim Report */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Victim Report</h3>
            <div className={styles.victimReportBox}>
              <span className={styles.victimCategory}>{getString(report.category, "Abuse")}</span>
              <p className={styles.victimText}>
                {getString(report.description, "Customer reported duplicate charge")}
              </p>
              <p className={styles.victimText}>
                {getString(report.resolutionNotes, "Full refund approved after payment verification")}
              </p>
            </div>

            <div className={styles.evidenceCard}>
              <div className={styles.evidenceIcon}>JPG</div>
              <div className={styles.evidenceInfo}>
                <span className={styles.evidenceName}>Screenshot-Evidence</span>
                <span className={styles.evidenceSize}>0 KB of 120 KB •</span>
              </div>
            </div>
          </div>

          {/* Card 3: Admin Notes */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Admin Notes</h3>
            <textarea
              className={styles.adminNotesArea}
              placeholder="Add internal notes about this case..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className={styles.rightCol}>
          {/* Card 1: Investigation Timeline */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Investigation Timeline</h3>
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
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => onContactReporter?.() || alert("Opening contact reporter...")}
              >
                <span>Contact Reporter</span>
                <ChevronRightIcon />
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => onContactReportedUser?.() || alert("Opening contact reported user...")}
              >
                <span>Contact Reported User</span>
                <ChevronRightIcon />
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => onEscalate?.() || alert("Case escalated.")}
              >
                <span>Escalate</span>
                <ChevronRightIcon />
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => onCloseTicket?.() || alert("Ticket closed.")}
              >
                <span>Close Ticket</span>
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
function FlagIcon({ fill = "#DC2626" }: { fill?: string }) {
  return (<svg width={14} height={14} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth={1}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>);
}
function CopyIcon() {
  return (<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>);
}
function CheckIcon() {
  return (<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}
