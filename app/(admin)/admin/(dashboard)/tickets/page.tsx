"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ADMIN_TICKETS,
  TICKET_STATS,
  Ticket,
  TicketStatus,
  TicketPriority,
} from "@/data/admin-tickets";
import FilterBar from "@/components/admin/FilterBar";
import StatCard from "@/components/admin/StatCard";
import AssignTicketModal from "@/components/admin/AssignTicketModal";
import ResolveTicketModal from "@/components/admin/ResolveTicketModal";
import styles from "./tickets.module.css";



export default function TicketsPage() {
  const router = useRouter();
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState<"All" | "Critical">("All");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [assignModalTicketId, setAssignModalTicketId] = useState<string | null>(null);
  const [resolveModalTicketId, setResolveModalTicketId] = useState<string | null>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleWindowClick = () => setOpenMenuId(null);
    if (openMenuId) {
      window.addEventListener("click", handleWindowClick);
    }
    return () => window.removeEventListener("click", handleWindowClick);
  }, [openMenuId]);

  const baseFiltered = ADMIN_TICKETS.filter(
    (t) =>
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filtered = baseFiltered.filter((t) => activeTab === "Critical" ? t.priority === "High" : true);

  const statusClass = (status: TicketStatus) => {
    switch (status) {
      case "TO DO": return styles.statusPending;
      case "IN PROGRESS": return styles.statusInProgress;
      case "RESOLVED": return styles.statusResolved;
      case "CLOSED": return styles.statusClosed;
      default: return "";
    }
  };

  const statusLabel = (status: TicketStatus) => {
    if (status === "TO DO") return "Pending";
    if (status === "IN PROGRESS") return "In Progress";
    if (status === "RESOLVED") return "Resolved";
    if (status === "CLOSED") return "Closed";
    return status;
  };

  const priorityClass: Record<TicketPriority, string> = {
    Low: styles.priorityLow,
    Medium: styles.priorityMedium,
    High: styles.priorityHigh,
  };

  return (
    <div className={styles.page}>
      {/* ─── Stats ─── */}
      <div className={styles.statsGrid}>
        {[
          { label: "Total Tickets", value: TICKET_STATS.totalTickets },
          { label: "Total Open Tickets", value: TICKET_STATS.totalOpenTickets },
          { label: "Total Pending Tickets", value: TICKET_STATS.totalPendingTickets },
          { label: "Total Resolved Tickets", value: TICKET_STATS.totalResolvedTickets },
        ].map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            id={`stat-${stat.label.replace(/\s+/g, '-').toLowerCase()}`}
          />
        ))}
      </div>

      {/* ─── Tabs & Toolbar ─── */}
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

      <div className={styles.toolbar}>
        <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} hideSort />
        <button className={styles.toolBtn} id="tickets-export" style={{ marginLeft: "auto" }}>Export</button>
      </div>

      {isEmpty || filtered.length === 0 ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard} id="tickets-empty-state">
          <div className={styles.emptyIllustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No roles illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>No tickets available</h2>
          <p className={styles.emptySubtitle}>Support requests and reports will appear here</p>
        </div>
      ) : (
        /* ─── Table View ─── */
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
                        if (selectedRows.size === filtered.length) {
                          setSelectedRows(new Set());
                        } else {
                          setSelectedRows(new Set(filtered.map((_, i) => i)));
                        }
                      }}
                    />
                  </th>
                  <th>Ticket ID</th>
                  <th>Customer Name</th>
                  <th>Ticket Type</th>
                  <th>Priority</th>
                  <th>Assigned Admin</th>
                  <th>Status</th>
                  <th>Created On</th>
                  <th className={styles.actionsCol}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket, idx) => (
                  <tr key={idx} className={selectedRows.has(idx) ? styles.rowSelected : ""}>
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
                    <td>{ticket.category}</td>
                    <td>
                      <span className={`${styles.priorityBadge} ${priorityClass[ticket.priority]}`}>
                        <FlagIcon />
                        {ticket.priority}
                      </span>
                    </td>
                    <td>{ticket.assignedAdmin}</td>
                    <td>
                      <span className={`${styles.badge} ${statusClass(ticket.status)}`}>
                        <span className={styles.badgeDot} />
                        {statusLabel(ticket.status)}
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
                              onClick={() => {
                                router.push(`/admin/tickets/${ticket.id}`);
                                setOpenMenuId(null);
                              }}
                            >
                              View Details
                            </button>
                            <button
                              className={styles.menuItem}
                              onClick={() => {
                                setAssignModalTicketId(ticket.id);
                                setOpenMenuId(null);
                              }}
                            >
                              Assign Ticket
                            </button>
                            <button
                              className={styles.menuItem}
                              onClick={() => {
                                setResolveModalTicketId(ticket.id);
                                setOpenMenuId(null);
                              }}
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
                              onClick={() => setOpenMenuId(null)}
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

      {/* Dev toggle */}
      <div className={styles.devToggleWrap}>
        <button className={styles.stateToggle} onClick={() => setIsEmpty((v) => !v)} id="toggle-tickets-state">
          {isEmpty ? "Show Populated State" : "Show Empty State"} →
        </button>
      </div>

      {/* Modals */}
      <AssignTicketModal
        isOpen={!!assignModalTicketId}
        onClose={() => setAssignModalTicketId(null)}
        onAssign={(admin, notes) => {
          console.log(`Assigned ticket ${assignModalTicketId} to ${admin} with notes: ${notes}`);
          setAssignModalTicketId(null);
        }}
      />
      
      <ResolveTicketModal
        isOpen={!!resolveModalTicketId}
        onClose={() => setResolveModalTicketId(null)}
        onResolve={(notes, email) => {
          console.log(`Resolved ticket ${resolveModalTicketId}. Notes: ${notes}. Notify: ${email}`);
          setResolveModalTicketId(null);
        }}
      />
    </div>
  );
}



/* ─── Inline Icons ─── */
const ip = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
function FlagIcon() { return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path fill="currentColor" stroke="none" d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="3" /></svg>; }
function MoreIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }
