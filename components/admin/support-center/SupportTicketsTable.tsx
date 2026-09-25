"use client";

import { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/admin/Pagination";
import { SupportTicket, TicketPriority } from "@/services/support-center-service";
import styles from "./SupportTicketsTable.module.css";

export type SupportTab = "All" | "Critical" | "My Tickets";

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  activeTab: SupportTab;
  onTabChange: (tab: SupportTab) => void;
  onSelectTicket: (ticket: SupportTicket) => void;
  onOpenAssignModal: (ticket: SupportTicket) => void;
  onOpenResolveModal: (ticket: SupportTicket) => void;
  onOpenCloseModal: (ticket: SupportTicket) => void;
  onOpenEscalateModal: (ticket: SupportTicket) => void;
}

export default function SupportTicketsTable({
  tickets = [],
  activeTab,
  onTabChange,
  onSelectTicket,
  onOpenAssignModal,
  onOpenResolveModal,
  onOpenCloseModal,
  onOpenEscalateModal,
}: SupportTicketsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenMenuId(null);
      setIsFilterOpen(false);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const filteredTickets = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return tickets.filter((item) => {
      if (priorityFilter !== "All" && item.priority !== priorityFilter) return false;
      if (query) {
        const match =
          item.ticketId?.toLowerCase().includes(query) ||
          item.user?.toLowerCase().includes(query) ||
          item.ticketType?.toLowerCase().includes(query) ||
          item.userType?.toLowerCase().includes(query) ||
          item.assignedAdmin?.toLowerCase().includes(query) ||
          item.createdOn?.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [tickets, priorityFilter, searchQuery]);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(paginatedTickets.map((t) => t.id)));
    else setSelectedIds(new Set());
  };

  const handleToggleRow = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getStatusStyle = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("progress")) return styles.statusInProgress;
    if (s.includes("closed")) return styles.statusClosed;
    if (s.includes("resolve")) return styles.statusResolved;
    return styles.statusPending;
  };

  const getPriorityStyle = (priority: TicketPriority) => {
    if (priority === "High" || priority === "Critical") return { class: styles.priorityHigh, color: "#DC2626" };
    if (priority === "Medium") return { class: styles.priorityMedium, color: "#EA580C" };
    return { class: styles.priorityLow, color: "#2563EB" };
  };

  return (
    <div className={styles.container}>
      {/* ── Tabs Header ── */}
      <div className={styles.tabsRow}>
        {(["All", "Critical", "My Tickets"] as SupportTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
            onClick={() => {
              onTabChange(tab);
              setCurrentPage(1);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.toolBtnWrap} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`${styles.toolBtn} ${priorityFilter !== "All" ? styles.toolBtnActive : ""}`}
            onClick={() => setIsFilterOpen((v) => !v)}
          >
            <FilterIcon />
            {priorityFilter === "All" ? "Filter" : priorityFilter}
          </button>
          {isFilterOpen && (
            <div className={styles.popover}>
              {["All", "High", "Medium", "Low"].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.popoverItem} ${priorityFilter === p ? styles.popoverItemActive : ""}`}
                  onClick={() => {
                    setPriorityFilter(p);
                    setIsFilterOpen(false);
                    setCurrentPage(1);
                  }}
                >
                  {p === "All" ? "All Priorities" : `${p} Priority`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkCol}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={paginatedTickets.length > 0 && selectedIds.size === paginatedTickets.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Ticket ID</th>
              <th>User</th>
              <th>User Type</th>
              <th>Ticket Type</th>
              <th>Priority</th>
              {activeTab !== "My Tickets" && <th>Assigned Admin</th>}
              <th>Status</th>
              <th>Created On</th>
              <th className={styles.actionsCol}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.map((row) => {
              const priorityData = getPriorityStyle(row.priority);
              const isChecked = selectedIds.has(row.id);

              return (
                <tr key={row.id} onClick={() => onSelectTicket(row)}>
                  <td className={styles.checkCol} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={isChecked}
                      onChange={() => handleToggleRow(row.id)}
                    />
                  </td>
                  <td className={styles.ticketId}>{row.ticketId || "—"}</td>
                  <td>{row.user || "—"}</td>
                  <td>{row.userType || "—"}</td>
                  <td>{row.ticketType || "—"}</td>
                  <td>
                    <span className={priorityData.class}>
                      <FlagIcon fill={priorityData.color} />
                      {row.priority || "Low"}
                    </span>
                  </td>
                  {activeTab !== "My Tickets" && <td>{row.assignedAdmin || "—"}</td>}
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusStyle(row.status)}`}>
                      <span className={styles.statusDot} />
                      {row.status || "Pending"}
                    </span>
                  </td>
                  <td>{row.createdOn || "—"}</td>
                  <td className={styles.actionsCol} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.kebabWrapper}>
                      <button
                        type="button"
                        className={styles.moreBtn}
                        aria-label="Actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId((prev) => (prev === row.id ? null : row.id));
                        }}
                      >
                        <MoreVerticalIcon />
                      </button>

                      {openMenuId === row.id && (
                        <div className={styles.kebabMenu} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => {
                              setOpenMenuId(null);
                              onSelectTicket(row);
                            }}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => {
                              setOpenMenuId(null);
                              onOpenAssignModal(row);
                            }}
                          >
                            Assign Ticket
                          </button>
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => {
                              setOpenMenuId(null);
                              onOpenResolveModal(row);
                            }}
                          >
                            Resolve Ticket
                          </button>
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => {
                              setOpenMenuId(null);
                              onOpenCloseModal(row);
                            }}
                          >
                            Close Ticket
                          </button>
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => {
                              setOpenMenuId(null);
                              onOpenEscalateModal(row);
                            }}
                          >
                            Escalate
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={activeTab === "My Tickets" ? 9 : 10} className={styles.emptyRow}>
                  No support tickets found matching your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          resultsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#868C98" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1={4} y1={6} x2={20} y2={6} />
      <line x1={7} y1={12} x2={17} y2={12} />
      <line x1={10} y1={18} x2={14} y2={18} />
    </svg>
  );
}
function FlagIcon({ fill = "#2563EB" }: { fill?: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth={1}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}
function MoreVerticalIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx={12} cy={5} r={1} />
      <circle cx={12} cy={12} r={1} />
      <circle cx={12} cy={19} r={1} />
    </svg>
  );
}
