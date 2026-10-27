import { publicApi } from "@/lib/api-client";

export type ReportPriority = "Low" | "Medium" | "High";
export type ReportUserType = "Passenger" | "Driver" | "ADMIN" | "";
export type ReportStatus =
  | "Under Review"
  | "Closed"
  | "Resolved"
  | "Active Investigation"
  | "SUBMITTED"
  | "OPEN"
  | "CLOSED"
  | "";

export interface ReportTimelineItem {
  id?: string | number;
  title: string;
  timestamp: string;
  completed?: boolean;
}

export interface ReportEvidence {
  name: string;
  size?: string;
  type?: string;
  url?: string;
}

export interface ReportTicket {
  id: string | number;
  reportId: string;
  date: string;
  category: string;
  userType: ReportUserType;
  priority: ReportPriority;
  reportedUser: string;
  status: ReportStatus;

  // Detail View fields
  victim?: string;
  bookingId?: string;
  pickUp?: string;
  dropOff?: string;
  trip?: string;
  tripStatus?: string;
  driverId?: string;
  passengerId?: string;
  description?: string;
  resolutionNotes?: string;
  evidence?: ReportEvidence[];
  adminNotes?: string[];
  timeline?: ReportTimelineItem[];
  raw?: any;
}

export interface ReportsSummary {
  openReports: number;
  highPriorityCases: number;
  activeInvestigations: number;
  suspendedUsers: number;
}

/** Shape returned by GET administration/insights/safety-reports/summary/ */
export interface BackendSafetyReportsSummary {
  open_report?: number;
  high_priority_cases?: number;
  active_reports?: number;
  suspended_users?: number;
}

/** Shape of each item returned by GET administration/safety-reports/ */
export interface BackendSafetyReportItem {
  id: number | string;
  created_at?: string;
  report_type?: string;
  user_type?: string;
  reporter?: number | string;
  reporter_name?: string;
  reported_user?: number | string | null;
  trip?: number | string | null;
  severity?: string;
  status?: string;
  [key: string]: any;
}

export const reportsService = {
  /**
   * Fetch summary stats for the stat cards.
   * GET administration/insights/safety-reports/summary/
   */
  getSummary: async (): Promise<BackendSafetyReportsSummary> => {
    const res = await publicApi.get("", {
      params: { path: "administration/insights/safety-reports/summary/" },
    });
    return res.data as BackendSafetyReportsSummary;
  },

  /**
   * Fetch the paginated list of safety reports.
   * GET administration/safety-reports/
   */
  getReports: async (
    page = 1,
  ): Promise<{ count: number; results: BackendSafetyReportItem[] }> => {
    const res = await publicApi.get("", {
      params: { path: "administration/safety-reports/", page },
    });
    const data = res.data;
    if (data && Array.isArray(data.results)) {
      return { count: data.count ?? data.results.length, results: data.results };
    }
    if (Array.isArray(data)) {
      return { count: data.length, results: data };
    }
    return { count: 0, results: [] };
  },

  /**
   * Fetch details for a single report.
   * GET administration/safety-reports/?id={reportId}
   */
  getReportDetails: async (
    reportId: string | number,
  ): Promise<BackendSafetyReportItem | null> => {
    try {
      const res = await publicApi.get("", {
        params: {
          path: "administration/safety-reports/",
          id: reportId,
        },
      });
      const data = res.data;
      return Array.isArray(data) ? data[0] ?? null : data ?? null;
    } catch {
      return null;
    }
  },

  /**
   * Escalate a safety report.
   * POST administration/safety-reports/escalate/?report_id={reportId}
   */
  escalateReport: async (reportId: string | number): Promise<any> => {
    return await publicApi.post(
      "",
      {},
      {
        params: {
          path: "administration/safety-reports/escalate/",
          report_id: reportId,
        },
        successMessage: "Report escalated successfully.",
      } as any
    );
  },

  /**
   * Close a safety report.
   * POST administration/safety-reports/close/?report_id={reportId}
   */
  closeReport: async (reportId: string | number): Promise<any> => {
    return await publicApi.post(
      "",
      {},
      {
        params: {
          path: "administration/safety-reports/close/",
          report_id: reportId,
        },
        successMessage: "Report closed successfully.",
      } as any
    );
  },

  /**
   * Resolve a safety report.
   * POST administration/safety-reports/resolve/?report_id={reportId}
   */
  resolveReport: async (reportId: string | number): Promise<any> => {
    return await publicApi.post(
      "",
      {},
      {
        params: {
          path: "administration/safety-reports/resolve/",
          report_id: reportId,
        },
        successMessage: "Report resolved successfully.",
      } as any
    );
  },

  /**
   * Update the status of a report by routing to closeReport, resolveReport, or escalateReport.
   */
  updateReportStatus: async (
    reportId: string | number,
    status: string,
  ): Promise<any> => {
    const s = (status || "").toLowerCase();
    if (s.includes("close")) {
      return await reportsService.closeReport(reportId);
    }
    if (s.includes("resolve")) {
      return await reportsService.resolveReport(reportId);
    }
    if (s.includes("escalat")) {
      return await reportsService.escalateReport(reportId);
    }
    return await publicApi.post(
      "",
      {},
      {
        params: {
          path: `administration/safety-reports/${s}/`,
          report_id: reportId,
        },
      } as any
    );
  },
};

