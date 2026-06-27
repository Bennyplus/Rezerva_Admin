"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Ticket, TicketStatus } from "@/data/admin-tickets";
import FilterBar from "@/components/admin/FilterBar";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import Pagination from "@/components/admin/Pagination";
import AssignTicketModal from "@/components/admin/AssignTicketModal";
import ResolveTicketModal from "@/components/admin/ResolveTicketModal";
import EscalateTicketModal from "@/components/admin/EscalateTicketModal";
import { ticketsService } from "@/services/tickets-service";
import FilterDropdown from "@/components/admin/FilterDropdown";
import SortDropdown from "@/components/admin/SortDropdown";
import MoreIcon from "@/components/admin/icons/MoreIcon";
import styles from "./tickets.module.css";

export default function TicketsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Critical">("All");
  const [activeFilters, setActiveFilters] = useState<{ status: string[] }>({ status: [] });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [assignModalTicketId, setAssignModalTicketId] = useState<string | null>(null);
  const [resolveModalTicketId, setResolveModalTicketId] = useState<string | null>(null);
  const [escalateModalTicketId, setEscalateModalTicketId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("Newest to Oldest");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch tickets on mount or page change
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const [data, metricsData] = await Promise.all([
          ticketsService.getTickets({ page: currentPage }),
          ticketsService.getMetrics().catch(() => null)
        ]);
        setTickets(data?.results || []);
        setTotalCount(data?.count || 0);
        if (metricsData) setMetrics(metricsData);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
        setTickets([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [currentPage]);

  // Close menu on click outside
  useEffect(() => {
    const handleWindowClick = () => setOpenMenuId(null);
    if (openMenuId) window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [openMenuId]);

  const filtered = (() => {
    let result = tickets.filter((t) => {
      const matchesSearch =
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "Critical" ? t.priority === "High" : true;
      const matchesStatus = activeFilters.status && activeFilters.status.length > 0
        ? activeFilters.status.includes(t.status)
        : true;
      return matchesSearch && matchesTab && matchesStatus;
    });

    if (sortOption === "Newest to Oldest") {
      result.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    } else if (sortOption === "Oldest to Newest") {
      result.sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());
    }

    return result;
  })();

  // Derived stat counts from live data (fallback to metrics)
  const totalTickets = metrics?.total_tickets ?? totalCount;
  const pendingCount = metrics?.total_pending ?? tickets.filter(t => t.status === "Pending").length;
  const resolvedCount = metrics?.total_resolved ?? tickets.filter(t => t.status === "Resolved").length;
  const escalatedCount = metrics?.total_escalated ?? tickets.filter(t => t.status === "Escalated").length;

  // Action handlers
  const handleAssign = async (ticketNumber: string, adminId: string) => {
    try {
      await ticketsService.assignTicket(ticketNumber, adminId);
      setTickets(prev => prev.map(t => t.ticketNumber === ticketNumber ? { ...t, status: "In Progress" as TicketStatus } : t));
    } catch (error) {
      console.error("Failed to assign ticket:", error);
    } finally {
      setAssignModalTicketId(null);
    }
  };

  const handleResolve = async (ticketNumber: string, notes: string) => {
    try {
      await ticketsService.resolveTicket(ticketNumber, notes);
      setTickets(prev => prev.map(t => t.ticketNumber === ticketNumber ? { ...t, status: "Resolved" as TicketStatus } : t));
    } catch (error) {
      console.error("Failed to resolve ticket:", error);
    } finally {
      setResolveModalTicketId(null);
    }
  };

  const handleEscalate = async (ticketNumber: string, reason: string) => {
    try {
      await ticketsService.escalateTicket(ticketNumber, reason);
      setTickets(prev => prev.map(t =>
        t.ticketNumber === ticketNumber ? { ...t, status: "Escalated" as any, priority: "High" } : t
      ));
    } catch (error) {
      console.error("Failed to escalate ticket:", error);
    } finally {
      setEscalateModalTicketId(null);
    }
  };

  const handleClose = async (ticketNumber: string) => {
    try {
      await ticketsService.closeTicket(ticketNumber);
      setTickets(prev => prev.map(t => t.ticketNumber === ticketNumber ? { ...t, status: "Closed" as TicketStatus } : t));
    } catch (error) {
      console.error("Failed to close ticket:", error);
    }
  };

  const handleExportTickets = async () => {
    try {
      const blob = await ticketsService.exportTickets() as Blob;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tickets_export.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export tickets:", err);
    }
  };

  const statusClass = (status: TicketStatus | string) => {
    switch (status) {
      case "Pending": return styles.statusPending;
      case "In Progress": return styles.statusInProgress;
      case "Resolved": return styles.statusResolved;
      case "Escalated": return styles.statusEscalated;
      case "Closed": return styles.statusClosed;
      default: return "";
    }
  };

  return (
    <div className={styles.page}>
      {/* ─── Stats ─── */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Tickets" value={totalTickets} id="stat-total" />
        <StatCard label="Pending Tickets" value={pendingCount} id="stat-pending" />
        <StatCard label="Resolved Tickets" value={resolvedCount} id="stat-resolved" />
        <StatCard label="Escalated" value={escalatedCount} id="stat-escalated" />
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
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
          filterDropdown={
            <FilterDropdown 
              tabs={[
                { id: 'status', label: 'Status', options: ['Pending', 'In Progress', 'Resolved', 'Escalated', 'Closed'] }
              ]}
              onApply={setActiveFilters} 
            />
          }
          sortDropdown={
            <SortDropdown 
              options={[
                { label: "Newest to Oldest", value: "Newest to Oldest" },
                { label: "Oldest to Newest", value: "Oldest to Newest" }
              ]}
              onSortSelect={setSortOption}
            />
          }
        />
        <button className={styles.toolBtn} id="tickets-export" style={{ marginLeft: "auto" }} onClick={handleExportTickets}>Export</button>
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
                    <td>{ticket.ticketNumber}</td>
                    <td>{ticket.customerName}</td>
                    <td style={{ maxWidth: 260 }}>
                      <span title={ticket.description}>
                        {ticket.description.length > 55
                          ? ticket.description.slice(0, 55) + "…"
                          : ticket.description}
                      </span>
                    </td>
                    <td>{ticket.assigned_admin}</td>
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
                              onClick={() => { router.push(`/admin/tickets/${ticket.ticketNumber}`); setOpenMenuId(null); }}
                            >
                              View Details
                            </button>
                            <button
                              className={styles.menuItem}
                              onClick={() => { setAssignModalTicketId(ticket.ticketNumber); setOpenMenuId(null); }}
                            >
                              Assign Ticket
                            </button>
                            <button
                              className={styles.menuItem}
                              onClick={() => { setResolveModalTicketId(ticket.ticketNumber); setOpenMenuId(null); }}
                            >
                              Resolve Ticket
                            </button>
                            <button
                              className={styles.menuItem}
                              onClick={() => { handleClose(ticket.ticketNumber); setOpenMenuId(null); }}
                            >
                              Close Ticket
                            </button>
                            <button
                              className={styles.menuItem}
                              onClick={() => { setEscalateModalTicketId(ticket.ticketNumber); setOpenMenuId(null); }}
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
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(totalCount / 10))}
            resultsPerPage={10}
            onPageChange={setCurrentPage}
          />
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

