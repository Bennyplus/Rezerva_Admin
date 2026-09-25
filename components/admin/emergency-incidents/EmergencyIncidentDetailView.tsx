"use client";

import React, { useState } from "react";
import { EmergencyIncident } from "@/services/emergency-incidents-service";
import styles from "./EmergencyIncidentDetailView.module.css";

interface EmergencyIncidentDetailViewProps {
  incident: EmergencyIncident;
  onBack: () => void;
  onExport?: () => void;
}

function getString(val: any, fallback: string = "—"): string {
  if (val == null || val === "") return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (val.location) return String(val.location);
    if (val.name) return String(val.name);
    if (val.title) return String(val.title);
    if (val.timestamp) return String(val.timestamp);
    return JSON.stringify(val);
  }
  return String(val);
}

export default function EmergencyIncidentDetailView({
  incident,
  onBack,
  onExport,
}: EmergencyIncidentDetailViewProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text?: any, key?: string) => {
    const str = getString(text, "");
    if (!str || !key) return;
    navigator.clipboard.writeText(str);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const priorityColor =
    incident.priority === "High" ? "#DC2626" : incident.priority === "Medium" ? "#EA580C" : "#175CD3";

  return (
    <div className={styles.container}>
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back">
          <ArrowLeftIcon />
        </button>
        <button type="button" className={styles.exportBtn} onClick={onExport}>
          Export Log
        </button>
      </div>

      {/* ── Headline ── */}
      <div className={styles.headlineArea}>
        <span className={styles.sosLabel}>SOS ID</span>
        <div className={styles.sosHeaderRow}>
          <span className={styles.sosTitle}>{getString(incident.sosId)}</span>
          <button
            type="button"
            className={styles.copyBtn}
            onClick={() => handleCopy(incident.sosId, "sosId")}
            title={copiedKey === "sosId" ? "Copied!" : "Copy SOS ID"}
          >
            <CopyIcon />
          </button>
          <span className={styles.statusPill}>
            <span className={styles.statusDot} />
            {getString(incident.status, "Active")}
          </span>
          <span className={styles.priorityPill} style={{ color: priorityColor }}>
            <FlagIcon fill={priorityColor} />
            {getString(incident.priority, "Low")}
          </span>
        </div>
        <span className={styles.timestamp}>
          Timestamp: {getString(incident.timestamp, "22 Apr 2026 11:12AM")}
        </span>
      </div>

      {/* ── 2-Column Grid Layout ── */}
      <div className={styles.grid}>
        {/* Left Column */}
        <div className={styles.col}>
          {/* Live Trip Details */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Live Trip Details</h2>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Driver</span>
                <span className={styles.fieldValue}>{getString(incident.driverName || incident.triggeredBy, "Prosper Edward")}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Passenger</span>
                <span className={styles.fieldValue}>{getString(incident.passengerName, "Edward Prosper")}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Booking ID</span>
                <span className={styles.fieldValue}>
                  {getString(incident.bookingId, "01234-KYE-I123")}
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy(incident.bookingId || "01234-KYE-I123", "bookingId")}
                  >
                    <CopyIcon />
                  </button>
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Trip Start Time</span>
                <span className={styles.fieldValue}>{getString(incident.tripStartTime, "30 Mar 2026 11:28AM")}</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Pick Up</span>
                <span className={styles.fieldValue}>{getString(incident.pickUp, "Frebson Fitness")}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Drop-Off</span>
                <span className={styles.fieldValue}>{getString(incident.dropOff, "10 Obe Street")}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Vehicle</span>
                <span className={styles.fieldValue}>{getString(incident.vehicle, "Black Toyota Camry 2026")}</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Driver ID</span>
                <span className={styles.fieldValue}>
                  {getString(incident.driverId, "01234-KYE-I123")}
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy(incident.driverId || "01234-KYE-I123", "driverId")}
                  >
                    <CopyIcon />
                  </button>
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Passenger ID</span>
                <span className={styles.fieldValue}>
                  {getString(incident.passengerId, "01234-KYE-I123")}
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy(incident.passengerId || "01234-KYE-I123", "passengerId")}
                  >
                    <CopyIcon />
                  </button>
                </span>
              </div>
            </div>
          </div>

          {/* Live Location Information */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Live Location Information</h2>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Driver Current Location</span>
                <span className={styles.fieldValue}>{getString(incident.driverCurrentLocation, "Frebson Fitness")}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Passenger Current Location</span>
                <span className={styles.fieldValue}>{getString(incident.passengerCurrentLocation, "12a Lekki Phase One")}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Timestamp</span>
                <span className={styles.fieldValue}>{getString(incident.locationTimestamp, "11:55 PM")}</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Last Location Update</span>
                <span className={styles.fieldValue}>{getString(incident.lastLocationUpdate, "Frebson Fitness")}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Emergency Triggered By</span>
                <span className={styles.fieldValue}>{getString(incident.triggeredBy, "Prosper Edward")}</span>
              </div>
            </div>
          </div>

          {/* Victim Report */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Victim Report</h2>
            <div className={styles.victimBox}>
              <span className={styles.victimCategory}>{getString(incident.victimReport?.category, "Abuse")}</span>
              <span className={styles.victimDesc}>
                {getString(incident.victimReport?.description, "Customer reported duplicate change")}
              </span>
              <span className={styles.victimDesc}>
                {getString(incident.victimReport?.notes, "Full refund approved after payment verification")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.col}>
          {/* Investigation Timeline */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Investigation Timeline</h2>
            <div className={styles.timelineGrid}>
              <div className={styles.timelineCol}>
                <TimelineStep title="Driver Triggered SOS" time="11 May 2026 11:34AM" />
                <TimelineStep title="Emergency Center Notified" time="11 May 2026 11:34AM" />
                <TimelineStep title="Admin Viewed Incident" time="12 June 2026 11:45AM" />
                <TimelineStep title="Driver Contacted" time="12 June 2026 11:45AM" />
              </div>
              <div className={styles.timelineCol}>
                <TimelineStep title="Emergency Contacts Contacted" time="12 June 2026 11:45AM" />
                <TimelineStep title="Police Contacted" time="12 June 2026 11:45AM" />
                <TimelineStep title="Incident Resolved" time="12 June 2026 11:45AM" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Quick Actions</h2>
            <div className={styles.actionsStack}>
              {[
                "Contact Emergency Services",
                "Contact Driver",
                "Contact Passenger",
                "Notify Emergency Contacts",
                "Freeze Trip",
              ].map((action) => (
                <button key={action} type="button" className={styles.actionBtn}>
                  <span>{action}</span>
                  <ChevronRightIcon />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ title, time }: { title: string; time: string }) {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.timelineIcon}>
        <CheckIcon />
      </div>
      <div className={styles.timelineDetails}>
        <span className={styles.timelineTitle}>{title}</span>
        <span className={styles.timelineTime}>{time}</span>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return (<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
}
function CopyIcon() {
  return (<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>);
}
function FlagIcon({ fill = "#175CD3" }: { fill?: string }) {
  return (<svg width={12} height={12} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth={1}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>);
}
function CheckIcon() {
  return (<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}
function ChevronRightIcon() {
  return (<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#868C98" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>);
}
