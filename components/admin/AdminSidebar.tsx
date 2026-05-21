"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ADMIN_USER, AdminRole } from "@/data/admin-mock";
import styles from "./AdminSidebar.module.css";

/* ─── Navigation structure matching the design ─── */
interface NavItem {
  label: string;
  href: string;
  icon: string;
  allowedRoles: AdminRole[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { 
        label: "Dashboard", 
        href: "/admin", 
        icon: "dashboard", 
        allowedRoles: ["Super Admin", "Fleet Manager", "Operations Manager", "Customer Engagement", "Finance Manager"] 
      },
      { 
        label: "Analytics", 
        href: "/admin/analytics", 
        icon: "analytics", 
        allowedRoles: ["Super Admin", "Fleet Manager", "Operations Manager", "Customer Engagement", "Finance Manager"] 
      },
      { 
        label: "Audit Logs", 
        href: "/admin/audit-logs", 
        icon: "audit", 
        allowedRoles: ["Super Admin"] 
      },
      {
        label: "Tickets",
        href: "/admin/tickets",
        icon: "ticket",
        allowedRoles: ["Super Admin", "Customer Engagement"]
      },
    ],
  },
  {
    label: "Operations",
    items: [
      { 
        label: "Vehicles", 
        href: "/admin/vehicles", 
        icon: "vehicles", 
        allowedRoles: ["Super Admin", "Fleet Manager"] 
      },
      { 
        label: "Bookings", 
        href: "/admin/bookings", 
        icon: "bookings", 
        allowedRoles: ["Super Admin", "Operations Manager", "Fleet Manager"] 
      },
      { 
        label: "Notifications", 
        href: "/admin/notifications", 
        icon: "notification", 
        allowedRoles: ["Super Admin", "Customer Engagement"] 
      },
    ],
  },
  {
    label: "Users",
    items: [
      { 
        label: "Users", 
        href: "/admin/users", 
        icon: "users", 
        allowedRoles: ["Super Admin", "Customer Engagement"] 
      },
    ],
  },
  {
    label: "Finance",
    items: [
      { 
        label: "Payments", 
        href: "/admin/payments", 
        icon: "payments", 
        allowedRoles: ["Super Admin", "Finance Manager"] 
      },
      {
        label: "Refunds",
        href: "/admin/refunds",
        icon: "refunds",
        allowedRoles: ["Super Admin", "Finance Manager"]
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: "settings",
        allowedRoles: ["Super Admin", "Fleet Manager", "Operations Manager", "Customer Engagement", "Finance Manager"]
      },
    ],
  },
];

function NavIcon({ icon }: { icon: string }) {
  const size = 20;
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  const imageIcons = [
    "analytics", "audit", "bookings", "dashboard", 
    "notification", "payments", "refunds", "reviews", 
    "ticket", "vehicles"
  ];

  if (imageIcons.includes(icon)) {
    return (
      <Image 
        src={`/images/admin/sidebar-icons/${icon}.svg`} 
        alt={icon} 
        width={size} 
        height={size} 
        style={{ objectFit: "contain" }}
      />
    );
  }

  switch (icon) {
    case "users":
      return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "teams":
      return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "drivers":
      return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /><path d="M10 14l2 3 2-3" /></svg>;
    case "customers":
      return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
  }
}

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [usersExpanded, setUsersExpanded] = useState(true);
  const pathname = usePathname();
  
  const currentRole = ADMIN_USER.role as AdminRole;

  // Filter sections and remove empty categories
  const visibleSections = NAV_SECTIONS.map((section) => {
    const filteredItems = section.items.filter((item) =>
      item.allowedRoles.includes(currentRole)
    );
    return {
      ...section,
      items: filteredItems,
    };
  }).filter((section) => section.items.length > 0);

  /* Close mobile sidebar on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Prevent scroll when mobile sidebar is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
        id="admin-sidebar-toggle"
      >
        {mobileOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        )}
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${mobileOpen ? styles.mobileOpen : ""}`}
        id="admin-sidebar"
      >
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/admin" className={styles.logoLink}>
            <Image
              src="/images/admin/admin-drifully-logo.svg"
              alt="Drifully"
              width={28}
              height={28}
              className={styles.logoIcon}
            />
            {!collapsed && (
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>DRIFULLY</span>
                <span className={styles.logoSub}>Car Rental</span>
              </div>
            )}
          </Link>
        </div>

        {/* Search */}
        <div className={styles.search}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {!collapsed && (
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              id="admin-search"
            />
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {visibleSections.map((section) => (
            <div key={section.label} className={styles.section}>
              {!collapsed && (
                <span className={styles.sectionLabel}>{section.label}</span>
              )}
              <ul className={styles.navList}>
                {section.items.map((item) => (
                  <li key={item.href}>
                    {item.icon === "users" ? (
                      /* Users — collapsible group trigger */
                      <>
                        <button
                          className={`${styles.navItem} ${styles.navItemBtn} ${isActive(item.href) ? styles.navItemActive : ""}`}
                          id={`admin-nav-${item.icon}`}
                          onClick={() => setUsersExpanded((v) => !v)}
                        >
                          <NavIcon icon={item.icon} />
                          {!collapsed && <span>{item.label}</span>}
                          {!collapsed && (
                            <svg
                              width="14" height="14" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              className={`${styles.chevron} ${usersExpanded ? styles.chevronOpen : ""}`}
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          )}
                        </button>

                        {/* Sub-items */}
                        {usersExpanded && !collapsed && (
                          <ul className={styles.subNavList}>
                            {[
                              { label: "Teams", href: "/admin/teams", icon: "teams", allowedRoles: ["Super Admin"] },
                              { label: "Drivers", href: "/admin/drivers", icon: "drivers", allowedRoles: ["Super Admin", "Customer Engagement"] },
                              { label: "Customers", href: "/admin/customers", icon: "customers", allowedRoles: ["Super Admin", "Customer Engagement"] },
                              { label: "Reviews", href: "/admin/reviews", icon: "reviews", allowedRoles: ["Super Admin", "Customer Engagement"] },
                            ].filter((sub) => sub.allowedRoles.includes(currentRole)).map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  className={`${styles.subNavItem} ${isActive(sub.href) ? styles.navItemActive : ""}`}
                                  id={`admin-nav-${sub.icon}`}
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ""}`}
                        id={`admin-nav-${item.icon}`}
                      >
                        <NavIcon icon={item.icon} />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User profile */}
        <div className={styles.profile}>
          <div className={styles.profileAvatar}>
            <Image
              src={ADMIN_USER.avatar}
              alt={ADMIN_USER.name}
              width={40}
              height={40}
              className={styles.avatarImg}
            />
          </div>
          {!collapsed && (
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>
                {ADMIN_USER.name}
                <Image
                  src="/images/admin/profile-checkmark.svg"
                  alt="Verified"
                  width={14}
                  height={14}
                  className={styles.verifiedBadge}
                />
              </div>
              <span className={styles.profileEmail}>{ADMIN_USER.email}</span>
            </div>
          )}
          {!collapsed && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.profileChevron}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </div>
      </aside>
    </>
  );
}
