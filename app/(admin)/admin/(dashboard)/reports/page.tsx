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
} from "@/services/reports-service";
import styles from "./reports.module.css";

function extractStr(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val.name || val.location || val.address || "";
  return String(val);
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
      const data = await reportsService.getDashboard();
      if (data?.stats) {
        setSummary({
          openReports: data.stats.open_reports ?? data.stats.open_report ?? 0,
          highPriorityCases: data.stats.high_priority_cases ?? 0,
          activeInvestigations: data.stats.active_investigations ?? 0,
          suspendedUsers: data.stats.suspended_users ?? 0,
        });
      }

      const list = data?.reports || data?.results || data?.tickets || (Array.isArray(data) ? data : []);
      if (Array.isArray(list)) {
        const normalized: ReportTicket[] = list.map((item: any, idx: number) => ({
          id: item.id || idx + 1,
          reportId: item.report_id || item.code || `#RP-${String(idx + 1).padStart(3, "0")}`,
          date: extractStr(item.date || item.timestamp || item.created_at),
          category: extractStr(item.category || "General"),
          userType: (item.user_type as any) || "Driver",
          priority: (item.priority as any) || "Low",
          reportedUser: extractStr(item.reported_user || item.reported_user_name || item.user),
          status: (item.status as any) || "Under Review",
          victim: extractStr(item.victim || item.reporter_name),
          bookingId: extractStr(item.booking_id || item.booking),
          pickUp: extractStr(item.pickup || item.pick_up),
          dropOff: extractStr(item.dropoff || item.drop_off),
          trip: extractStr(item.trip || "One-Time"),
          tripStatus: extractStr(item.trip_status || "Completed"),
          driverId: extractStr(item.driver_id),
          passengerId: extractStr(item.passenger_id),
          description: extractStr(item.description),
          resolutionNotes: extractStr(item.resolution_notes),
          timeline: Array.isArray(item.timeline) ? item.timeline : undefined,
          raw: item,
        }));
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
              victim: extractStr(detail.victim || detail.reporter_name || prev.victim),
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

  const handleUpdateStatus = async (reportOrStatus: ReportTicket | string, newStatus?: string) => {
    const reportToUpdate = typeof reportOrStatus === "string" ? selectedReport : reportOrStatus;
    const statusVal = typeof reportOrStatus === "string" ? reportOrStatus : (newStatus || "Resolved");
    
    if (!reportToUpdate) return;

    // Optimistic update
    setReports((prev) =>
      prev.map((r) => (r.id === reportToUpdate.id ? { ...r, status: statusVal as any } : r))
    );
    if (selectedReport && selectedReport.id === reportToUpdate.id) {
      setSelectedReport((prev) => (prev ? { ...prev, status: statusVal as any } : null));
    }

    try {
      await reportsService.updateReportStatus(reportToUpdate.id, statusVal);
    } catch (e) {
      console.error("Failed to update report status:", e);
    }
  };

  const handleEscalate = async (report: ReportTicket) => {
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, priority: "High" } : r))
    );
    try {
      await reportsService.escalateReport(report.id);
    } catch (e) {
      console.error("Failed to escalate report:", e);
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
          onCloseTicket={() => handleUpdateStatus(selectedReport, "Closed")}
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
          <p className={styles.emptySubtitle}>Support requests and reports will appear here</p>
        </div>
      ) : (
        /* Screen 2: Table View */
        <ReportsTable
          reports={reports}
          onSelectReport={handleSelectReport}
          onUpdateStatus={(r, s) => handleUpdateStatus(r, s)}
          onEscalate={handleEscalate}
        />
      )}
    </div>
  );
}
