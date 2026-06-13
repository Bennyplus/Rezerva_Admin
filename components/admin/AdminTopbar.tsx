"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ADMIN_USER } from "@/data/admin-mock";
import styles from "./AdminTopbar.module.css";

/* ─── Map routes to page titles & subtitles ─── */
const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Dashboard",
    subtitle: "Welcome back, monitor your fleet at a glance",
  },
  "/admin/analytics": {
    title: "Analytics",
    subtitle: "Monitor platform growth, bookings, and revenue trends",
  },
  "/admin/audit-logs": {
    title: "Audit Logs",
    subtitle: "Track admin and system activity across the platform",
  },
  "/admin/tickets": {
    title: "Tickets",
    subtitle: "Monitor platform growth, bookings, and revenue trends",
  },
  "/admin/vehicles": {
    title: "Vehicles",
    subtitle: "View, update, and track vehicle status",
  },
  "/admin/bookings": {
    title: "Bookings",
    subtitle: "Manage reservations and trip activity",
  },
  "/admin/notifications": {
    title: "Notifications",
    subtitle: "Notify users instantly across every channel.",
  },
  "/admin/users": {
    title: "Users",
    subtitle: "Manage customer accounts and access",
  },
  "/admin/teams": {
    title: "Team Management",
    subtitle: "Manage all administrative users",
  },
  "/admin/drivers": {
    title: "Drivers",
    subtitle: "Manage and monitor all drivers",
  },
  "/admin/customers": {
    title: "Customers",
    subtitle: "Manage customer accounts and activity",
  },
  "/admin/reviews": {
    title: "Reviews",
    subtitle: "Manage customer feedback and moderate reported content",
  },
  "/admin/payments": {
    title: "Payments",
    subtitle: "Monitor payments, refunds, and wallet activity",
  },
  "/admin/payments/:id": {
    title: "Payment Details",
    subtitle: "Review transaction details and payment status",
  },
  "/admin/refunds": {
    title: "Refunds",
    subtitle: "Manage and monitor customer refund requests",
  },
  "/admin/settings": {
    title: "Settings",
    subtitle: "Configure your dashboard preferences",
  },
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("drifully_admin_user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Resolve dynamic routes before exact lookup
  const resolvedPath = (() => {
    if (/^\/admin\/payments\/[^/]+$/.test(pathname)) return "/admin/payments/:id";
    return pathname;
  })();

  const meta = PAGE_META[resolvedPath] || { title: "Dashboard", subtitle: "" };

  const name = currentUser?.full_name || ADMIN_USER.name;
  const profilePic = currentUser?.profile?.profile_picture;
  const hasProfilePic = profilePic && !profilePic.includes("default.jpg");

  return (
    <header className={styles.topbar} id="admin-topbar">
      {/* Page title */}
      <div className={styles.titleArea}>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.subtitle}>{meta.subtitle}</p>
      </div>

      {/* Right actions */}
      <div className={styles.actions}>
        {/* Notification bell */}
        <button
          className={styles.iconBtn}
          aria-label="Notifications"
          id="admin-notification-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={styles.notifDot} aria-hidden="true" />
        </button>

        {/* Admin avatar */}
        <button
          className={styles.avatar}
          aria-label="Admin menu"
          id="admin-avatar-btn"
        >
          {hasProfilePic ? (
            <Image
              src={profilePic}
              alt={name}
              width={36}
              height={36}
              className={styles.avatarImg}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "13px", flexShrink: 0 }}>
              {getInitials(name)}
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
