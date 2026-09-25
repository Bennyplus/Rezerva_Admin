import { publicApi } from "@/lib/api-client";

export type ReportPriority = "Low" | "Medium" | "High";
export type ReportUserType = "Passenger" | "Driver" | "";
export type ReportStatus = "Under Review" | "Closed" | "Resolved" | "Active Investigation" | "";

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

export interface BackendReportsStats {
  open_reports?: number;
  open_report?: number;
  high_priority_cases?: number;
  active_investigations?: number;
  suspended_users?: number;
}

export interface BackendReportItem {
  id: number | string;
  report_id?: string;
  code?: string;
  date?: string;
  timestamp?: string;
  created_at?: string;
  category?: string;
  user_type?: string;
  priority?: string;
  reported_user?: string;
  reported_user_name?: string;
  status?: string;
  [key: string]: any;
}

export interface ReportsDashboardResponse {
  stats?: BackendReportsStats;
  reports?: BackendReportItem[];
  results?: BackendReportItem[];
  tickets?: BackendReportItem[];
}

export const reportsService = {
  getDashboard: async (): Promise<any> => {
    try {
      const res = await publicApi.get("", {
        params: { path: "administration/reports/dashboard/" },
      });
      return res.data;
    } catch {
      // Try alternate endpoint if dashboard is not available
      try {
        const resAlt = await publicApi.get("", {
          params: { path: "administration/reports/" },
        });
        return resAlt.data;
      } catch (err) {
        return { stats: {}, reports: [] };
      }
    }
  },

  getReportDetails: async (reportId: string | number): Promise<any> => {
    try {
      const res = await publicApi.get("", {
        params: { path: "administration/reports/details/", id: reportId },
      });
      return Array.isArray(res.data) ? res.data[0] : res.data;
    } catch {
      try {
        const resAlt = await publicApi.get("", {
          params: { path: "administration/reports/", id: reportId },
        });
        return Array.isArray(resAlt.data) ? resAlt.data[0] : resAlt.data;
      } catch {
        return null;
      }
    }
  },

  updateReportStatus: async (reportId: string | number, status: string): Promise<any> => {
    return await publicApi.patch("", {
      path: `administration/reports/${reportId}/status/`,
      status,
    });
  },

  escalateReport: async (reportId: string | number): Promise<any> => {
    return await publicApi.post("", {
      path: `administration/reports/${reportId}/escalate/`,
    });
  },
};
