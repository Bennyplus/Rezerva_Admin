"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import SupportTicketsTable, { SupportTab } from "@/components/admin/support-center/SupportTicketsTable";
import SupportTicketDetailView from "@/components/admin/support-center/SupportTicketDetailView";
import AssignTicketModal from "@/components/admin/support-center/modals/AssignTicketModal";
import ResolveTicketModal from "@/components/admin/support-center/modals/ResolveTicketModal";
import CloseTicketModal from "@/components/admin/support-center/modals/CloseTicketModal";
import EscalateTicketModal from "@/components/admin/support-center/modals/EscalateTicketModal";
import {
  supportCenterService,
  SupportTicket,
  SupportCenterSummary,
  BackendTicketItem,
} from "@/services/support-center-service";
import styles from "./support-center.module.css";

function extractStr(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val.name || val.location || val.address || "";
  return String(val);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

function formatStatus(st?: string): string {
  if (!st) return "Pending";
  const s = st.toLowerCase();
  if (s.includes("progress")) return "In Progress";
  if (s.includes("closed") || s === "closed") return "Closed";
  if (s.includes("resolve")) return "Resolved";
  if (s.includes("escalat")) return "Escalated";
  return "Pending";
}

function formatUserType(ut?: string): string {
  if (!ut) return "Customer";
  const u = ut.toUpperCase();
  if (u === "CUSTOMER") return "Customer";
  if (u === "ADMIN") return "Admin";
  if (u === "DRIVER") return "Driver";
  if (u === "PASSENGER") return "Passenger";
  return ut.charAt(0).toUpperCase() + ut.slice(1).toLowerCase();
}

export default function SupportCenterPage() {
  const [activeTab, setActiveTab] = useState<SupportTab>("All");
  const [summary, setSummary] = useState<SupportCenterSummary>({
    totalTickets: 0,
    totalOpenTickets: 0,
    totalEscalatedTickets: 0,
    totalResolvedTickets: 0,
  });
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [modalAssignTicket, setModalAssignTicket] = useState<SupportTicket | null>(null);
  const [modalResolveTicket, setModalResolveTicket] = useState<SupportTicket | null>(null);
  const [modalCloseTicket, setModalCloseTicket] = useState<SupportTicket | null>(null);
  const [modalEscalateTicket, setModalEscalateTicket] = useState<SupportTicket | null>(null);

  // 1. Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const stats = await supportCenterService.getStats();
      if (stats) {
        setSummary({
          totalTickets: stats.total_tickets ?? 0,
          totalOpenTickets: stats.total_open_tickets ?? 0,
          totalEscalatedTickets: stats.total_escalated_tickets ?? 0,
          totalResolvedTickets: stats.total_resolved_tickets ?? 0,
        });
      }
    } catch (err) {
      console.error("Failed to load support stats:", err);
    }
  }, []);

  // 2. Fetch Tickets per activeTab
  const fetchTickets = useCallback(async (tab: SupportTab) => {
    setIsLoading(true);
    try {
      const tabParam = tab === "Critical" ? "critical" : tab === "My Tickets" ? "my_tickets" : "all";
      const list = await supportCenterService.getTickets(tabParam);
      
      if (Array.isArray(list)) {
        const normalized: SupportTicket[] = list.map((item: BackendTicketItem, idx: number) => ({
          id: item.id || idx + 1,
          ticketId: item.ticket_number || item.ticket_id || `TIC-${String(idx + 1).padStart(3, "0")}`,
          user: extractStr(item.user_name || item.user),
          userType: formatUserType(item.user_type),
          ticketType: extractStr(item.category || item.ticket_type || "General"),
          priority: (item.priority as any) || "Low",
          assignedAdmin: item.assigned_to_name ? extractStr(item.assigned_to_name) : "—",
          status: formatStatus(item.status),
          createdOn: formatDate(item.created_at || item.created_on),
          customerName: extractStr(item.user_name || item.customer_name || item.user),
          customerAvatar: item.profile_picture || item.customer_avatar,
          category: extractStr(item.category || item.ticket_type),
          description: extractStr(item.description),
          resolutionNotes: extractStr(item.resolution_notes),
          evidenceName: extractStr(item.evidence_name),
          evidenceSize: extractStr(item.evidence_size),
          adminNotes: extractStr(item.admin_notes),
          raw: item,
        }));
        setTickets(normalized);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error("Failed to load tickets for tab:", tab, err);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchTickets(activeTab);
  }, [activeTab, fetchTickets]);

  const handleSelectTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    try {
      if (ticket.id) {
        const detail = await supportCenterService.getTicketDetails(ticket.id);
        if (detail) {
          setSelectedTicket((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              customerName: extractStr(detail.user_name || detail.customer_name || prev.customerName),
              customerPhone: extractStr(detail.customer_phone || detail.phone_number || prev.customerPhone),
              customerEmail: extractStr(detail.customer_email || detail.email || prev.customerEmail),
              customerAvatar: detail.profile_picture || prev.customerAvatar,
              category: extractStr(detail.category || prev.category),
              description: extractStr(detail.description || prev.description),
              resolutionNotes: extractStr(detail.resolution_notes || prev.resolutionNotes),
              evidenceName: extractStr(detail.evidence_name || prev.evidenceName),
              evidenceSize: extractStr(detail.evidence_size || prev.evidenceSize),
              adminNotes: extractStr(detail.admin_notes || prev.adminNotes),
              raw: detail,
            };
          });
        }
      }
    } catch (err) {
      console.error("Failed to load ticket details:", err);
    }
  };

  const handleAssign = async (ticket: SupportTicket, assignedTo: string | number, adminNotes?: string) => {
    const adminLabel = String(assignedTo) === "1" ? "Edward Prosper" : "Prosper Edward";
    setTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, assignedAdmin: adminLabel } : t))
    );
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket((prev) => (prev ? { ...prev, assignedAdmin: adminLabel } : null));
    }
    try {
      await supportCenterService.assignTicket(ticket.id, assignedTo, adminNotes);
      fetchStats();
      fetchTickets(activeTab);
    } catch (e) {
      console.error("Assign ticket failed:", e);
    }
  };

  const handleResolve = async (ticket: SupportTicket, notes: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, status: "Resolved", resolutionNotes: notes } : t))
    );
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: "Resolved", resolutionNotes: notes } : null));
    }
    try {
      await supportCenterService.resolveTicket(ticket.id, notes);
      fetchStats();
      fetchTickets(activeTab);
    } catch (e) {
      console.error("Resolve ticket failed:", e);
    }
  };

  const handleCloseTicket = async (ticket: SupportTicket, reason?: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, status: "Closed" } : t))
    );
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: "Closed" } : null));
    }
    try {
      await supportCenterService.closeTicket(ticket.id, reason);
      fetchStats();
      fetchTickets(activeTab);
    } catch (e) {
      console.error("Close ticket failed:", e);
    }
  };

  const handleEscalate = async (ticket: SupportTicket, reason: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, priority: "High" } : t))
    );
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket((prev) => (prev ? { ...prev, priority: "High" } : null));
    }
    try {
      await supportCenterService.escalateTicket(ticket.id, reason);
      fetchStats();
      fetchTickets(activeTab);
    } catch (e) {
      console.error("Escalate ticket failed:", e);
    }
  };

  if (selectedTicket) {
    return (
      <div className={styles.page}>
        <SupportTicketDetailView
          ticket={selectedTicket}
          onBack={() => setSelectedTicket(null)}
          onUpdateStatus={(st) => handleResolve(selectedTicket, st)}
          onOpenAssignModal={(t) => setModalAssignTicket(t)}
          onOpenResolveModal={(t) => setModalResolveTicket(t)}
          onOpenCloseModal={(t) => setModalCloseTicket(t)}
          onOpenEscalateModal={(t) => setModalEscalateTicket(t)}
        />

        <AssignTicketModal
          isOpen={!!modalAssignTicket}
          ticket={modalAssignTicket}
          onClose={() => setModalAssignTicket(null)}
          onAssign={handleAssign}
        />
        <ResolveTicketModal
          isOpen={!!modalResolveTicket}
          ticket={modalResolveTicket}
          onClose={() => setModalResolveTicket(null)}
          onResolve={handleResolve}
        />
        <CloseTicketModal
          isOpen={!!modalCloseTicket}
          ticket={modalCloseTicket}
          onClose={() => setModalCloseTicket(null)}
          onConfirmClose={handleCloseTicket}
        />
        <EscalateTicketModal
          isOpen={!!modalEscalateTicket}
          ticket={modalEscalateTicket}
          onClose={() => setModalEscalateTicket(null)}
          onEscalate={handleEscalate}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Top 4 Stat Cards ── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Tickets"
          value={summary.totalTickets ?? 0}
          id="stat-total-tickets"
        />
        <StatCard
          label="Total Open Tickets"
          value={summary.totalOpenTickets ?? 0}
          id="stat-total-open-tickets"
        />
        <StatCard
          label="Total Escalated Tickets"
          value={summary.totalEscalatedTickets ?? 0}
          id="stat-total-escalated-tickets"
        />
        <StatCard
          label="Total Resolved Tickets"
          value={summary.totalResolvedTickets ?? 0}
          id="stat-total-resolved-tickets"
        />
      </div>

      {/* ── Content View ── */}
      {isLoading ? (
        <div className={styles.loadingCard}>
          <Spinner size={36} color="#2F68FE" />
          <p className={styles.loadingSubtitle}>Loading support tickets…</p>
        </div>
      ) : tickets.length === 0 && summary.totalTickets === 0 ? (
        /* Screen 1: Inactive State (No Data) */
        <div className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No tickets available</h2>
          <p className={styles.emptySubtitle}>Support requests and reports will appear here</p>
        </div>
      ) : (
        /* Screen 2 & 3: Table View with Tabs */
        <SupportTicketsTable
          tickets={tickets}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSelectTicket={handleSelectTicket}
          onOpenAssignModal={(t) => setModalAssignTicket(t)}
          onOpenResolveModal={(t) => setModalResolveTicket(t)}
          onOpenCloseModal={(t) => setModalCloseTicket(t)}
          onOpenEscalateModal={(t) => setModalEscalateTicket(t)}
        />
      )}

      {/* ── Action Modals ── */}
      <AssignTicketModal
        isOpen={!!modalAssignTicket}
        ticket={modalAssignTicket}
        onClose={() => setModalAssignTicket(null)}
        onAssign={handleAssign}
      />
      <ResolveTicketModal
        isOpen={!!modalResolveTicket}
        ticket={modalResolveTicket}
        onClose={() => setModalResolveTicket(null)}
        onResolve={handleResolve}
      />
      <CloseTicketModal
        isOpen={!!modalCloseTicket}
        ticket={modalCloseTicket}
        onClose={() => setModalCloseTicket(null)}
        onConfirmClose={handleCloseTicket}
      />
      <EscalateTicketModal
        isOpen={!!modalEscalateTicket}
        ticket={modalEscalateTicket}
        onClose={() => setModalEscalateTicket(null)}
        onEscalate={handleEscalate}
      />
    </div>
  );
}
