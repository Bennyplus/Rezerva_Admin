export type TransactionStatus =
  | "Pending"
  | "Completed"
  | "Failed"
  | "Reversed"
  | "Processing";

export type TransactionType = "Bookings" | "Payout" | "Payouts" | "Refund";
export type PayoutStatus = "Pending" | "Completed";

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: string;
  type: TransactionType;
  date: string;
  status: TransactionStatus;

  // Detail-level fields
  customerEmail: string;
  customerPhone: string;
  dateCreated: string;
  bookingType: string;
  bookingId: string;
  fees: string;
  taxes: string;
  paymentMethod: string;
  referenceNumber: string;
  paymentInitiated: string;
  paymentReceived: string;
  paymentInitiatedAt: string;
  paymentCompletedAt: string | null;
}

export interface Payout {
  id: string;
  driverName: string;
  amount: string;
  transactionReference: TransactionType;
  date: string;
  status: PayoutStatus;
}

export interface PaymentStats {
  totalRevenue: number;
  totalPayouts: number;
  pendingTransactions: number;
  totalRefunds: number;
  totalCommissions: number;
}

export const PAYMENT_STATS: PaymentStats = {
  totalRevenue: 0,
  totalPayouts: 0,
  pendingTransactions: 0,
  totalRefunds: 0,
  totalCommissions: 0,
};

export const ADMIN_TRANSACTIONS: Transaction[] = [
  {
    id: "DRI-12XDF-123",
    customerId: "CUST-001",
    customerName: "Prosper Edward",
    amount: "$120.00",
    type: "Bookings",
    date: "30 Feb 2026",
    status: "Pending",
    customerEmail: "prosper@gmail.com",
    customerPhone: "+234801234573",
    dateCreated: "11 May 2026",
    bookingType: "Drive Yourself",
    bookingId: "FNVID-123323-232KD",
    fees: "$5,000",
    taxes: "$20",
    paymentMethod: "Stripe",
    referenceNumber: "123-123323-232KD",
    paymentInitiated: "11 May 2026  11:34AM",
    paymentReceived: "--",
    paymentInitiatedAt: "11 May 2026  11:34AM",
    paymentCompletedAt: null,
  },
  {
    id: "DRI-12XDF-123",
    customerId: "CUST-002",
    customerName: "Prosper Edward",
    amount: "$120.00",
    type: "Payout",
    date: "30 Feb 2026",
    status: "Completed",
    customerEmail: "prosper@gmail.com",
    customerPhone: "+234801234573",
    dateCreated: "11 May 2026",
    bookingType: "With a Driver",
    bookingId: "FNVID-123323-232KE",
    fees: "$4,000",
    taxes: "$18",
    paymentMethod: "Stripe",
    referenceNumber: "123-123323-232KE",
    paymentInitiated: "11 May 2026  11:34AM",
    paymentReceived: "11 May 2026  12:00PM",
    paymentInitiatedAt: "11 May 2026  11:34AM",
    paymentCompletedAt: "11 May 2026  12:00PM",
  },
  {
    id: "DRI-12XDF-123",
    customerId: "CUST-003",
    customerName: "Prosper Edward",
    amount: "$120.00",
    type: "Payouts",
    date: "30 Feb 2026",
    status: "Failed",
    customerEmail: "prosper@gmail.com",
    customerPhone: "+234801234573",
    dateCreated: "11 May 2026",
    bookingType: "Drive Yourself",
    bookingId: "FNVID-123323-232KF",
    fees: "$3,500",
    taxes: "$15",
    paymentMethod: "Stripe",
    referenceNumber: "123-123323-232KF",
    paymentInitiated: "11 May 2026  11:34AM",
    paymentReceived: "--",
    paymentInitiatedAt: "11 May 2026  11:34AM",
    paymentCompletedAt: null,
  },
  {
    id: "DRI-12XDF-123",
    customerId: "CUST-004",
    customerName: "Prosper Edward",
    amount: "$120.00",
    type: "Refund",
    date: "30 Feb 2026",
    status: "Pending",
    customerEmail: "prosper@gmail.com",
    customerPhone: "+234801234573",
    dateCreated: "11 May 2026",
    bookingType: "Drive Yourself",
    bookingId: "FNVID-123323-232KG",
    fees: "$2,000",
    taxes: "$10",
    paymentMethod: "Stripe",
    referenceNumber: "123-123323-232KG",
    paymentInitiated: "11 May 2026  11:34AM",
    paymentReceived: "--",
    paymentInitiatedAt: "11 May 2026  11:34AM",
    paymentCompletedAt: null,
  },
  {
    id: "DRI-12XDF-123",
    customerId: "CUST-005",
    customerName: "Prosper Edward",
    amount: "$120.00",
    type: "Bookings",
    date: "30 Feb 2026",
    status: "Reversed",
    customerEmail: "prosper@gmail.com",
    customerPhone: "+234801234573",
    dateCreated: "11 May 2026",
    bookingType: "Drive Yourself",
    bookingId: "FNVID-123323-232KH",
    fees: "$1,500",
    taxes: "$8",
    paymentMethod: "Stripe",
    referenceNumber: "123-123323-232KH",
    paymentInitiated: "11 May 2026  11:34AM",
    paymentReceived: "--",
    paymentInitiatedAt: "11 May 2026  11:34AM",
    paymentCompletedAt: null,
  },
  {
    id: "DRI-12XDF-123",
    customerId: "CUST-006",
    customerName: "Prosper Edward",
    amount: "$120.00",
    type: "Bookings",
    date: "30 Feb 2026",
    status: "Processing",
    customerEmail: "prosper@gmail.com",
    customerPhone: "+234801234573",
    dateCreated: "11 May 2026",
    bookingType: "Drive Yourself",
    bookingId: "FNVID-123323-232KI",
    fees: "$1,200",
    taxes: "$5",
    paymentMethod: "Stripe",
    referenceNumber: "123-123323-232KI",
    paymentInitiated: "11 May 2026  11:34AM",
    paymentReceived: "--",
    paymentInitiatedAt: "11 May 2026  11:34AM",
    paymentCompletedAt: null,
  },
];

export const ADMIN_PAYOUTS: Payout[] = [
  {
    id: "DRI-12XDF-123",
    driverName: "Prosper Edward",
    amount: "$120.00",
    transactionReference: "Bookings",
    date: "30 Feb 2026",
    status: "Pending",
  },
  {
    id: "DRI-12XDF-123",
    driverName: "Prosper Edward",
    amount: "$120.00",
    transactionReference: "Bookings",
    date: "30 Feb 2026",
    status: "Completed",
  },
];
