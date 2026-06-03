export const ANALYTICS_STATS = [
  { id: "total-bookings", label: "Total Bookings", value: "12", growth: "", isPositive: true },
  { id: "revenue", label: "Revenue", value: "$748,750", growth: "", isPositive: true },
  { id: "completed-trips", label: "Completed Trips", value: "1", growth: "", isPositive: true },
  { id: "cancelled-bookings", label: "Cancelled Bookings", value: "3", growth: "", isPositive: false },
];

export const BOOKINGS_OVER_TIME_DATA = {
  series: [{
    name: "Bookings",
    data: [5, 0, 0, 0, 0, 0, 0]
  }],
  categories: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
};

export const REVENUE_PERFORMANCE_DATA = {
  series: [{
    name: "Revenue",
    data: [79875, 0, 0, 0, 0, 0, 0]
  }],
  categories: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
};

export const USER_GROWTH_DATA = {
  series: [
    {
      name: "New Users",
      data: [0, 0, 0, 0, 0, 0]
    },
    {
      name: "Returning Users",
      data: [0, 0, 0, 0, 0, 0]
    }
  ],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
};

export const BOOKINGS_BY_LOCATION = [
  { location: "United States", count: 7, color: "#FFE8CC" },
];

export const REPORTS_DATA = [
  { id: "booking-report", title: "Booking Report", description: "Detailed booking and trip data", type: "PDF" },
  { id: "payments-report", title: "Payments Report", description: "Revenue, refunds and adjustments", type: "PDF" },
  { id: "user-activity-report", title: "User Activity Report", description: "User Signups, activity log", type: "PDF" },
  { id: "audit-log", title: "Audit Log", description: "User Signups, activity log", type: "PDF" },
];
