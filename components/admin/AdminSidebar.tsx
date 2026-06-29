"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_USER, AdminRole } from "@/data/admin-mock";
import ConfirmActionModal from "./ConfirmActionModal";
import { accountsService } from "@/services/accounts-service";
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
        allowedRoles: ["Super Admin", "Admin", "Fleet Manager", "Operations Manager", "Customer Engagement", "Finance Manager"]
      },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: "analytics",
        allowedRoles: ["Super Admin", "Admin", "Fleet Manager", "Operations Manager", "Customer Engagement", "Finance Manager"]
      },
      {
        label: "Audit Logs",
        href: "/admin/audit-logs",
        icon: "audit",
        allowedRoles: ["Super Admin", "Admin"]
      },
      {
        label: "Tickets",
        href: "/admin/tickets",
        icon: "ticket",
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"]
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
        allowedRoles: ["Super Admin", "Admin", "Fleet Manager"]
      },
      {
        label: "Bookings",
        href: "/admin/bookings",
        icon: "bookings",
        allowedRoles: ["Super Admin", "Admin", "Operations Manager", "Fleet Manager"]
      },
      {
        label: "Notifications",
        href: "/admin/notifications",
        icon: "notification",
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"]
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
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"]
      },
      {
        label: "Reviews",
        href: "/admin/reviews",
        icon: "reviews",
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"]
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
        allowedRoles: ["Super Admin", "Admin", "Finance Manager"]
      },
      {
        label: "Refunds",
        href: "/admin/refunds",
        icon: "refunds",
        allowedRoles: ["Super Admin", "Admin", "Finance Manager"]
      },
    ],
  },
];

