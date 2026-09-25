import { publicApi } from "@/lib/api-client";

export type TicketPriority = "Low" | "Medium" | "High" | "Critical";
export type TicketUserType = "Customer" | "Passenger" | "Driver" | "Admin" | string;
export type TicketStatus = "Pending" | "In Progress" | "Resolved" | "Closed" | "Escalated" | string;

export interface TicketActivityItem {
  id?: string | number;
  title: string;
  timestamp: string;
  completed?: boolean;
}

export interface SupportTicket {
  id: string | number;
  ticketId: string;
  user: string;
  userType: TicketUserType;
  ticketType: string;
  priority: TicketPriority;
  assignedAdmin?: string;
  assignedAdminId?: string | number;
  status: TicketStatus;
  createdOn: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAvatar?: string;
  category?: string;
  description?: string;
  resolutionNotes?: string;
  evidenceName?: string;
  evidenceSize?: string;
  adminNotes?: string;
  timeline?: TicketActivityItem[];
  raw?: any;
}

export interface SupportCenterSummary {
  totalTickets: number;
  totalOpenTickets: number;
  totalEscalatedTickets: number;
  totalResolvedTickets: number;
}

export interface BackendSupportStatsResponse {
  total_tickets: number;
  total_open_tickets: number;
  total_escalated_tickets: number;
  total_resolved_tickets: number;
}

export interface BackendTicketItem {
  id: number;
  ticket_number?: string;
  user_name?: string;
  user_type?: string;
  category?: string;
  description?: string;
  priority?: string;
  status?: string;
  assigned_to_name?: string | null;
  assigned_to?: number | string | null;
  profile_picture?: string;
  created_at?: string;
  [key: string]: any;
}

export const supportCenterService = {
  getStats: async (): Promise<BackendSupportStatsResponse> => {
    const res = await publicApi.get("", {
      params: { path: "administration/support-tickets/stats/" },
    });
    return res.data;
  },

  getTickets: async (tab?: "all" | "critical" | "my_tickets"): Promise<BackendTicketItem[]> => {
    const params: Record<string, string> = { path: "administration/support-tickets/" };
    if (tab && tab !== "all") {
      params.tab = tab;
    }
    const res = await publicApi.get("", { params });
    return Array.isArray(res.data) ? res.data : res.data?.results || [];
  },

  getTicketDetails: async (ticketId: string | number): Promise<any> => {
    try {
      const res = await publicApi.get("", {
        params: { path: `administration/support-tickets/${ticketId}/` },
      });
      return Array.isArray(res.data) ? res.data[0] : res.data;
    } catch {
      return null;
    }
  },

  // PUT {{base_url}}administration/assign/support-ticket/?ticket_id=1
  assignTicket: async (
    ticketId: string | number,
    assignedTo: string | number,
    adminNotes?: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("assigned_to", String(assignedTo));
    if (adminNotes) {
      formData.append("admin_notes", adminNotes);
    }
    return await publicApi.put("", formData, {
      params: { path: "administration/assign/support-ticket/", ticket_id: ticketId },
      headers: { "Content-Type": "multipart/form-data" },
      successMessage: "Ticket assigned successfully.",
    } as any);
  },

  // PUT {{base_url}}administration/support-tickets/escalate/?ticket_id=3
  escalateTicket: async (ticketId: string | number, reason: string): Promise<any> => {
    const formData = new FormData();
    formData.append("reason", reason);
    return await publicApi.put("", formData, {
      params: { path: "administration/support-tickets/escalate/", ticket_id: ticketId },
      headers: { "Content-Type": "multipart/form-data" },
      successMessage: "Ticket escalated successfully.",
    } as any);
  },

  // PUT {{base_url}}administration/support-tickets/close/?ticket_id=3
  closeTicket: async (ticketId: string | number, reason?: string): Promise<any> => {
    const formData = new FormData();
    if (reason) {
      formData.append("reason", reason);
    }
    return await publicApi.put("", formData, {
      params: { path: "administration/support-tickets/close/", ticket_id: ticketId },
      headers: { "Content-Type": "multipart/form-data" },
      successMessage: "Ticket closed successfully.",
    } as any);
  },

  // PUT {{base_url}}administration/support-tickets/resolve/?ticket_id=3
  resolveTicket: async (ticketId: string | number, resolutionNotes: string): Promise<any> => {
    const formData = new FormData();
    formData.append("resolution_notes", resolutionNotes);
    return await publicApi.put("", formData, {
      params: { path: "administration/support-tickets/resolve/", ticket_id: ticketId },
      headers: { "Content-Type": "multipart/form-data" },
      successMessage: "Ticket resolved successfully.",
    } as any);
  },
};
