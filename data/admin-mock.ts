/* ─── Admin Dashboard Mock Data ─── */

export type AdminRole =
  | "Super Admin"
  | "Admin"
  | "Fleet Manager"
  | "Operations Manager"
  | "Customer Engagement"
  | "Finance Manager";

export const ADMIN_USER = {
  name: "James Brown",
  email: "[EMAIL_ADDRESS]",
  avatar: "",
  role: "Admin" as AdminRole,
  // role: "Fleet Manager" as AdminRole,
  verified: true,
};

export const DASHBOARD_STATS = [
  {
    id: "total-bookings",
    label: "Total Bookings",
    value: 24,
    growth: "+12% from last month",
    isPositive: true,
  },
  {
    id: "total-revenue",
    label: "Total Revenue",
    value: "$1,000",
    growth: "+18% growth",
    isPositive: true,
  },
  {
    id: "total-payouts",
    label: "Total Payouts",
    value: "$1,000",
  },
  {
    id: "available-cars",
    label: "Available Cars",
    value: 300,
  },
];

export const MONTHLY_REVENUE = {
  series: [{ name: "Revenue", data: [28, 18, 11, 38, 24, 40, 10, 30, 42, 30, 20, 22] }],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
};

export const BOOKING_TRENDS = {
  cancelled: 120,
  ongoing: 230,
  scheduled: 230,
};

export const RECENT_BOOKINGS = [
  {
    id: "(252) 555-0126",
    customer: "Sarah Cruz",
    vehicle: "Toyota Highlander",
    bookingType: "Drive Yourself",
    status: "completed" as const,
  },
  {
    id: "(252) 555-0126",
    customer: "Darrell Steward",
    vehicle: "Toyota Highlander",
    bookingType: "Chauffeur",
    status: "upcoming" as const,
  },
  {
    id: "(252) 555-0126",
    customer: "Jenny Wilson",
    vehicle: "Toyota Highlander",
    bookingType: "Drive Yourself",
    status: "ongoing" as const,
  },
  {
    id: "(252) 555-0126",
    customer: "Leslie Alexander",
    vehicle: "Toyota Highlander",
    bookingType: "Chauffeur",
    status: "cancelled" as const,
  },
];

export type BookingStatus = "completed" | "upcoming" | "ongoing" | "cancelled";
export type ActivityType = "booking" | "return" | "user" | "payment" | "vehicle";
