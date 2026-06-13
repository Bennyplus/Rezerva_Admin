"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_USER, AdminRole } from "@/data/admin-mock";
import Spinner from "./Spinner";
import styles from "./AdminGuard.module.css";

// Pathname-to-allowed-roles mapping
const ROUTE_PERMISSIONS: Record<string, AdminRole[]> = {
  "/admin": ["Super Admin", "Admin", "Fleet Manager", "Operations Manager", "Customer Engagement", "Finance Manager"],
  "/admin/analytics": ["Super Admin", "Admin", "Fleet Manager", "Operations Manager", "Customer Engagement", "Finance Manager"],
  "/admin/audit-logs": ["Super Admin", "Admin"],
  "/admin/vehicles": ["Super Admin", "Admin", "Fleet Manager"],
  "/admin/bookings": ["Super Admin", "Admin", "Operations Manager", "Fleet Manager"],
  "/admin/notifications": ["Super Admin", "Admin", "Customer Engagement"],
  "/admin/users": ["Super Admin", "Admin", "Customer Engagement"],
  "/admin/teams": ["Super Admin", "Admin"],
  "/admin/drivers": ["Super Admin", "Admin", "Customer Engagement"],
  "/admin/customers": ["Super Admin", "Admin", "Customer Engagement"],
  "/admin/reviews": ["Super Admin", "Admin", "Customer Engagement"],
  "/admin/payments": ["Super Admin", "Admin", "Finance Manager"],
};

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentRole, setCurrentRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("drifully_admin_role") as AdminRole | null;
    setCurrentRole(savedRole || (ADMIN_USER.role as AdminRole));
  }, []);

  if (currentRole === null) {
    return null; // Wait for role to load from client storage to prevent hydration mismatch
  }

  // Find if current path is protected, matching the most specific prefix first
  const sortedRoutes = Object.keys(ROUTE_PERMISSIONS).sort((a, b) => b.length - a.length);
  const matchedRoute = sortedRoutes.find(route =>
    pathname === route || pathname.startsWith(route + "/")
  );

  const allowedRoles = matchedRoute ? ROUTE_PERMISSIONS[matchedRoute] : null;
  const isAuthorized = !allowedRoles || allowedRoles.includes(currentRole as AdminRole);

  if (!isAuthorized && allowedRoles) {
    return (
      <div className={styles.forbidden} role="alert">
        <div className={styles.card}>
          <div className={styles.iconContainer}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={styles.lockIcon}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className={styles.title}>Access Denied</h1>
          <p className={styles.message}>
            Your role as <strong className={styles.roleHighlight}>{currentRole}</strong> does not have permission to access this resource.
          </p>

          <button
            onClick={() => router.push("/admin")}
            className={styles.backButton}
            style={{ width: "fit-content" }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
