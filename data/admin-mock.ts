/* ─── Admin Dashboard Mock Data ─── */

export type AdminRole =
  | "Super Admin"
  | "Fleet Manager"
  | "Operations Manager"
  | "Customer Engagement"
  | "Finance Manager";

export const ADMIN_USER = {
  name: "James Brown",
  email: "james@drifully.com",
  avatar: "/images/admin/profile-Avatar.svg",
  role: "Super Admin" as AdminRole,
  // role: "Fleet Manager" as AdminRole,
  verified: true,
};

export const DASHBOARD_STATS = [
  {
    id: "total-vehicles",
    label: "Total Vehicles",
    value: 24,
    accent: "var(--admin-stat-accent-1)",
  },
  {
    id: "available-vehicles",
    label: "Available Vehicles",
    value: 18,
    accent: "var(--admin-stat-accent-2)",
  },
  {
    id: "booked-vehicles",
    label: "Booked Vehicles",
    value: 5,
    accent: "var(--admin-stat-accent-3)",
  },
  {
    id: "under-maintenance",
    label: "Under Maintenance",
    value: 1,
    accent: "var(--admin-stat-accent-4)",
  },
];

export const RECENT_BOOKINGS = [
  {
    id: "BK-001",
    customer: "Sarah Johnson",
    vehicle: "Tesla Model S",
    startDate: "2026-05-01",
    endDate: "2026-05-05",
    amount: "$1,200",
    status: "active" as const,
  },
  {
    id: "BK-002",
    customer: "Michael Chen",
    vehicle: "BMW X6",
    startDate: "2026-04-28",
    endDate: "2026-05-02",
    amount: "$1,800",
    status: "active" as const,
  },
  {
    id: "BK-003",
    customer: "Emily Davis",
    vehicle: "Mini Cooper S",
    startDate: "2026-04-20",
    endDate: "2026-04-25",
    amount: "$625",
    status: "completed" as const,
  },
  {
    id: "BK-004",
    customer: "David Wilson",
    vehicle: "Volkswagen T2 Bus",
    startDate: "2026-04-15",
    endDate: "2026-04-18",
    amount: "$900",
    status: "completed" as const,
  },
  {
    id: "BK-005",
    customer: "Lisa Thompson",
    vehicle: "Polestar 2",
    startDate: "2026-05-03",
    endDate: "2026-05-10",
    amount: "$2,250",
    status: "pending" as const,
  },
];

export const RECENT_ACTIVITY = [
  {
    id: 1,
    action: "New booking created",
    detail: "Lisa Thompson booked Polestar 2",
    time: "2 hours ago",
    type: "booking" as const,
  },
  {
    id: 2,
    action: "Vehicle returned",
    detail: "Emily Davis returned Mini Cooper S",
    time: "5 hours ago",
    type: "return" as const,
  },
  {
    id: 3,
    action: "New user registered",
    detail: "Robert Martinez joined the platform",
    time: "1 day ago",
    type: "user" as const,
  },
  {
    id: 4,
    action: "Payment received",
    detail: "$1,800 from Michael Chen",
    time: "1 day ago",
    type: "payment" as const,
  },
  {
    id: 5,
    action: "Vehicle added",
    detail: "Nissan Skyline GT-R added to fleet",
    time: "2 days ago",
    type: "vehicle" as const,
  },
];

export type BookingStatus = "active" | "completed" | "pending" | "cancelled";
export type ActivityType = "booking" | "return" | "user" | "payment" | "vehicle";
