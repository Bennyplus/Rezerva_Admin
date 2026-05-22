export const ANALYTICS_STATS = [
  { id: "total-bookings", label: "Total Bookings", value: "24", growth: "+12% from last month", isPositive: true },
  { id: "revenue", label: "Revenue", value: "$4,000", growth: "+18% growth", isPositive: true },
  { id: "active-users", label: "Active Users", value: "100", growth: "+6% growth", isPositive: true },
  { id: "ongoing-trips", label: "Ongoing Trips", value: "12" },
];

export const BOOKINGS_OVER_TIME_DATA = {
  series: [{
    name: "Bookings",
    data: [5, 23, 19, 35, 24, 8, 52]
  }],
  categories: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
};

export const REVENUE_PERFORMANCE_DATA = {
  series: [{
    name: "Revenue",
    data: [44, 15, 30, 58, 26, 8, 31]
  }],
  categories: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
};

export const USER_GROWTH_DATA = {
  series: [
    {
      name: "New Users",
      data: [25, 22, 26, 22, 33, 42, 31, 23, 29, 25, 33, 27]
    },
    {
      name: "Returning Users",
      data: [21, 30, 31, 28, 41, 31, 38, 42, 36, 46, 41, 50]
    }
  ],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Spet", "Oct", "Nov", "Dec"]
};

export const BOOKINGS_BY_LOCATION = [
  { location: "US", count: 820, color: "#FFE8CC" },
  { location: "UK", count: 200, color: "#F4F5F6" },
  { location: "Canada", count: 750, color: "#FFE2E5" },
  { location: "Lagos", count: 1020, color: "#D1FADF" },
  { location: "Abuja", count: 50, color: "#E0EAFF" },
];

export const REPORTS_DATA = [
  { id: "booking-report", title: "Booking Report", description: "Detailed booking and trip data", type: "PDF" },
  { id: "payments-report", title: "Payments Report", description: "Revenue, refunds and adjustments", type: "PDF" },
  { id: "user-activity-report", title: "User Activity Report", description: "User Signups, activity log", type: "PDF" },
  { id: "audit-log", title: "Audit Log", description: "User Signups, activity log", type: "PDF" },
];
