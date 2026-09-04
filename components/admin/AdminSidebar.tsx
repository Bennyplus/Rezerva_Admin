"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_USER, AdminRole } from "@/data/admin-mock";
import ConfirmActionModal from "./ConfirmActionModal";
import { accountsService } from "@/services/accounts-service";
import styles from "./AdminSidebar.module.css";

/* ─── Navigation structure ─── */
interface NavItem {
  label: string;
  href: string;
  icon: string;
  allowedRoles: AdminRole[];
  children?: {
    label: string;
    href: string;
    icon?: string;
    allowedRoles: AdminRole[];
  }[];
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
        allowedRoles: [
          "Super Admin",
          "Admin",
          "Fleet Manager",
          "Operations Manager",
          "Customer Engagement",
          "Finance Manager",
        ],
      },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: "analytics",
        allowedRoles: [
          "Super Admin",
          "Admin",
          "Fleet Manager",
          "Operations Manager",
          "Customer Engagement",
          "Finance Manager",
        ],
      },
      {
        label: "Audit Logs",
        href: "/admin/audit-logs",
        icon: "audit",
        allowedRoles: ["Super Admin", "Admin"],
      },
      {
        label: "Tickets",
        href: "/admin/tickets",
        icon: "ticket",
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"],
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Trips",
        href: "/admin/trips",
        icon: "trips",
        allowedRoles: [
          "Super Admin",
          "Admin",
          "Fleet Manager",
          "Operations Manager",
        ],
        children: [
          {
            label: "Vehicles",
            href: "/admin/vehicles",
            allowedRoles: ["Super Admin", "Admin", "Fleet Manager"],
          },
          {
            label: "Rides",
            href: "/admin/rides",
            allowedRoles: ["Super Admin", "Admin", "Operations Manager"],
          },
          {
            label: "Bookings",
            href: "/admin/bookings",
            allowedRoles: [
              "Super Admin",
              "Admin",
              "Operations Manager",
              "Fleet Manager",
            ],
          },
        ],
      },
      {
        label: "Notifications",
        href: "/admin/notifications",
        icon: "notification",
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"],
      },
      {
        label: "Promotions",
        href: "/admin/promotions",
        icon: "promotions",
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"],
      },
      {
        label: "Content",
        href: "/admin/content",
        icon: "content",
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"],
      },
      {
        label: "Safety",
        href: "/admin/safety",
        icon: "safety",
        allowedRoles: [
          "Super Admin",
          "Admin",
          "Customer Engagement",
          "Operations Manager",
        ],
        children: [
          {
            label: "Support Center",
            href: "/admin/support-center",
            allowedRoles: ["Super Admin", "Admin", "Customer Engagement"],
          },
          {
            label: "Reports",
            href: "/admin/reports",
            allowedRoles: [
              "Super Admin",
              "Admin",
              "Customer Engagement",
              "Operations Manager",
            ],
          },
          {
            label: "Emergency Incidents",
            href: "/admin/emergency-incidents",
            allowedRoles: [
              "Super Admin",
              "Admin",
              "Customer Engagement",
              "Operations Manager",
            ],
          },
        ],
      },
    ],
  },
  {
    label: "Users",
    items: [
      {
        label: "Referrals",
        href: "/admin/referrals",
        icon: "referrals",
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"],
      },
      {
        label: "Reviews Ratings",
        href: "/admin/reviews",
        icon: "reviews",
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"],
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: "users",
        allowedRoles: ["Super Admin", "Admin", "Customer Engagement"],
        children: [
          {
            label: "Teams",
            href: "/admin/teams",
            allowedRoles: ["Super Admin", "Admin"],
          },
          {
            label: "Drivers",
            href: "/admin/drivers",
            allowedRoles: ["Super Admin", "Admin", "Customer Engagement"],
          },
          {
            label: "Customers",
            href: "/admin/customers",
            allowedRoles: ["Super Admin", "Admin", "Customer Engagement"],
          },
        ],
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
        allowedRoles: ["Super Admin", "Admin", "Finance Manager"],
      },
      {
        label: "Wallet",
        href: "/admin/wallet",
        icon: "wallet",
        allowedRoles: ["Super Admin", "Admin", "Finance Manager"],
      },
    ],
  },
];

