// Status values returned or derived from the API
export type TicketStatus = "Pending" | "In Progress" | "Resolved" | "Escalated" | "Closed";

// Priority is not returned by the API — placeholder until available
export type TicketPriority = "Low" | "Medium" | "High" | "N/A";

export interface TicketAttachment {
  id: number;
  file: string;
  uploaded_at: string;
}

export interface Ticket {
  id: string;             // ticket_number from API (e.g. "TIC-AC-545")
  ticketNumber: string;
  customerName: string;
  description: string;
  date: string;           // date_created from API
  status: TicketStatus;
  attachments: TicketAttachment[];

  // Fields NOT returned by API — will show "N/A" until endpoint provides them
  category: string;
  priority: TicketPriority | string;
  assignedAdmin: string;
  customerPhone: string;
  customerEmail: string;
}
