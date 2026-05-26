export type RefundStatus = "Pending" | "Processing" | "Completed" | "Rejected";

export interface Refund {
  bookingId: string;
  customerName: string;
  amount: string;
  dateRequested: string;
  status: RefundStatus;

  // Additional detail fields
  transactionId: string;
  vehicle: string;
  refundType: string;
  refundReason: string;
}

export const ADMIN_REFUNDS: Refund[] = [
  {
    bookingId: "DRI-12XDJF-123",
    customerName: "Prosper Edward",
    amount: "$120.00",
    dateRequested: "30 Feb 2026",
    status: "Pending",
    transactionId: "123SFRRF123GVB",
    vehicle: "Toyota Highlander",
    refundType: "Partial Refund",
    refundReason: "Broken Child Seat",
  },
  {
    bookingId: "DRI-12XDJF-124",
    customerName: "Prosper Edward",
    amount: "$120.00",
    dateRequested: "30 Feb 2026",
    status: "Processing",
    transactionId: "123SFRRF123GVC",
    vehicle: "Toyota Highlander",
    refundType: "Full Refund",
    refundReason: "Vehicle not available",
  },
  {
    bookingId: "DRI-12XDJF-125",
    customerName: "Prosper Edward",
    amount: "$120.00",
    dateRequested: "30 Feb 2026",
    status: "Completed",
    transactionId: "123SFRRF123GVD",
    vehicle: "Toyota Highlander",
    refundType: "Partial Refund",
    refundReason: "Dirty exterior",
  },
  {
    bookingId: "DRI-12XDJF-126",
    customerName: "Prosper Edward",
    amount: "$120.00",
    dateRequested: "30 Feb 2026",
    status: "Rejected",
    transactionId: "123SFRRF123GVE",
    vehicle: "Toyota Highlander",
    refundType: "Full Refund",
    refundReason: "Late return",
  },
  {
    bookingId: "DRI-12XDJF-127",
    customerName: "Prosper Edward",
    amount: "$120.00",
    dateRequested: "30 Feb 2026",
    status: "Pending",
    transactionId: "123SFRRF123GVF",
    vehicle: "Toyota Highlander",
    refundType: "Partial Refund",
    refundReason: "Missing accessory",
  },
  {
    bookingId: "DRI-12XDJF-128",
    customerName: "Prosper Edward",
    amount: "$120.00",
    dateRequested: "30 Feb 2026",
    status: "Processing",
    transactionId: "123SFRRF123GVG",
    vehicle: "Toyota Highlander",
    refundType: "Full Refund",
    refundReason: "Booking error",
  },
  {
    bookingId: "DRI-12XDJF-129",
    customerName: "Prosper Edward",
    amount: "$120.00",
    dateRequested: "30 Feb 2026",
    status: "Completed",
    transactionId: "123SFRRF123GVH",
    vehicle: "Toyota Highlander",
    refundType: "Full Refund",
    refundReason: "Customer cancelled",
  },
  {
    bookingId: "DRI-12XDJF-130",
    customerName: "Prosper Edward",
    amount: "$120.00",
    dateRequested: "30 Feb 2026",
    status: "Rejected",
    transactionId: "123SFRRF123GVI",
    vehicle: "Toyota Highlander",
    refundType: "Partial Refund",
    refundReason: "Damage during trip",
  },
];
