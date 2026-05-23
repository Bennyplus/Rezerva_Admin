export type TicketStatus = "TO DO" | "IN PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "Low" | "Medium" | "High";

export interface TicketActivity {
  label: string;
  date: string;
  time: string;
}

export interface Ticket {
  id: string;
  category: string;
  priority: TicketPriority;
  date: string;
  description: string;
  customerName: string;
  customerAvatar?: string;
  status: TicketStatus;

  // Detail-level fields
  customerPhone: string;
  customerEmail: string;
  assignedAdmin: string;
  reportDescription: string;
  evidenceFileName: string;
  evidenceFileSize: string;
  adminNotes: string;
  activities: TicketActivity[];
}

export interface TicketStats {
  totalTickets: number;
  totalOpenTickets: number;
  totalPendingTickets: number;
  totalResolvedTickets: number;
}

export const TICKET_STATS: TicketStats = {
  totalTickets: 24,
  totalOpenTickets: 4,
  totalPendingTickets: 10,
  totalResolvedTickets: 12,
};

export const ADMIN_TICKETS: Ticket[] = [
  {
    id: "DRI-001",
    category: "Payment Issues",
    priority: "Low",
    date: "22 Apr 2026",
    description:
      "I made a booking and was debited, but my order was not placed. my trip is in 2 days and i placed an initial complaint a week ago",
    customerName: "Prosper Edward",
    status: "TO DO",
    customerPhone: "+2348034567865",
    customerEmail: "sarahjohnson@gmail.com",
    assignedAdmin: "Prosper Edward",
    reportDescription:
      "Customer reported duplicate charge\nFull refund approved after payment verification",
    evidenceFileName: "Screenshot-Evidence",
    evidenceFileSize: "0 KB of 120 KB",
    adminNotes: "",
    activities: [
      { label: "Ticket Submitted", date: "11 May 2026", time: "11:34AM" },
      {
        label: "Assigned to Admin Prosper Edward",
        date: "11 May 2026",
        time: "11:34AM",
      },
      {
        label: "Refund Investigation Started",
        date: "12 June 2026",
        time: "11:45AM",
      },
    ],
  },
  {
    id: "DRI-001",
    category: "Payment Issues",
    priority: "High",
    date: "22 Apr 2026",
    description:
      "I made a booking and was debited, but my order was not placed. my trip is in 2 days and i placed an initial complaint a week ago",
    customerName: "Prosper Edward",
    status: "TO DO",
    customerPhone: "+2348034567865",
    customerEmail: "sarahjohnson@gmail.com",
    assignedAdmin: "Prosper Edward",
    reportDescription: "Customer reported duplicate charge",
    evidenceFileName: "Screenshot-Evidence",
    evidenceFileSize: "0 KB of 120 KB",
    adminNotes: "",
    activities: [
      { label: "Ticket Submitted", date: "11 May 2026", time: "11:34AM" },
    ],
  },
  {
    id: "DRI-001",
    category: "Payment Issues",
    priority: "Medium",
    date: "22 Apr 2026",
    description:
      "I made a booking and was debited, but my order was not placed. my trip is in 2 days and i placed an initial complaint a week ago",
    customerName: "Prosper Edward",
    status: "TO DO",
    customerPhone: "+2348034567865",
    customerEmail: "sarahjohnson@gmail.com",
    assignedAdmin: "Prosper Edward",
    reportDescription: "Customer reported duplicate charge",
    evidenceFileName: "Screenshot-Evidence",
    evidenceFileSize: "0 KB of 120 KB",
    adminNotes: "",
    activities: [
      { label: "Ticket Submitted", date: "11 May 2026", time: "11:34AM" },
    ],
  },
  {
    id: "DRI-002",
    category: "Vehicle Damage",
    priority: "High",
    date: "22 Apr 2026",
    description: "Customer claims vehicle had pre-existing damage upon pickup.",
    customerName: "Sarah Johnson",
    status: "IN PROGRESS",
    customerPhone: "+2348034567865",
    customerEmail: "sarahjohnson@gmail.com",
    assignedAdmin: "Prosper Edward",
    reportDescription:
      "Photos submitted show scratch on driver's side rear panel.",
    evidenceFileName: "Damage-Photos",
    evidenceFileSize: "120 KB of 2.4 MB",
    adminNotes: "Reviewing CCTV footage from pickup location.",
    activities: [
      { label: "Ticket Submitted", date: "11 May 2026", time: "09:10AM" },
      {
        label: "Assigned to Admin Prosper Edward",
        date: "11 May 2026",
        time: "09:30AM",
      },
    ],
  },
  {
    id: "DRI-003",
    category: "Booking Error",
    priority: "Low",
    date: "20 Apr 2026",
    description: "Booking was cancelled automatically without reason.",
    customerName: "James Okafor",
    status: "RESOLVED",
    customerPhone: "+2348012345678",
    customerEmail: "jamesokafor@gmail.com",
    assignedAdmin: "Prosper Edward",
    reportDescription: "System error caused automatic cancellation.",
    evidenceFileName: "Booking-Confirmation",
    evidenceFileSize: "4 KB of 48 KB",
    adminNotes: "Refund initiated and booking rescheduled.",
    activities: [
      { label: "Ticket Submitted", date: "20 Apr 2026", time: "10:00AM" },
      {
        label: "Assigned to Admin Prosper Edward",
        date: "20 Apr 2026",
        time: "10:15AM",
      },
      { label: "Ticket Resolved", date: "21 Apr 2026", time: "02:00PM" },
    ],
  },
  {
    id: "DRI-004",
    category: "Late Return",
    priority: "Medium",
    date: "18 Apr 2026",
    description: "Customer returned vehicle 4 hours late without notice.",
    customerName: "Ada Nwosu",
    status: "CLOSED",
    customerPhone: "+2348098765432",
    customerEmail: "adanwosu@gmail.com",
    assignedAdmin: "Prosper Edward",
    reportDescription:
      "Late return fee applied per company policy. Customer disputes the charge.",
    evidenceFileName: "Return-Receipt",
    evidenceFileSize: "8 KB of 56 KB",
    adminNotes: "Case closed. Fee stands as per policy.",
    activities: [
      { label: "Ticket Submitted", date: "18 Apr 2026", time: "03:00PM" },
      {
        label: "Assigned to Admin Prosper Edward",
        date: "18 Apr 2026",
        time: "03:30PM",
      },
      { label: "Ticket Closed", date: "19 Apr 2026", time: "09:00AM" },
    ],
  },
];