function NavIcon({ icon }: { icon: string }) {
  const props = {
    width: 18, height: 18, viewBox: "0 0 18 18", fill: "none",
    stroke: "currentColor", strokeWidth: 1.5,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "dashboard":
      return <svg {...props}><path d="M6.765 2.12866L2.7225 5.27866C2.0475 5.80366 1.5 6.92116 1.5 7.76866V13.3262C1.5 15.0662 2.9175 16.4912 4.6575 16.4912H13.3425C15.0825 16.4912 16.5 15.0662 16.5 13.3337V7.87366C16.5 6.96616 15.8925 5.80366 15.15 5.28616L10.515 2.03866C9.465 1.30366 7.7775 1.34116 6.765 2.12866Z" /><path d="M9 13.4922V11.2422" /></svg>;
    case "analytics":
      return <svg {...props}><path d="M3.015 4.4775C2.0625 5.7375 1.5 7.305 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5" /><path d="M3.75 9C3.75 11.9025 6.0975 14.25 9 14.25C11.9025 14.25 14.25 11.9025 14.25 9C14.25 6.0975 11.9025 3.75 9 3.75" /><path d="M9 12C10.6575 12 12 10.6575 12 9C12 7.3425 10.6575 6 9 6" /></svg>;
    case "audit":
      return <svg {...props} strokeMiterlimit={10}><path d="M7.5 4.5H10.5C12 4.5 12 3.75 12 3C12 1.5 11.25 1.5 10.5 1.5H7.5C6.75 1.5 6 1.5 6 3C6 4.5 6.75 4.5 7.5 4.5Z" /><path d="M12 3.01562C14.4975 3.15062 15.75 4.07312 15.75 7.50062V12.0006C15.75 15.0006 15 16.5006 11.25 16.5006H6.75C3 16.5006 2.25 15.0006 2.25 12.0006V7.50062C2.25 4.08062 3.5025 3.15062 6 3.01562" /></svg>;
    case "ticket":
      return <svg {...props}><path d="M14.625 9.375C14.625 8.34 15.465 7.5 16.5 7.5V6.75C16.5 3.75 15.75 3 12.75 3H5.25C2.25 3 1.5 3.75 1.5 6.75V7.125C2.535 7.125 3.375 7.965 3.375 9C3.375 10.035 2.535 10.875 1.5 10.875V11.25C1.5 14.25 2.25 15 5.25 15H12.75C15.75 15 16.5 14.25 16.5 11.25C15.465 11.25 14.625 10.41 14.625 9.375Z" /><path d="M7.5 3L7.5 15" strokeDasharray="5 5" /></svg>;
    case "vehicles":
      return <svg {...props}><path d="M11.6325 2.12109H6.3675C4.5 2.12109 4.0875 3.05109 3.8475 4.19109L3 8.24859H15L14.1525 4.19109C13.9125 3.05109 13.5 2.12109 11.6325 2.12109Z" /><path d="M16.4916 14.865C16.5741 15.7425 15.8691 16.5 14.9691 16.5H13.5591C12.7491 16.5 12.6366 16.155 12.4941 15.7275L12.3441 15.2775C12.1341 14.6625 11.9991 14.25 10.9191 14.25H7.07907C5.99907 14.25 5.84157 14.715 5.65407 15.2775L5.50407 15.7275C5.36157 16.155 5.24907 16.5 4.43907 16.5H3.02907C2.12907 16.5 1.42407 15.7425 1.50657 14.865L1.92657 10.2975C2.03157 9.1725 2.24907 8.25 4.21407 8.25H13.7841C15.7491 8.25 15.9666 9.1725 16.0716 10.2975L16.4916 14.865Z" /><path d="M3 6H2.25" /><path d="M15.75 6H15" /><path d="M9 2.25V3.75" /><path d="M7.875 3.75H10.125" /><path d="M4.5 11.25H6.75" /><path d="M11.25 11.25H13.5" /></svg>;
    case "bookings":
      return <svg {...props} strokeMiterlimit={10}><path d="M6 1.5V3.75" /><path d="M12 1.5V3.75" /><path d="M2.625 6.81641H15.375" /><path d="M15.75 6.375V12.75C15.75 15 14.625 16.5 12 16.5H6C3.375 16.5 2.25 15 2.25 12.75V6.375C2.25 4.125 3.375 2.625 6 2.625H12C14.625 2.625 15.75 4.125 15.75 6.375Z" /><path d="M8.99588 10.2734H9.00262" /><path d="M6.22244 10.2734H6.22918" /><path d="M6.22244 12.5234H6.22918" /></svg>;
    case "notification":
      return <svg {...props} strokeMiterlimit={10}><path d="M9.01494 2.18359C6.53244 2.18359 4.51494 4.20109 4.51494 6.68359V8.85109C4.51494 9.30859 4.31994 10.0061 4.08744 10.3961L3.22494 11.8286C2.69244 12.7136 3.05994 13.6961 4.03494 14.0261C7.26744 15.1061 10.7549 15.1061 13.9874 14.0261C14.8949 13.7261 15.2924 12.6536 14.7974 11.8286L13.9349 10.3961C13.7099 10.0061 13.5149 9.30859 13.5149 8.85109V6.68359C13.5149 4.20859 11.4899 2.18359 9.01494 2.18359Z" /><path d="M10.4039 2.39812C10.1714 2.33062 9.93141 2.27812 9.68391 2.24812C8.96391 2.15812 8.27391 2.21062 7.62891 2.39812C7.84641 1.84312 8.38641 1.45312 9.01641 1.45312C9.64641 1.45312 10.1864 1.84312 10.4039 2.39812Z" /><path d="M11.2656 14.2969C11.2656 15.5344 10.2531 16.5469 9.01562 16.5469C8.40062 16.5469 7.83062 16.2919 7.42562 15.8869C7.02062 15.4819 6.76562 14.9119 6.76562 14.2969" /></svg>;
    case "users":
      return <svg {...props}><path d="M6.86797 8.1525C6.79297 8.145 6.70297 8.145 6.62047 8.1525C4.83547 8.0925 3.41797 6.63 3.41797 4.83C3.41797 2.9925 4.90297 1.5 6.74797 1.5C8.58547 1.5 10.078 2.9925 10.078 4.83C10.0705 6.63 8.65297 8.0925 6.86797 8.1525Z" /><path d="M12.3084 3C13.7634 3 14.9334 4.1775 14.9334 5.625C14.9334 7.0425 13.8084 8.1975 12.4059 8.25C12.3459 8.2425 12.2784 8.2425 12.2109 8.25" /><path d="M3.11906 10.92C1.30406 12.135 1.30406 14.115 3.11906 15.3225C5.18156 16.7025 8.56406 16.7025 10.6266 15.3225C12.4416 14.1075 12.4416 12.1275 10.6266 10.92C8.57156 9.5475 5.18906 9.5475 3.11906 10.92Z" /><path d="M13.7539 15C14.2939 14.8875 14.8039 14.67 15.2239 14.3475C16.3939 13.47 16.3939 12.0225 15.2239 11.145C14.8114 10.83 14.3089 10.62 13.7764 10.5" /></svg>;
    case "reviews":
      return <svg {...props}><path d="M9.9735 6.08172L10.9635 8.06172C11.0985 8.33172 11.4585 8.60172 11.7585 8.64672L13.551 8.94671C14.6985 9.14171 14.9685 9.96672 14.1435 10.7917L12.7485 12.1867C12.516 12.4192 12.381 12.8767 12.456 13.2067L12.8535 14.9392C13.1685 16.3042 12.441 16.8367 11.2335 16.1242L9.5535 15.1267C9.246 14.9467 8.75102 14.9467 8.44352 15.1267L6.7635 16.1242C5.556 16.8367 4.8285 16.3042 5.1435 14.9392L5.54102 13.2067C5.61602 12.8842 5.48101 12.4267 5.24851 12.1867L3.85352 10.7917C3.02852 9.96672 3.2985 9.13421 4.446 8.94671L6.23852 8.64672C6.53852 8.59422 6.89851 8.33172 7.03351 8.06172L8.02352 6.08172C8.55602 5.00922 9.441 5.00922 9.9735 6.08172Z" /><path d="M4.5 6.75V1.5" /><path d="M13.5 6.75V1.5" /><path d="M9 3V1.5" /></svg>;
    case "payments":
      return <svg {...props} strokeMiterlimit={10}><path d="M14.4737 5.9406V9.80312C14.4737 12.1131 13.1538 13.1031 11.1738 13.1031H4.58125C4.24375 13.1031 3.92125 13.0731 3.62125 13.0056C3.43375 12.9756 3.25375 12.9231 3.08875 12.8631C1.96375 12.4431 1.28125 11.4681 1.28125 9.80312V5.9406C1.28125 3.6306 2.60125 2.64062 4.58125 2.64062H11.1738C12.8538 2.64062 14.0612 3.35312 14.3837 4.98062C14.4362 5.28062 14.4737 5.5881 14.4737 5.9406Z" /><path d="M16.7236 8.19044V12.053C16.7236 14.363 15.4036 15.3529 13.4236 15.3529H6.83109C6.27609 15.3529 5.7736 15.278 5.3386 15.113C4.4461 14.783 3.83859 14.1005 3.62109 13.0055C3.92109 13.073 4.24359 13.1029 4.58109 13.1029H11.1736C13.1536 13.1029 14.4736 12.113 14.4736 9.80296V5.94044C14.4736 5.58794 14.4436 5.27297 14.3836 4.98047C15.8086 5.28047 16.7236 6.28544 16.7236 8.19044Z" /><path d="M7.87064 9.85455C8.96416 9.85455 9.85065 8.96807 9.85065 7.87454C9.85065 6.78102 8.96416 5.89453 7.87064 5.89453C6.77711 5.89453 5.89062 6.78102 5.89062 7.87454C5.89062 8.96807 6.77711 9.85455 7.87064 9.85455Z" /><path d="M3.58203 6.22656V9.52658" /><path d="M12.1641 6.22656V9.52658" /></svg>;
    case "refunds":
      return <svg {...props} strokeMiterlimit={10}><path d="M1.5 8.25V6.75C1.5 4.125 3 3 5.25 3H12.75C15 3 16.5 4.125 16.5 6.75V11.25C16.5 13.875 15 15 12.75 15H9" /><path d="M9 10.875C10.0355 10.875 10.875 10.0355 10.875 9C10.875 7.96447 10.0355 7.125 9 7.125C7.96447 7.125 7.125 7.96447 7.125 9C7.125 10.0355 7.96447 10.875 9 10.875Z" /><path d="M13.875 7.125V10.875" /><path d="M1.5 11.625H5.50502C5.98502 11.625 6.375 12.015 6.375 12.495V13.455" /><path d="M2.41498 10.7109L1.5 11.6259L2.41498 12.5409" /><path d="M6.375 15.5859H2.36998C1.88998 15.5859 1.5 15.1958 1.5 14.7158V13.7559" /><path d="M5.46094 16.5019L6.37592 15.5869L5.46094 14.6719" /></svg>;
    case "teams":
      return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "drivers":
      return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /><path d="M10 14l2 3 2-3" /></svg>;
    case "customers":
      return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case "settings":
      return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    default:
      return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>;
  }
}


