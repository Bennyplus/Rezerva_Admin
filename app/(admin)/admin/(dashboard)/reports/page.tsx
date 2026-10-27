"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import ReportsTable from "@/components/admin/reports/ReportsTable";
import ReportDetailView from "@/components/admin/reports/ReportDetailView";
import {
  reportsService,
  ReportTicket,
  ReportsSummary,
  BackendSafetyReportItem,
} from "@/services/reports-service";
import styles from "./reports.module.css";

function extractStr(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return val.name || val.location || val.address || "";
  return String(val);
}

/** Normalise severity/priority label from backend to our union */
function normalizePriority(severity?: string): "Low" | "Medium" | "High" {
  const s = (severity || "").toUpperCase();
  if (s === "CRITICAL" || s === "HIGH") return "High";
  if (s === "MEDIUM" || s === "MODERATE") return "Medium";
  return "Low";
}

/** Normalise status string from backend */
function normalizeStatus(
  status?: string,
): "Under Review" | "Closed" | "Resolved" | "Active Investigation" | "SUBMITTED" | "OPEN" | "CLOSED" | "" {
  const s = (status || "").toUpperCase();
  if (s === "SUBMITTED" || s === "OPEN") return s as any;
  if (s === "CLOSED" || s === "RESOLVED") return s as any;
  if (s === "UNDER_REVIEW" || s === "UNDER REVIEW") return "Under Review";
  if (s === "ACTIVE_INVESTIGATION" || s === "ACTIVE INVESTIGATION") return "Active Investigation";
  return (status as any) || "";
}

