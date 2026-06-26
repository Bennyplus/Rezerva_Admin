import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminGuard from "@/components/admin/AdminGuard";
import { ToastProvider } from "@/lib/toast-context";
import { ToastContainer } from "@/components/admin/Toast";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Drifully Admin",
  },
  description: "Drifully admin dashboard — manage vehicles, bookings, users, and payments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className={styles.dashboard}>
        <AdminSidebar />
        <div className={styles.main}>
          <AdminTopbar />
          <main className={styles.content} id="admin-content">
            <AdminGuard>{children}</AdminGuard>
          </main>
        </div>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}