function NavIcon({ icon }: { icon: string }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "dashboard":
      return (
        <svg {...props}>
          <path d="M6.765 2.12866L2.7225 5.27866C2.0475 5.80366 1.5 6.92116 1.5 7.76866V13.3262C1.5 15.0662 2.9175 16.4912 4.6575 16.4912H13.3425C15.0825 16.4912 16.5 15.0662 16.5 13.3337V7.87366C16.5 6.96616 15.8925 5.80366 15.15 5.28616L10.515 2.03866C9.465 1.30366 7.7775 1.34116 6.765 2.12866Z" />
          <path d="M9 13.4922V11.2422" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...props}>
          <path d="M3.015 4.4775C2.0625 5.7375 1.5 7.305 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5" />
          <path d="M3.75 9C3.75 11.9025 6.0975 14.25 9 14.25C11.9025 14.25 14.25 11.9025 14.25 9C14.25 6.0975 11.9025 3.75 9 3.75" />
          <path d="M9 12C10.6575 12 12 10.6575 12 9C12 7.3425 10.6575 6 9 6" />
        </svg>
      );
    case "audit":
      return (
        <svg {...props} strokeMiterlimit={10}>
          <path d="M7.5 4.5H10.5C12 4.5 12 3.75 12 3C12 1.5 11.25 1.5 10.5 1.5H7.5C6.75 1.5 6 1.5 6 3C6 4.5 6.75 4.5 7.5 4.5Z" />
          <path d="M12 3.01562C14.4975 3.15062 15.75 4.07312 15.75 7.50062V12.0006C15.75 15.0006 15 16.5006 11.25 16.5006H6.75C3 16.5006 2.25 15.0006 2.25 12.0006V7.50062C2.25 4.08062 3.5025 3.15062 6 3.01562" />
        </svg>
      );
    case "ticket":
      return (
        <svg {...props}>
          <path d="M14.625 9.375C14.625 8.34 15.465 7.5 16.5 7.5V6.75C16.5 3.75 15.75 3 12.75 3H5.25C2.25 3 1.5 3.75 1.5 6.75V7.125C2.535 7.125 3.375 7.965 3.375 9C3.375 10.035 2.535 10.875 1.5 10.875V11.25C1.5 14.25 2.25 15 5.25 15H12.75C15.75 15 16.5 14.25 16.5 11.25C15.465 11.25 14.625 10.41 14.625 9.375Z" />
          <path d="M7.5 3L7.5 15" strokeDasharray="5 5" />
        </svg>
      );
    case "trips":
    case "vehicles":
      return (
        <svg {...props}>
          <path d="M11.6325 2.12109H6.3675C4.5 2.12109 4.0875 3.05109 3.8475 4.19109L3 8.24859H15L14.1525 4.19109C13.9125 3.05109 13.5 2.12109 11.6325 2.12109Z" />
          <path d="M16.4916 14.865C16.5741 15.7425 15.8691 16.5 14.9691 16.5H13.5591C12.7491 16.5 12.6366 16.155 12.4941 15.7275L12.3441 15.2775C12.1341 14.6625 11.9991 14.25 10.9191 14.25H7.07907C5.99907 14.25 5.84157 14.715 5.65407 15.2775L5.50407 15.7275C5.36157 16.155 5.24907 16.5 4.43907 16.5H3.02907C2.12907 16.5 1.42407 15.7425 1.50657 14.865L1.92657 10.2975C2.03157 9.1725 2.24907 8.25 4.21407 8.25H13.7841C15.7491 8.25 15.9666 9.1725 16.0716 10.2975L16.4916 14.865Z" />
          <path d="M3 6H2.25" />
          <path d="M15.75 6H15" />
          <path d="M9 2.25V3.75" />
          <path d="M7.875 3.75H10.125" />
          <path d="M4.5 11.25H6.75" />
          <path d="M11.25 11.25H13.5" />
        </svg>
      );
    case "bookings":
      return (
        <svg {...props} strokeMiterlimit={10}>
          <path d="M6 1.5V3.75" />
          <path d="M12 1.5V3.75" />
          <path d="M2.625 6.81641H15.375" />
          <path d="M15.75 6.375V12.75C15.75 15 14.625 16.5 12 16.5H6C3.375 16.5 2.25 15 2.25 12.75V6.375C2.25 4.125 3.375 2.625 6 2.625H12C14.625 2.625 15.75 4.125 15.75 6.375Z" />
          <path d="M8.99588 10.2734H9.00262" />
          <path d="M6.22244 10.2734H6.22918" />
          <path d="M6.22244 12.5234H6.22918" />
        </svg>
      );
    case "notification":
      return (
        <svg {...props} strokeMiterlimit={10}>
          <path d="M9.01494 2.18359C6.53244 2.18359 4.51494 4.20109 4.51494 6.68359V8.85109C4.51494 9.30859 4.31994 10.0061 4.08744 10.3961L3.22494 11.8286C2.69244 12.7136 3.05994 13.6961 4.03494 14.0261C7.26744 15.1061 10.7549 15.1061 13.9874 14.0261C14.8949 13.7261 15.2924 12.6536 14.7974 11.8286L13.9349 10.3961C13.7099 10.0061 13.5149 9.30859 13.5149 8.85109V6.68359C13.5149 4.20859 11.4899 2.18359 9.01494 2.18359Z" />
          <path d="M10.4039 2.39812C10.1714 2.33062 9.93141 2.27812 9.68391 2.24812C8.96391 2.15812 8.27391 2.21062 7.62891 2.39812C7.84641 1.84312 8.38641 1.45312 9.01641 1.45312C9.64641 1.45312 10.1864 1.84312 10.4039 2.39812Z" />
          <path d="M11.2656 14.2969C11.2656 15.5344 10.2531 16.5469 9.01562 16.5469C8.40062 16.5469 7.83062 16.2919 7.42562 15.8869C7.02062 15.4819 6.76562 14.9119 6.76562 14.2969" />
        </svg>
      );
    case "promotions":
      return (
        <svg {...props}>
          <rect x="2.5" y="2.5" width="13" height="13" rx="2.5" />
          <path d="M6 12V6M9 13.5V4.5M12 11V7" />
        </svg>
      );
    case "content":
      return (
        <svg {...props}>
          <rect x="2.5" y="2.5" width="13" height="13" rx="2.5" />
          <path d="M6.5 6.5H11.5M6.5 10.5H9.5" />
        </svg>
      );
    case "safety":
      return (
        <svg {...props}>
          <path d="M9 1.5l6 3v5.25c0 3.75-2.625 7.125-6 8.25-3.375-1.125-6-4.5-6-8.25V4.5l6-3z" />
        </svg>
      );
    case "referrals":
      return (
        <svg {...props} viewBox="0 0 18 18">
          <path
            d="M6.87187 8.1525C6.79687 8.145 6.70687 8.145 6.62437 8.1525C4.83937 8.0925 3.42188 6.63 3.42188 4.83C3.42187 2.9925 4.90687 1.5 6.75187 1.5C8.58937 1.5 10.0819 2.9925 10.0819 4.83C10.0744 6.63 8.65687 8.0925 6.87187 8.1525Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.3084 3C13.7634 3 14.9334 4.1775 14.9334 5.625C14.9334 7.0425 13.8084 8.1975 12.4059 8.25C12.3459 8.2425 12.2784 8.2425 12.2109 8.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.11906 10.92C1.30406 12.135 1.30406 14.115 3.11906 15.3225C5.18156 16.7025 8.56406 16.7025 10.6266 15.3225C12.4416 14.1075 12.4416 12.1275 10.6266 10.92C8.57156 9.5475 5.18906 9.5475 3.11906 10.92Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.7578 15C14.2978 14.8875 14.8078 14.67 15.2278 14.3475C16.3978 13.47 16.3978 12.0225 15.2278 11.145C14.8153 10.83 14.3128 10.62 13.7803 10.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <path d="M6.86797 8.1525C6.79297 8.145 6.70297 8.145 6.62047 8.1525C4.83547 8.0925 3.41797 6.63 3.41797 4.83C3.41797 2.9925 4.90297 1.5 6.74797 1.5C8.58547 1.5 10.078 2.9925 10.078 4.83C10.0705 6.63 8.65297 8.0925 6.86797 8.1525Z" />
          <path d="M12.3084 3C13.7634 3 14.9334 4.1775 14.9334 5.625C14.9334 7.0425 13.8084 8.1975 12.4059 8.25C12.3459 8.2425 12.2784 8.2425 12.2109 8.25" />
          <path d="M3.11906 10.92C1.30406 12.135 1.30406 14.115 3.11906 15.3225C5.18156 16.7025 8.56406 16.7025 10.6266 15.3225C12.4416 14.1075 12.4416 12.1275 10.6266 10.92C8.57156 9.5475 5.18906 9.5475 3.11906 10.92Z" />
          <path d="M13.7539 15C14.2939 14.8875 14.8039 14.67 15.2239 14.3475C16.3939 13.47 16.3939 12.0225 15.2239 11.145C14.8114 10.83 14.3089 10.62 13.7764 10.5" />
        </svg>
      );
    case "reviews":
      return (
        <svg {...props}>
          <path d="M9.9735 6.08172L10.9635 8.06172C11.0985 8.33172 11.4585 8.60172 11.7585 8.64672L13.551 8.94671C14.6985 9.14171 14.9685 9.96672 14.1435 10.7917L12.7485 12.1867C12.516 12.4192 12.381 12.8767 12.456 13.2067L12.8535 14.9392C13.1685 16.3042 12.441 16.8367 11.2335 16.1242L9.5535 15.1267C9.246 14.9467 8.75102 14.9467 8.44352 15.1267L6.7635 16.1242C5.556 16.8367 4.8285 16.3042 5.1435 14.9392L5.54102 13.2067C5.61602 12.8842 5.48101 12.4267 5.24851 12.1867L3.85352 10.7917C3.02852 9.96672 3.2985 9.13421 4.446 8.94671L6.23852 8.64672C6.53852 8.59422 6.89851 8.33172 7.03351 8.06172L8.02352 6.08172C8.55602 5.00922 9.441 5.00922 9.9735 6.08172Z" />
          <path d="M4.5 6.75V1.5" />
          <path d="M13.5 6.75V1.5" />
          <path d="M9 3V1.5" />
        </svg>
      );
    case "payments":
      return (
        <svg {...props} strokeMiterlimit={10}>
          <path d="M14.4737 5.9406V9.80312C14.4737 12.1131 13.1538 13.1031 11.1738 13.1031H4.58125C4.24375 13.1031 3.92125 13.0731 3.62125 13.0056C3.43375 12.9756 3.25375 12.9231 3.08875 12.8631C1.96375 12.4431 1.28125 11.4681 1.28125 9.80312V5.9406C1.28125 3.6306 2.60125 2.64062 4.58125 2.64062H11.1738C12.8538 2.64062 14.0612 3.35312 14.3837 4.98062C14.4362 5.28062 14.4737 5.5881 14.4737 5.9406Z" />
          <path d="M16.7236 8.19044V12.053C16.7236 14.363 15.4036 15.3529 13.4236 15.3529H6.83109C6.27609 15.3529 5.7736 15.278 5.3386 15.113C4.4461 14.783 3.83859 14.1005 3.62109 13.0055C3.92109 13.073 4.24359 13.1029 4.58109 13.1029H11.1736C13.1536 13.1029 14.4736 12.113 14.4736 9.80296V5.94044C14.4736 5.58794 14.4436 5.27297 14.3836 4.98047C15.8086 5.28047 16.7236 6.28544 16.7236 8.19044Z" />
          <path d="M7.87064 9.85455C8.96416 9.85455 9.85065 8.96807 9.85065 7.87454C9.85065 6.78102 8.96416 5.89453 7.87064 5.89453C6.77711 5.89453 5.89062 6.78102 5.89062 7.87454C5.89062 8.96807 6.77711 9.85455 7.87064 9.85455Z" />
          <path d="M3.58203 6.22656V9.52658" />
          <path d="M12.1641 6.22656V9.52658" />
        </svg>
      );
    case "wallet":
    case "refunds":
      return (
        <svg {...props}>
          <path d="M9.75 8.36328H5.25" />
          <path d="M1.5 8.3614V4.89641C1.5 3.36641 2.7375 2.12891 4.2675 2.12891H8.4825C10.0125 2.12891 11.25 3.0814 11.25 4.6114" />
          <path d="M13.11 9.15077C12.735 9.51077 12.555 10.0658 12.705 10.6358C12.8925 11.3333 13.5825 11.7758 14.3025 11.7758H15V12.8633C15 14.5208 13.6575 15.8633 12 15.8633H4.5C2.8425 15.8633 1.5 14.5208 1.5 12.8633V7.61328C1.5 5.95578 2.8425 4.61328 4.5 4.61328H12C13.65 4.61328 15 5.96328 15 7.61328V8.70074H14.19C13.77 8.70074 13.3875 8.86577 13.11 9.15077Z" />
          <path d="M16.5031 9.46423V11.0092C16.5031 11.4292 16.1581 11.7742 15.7306 11.7742H14.2831C13.4731 11.7742 12.7306 11.1817 12.6631 10.3717C12.6181 9.89925 12.7981 9.45675 13.1131 9.14925C13.3906 8.86425 13.7731 8.69922 14.1931 8.69922H15.7306C16.1581 8.69922 16.5031 9.04423 16.5031 9.46423Z" />
        </svg>
      );
    case "logout":
      return (
        <svg {...props}>
          <path d="M6.75 15.75H3.75C2.51 15.75 1.5 14.74 1.5 13.5V4.5C1.5 3.26 2.51 2.25 3.75 2.25H6.75" />
          <polyline points="12 12.75 15.75 9 12 5.25" />
          <line x1="15.75" y1="9" x2="6.75" y2="9" />
        </svg>
      );
    default:
      return (
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    trips: false,
    safety: false,
    users: true,
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem("drifully_admin_user");
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {}
      }
    };
    loadUser();
    window.addEventListener("admin-user-updated", loadUser);
    return () => window.removeEventListener("admin-user-updated", loadUser);
  }, []);

  const currentRole = (currentUser?.user_type || ADMIN_USER.role) as AdminRole;

  // Filter sections and items based on role permissions
  const visibleSections = useMemo(() => {
    return NAV_SECTIONS.map((section) => {
      const filteredItems = section.items
        .map((item) => {
          if (item.children) {
            const filteredChildren = item.children.filter((child) =>
              child.allowedRoles.includes(currentRole),
            );
            return {
              ...item,
              children: filteredChildren,
            };
          }
          return item;
        })
        .filter((item) => {
          if (item.children) {
            return item.children.length > 0;
          }
          return item.allowedRoles.includes(currentRole);
        });

      return {
        ...section,
        items: filteredItems,
      };
    }).filter((section) => section.items.length > 0);
  }, [currentRole]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  // Keep collapsible sections open if a child is active
  useEffect(() => {
    const newExpanded = { ...expandedItems };
    let changed = false;

    visibleSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some((child) =>
            isActive(child.href),
          );
          const key = item.label.toLowerCase();
          if (hasActiveChild && !newExpanded[key]) {
            newExpanded[key] = true;
            changed = true;
          }
        }
      });
    });

    if (changed) {
      setExpandedItems(newExpanded);
    }
  }, [pathname, visibleSections]);

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* Close mobile sidebar on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Prevent scroll when mobile sidebar is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const getInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const name = currentUser?.full_name || ADMIN_USER.name;
  const email = currentUser?.email || ADMIN_USER.email;
  const profilePic =
    currentUser?.profile?.profile_picture || currentUser?.profile_picture;
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
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
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
              src="/REZARVA.svg"
              alt="REZARVA Logo"
              width={130}
              height={26}
              priority
              style={{ width: "auto", height: "26px" }}
            />
          </Link>
        </div>

        {/* Search */}
        <div className={styles.search}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={styles.searchIcon}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
                    {item.children ? (
                      /* Collapsible Menu Group */
                      <>
                        <button
                          className={`${styles.navItem} ${styles.navItemBtn}`}
                          id={`admin-nav-${item.icon}`}
                          onClick={() => toggleExpand(item.label.toLowerCase())}
                        >
                          <NavIcon icon={item.icon} />
                          {!collapsed && <span>{item.label}</span>}
                          {!collapsed && (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              className={`${styles.chevron} ${
                                expandedItems[item.label.toLowerCase()]
                                  ? styles.chevronOpen
                                  : ""
                              }`}
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          )}
                        </button>

                        {/* Collapsible Sub Items */}
                        {expandedItems[item.label.toLowerCase()] &&
                          !collapsed && (
                            <ul className={styles.subNavList}>
                              {item.children.map((sub) => (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className={`${styles.subNavItem} ${isActive(sub.href) ? styles.navItemActive : ""}`}
                                    id={`admin-nav-${sub.label.toLowerCase().replace(/\s+/g, "-")}`}
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                      </>
                    ) : (
                      /* Standalone Menu Link */
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

          {/* Dedicated Logout option */}
          <div
            className={styles.section}
            style={{
              borderTop: "1px solid var(--admin-sidebar-border, #E2E4E9)",
              marginTop: "8px",
              paddingTop: "8px",
            }}
          >
            <ul className={styles.navList}>
              <li>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className={styles.navItem}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  id="admin-nav-logout"
                >
                  <NavIcon icon="logout" />
                  {!collapsed && <span>Logout</span>}
                </button>
              </li>
            </ul>
          </div>
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
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
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