function normalizeReport(item: BackendSafetyReportItem, idx: number): ReportTicket {
  return {
    id: item.id ?? idx + 1,
    reportId: extractStr(item.report_id || item.code) || `#RP-${String(idx + 1).padStart(3, "0")}`,
    date: extractStr(item.created_at || item.date || item.timestamp),
    category: extractStr(item.report_type || item.category || "General"),
    userType: (item.user_type as any) || "",
    priority: normalizePriority(item.severity || item.priority),
    reportedUser: extractStr(item.reported_user || item.reported_user_name || item.user) || "—",
    status: normalizeStatus(item.status),
    victim: extractStr(item.reporter_name || item.victim),
    bookingId: extractStr(item.booking_id || item.booking),
    pickUp: extractStr(item.pickup || item.pick_up),
    dropOff: extractStr(item.dropoff || item.drop_off),
    trip: extractStr(item.trip),
    tripStatus: extractStr(item.trip_status || ""),
    driverId: extractStr(item.driver_id),
    passengerId: extractStr(item.passenger_id),
    description: extractStr(item.description),
    resolutionNotes: extractStr(item.resolution_notes),
    timeline: Array.isArray(item.timeline) ? item.timeline : undefined,
    raw: item,
  };
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<ReportsSummary>({
    openReports: 0,
    highPriorityCases: 0,
    activeInvestigations: 0,
    suspendedUsers: 0,
  });
  const [reports, setReports] = useState<ReportTicket[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fire both requests in parallel
      const [summaryData, reportsData] = await Promise.allSettled([
        reportsService.getSummary(),
        reportsService.getReports(1),
      ]);

      // ── Stats ──
      if (summaryData.status === "fulfilled") {
        const s = summaryData.value;
        setSummary({
          openReports: s.open_report ?? 0,
          highPriorityCases: s.high_priority_cases ?? 0,
          activeInvestigations: s.active_reports ?? 0,
          suspendedUsers: s.suspended_users ?? 0,
        });
      }

      // ── Reports list ──
      if (reportsData.status === "fulfilled") {
        const normalized = reportsData.value.results.map(normalizeReport);
        setReports(normalized);
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectReport = async (report: ReportTicket) => {
    setSelectedReport(report);
    try {
      if (report.id) {
        const detail = await reportsService.getReportDetails(report.id);
        if (detail) {
          setSelectedReport((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              victim: extractStr(detail.reporter_name || detail.victim || prev.victim),
              bookingId: extractStr(detail.booking_id || prev.bookingId),
              pickUp: extractStr(detail.pickup || detail.pick_up || prev.pickUp),
              dropOff: extractStr(detail.dropoff || detail.drop_off || prev.dropOff),
              trip: extractStr(detail.trip || prev.trip),
              tripStatus: extractStr(detail.trip_status || prev.tripStatus),
              driverId: extractStr(detail.driver_id || prev.driverId),
              passengerId: extractStr(detail.passenger_id || prev.passengerId),
              description: extractStr(detail.description || prev.description),
              resolutionNotes: extractStr(detail.resolution_notes || prev.resolutionNotes),
              timeline: Array.isArray(detail.timeline) ? detail.timeline : prev.timeline,
              raw: detail,
            };
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch report details:", err);
    }
  };

  const handleClose = async (report: ReportTicket) => {
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, status: "Closed" } : r))
    );
    if (selectedReport && selectedReport.id === report.id) {
      setSelectedReport((prev) => (prev ? { ...prev, status: "Closed" } : null));
    }
    try {
      await reportsService.closeReport(report.id);
      fetchData();
    } catch (e) {
      console.error("Failed to close report:", e);
      fetchData();
    }
  };

  const handleResolve = async (report: ReportTicket) => {
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, status: "Resolved" } : r))
    );
    if (selectedReport && selectedReport.id === report.id) {
      setSelectedReport((prev) => (prev ? { ...prev, status: "Resolved" } : null));
    }
    try {
      await reportsService.resolveReport(report.id);
      fetchData();
    } catch (e) {
      console.error("Failed to resolve report:", e);
      fetchData();
    }
  };

  const handleEscalate = async (report: ReportTicket) => {
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, priority: "High" } : r)),
    );
    if (selectedReport && selectedReport.id === report.id) {
      setSelectedReport((prev) => (prev ? { ...prev, priority: "High" } : null));
    }
    try {
      await reportsService.escalateReport(report.id);
      fetchData();
    } catch (e) {
      console.error("Failed to escalate report:", e);
      fetchData();
    }
  };

  const handleUpdateStatus = async (
    reportOrStatus: ReportTicket | string,
    newStatus?: string,
  ) => {
    const reportToUpdate =
      typeof reportOrStatus === "string" ? selectedReport : reportOrStatus;
    const statusVal =
      typeof reportOrStatus === "string"
        ? reportOrStatus
        : newStatus || "Resolved";

    if (!reportToUpdate) return;

    const s = statusVal.toLowerCase();
    if (s.includes("close")) {
      return await handleClose(reportToUpdate);
    }
    if (s.includes("resolve")) {
      return await handleResolve(reportToUpdate);
    }
    if (s.includes("escalat")) {
      return await handleEscalate(reportToUpdate);
    }

    // Generic fallback for any other status
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportToUpdate.id ? { ...r, status: statusVal as any } : r,
      ),
    );
    if (selectedReport && selectedReport.id === reportToUpdate.id) {
      setSelectedReport((prev) =>
        prev ? { ...prev, status: statusVal as any } : null,
      );
    }

    try {
      await reportsService.updateReportStatus(reportToUpdate.id, statusVal);
      fetchData();
    } catch (e) {
      console.error("Failed to update report status:", e);
      fetchData();
    }
  };

  if (selectedReport) {
    return (
      <div className={styles.page}>
        <ReportDetailView
          report={selectedReport}
          onBack={() => setSelectedReport(null)}
          onUpdateStatus={(st) => handleUpdateStatus(selectedReport, st)}
          onEscalate={() => handleEscalate(selectedReport)}
          onCloseTicket={() => handleClose(selectedReport)}
          onResolveTicket={() => handleResolve(selectedReport)}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Top 4 Stat Cards ── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Open Report"
          value={summary.openReports ?? 0}
          id="stat-open-reports"
        />
        <StatCard
          label="High Priority Cases"
          value={summary.highPriorityCases ?? 0}
          id="stat-high-priority-cases"
        />
        <StatCard
          label="Active Investigations"
          value={summary.activeInvestigations ?? 0}
          id="stat-active-investigations"
        />
        <StatCard
          label="Suspended Users"
          value={summary.suspendedUsers ?? 0}
          id="stat-suspended-users"
        />
      </div>

      {/* ── Content View ── */}
      {isLoading ? (
        <div className={styles.loadingCard}>
          <Spinner size={36} color="#2F68FE" />
          <p className={styles.loadingSubtitle}>Loading report tickets…</p>
        </div>
      ) : reports.length === 0 ? (
        /* Screen 1: Inactive State (No Data) */
        <div className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No report tickets available</h2>
          <p className={styles.emptySubtitle}>
            Support requests and reports will appear here
          </p>
        </div>
      ) : (
        /* Screen 2: Table View */
        <ReportsTable
          reports={reports}
          onSelectReport={handleSelectReport}
          onUpdateStatus={(r, s) => handleUpdateStatus(r, s)}
          onEscalate={handleEscalate}
          onClose={handleClose}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
}
