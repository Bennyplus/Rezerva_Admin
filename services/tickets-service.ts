import { publicApi } from '@/lib/api-client';

export const ticketsService = {
  /**
   * Fetches all support tickets
   */
  getTickets: async (): Promise<any[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/support-tickets/' }
    });
    const raw = response?.data?.results || response?.data?.data || (Array.isArray(response?.data) ? response.data : []);
    return raw.map((item: any) => mapTicket(item));
  },

  /**
   * Fetches a single ticket by ticket_number
   * GET admin/support-tickets/?ticket_id={ticketNumber}
   */
  getTicket: async (ticketNumber: string): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/support-tickets/', ticket_id: ticketNumber }
    });
    // API may return a single object or an array
    const item = Array.isArray(response?.data) ? response.data[0] : (response?.data?.results?.[0] ?? response?.data);
    return item ? mapTicket(item) : null;
  },

  /**
   * Assigns a ticket to an admin
   * POST admin/support-tickets/assign/?ticket_id={ticketNumber}
   * Body (form-data): admin_id
   */
  assignTicket: async (ticketNumber: string, adminId: string | number): Promise<any> => {
    const formData = new FormData();
    formData.append('admin_id', String(adminId));
    const response = await publicApi.post('', formData, {
      params: { path: 'api/v1/admin/support-tickets/assign/', ticket_id: ticketNumber }
    });
    return response.data;
  },

  /**
   * Resolves a ticket
   * POST admin/support-tickets/resolve/?ticket_id={ticketNumber}
   * Body (form-data): resolution_notes
   */
  resolveTicket: async (ticketNumber: string, notes: string): Promise<any> => {
    const formData = new FormData();
    formData.append('resolution_notes', notes);
    const response = await publicApi.post('', formData, {
      params: { path: 'api/v1/admin/support-tickets/resolve/', ticket_id: ticketNumber }
    });
    return response.data;
  },

  /**
   * Escalates a ticket
   * POST admin/support-tickets/escalate/?ticket_id={ticketNumber}
   * Body (form-data): escalation_reason
   */
  escalateTicket: async (ticketNumber: string, reason: string): Promise<any> => {
    const formData = new FormData();
    formData.append('escalation_reason', reason);
    const response = await publicApi.post('', formData, {
      params: { path: 'api/v1/admin/support-tickets/escalate/', ticket_id: ticketNumber }
    });
    return response.data;
  },

  /**
   * Fetches ticket metrics
   * GET admin/support-tickets/metrics/
   */
  getMetrics: async (): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/support-tickets/metrics/' }
    });
    return response.data;
  },

  /**
   * Closes a ticket
   * POST admin/support-tickets/close/?ticket_number={ticketNumber}
   */
  closeTicket: async (ticketNumber: string): Promise<any> => {
    const response = await publicApi.post('', {}, {
      params: { path: 'api/v1/admin/support-tickets/close/', ticket_number: ticketNumber }
    });
    return response.data;
  },

  /**
   * Fetches admin members for assignment
   * GET admin/members/
   */
  getAdmins: async (): Promise<any[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/members/' }
    });
    return response.data || [];
  },

  /**
   * Exports tickets to XLSX
   * GET admin/support-tickets/export/?export=xlsx
   */
  exportTickets: async (): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/support-tickets/export/', export: 'xlsx' },
      responseType: 'blob'
    });
    return response.data;
  },
};

function mapTicket(item: any) {
  return {
    id: item?.ticket_number || String(item?.id) || 'N/A',
    ticketNumber: item?.ticket_number || 'N/A',
    customerName: item?.customer_name || 'N/A',
    description: item?.description || 'N/A',
    date: item?.date_created || 'N/A',
    status: mapStatus(item?.status),
    attachments: item?.attachments || [],
    category: 'N/A', // Not in API data yet
    priority: item?.priority || 'N/A',
    assigned_admin: item?.assigned_admin || 'N/A',
    customerPhone: item?.phone_number || 'N/A',
    customerEmail: item?.customer_email || 'N/A',
  };
}

function mapStatus(apiStatus?: string): string {
  if (!apiStatus) return 'Pending';
  const s = apiStatus.toLowerCase();
  if (s === 'pending') return 'Pending';
  if (s === 'in progress' || s === 'in_progress') return 'In Progress';
  if (s === 'resolved') return 'Resolved';
  if (s === 'escalated') return 'Escalated';
  if (s === 'closed') return 'Closed';
  return apiStatus;
}
