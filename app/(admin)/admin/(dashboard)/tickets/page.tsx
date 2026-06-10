"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Ticket, TicketStatus } from "@/data/admin-tickets";
import FilterBar from "@/components/admin/FilterBar";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import AssignTicketModal from "@/components/admin/AssignTicketModal";
import ResolveTicketModal from "@/components/admin/ResolveTicketModal";
import EscalateTicketModal from "@/components/admin/EscalateTicketModal";
import { ticketsService } from "@/services/tickets-service";
import styles from "./tickets.module.css";

export default function TicketsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Critical">("All");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [assignModalTicketId, setAssignModalTicketId] = useState<string | null>(null);
  const [resolveModalTicketId, setResolveModalTicketId] = useState<string | null>(null);
  const [escalateModalTicketId, setEscalateModalTicketId] = useState<string | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tickets on mount
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const data = await ticketsService.getTickets();
        setTickets(data || []);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
        setTickets([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleWindowClick = () => setOpenMenuId(null);
    if (openMenuId) window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [openMenuId]);

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "Critical" ? t.priority === "High" : true;
    return matchesSearch && matchesTab;
  });

  // Derived stat counts from live data
  const totalTickets = tickets.length;
  const pendingCount = tickets.filter(t => t.status === "Pending").length;
  const resolvedCount = tickets.filter(t => t.status === "Resolved").length;
  const escalatedCount = tickets.filter(t => t.status === "Escalated").length;

  // Action handlers
  const handleAssign = async (ticketNumber: string, adminId: string) => {
    try {
      await ticketsService.assignTicket(ticketNumber, adminId);
      setTickets(prev => prev.map(t => t.id === ticketNumber ? { ...t, status: "In Progress" as TicketStatus } : t));
    } catch (error) {
      console.error("Failed to assign ticket:", error);
    } finally {
      setAssignModalTicketId(null);
    }
  };

  const handleResolve = async (ticketNumber: string, notes: string) => {
    try {
      await ticketsService.resolveTicket(ticketNumber, notes);
      setTickets(prev => prev.map(t => t.id === ticketNumber ? { ...t, status: "Resolved" as TicketStatus } : t));
    } catch (error) {
      console.error("Failed to resolve ticket:", error);
    } finally {
      setResolveModalTicketId(null);
    }
  };

  const handleEscalate = async (ticketId: string, reason: string) => {
    try {
      await ticketsService.escalateTicket(ticketId, reason);
      setTickets(prev => prev.map(t =>
        t.id === ticketId ? { ...t, status: "Escalated" as any, priority: "High" } : t
      ));
    } catch (error) {
      console.error("Failed to escalate ticket:", error);
    } finally {
      setEscalateModalTicketId(null);
    }
  };

  const statusClass = (status: TicketStatus | string) => {
    switch (status) {
      case "Pending":     return styles.statusPending;
      case "In Progress": return styles.statusInProgress;
      case "Resolved":    return styles.statusResolved;
      case "Escalated":   return styles.statusEscalated;
      case "Closed":      return styles.statusClosed;
      default:            return "";
    }
  };

  return (
    <div className={styles.page}>
      {/* ─── Stats ─── */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Tickets"    value={totalTickets}   id="stat-total" />
        <StatCard label="Pending Tickets"  value={pendingCount}   id="stat-pending" />
        <StatCard label="Resolved Tickets" value={resolvedCount}  id="stat-resolved" />
        <StatCard label="Escalated"        value={escalatedCount} id="stat-escalated" />
      </div>

      {/* ─── Tabs ─── */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "All" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("All")}
        >
          All
        </button>
        <button
          className={`${styles.tab} ${activeTab === "Critical" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("Critical")}
        >
          Critical
        </button>
      </div>

      {/* ─── Toolbar ─── */}
      <div className={styles.toolbar}>
        <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} hideSort />
        <button className={styles.toolBtn} id="tickets-export" style={{ marginLeft: "auto" }}>Export</button>
      </div>

      {/* ─── Content ─── */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard} id="tickets-empty-state">
          <div className={styles.emptyIllustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No tickets illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>No tickets available</h2>
          <p className={styles.emptySubtitle}>Support requests and reports will appear here</p>
        </div>
      ) : (
        /* ─── Table ─── */
        <div className={styles.tableCard} id="tickets-table">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedRows.size === filtered.length && filtered.length > 0}
                      onChange={() => {
                        if (selectedRows.size === filtered.length) setSelectedRows(new Set());
                        else setSelectedRows(new Set(filtered.map((_, i) => i)));
                      }}
                    />
                  </th>
                  <th>Ticket ID</th>
                  <th>Customer Name</th>
                  <th>Description</th>
                  <th>Assigned Admin</th>
                  <th>Status</th>
                  <th>Created On</th>
                  <th className={styles.actionsCol}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket, idx) => (
                  <tr key={`${ticket.id}-${idx}`} className={selectedRows.has(idx) ? styles.rowSelected : ""}>
                    <td className={styles.checkCol}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedRows.has(idx)}
                        onChange={() => {
                          const next = new Set(selectedRows);
                          if (next.has(idx)) next.delete(idx);
                          else next.add(idx);
                          setSelectedRows(next);
                        }}
                      />
                    </td>
                    <td>{ticket.id}</td>
                    <td>{ticket.customerName}</td>
                    <td style={{ maxWidth: 260 }}>
                      <span title={ticket.description}>
                        {ticket.description.length > 55
                          ? ticket.description.slice(0, 55) + "…"
                          : ticket.description}
                      </span>
                    </td>
                    <td>{ticket.assignedAdmin}</td>
                    <td>
                      <span className={`${styles.badge} ${statusClass(ticket.status)}`}>
                        <span className={styles.badgeDot} />
                        {ticket.status}
                      </span>
                    </td>
                    <td>{ticket.date}</td>
                    <td className={styles.actionsCol}>
                      <div className={styles.menuContainer} onClick={(e) => e.stopPropagation()}>
                        <button
                          className={styles.moreBtn}
                          onClick={() => setOpenMenuId(openMenuId === `${ticket.id}-${idx}` ? null : `${ticket.id}-${idx}`)}
                        >
                          <MoreIcon />
                        </button>
                        {openMenuId === `${ticket.id}-${idx}` && (
                          <div className={styles.dropdownMenu}>
                            <button
                              className={styles.menuItem}
                              onClick={() => { router.push(`/admin/tickets/${ticket.id}`); setOpenMenuId(null); }}
                            >
                              View Details
                            </button>
                            <button
                              className={styles.menuItem}
                              onClick={() => { setAssignModalTicketId(ticket.id); setOpenMenuId(null); }}
                            >
                              Assign Ticket
                            </button>
                            <button
                              className={styles.menuItem}
                              onClick={() => { setResolveModalTicketId(ticket.id); setOpenMenuId(null); }}
                            >
                              Resolve Ticket
                            </button>
                            <button
                              className={styles.menuItem}
                              onClick={() => setOpenMenuId(null)}
                            >
                              Close Ticket
                            </button>
                            <button
                              className={styles.menuItem}
                              onClick={() => { setEscalateModalTicketId(ticket.id); setOpenMenuId(null); }}
                            >
                              Escalate
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Modals ─── */}
      <AssignTicketModal
        isOpen={!!assignModalTicketId}
        onClose={() => setAssignModalTicketId(null)}
        onAssign={(adminId, _notes) => {
          if (assignModalTicketId) handleAssign(assignModalTicketId, adminId);
        }}
      />

      <ResolveTicketModal
        isOpen={!!resolveModalTicketId}
        onClose={() => setResolveModalTicketId(null)}
        onResolve={(notes, _email) => {
          if (resolveModalTicketId) handleResolve(resolveModalTicketId, notes);
        }}
      />

      <EscalateTicketModal
        isOpen={!!escalateModalTicketId}
        onClose={() => setEscalateModalTicketId(null)}
        onEscalate={(reason) => {
          if (escalateModalTicketId) handleEscalate(escalateModalTicketId, reason);
        }}
      />
    </div>
  );
}

/* ─── Inline Icons ─── */
function MoreIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
