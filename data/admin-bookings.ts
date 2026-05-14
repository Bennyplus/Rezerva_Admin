/* ─── Admin Bookings Mock Data ─── */

export const BOOKING_STATS_EMPTY = [
  { id: "total-sent", label: "Total Sent", value: 0 },
  { id: "total-delivered", label: "Total Delivered", value: 0 },
  { id: "total-failed", label: "Total Failed", value: 0 },
];

export const BOOKING_STATS_POPULATED = [
  { id: "total-bookings", label: "Total Bookings", value: 12 },
  { id: "ongoing-trips", label: "Ongoing Trips", value: 5 },
  { id: "completed-trips", label: "Completed Trips", value: 8 },
  { id: "cancelled-bookings", label: "Cancelled Bookings", value: 2 },
];

export interface Booking {
  id: string;
  customerName: string;
  vehicle: string;
  bookingType: string;
  pickupDate: string;
  returnDate: string;
  status: "Completed" | "Upcoming" | "Ongoing" | "Cancelled";
  email: string;
  phone: string;
  dateCreated: string;
  vehicleCategory: string;
  fuelType: string;
  transmission: string;
  currentCarStatus: string;
  extras: { name: string; amount: number }[];
  paymentSummary: {
    subtotal: number;
    tax: number;
    total: number;
  };
}

export const ADMIN_BOOKINGS: Booking[] = [
  {
    id: "(252) 555-0126",
    customerName: "Sarah Cruz",
    vehicle: "Toyota Highlander",
    bookingType: "Drive Yourself",
    pickupDate: "12 Mar 2025",
    returnDate: "23 May 2026",
    status: "Completed",
    email: "sarah@gmail.com",
    phone: "+2348012345673",
    dateCreated: "11 May 2026",
    vehicleCategory: "Jeep",
    fuelType: "Petrol",
    transmission: "Automatic",
    currentCarStatus: "Available",
    extras: [
      { name: "Prepaid Fuel", amount: 10000 },
      { name: "Child Seat (1)", amount: 10000 },
    ],
    paymentSummary: {
      subtotal: 120000,
      tax: 5000,
      total: 125000,
    },
  },
  {
    id: "(252) 555-0127",
    customerName: "Sarah Cruz",
    vehicle: "Toyota Highlander",
    bookingType: "Drive Yourself",
    pickupDate: "12 Mar 2025",
    returnDate: "23 May 2026",
    status: "Upcoming",
    email: "sarah@gmail.com",
    phone: "+2348012345673",
    dateCreated: "11 May 2026",
    vehicleCategory: "Jeep",
    fuelType: "Petrol",
    transmission: "Automatic",
    currentCarStatus: "Available",
    extras: [],
    paymentSummary: {
      subtotal: 120000,
      tax: 5000,
      total: 125000,
    },
  },
  {
    id: "(252) 555-0128",
    customerName: "Sarah Cruz",
    vehicle: "Toyota Highlander",
    bookingType: "Drive Yourself",
    pickupDate: "12 Mar 2025",
    returnDate: "23 May 2026",
    status: "Ongoing",
    email: "sarah@gmail.com",
    phone: "+2348012345673",
    dateCreated: "11 May 2026",
    vehicleCategory: "Jeep",
    fuelType: "Petrol",
    transmission: "Automatic",
    currentCarStatus: "Available",
    extras: [],
    paymentSummary: {
      subtotal: 120000,
      tax: 5000,
      total: 125000,
    },
  },
  {
    id: "(252) 555-0129",
    customerName: "Sarah Cruz",
    vehicle: "Toyota Highlander",
    bookingType: "Drive Yourself",
    pickupDate: "12 Mar 2025",
    returnDate: "23 May 2026",
    status: "Cancelled",
    email: "sarah@gmail.com",
    phone: "+2348012345673",
    dateCreated: "11 May 2026",
    vehicleCategory: "Jeep",
    fuelType: "Petrol",
    transmission: "Automatic",
    currentCarStatus: "Available",
    extras: [],
    paymentSummary: {
      subtotal: 120000,
      tax: 5000,
      total: 125000,
    },
  },
];
