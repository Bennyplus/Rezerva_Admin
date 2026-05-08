"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ADMIN_USER } from "@/data/admin-mock";
import styles from "./AdminSidebar.module.css";

/* ─── Navigation structure matching the design ─── */
const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: "dashboard" },
      { label: "Analytics", href: "/admin/analytics", icon: "analytics" },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: "audit" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Vehicles", href: "/admin/vehicles", icon: "vehicles" },
      { label: "Bookings", href: "/admin/bookings", icon: "bookings" },
      { label: "Notifications", href: "/admin/notifications", icon: "notifications" },
    ],
  },
  {
    label: "Users",
    items: [
      { label: "Users", href: "/admin/users", icon: "users" },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Payments", href: "/admin/payments", icon: "payments" },
    ],
  },
];

/* ─── Icon components (inline SVGs for zero deps) ─── */
function NavIcon({ icon }: { icon: string }) {
  const size = 20;
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (icon) {
    case "dashboard":
      return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
    case "analytics":
      return <svg {...props}><path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3" /><path d="M7 14.5l4-4 3 3 5-5" /></svg>;
    case "audit":
      return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
    case "vehicles":
      return <svg {...props}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.7-3.4A2 2 0 0 0 13.7 6H6.3a2 2 0 0 0-1.6.8L2 10l-1 1.1C.7 11.3 0 12.1 0 13v3c0 .6.4 1 1 1h2" transform="translate(1,0)" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>;
    case "bookings":
      return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" /></svg>;
    case "notifications":
      return <svg {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
    case "users":
      return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "reviews":
      return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
    case "teams":
      return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "drivers":
      return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /><path d="M10 14l2 3 2-3" /></svg>;
    case "customers":
      return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "payments":
      return <svg {...props}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /><path d="M6 16h.01M10 16h4" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
  }
}

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [usersExpanded, setUsersExpanded] = useState(true);
  const pathname = usePathname();

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
          {NAV_SECTIONS.map((section) => (
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
                              { label: "Teams", href: "/admin/teams", icon: "teams" },
                              { label: "Drivers", href: "/admin/drivers", icon: "drivers" },
                              { label: "Customers", href: "/admin/customers", icon: "customers" },
                              { label: "Reviews", href: "/admin/reviews", icon: "reviews" },
                            ].map((sub) => (
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
