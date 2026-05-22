export interface AuditLog {
  id: string;
  timestamp: string;
  user: {
    name: string;
    role: string;
    email: string;
    avatar: string;
  };
  category: "Bookings" | "Vehicles" | "Users" | "Finance" | "Settings";
  action: string;
  status: "Success" | "Denied" | "Pending";
  affectedRecord?: {
    bookingId?: string;
    transactionId?: string;
    customerName?: string;
    vehicleId?: string;
  };
  changeDetails?: {
    field: string;
    before: string;
    after: string;
  }[];
  adminNotes?: string;
  activityTimeline?: {
    title: string;
    timestamp: string;
    completed: boolean;
  }[];
  networkInfo?: {
    ipAddress: string;
    deviceBrowser: string;
    location: string;
  };
}

export const ADMIN_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "22 Apr 2026 11:12AM",
    user: {
      name: "Prosper Edward",
      role: "Operations Admin",
      email: "prosper@drifully.com",
      avatar: "/images/admin/avatars/prosper.jpg",
    },
    category: "Bookings",
    action: "Approved Extension",
    status: "Success",
    affectedRecord: {
      bookingId: "DRI-F2332-23323",
      customerName: "Prosper Edward",
    },
    changeDetails: [
      {
        field: "Booking End Date",
        before: "21 Apr 2026 10:00AM",
        after: "23 Apr 2026 10:00AM",
      },
    ],
    adminNotes: "Customer requested extension via support ticket #TKT-452. Approved after checking vehicle availability.",
    activityTimeline: [
      {
        title: "Extension Requested",
        timestamp: "22 Apr 2026 10:30AM",
        completed: true,
      },
      {
        title: "Reviewed by Operations Admin",
        timestamp: "22 Apr 2026 11:10AM",
        completed: true,
      },
      {
        title: "Extension Successfully Approved",
        timestamp: "22 Apr 2026 11:12AM",
        completed: true,
      },
    ],
    networkInfo: {
      ipAddress: "192.168.10.1",
      deviceBrowser: "Chrome on Windows",
      location: "Lagos, Nigeria",
    },
  },
  {
    id: "log-2",
    timestamp: "22 Apr 2026 11:12AM",
    user: {
      name: "Prosper Edward",
      role: "Operations Admin",
      email: "prosper@drifully.com",
      avatar: "/images/admin/avatars/prosper.jpg",
    },
    category: "Vehicles",
    action: "Upload Vehicle",
    status: "Denied",
    affectedRecord: {
      vehicleId: "VEH-7821-213",
    },
    changeDetails: [],
    adminNotes: "Attempted to upload a vehicle with missing insurance documents. System automatically denied the upload.",
    activityTimeline: [
      {
        title: "Vehicle Data Submitted",
        timestamp: "22 Apr 2026 11:11AM",
        completed: true,
      },
      {
        title: "System Validation",
        timestamp: "22 Apr 2026 11:12AM",
        completed: true,
      },
      {
        title: "Upload Denied",
        timestamp: "22 Apr 2026 11:12AM",
        completed: false,
      },
    ],
    networkInfo: {
      ipAddress: "192.168.10.1",
      deviceBrowser: "Chrome on Windows",
      location: "Lagos, Nigeria",
    },
  },
  {
    id: "log-3",
    timestamp: "22 Apr 2026 11:12AM",
    user: {
      name: "Sarah Johnson",
      role: "Operations Admin",
      email: "sarahjohnson@gmail.com",
      avatar: "/images/admin/avatars/sarah.jpg",
    },
    category: "Finance",
    action: "Approved Refund",
    status: "Success",
    affectedRecord: {
      bookingId: "DRI-F2332-23323",
      transactionId: "FNVID-123323-232KD",
      customerName: "Prosper Edward",
    },
    changeDetails: [
      {
        field: "Refund Status",
        before: "Pending",
        after: "Success",
      },
    ],
    adminNotes: "Customer reported duplicate charge. Verified transaction logs and processed refund.",
    activityTimeline: [
      {
        title: "Refund Request Submitted",
        timestamp: "11 May 2026 11:34AM",
        completed: true,
      },
      {
        title: "Reviewed by Finance Admin",
        timestamp: "11 May 2026 11:34AM",
        completed: true,
      },
      {
        title: "Refund Successfully processed",
        timestamp: "11 May 2026 11:40AM",
        completed: false, // In mock it's shown as uncompleted checkbox but text says successfully processed, we'll follow mock visual
      },
    ],
    networkInfo: {
      ipAddress: "192.168.10.1",
      deviceBrowser: "Chrome on Windows",
      location: "Lagos, Nigeria",
    },
  },
  {
    id: "log-4",
    timestamp: "22 Apr 2026 10:45AM",
    user: {
      name: "Michael Chen",
      role: "Fleet Manager",
      email: "michael@drifully.com",
      avatar: "/images/admin/avatars/michael.jpg",
    },
    category: "Vehicles",
    action: "Update Status",
    status: "Success",
    affectedRecord: {
      vehicleId: "VEH-9012-444",
    },
    changeDetails: [
      {
        field: "Status",
        before: "Active",
        after: "Maintenance",
      },
    ],
    networkInfo: {
      ipAddress: "10.0.0.55",
      deviceBrowser: "Safari on macOS",
      location: "Abuja, Nigeria",
    },
  },
  {
    id: "log-5",
    timestamp: "21 Apr 2026 09:15AM",
    user: {
      name: "Amanda Cole",
      role: "Customer Engagement",
      email: "amanda@drifully.com",
      avatar: "/images/admin/avatars/amanda.jpg",
    },
    category: "Users",
    action: "Suspend Driver",
    status: "Success",
    affectedRecord: {
      customerName: "David Ojo",
    },
    changeDetails: [
      {
        field: "Account Status",
        before: "Active",
        after: "Suspended",
      },
    ],
    adminNotes: "Suspended due to multiple negative reviews regarding driving behavior.",
    networkInfo: {
      ipAddress: "192.168.1.100",
      deviceBrowser: "Firefox on Linux",
      location: "Port Harcourt, Nigeria",
    },
  },
  {
    id: "log-6",
    timestamp: "21 Apr 2026 08:30AM",
    user: {
      name: "Super Admin User",
      role: "Super Admin",
      email: "admin@drifully.com",
      avatar: "/images/admin/avatars/admin.jpg",
    },
    category: "Settings",
    action: "Change API Keys",
    status: "Success",
    changeDetails: [
      {
        field: "Payment Gateway Key",
        before: "sk_live_123***",
        after: "sk_live_987***",
      },
    ],
    networkInfo: {
      ipAddress: "203.0.113.42",
      deviceBrowser: "Edge on Windows",
      location: "London, UK",
    },
  },
  {
    id: "log-7",
    timestamp: "20 Apr 2026 03:22PM",
    user: {
      name: "Sarah Johnson",
      role: "Operations Admin",
      email: "sarahjohnson@gmail.com",
      avatar: "/images/admin/avatars/sarah.jpg",
    },
    category: "Bookings",
    action: "Cancel Booking",
    status: "Success",
    affectedRecord: {
      bookingId: "DRI-A9988-11223",
      customerName: "Alice Smith",
    },
    changeDetails: [
      {
        field: "Booking Status",
        before: "Confirmed",
        after: "Cancelled",
      },
    ],
    adminNotes: "Customer requested cancellation 48h prior.",
    networkInfo: {
      ipAddress: "192.168.10.1",
      deviceBrowser: "Chrome on Windows",
      location: "Lagos, Nigeria",
    },
  },
  {
    id: "log-8",
    timestamp: "20 Apr 2026 02:10PM",
    user: {
      name: "Prosper Edward",
      role: "Operations Admin",
      email: "prosper@drifully.com",
      avatar: "/images/admin/avatars/prosper.jpg",
    },
    category: "Vehicles",
    action: "Delete Vehicle",
    status: "Denied",
    affectedRecord: {
      vehicleId: "VEH-1111-222",
    },
    adminNotes: "Cannot delete vehicle with active bookings.",
    networkInfo: {
      ipAddress: "192.168.10.1",
      deviceBrowser: "Chrome on Windows",
      location: "Lagos, Nigeria",
    },
  },
  {
    id: "log-9",
    timestamp: "19 Apr 2026 11:05AM",
    user: {
      name: "Michael Chen",
      role: "Fleet Manager",
      email: "michael@drifully.com",
      avatar: "/images/admin/avatars/michael.jpg",
    },
    category: "Vehicles",
    action: "Update Pricing",
    status: "Success",
    affectedRecord: {
      vehicleId: "VEH-5555-666",
    },
    changeDetails: [
      {
        field: "Daily Rate",
        before: "$120.00",
        after: "$135.00",
      },
    ],
    networkInfo: {
      ipAddress: "10.0.0.55",
      deviceBrowser: "Safari on macOS",
      location: "Abuja, Nigeria",
    },
  }
];
