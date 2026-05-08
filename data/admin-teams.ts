/* ─── Admin Teams & Roles Mock Data ─── */

/* ─── Types ─── */
export type RoleStatus = "Active" | "Inactive";

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdAt: string;
  status: RoleStatus;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: "Active" | "Inactive";
  joinedAt: string;
}

/* ─── Permission Matrix ─── */
export interface PermissionGroup {
  module: string;
  permissions: string[];
}

export const PERMISSION_MATRIX: PermissionGroup[] = [
  {
    module: "Vehicles",
    permissions: ["Create", "Edit", "Approve/Disapprove", "Deactivate"],
  },
  {
    module: "Bookings",
    permissions: ["View", "Modify", "Cancel"],
  },
  {
    module: "Notifications",
    permissions: ["Create", "View", "Modify"],
  },
  {
    module: "Users",
    permissions: [
      "Add Role",
      "Add Team Member",
      "Approve/Disapprove",
      "Verify Customer",
      "Modify",
      "Cancel",
    ],
  },
];

/* ─── All permission keys (flat list for Select All) ─── */
export const ALL_PERMISSIONS: string[] = PERMISSION_MATRIX.flatMap((group) =>
  group.permissions.map((p) => `${group.module}:${p}`)
);

/* ─── Mock Roles ─── */
export const ADMIN_ROLES: Role[] = [
  {
    id: "role-1",
    name: "Vehicles Manager",
    permissions: ["Vehicles:Create", "Vehicles:Edit", "Vehicles:Approve/Disapprove"],
    createdAt: "30 Apr 2026",
    status: "Active",
  },
  {
    id: "role-2",
    name: "Operations Lead",
    permissions: [
      "Vehicles:Create",
      "Vehicles:Edit",
      "Vehicles:Approve/Disapprove",
      "Vehicles:Deactivate",
      "Bookings:View",
      "Bookings:Modify",
      "Notifications:Create",
      "Notifications:View",
    ],
    createdAt: "30 Apr 2026",
    status: "Active",
  },
  {
    id: "role-3",
    name: "Bookings Coordinator",
    permissions: ["Bookings:View", "Bookings:Modify", "Bookings:Cancel"],
    createdAt: "29 Apr 2026",
    status: "Active",
  },
  {
    id: "role-4",
    name: "Customer Support",
    permissions: ["Users:Verify Customer", "Users:Approve/Disapprove", "Bookings:View"],
    createdAt: "28 Apr 2026",
    status: "Active",
  },
  {
    id: "role-5",
    name: "Notification Manager",
    permissions: ["Notifications:Create", "Notifications:View", "Notifications:Modify"],
    createdAt: "27 Apr 2026",
    status: "Inactive",
  },
  {
    id: "role-6",
    name: "Finance Reviewer",
    permissions: ["Bookings:View"],
    createdAt: "25 Apr 2026",
    status: "Active",
  },
  {
    id: "role-7",
    name: "Super Editor",
    permissions: [
      "Vehicles:Create",
      "Vehicles:Edit",
      "Bookings:View",
      "Bookings:Modify",
      "Users:Modify",
    ],
    createdAt: "22 Apr 2026",
    status: "Active",
  },
  {
    id: "role-8",
    name: "Read-Only Auditor",
    permissions: ["Bookings:View", "Notifications:View"],
    createdAt: "20 Apr 2026",
    status: "Inactive",
  },
  {
    id: "role-9",
    name: "Team Admin",
    permissions: [
      "Users:Add Role",
      "Users:Add Team Member",
      "Users:Approve/Disapprove",
      "Users:Modify",
    ],
    createdAt: "18 Apr 2026",
    status: "Active",
  },
];

/* ─── Mock Team Members ─── */
export const ADMIN_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "Alice Morgan",
    email: "alice@drifully.com",
    avatar: "/images/admin/profile-Avatar.svg",
    role: "Vehicles Manager",
    status: "Active",
    joinedAt: "30 Apr 2026",
  },
  {
    id: "tm-2",
    name: "Brian Cole",
    email: "brian@drifully.com",
    avatar: "/images/admin/profile-Avatar.svg",
    role: "Operations Lead",
    status: "Active",
    joinedAt: "29 Apr 2026",
  },
  {
    id: "tm-3",
    name: "Carla Reed",
    email: "carla@drifully.com",
    avatar: "/images/admin/profile-Avatar.svg",
    role: "Customer Support",
    status: "Inactive",
    joinedAt: "28 Apr 2026",
  },
];

/* ─── Helper — format permissions for display ─── */
export function formatPermissions(permissions: string[], maxChars = 40): string {
  const labels = permissions.map((p) => p.split(":")[0]);
  const unique = [...new Set(labels)];
  const joined = unique.join(", ");
  if (joined.length <= maxChars) return joined;
  return joined.slice(0, maxChars) + "...";
}
