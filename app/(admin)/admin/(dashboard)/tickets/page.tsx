"use client";

import { useState } from "react";
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
import styles from "./tickets.module.css";

const COLUMNS: { status: TicketStatus; dotClass: string; countClass: string }[] = [
  { status: "TO DO", dotClass: styles.dotTodo, countClass: styles.countTodo },
  { status: "IN PROGRESS", dotClass: styles.dotInProgress, countClass: styles.countInProgress },
  { status: "RESOLVED", dotClass: styles.dotResolved, countClass: styles.countResolved },
  { status: "CLOSED", dotClass: styles.dotClosed, countClass: styles.countClosed },
];

export default function TicketsPage() {
  const router = useRouter();
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ADMIN_TICKETS.filter(
    (t) =>
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTicketsByStatus = (status: TicketStatus) =>
    filtered.filter((t) => t.status === status);

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
          <div key={stat.label} className={styles.statCard}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* ─── Toolbar ─── */}
      <div className={styles.toolbar}>
        <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} hideSort />
        <button className={styles.toolBtn} id="tickets-export" style={{ marginLeft: "auto" }}>Export</button>
      </div>

      {isEmpty ? (
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
        /* ─── Kanban Board ─── */
        <div className={styles.board} id="tickets-board">
          {COLUMNS.map(({ status, dotClass, countClass }) => {
            const cards = getTicketsByStatus(status);
            return (
              <div key={status} className={styles.column}>
                <div className={styles.colHeader}>
                  <span className={`${styles.colDot} ${dotClass}`} />
                  <span className={styles.colTitle}>{status}</span>
                  <span className={`${styles.colCount} ${countClass}`}>{cards.length}</span>
                </div>
                {cards.map((ticket, i) => (
                  <TicketCard
                    key={`${ticket.id}-${i}`}
                    ticket={ticket}
                    onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Dev toggle */}
      <div className={styles.devToggleWrap}>
        <button className={styles.stateToggle} onClick={() => setIsEmpty((v) => !v)} id="toggle-tickets-state">
          {isEmpty ? "Show Populated State" : "Show Empty State"} →
        </button>
      </div>
    </div>
  );
}

/* ─── Ticket Card ─── */
function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const priorityClass: Record<TicketPriority, string> = {
    Low: styles.priorityLow,
    Medium: styles.priorityMedium,
    High: styles.priorityHigh,
  };

  const initials = ticket.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardTop}>
        <h3 className={styles.cardTitle}>{ticket.category}</h3>
        <span className={styles.cardDate}>{ticket.date}</span>
      </div>
      <span className={styles.cardId}>{ticket.id}</span>
      <span className={`${styles.priorityBadge} ${priorityClass[ticket.priority]}`}>
        <FlagIcon />
        {ticket.priority}
      </span>
      <p className={styles.cardDescription}>{ticket.description}</p>
      <div className={styles.cardFooter}>
        <span className={styles.cardCustomer}>{ticket.customerName}</span>
        <div className={styles.cardAvatar}>{initials}</div>
      </div>
    </div>
  );
}

/* ─── Empty State Illustration ─── */
function EmptyIllustration() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="40" r="10" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="90" cy="40" r="10" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M40 40 Q60 20 80 40" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      <circle cx="30" cy="40" r="4" fill="#D1D5DB" />
      <circle cx="90" cy="40" r="4" fill="#D1D5DB" />
      <circle cx="60" cy="26" r="3" fill="#D1D5DB" />
      <path d="M20 40 Q10 55 30 55" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="2 2" fill="none" />
      <path d="M100 40 Q110 55 90 55" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="2 2" fill="none" />
    </svg>
  );
}

/* ─── Inline Icons ─── */
const ip = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
function FlagIcon() { return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>; }
