"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_USER } from "@/data/admin-mock";
import ConfirmActionModal from "./ConfirmActionModal";
import EditProfileModal from "./EditProfileModal";
import { accountsService, Country } from "@/services/accounts-service";
import { useNotifications, Notification } from "@/hooks/useNotifications";
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
  "/admin/rides": {
    title: "Ride Management",
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
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const list = await accountsService.getCountries();
        setCountries(list);
      } catch (e) {
        console.error("Failed to load countries in Topbar:", e);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem("drifully_admin_user");
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) { }
      }
    };
    loadUser();
    window.addEventListener("admin-user-updated", loadUser);
    return () => window.removeEventListener("admin-user-updated", loadUser);
  }, []);

  const handleProfileUpdate = (updatedUser: any) => {
    localStorage.setItem("drifully_admin_user", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    window.dispatchEvent(new Event("admin-user-updated"));
  };

  const getInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getCountryName = (id: string | number) => {
    const match = countries.find((c) => String(c.id) === String(id));
    return match ? match.name : `Country ID: ${id}`;
  };

  // Resolve dynamic routes before exact lookup
  const resolvedPath = (() => {
    if (/^\/admin\/payments\/[^/]+$/.test(pathname)) return "/admin/payments/:id";
    return pathname;
  })();

  const meta = PAGE_META[resolvedPath] || { title: "Dashboard", subtitle: "" };

  const name = currentUser?.full_name || ADMIN_USER.name;
  const profilePic = currentUser?.profile?.profile_picture || currentUser?.profile_picture;
  const hasProfilePic = profilePic && !profilePic.includes("default.jpg");

  const handleLogout = async () => {
    try {
      await accountsService.logout();
    } catch (e) {
      console.error("Logout API failed:", e);
    } finally {
      localStorage.removeItem("drifully_admin_user");
      router.push("/admin/login");
    }
  };

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
        <div className={styles.notificationWrapper} ref={notifRef}>
          <button
            className={styles.iconBtn}
            aria-label="Notifications"
            id="admin-notification-btn"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className={styles.notifBadge} aria-hidden="true">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </button>

          {isNotifOpen && (
            <div className={styles.notificationsDropdown}>
              <div className={styles.dropdownHeader}>
                <h3 className={styles.dropdownTitle}>Notifications</h3>
                {unreadCount > 0 && (
                  <button className={styles.markAllReadBtn} onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length > 0 ? (
                <ul className={styles.notificationList}>
                  {notifications.map((notif: Notification) => (
                    <li
                      key={notif.id}
                      className={`${styles.notificationItem} ${!notif.is_read ? styles.unread : ''}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <h4 className={styles.notificationTitle}>{notif.title}</h4>
                      <p className={styles.notificationMessage}>{notif.message}</p>
                      {notif.created_at && (
                        <span className={styles.notificationTime}>
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.emptyState}>
                  No new notifications
                </div>
              )}
              {notifications.length > 0 && (
                <div className={styles.dropdownFooter}>
                  <button className={styles.clearAllBtn} onClick={clearNotifications}>
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          className={styles.iconBtn}
          aria-label="Logout"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>

        <div className={styles.userPill}>
          {/* Admin avatar with profile details dropdown */}
          <div className={styles.profileWrapper} ref={profileRef}>
            <button
              className={styles.avatar}
              aria-label="Admin menu"
              id="admin-avatar-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
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

            {isProfileOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileNameRow}>
                    <h4 className={styles.profileName}>{name}</h4>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className={styles.editBtn}
                      title="Edit Profile"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                  </div>
                  <p className={styles.profileEmail}>{currentUser?.email || ADMIN_USER.email}</p>
                </div>
                <div className={styles.profileInfoSection}>
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLabel}>Phone Number</span>
                    <span className={styles.profileDetailValue}>{currentUser?.phone_number || "Not Provided"}</span>
                  </div>
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLabel}>Referral Code</span>
                    <span className={styles.profileDetailValue}>{currentUser?.referral_code || "N/A"}</span>
                  </div>
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLabel}>MFA Status</span>
                    <span className={styles.profileDetailValue}>
                      <span className={`${styles.mfaBadge} ${currentUser?.mfa_enabled ? styles.mfaEnabled : styles.mfaDisabled}`}>
                        {currentUser?.mfa_enabled ? "Enabled" : "Disabled"}
                      </span>
                    </span>
                  </div>
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLabel}>Address</span>
                    <span className={styles.profileDetailValue}>{currentUser?.address_line_1 || "Not Provided"}</span>
                  </div>
                  {currentUser?.country && (
                    <div className={styles.profileDetailRow}>
                      <span className={styles.profileDetailLabel}>Country</span>
                      <span className={styles.profileDetailValue}>{getCountryName(currentUser.country)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmActionModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to log out of your session?"
        confirmText="Logout"
        cancelText="Cancel"
        isDanger={true}
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={currentUser}
        onUpdate={handleProfileUpdate}
      />
    </header>
  );
}