export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [usersExpanded, setUsersExpanded] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("drifully_admin_user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) { }
    }
  }, []);

  const currentRole = (currentUser?.user_type || ADMIN_USER.role) as AdminRole;

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

  const getInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const name = currentUser?.full_name || ADMIN_USER.name;
  const email = currentUser?.email || ADMIN_USER.email;
  const profilePic = currentUser?.profile?.profile_picture;
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
        {/* <div className={styles.logo}>
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
        </div> */}
        <div className={styles.logo}>
          {/* <Image src="/logo.svg" alt="Drifully" width={150} height={150} /> */}
          <svg width="199" height="62" viewBox="0 0 199 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.94922 30.6917L20.79 3.63037H179.198L195.039 30.6917L179.198 57.7531H20.79L4.94922 30.6917Z" fill="white" stroke="#111111" stroke-width="2.64013" />
            <path d="M45.0647 40.605H38.2006L41.3715 21.5048H48.1051C50.0263 21.5048 51.6211 21.8965 52.8894 22.6799C54.164 23.4633 55.0625 24.5856 55.5847 26.0467C56.107 27.5016 56.2003 29.2394 55.8645 31.2601C55.5412 33.2124 54.8977 34.888 53.934 36.2869C52.9703 37.6796 51.7361 38.7491 50.2314 39.4952C48.7268 40.235 47.0046 40.605 45.0647 40.605ZM42.8171 37.1449H45.2979C46.4978 37.1449 47.5486 36.9211 48.4501 36.4734C49.3579 36.0258 50.1009 35.3356 50.6791 34.403C51.2636 33.4704 51.677 32.2766 51.9195 30.8217C52.1495 29.4415 52.134 28.3223 51.8729 27.4643C51.618 26.6001 51.1237 25.969 50.39 25.5711C49.6563 25.1669 48.6926 24.9648 47.4989 24.9648H44.8409L42.8171 37.1449ZM57.3077 40.605L60.4787 21.5048H68.0143C69.4567 21.5048 70.6443 21.7597 71.5769 22.2696C72.5158 22.7794 73.1748 23.5037 73.5541 24.4426C73.9396 25.3752 74.0297 26.4757 73.8245 27.7441C73.6132 29.0124 73.1562 30.1005 72.4536 31.0083C71.7572 31.916 70.8495 32.6155 69.7303 33.1067C68.6174 33.5916 67.3273 33.8341 65.8599 33.8341H60.8144L61.374 30.5886H65.7573C66.5283 30.5886 67.1874 30.4829 67.7345 30.2715C68.2816 30.0601 68.7138 29.743 69.0309 29.3202C69.3542 28.8974 69.5656 28.372 69.665 27.7441C69.7707 27.1037 69.7334 26.569 69.5531 26.14C69.3728 25.7047 69.0464 25.3752 68.5739 25.1514C68.1013 24.9213 67.4796 24.8063 66.7086 24.8063H63.9853L61.346 40.605H57.3077ZM69.0588 31.9129L72.3697 40.605H67.9117L64.7035 31.9129H69.0588ZM81.9057 21.5048L78.7348 40.605H74.6965L77.8675 21.5048H81.9057ZM82.0573 40.605L85.2282 21.5048H97.8746L97.3151 24.8343H88.7069L87.9608 29.3855H95.7296L95.17 32.715H87.4012L86.0956 40.605H82.0573ZM112.389 21.5048H116.427L114.375 33.9087C114.145 35.3014 113.613 36.5201 112.78 37.5646C111.947 38.6092 110.887 39.4237 109.6 40.0081C108.313 40.5863 106.877 40.8754 105.291 40.8754C103.706 40.8754 102.369 40.5863 101.281 40.0081C100.193 39.4237 99.4065 38.6092 98.9215 37.5646C98.4365 36.5201 98.3091 35.3014 98.5391 33.9087L100.591 21.5048H104.629L102.624 33.5637C102.512 34.2911 102.568 34.9377 102.792 35.5035C103.022 36.0693 103.401 36.5139 103.93 36.8372C104.458 37.1605 105.111 37.3221 105.888 37.3221C106.672 37.3221 107.38 37.1605 108.015 36.8372C108.655 36.5139 109.18 36.0693 109.591 35.5035C110.007 34.9377 110.272 34.2911 110.383 33.5637L112.389 21.5048ZM116.578 40.605L119.749 21.5048H123.788L121.176 37.2755H129.365L128.805 40.605H116.578ZM131.479 40.605L134.65 21.5048H138.689L136.077 37.2755H144.266L143.706 40.605H131.479ZM145.996 21.5048H150.519L153.513 29.7306H153.718L159.416 21.5048H163.939L154.93 33.8528L153.802 40.605H149.792L150.92 33.8528L145.996 21.5048Z" fill="#111111" />
          </svg>
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
                              { label: "Teams", href: "/admin/teams", icon: "teams", allowedRoles: ["Super Admin", "Admin"] },
                              { label: "Drivers", href: "/admin/drivers", icon: "drivers", allowedRoles: ["Super Admin", "Admin", "Customer Engagement"] },
                              { label: "Customers", href: "/admin/customers", icon: "customers", allowedRoles: ["Super Admin", "Admin", "Customer Engagement"] },
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
            {hasProfilePic ? (
              <Image
                src={profilePic}
                alt={name}
                width={40}
                height={40}
                className={styles.avatarImg}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "14px", flexShrink: 0 }}>
                {getInitials(name)}
              </div>
            )}
          </div>
          {!collapsed && (
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>
                {name}
                <Image
                  src="/images/admin/profile-checkmark.svg"
                  alt="Verified"
                  width={14}
                  height={14}
                  className={styles.verifiedBadge}
                />
              </div>
              <span className={styles.profileEmail}>{email}</span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', marginLeft: 'auto' }}
              title="Logout"
              aria-label="Logout"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          )}
        </div>
      </aside>

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
    </>
  );
}
