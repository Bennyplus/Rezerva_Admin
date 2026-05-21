"use client";

import { useState } from "react";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import CustomerDetailView from "@/components/admin/CustomerDetailView";
import { ADMIN_CUSTOMERS, type Customer } from "@/data/admin-customers";
import styles from "./customers.module.css";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(ADMIN_CUSTOMERS);
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(2);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [openKebab, setOpenKebab] = useState<string | null>(null);

  const totalPages = 16;
  const resultsPerPage = 9;

  /* ─── Filter ─── */
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  /* ─── Detail view ─── */
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  if (selectedCustomerId && selectedCustomer) {
    return (
      <CustomerDetailView
        customer={selectedCustomer}
        onBack={() => setSelectedCustomerId(null)}
        onDeactivate={(id) => {
          setCustomers((prev) =>
            prev.map((c) =>
              c.id === id ? { ...c, verificationStatus: "Pending Verification" } : c
            )
          );
          setSelectedCustomerId(null);
        }}
        onSuspend={(id) => {
          setCustomers((prev) =>
            prev.map((c) =>
              c.id === id ? { ...c, verificationStatus: "Suspended" } : c
            )
          );
          setSelectedCustomerId(null);
        }}
      />
    );
  }

  /* ─── Checkbox helpers ─── */
  const toggleAll = () => {
    if (selectedRows.size === filtered.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filtered.map((c) => c.id)));
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  return (
    <div className={styles.page} onClick={() => setOpenKebab(null)}>
      {/* ─── Empty State ─── */}
      {isEmpty ? (
        <div className={styles.emptyCard} id="customers-empty-state">
          <div className={styles.illustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No users illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>No users found</h2>
          <p className={styles.emptySubtitle}>
            Users will appear here once registrations begin
          </p>
        </div>
      ) : (
        /* ─── Populated State ─── */
        <div className={styles.tableCard} id="customers-table-card">
          {/* Toolbar */}
          <div className={styles.toolbar} id="customers-toolbar">
            <div className={styles.toolbarLeft}>
              <div className={styles.searchBox}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.searchInput}
                  id="customers-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className={styles.toolBtn} id="customers-filter-btn">
                <FilterIcon /> Filter
              </button>
            </div>
            <div className={styles.toolbarRight}>
              <button className={styles.exportBtn} id="customers-export-btn">
                Export Users
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedRows.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      aria-label="Select all"
                      id="select-all-customers"
                    />
                  </th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Total No of Bookings</th>
                  <th>Verification Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className={`${styles.tableRow} ${selectedRows.has(customer.id) ? styles.rowSelected : ""}`}
                    onClick={() => setSelectedCustomerId(customer.id)}
                  >
                    <td
                      className={styles.checkCol}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedRows.has(customer.id)}
                        onChange={() => toggleRow(customer.id)}
                        aria-label={`Select ${customer.name}`}
                      />
                    </td>
                    <td>
                      <div className={styles.customerCell}>
                        <div className={styles.avatarWrap}>
                          <Image
                            src={customer.avatar}
                            alt={customer.name}
                            width={34}
                            height={34}
                            className={styles.avatarImg}
                          />
                        </div>
                        <span className={styles.customerName}>{customer.name}</span>
                      </div>
                    </td>
                    <td>{customer.phone}</td>
                    <td className={styles.emailCell}>{customer.email}</td>
                    <td className={styles.bookingsCell}>{customer.totalBookings.toLocaleString()}</td>
                    <td>
                      <VerificationBadge status={customer.verificationStatus} />
                    </td>
                    <td
                      className={styles.actionsCol}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.kebabWrap}>
                        <button
                          className={styles.moreBtn}
                          aria-label={`More actions for ${customer.name}`}
                          id={`kebab-cust-${customer.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenKebab((prev) =>
                              prev === customer.id ? null : customer.id
                            );
                          }}
                        >
                          <MoreIcon />
                        </button>
                        {openKebab === customer.id && (
                          <div className={styles.kebabMenu}>
                            <button
                              className={styles.kebabItem}
                              onClick={() => {
                                setOpenKebab(null);
                                setSelectedCustomerId(customer.id);
                              }}
                            >
                              View
                            </button>
                            <button
                              className={`${styles.kebabItem} ${styles.kebabItemDanger}`}
                              onClick={() => {
                                setOpenKebab(null);
                                setCustomers((prev) =>
                                  prev.map((c) =>
                                    c.id === customer.id
                                      ? { ...c, verificationStatus: "Suspended" }
                                      : c
                                  )
                                );
                              }}
                            >
                              Suspend User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      No customers match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            resultsPerPage={resultsPerPage}
            onPageChange={setCurrentPage}
            variant="table"
          />
        </div>
      )}

      {/* Dev toggle */}
      <div className={styles.devToggleWrap}>
        <button
          className={styles.stateToggle}
          onClick={() => setIsEmpty((v) => !v)}
          id="toggle-customers-state"
        >
          {isEmpty ? "Show Populated State" : "Show Empty State"} →
        </button>
      </div>
    </div>
  );
}

/* ─── Verification Badge ─── */
function VerificationBadge({ status }: { status: string }) {
  const cls =
    status === "Verified"
      ? styles.badgeVerified
      : status === "Suspended"
      ? styles.badgeSuspended
      : styles.badgePending;

  return (
    <span className={`${styles.badge} ${cls}`}>
      <span className={styles.badgeDot} />
      {status}
    </span>
  );
}

/* ─── Icons ─── */
function SearchIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" stroke="#E2E4E9" strokeWidth="2" strokeDasharray="6 4" />
      <circle cx="40" cy="32" r="12" stroke="#D1D5DB" strokeWidth="2" />
      <path d="M18 62c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
