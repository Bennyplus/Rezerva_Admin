"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import CustomerDetailView from "@/components/admin/CustomerDetailView";
import FilterBar from "@/components/admin/FilterBar";
import { type Customer } from "@/data/admin-customers";
import { customersService } from "@/services/customers-service";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import SuspendUserModal from "@/components/admin/SuspendUserModal";
import Spinner from "@/components/admin/Spinner";
import FilterDropdown from "@/components/admin/FilterDropdown";
import SortDropdown from "@/components/admin/SortDropdown";
import MoreIcon from "@/components/admin/icons/MoreIcon";
import styles from "./customers.module.css";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  
  // Export state
  const [isExporting, setIsExporting] = useState(false);

  // Filter & sort state
  const [activeFilters, setActiveFilters] = useState<{ verificationStatus: string[] }>({ verificationStatus: [] });
  const [sortOption, setSortOption] = useState<string>("Name A to Z");

  // Modal & action states
  const [suspendUser, setSuspendUser] = useState<Customer | null>(null);
  const [unsuspendUser, setUnsuspendUser] = useState<Customer | null>(null);
  const [deactivateUser, setDeactivateUser] = useState<Customer | null>(null);
  const [reactivateUser, setReactivateUser] = useState<Customer | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const resultsPerPage = 9;

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customersService.getCustomers({ page: currentPage, page_size: resultsPerPage });
      // Map API data to Customer type
      const mappedCustomers: Customer[] = (data || []).map((item: any, idx: number) => {
        // Fallbacks since list API might not include user_id explicitly
        const userIdFallback = item.user_id || item.id || item.pk || (idx + 1);
        
        return {
          id: `cust-${item.email || idx}`,
          userId: userIdFallback,
          name: item.full_name || "",
          avatar: item.profile_picture || "/images/admin/profile-Avatar.svg",
          phone: item.phone_number || "",
          email: item.email || "",
          totalBookings: item.total_no_of_bookings || 0,
          verificationStatus: item.verification_status || "Pending Verification",
          // Default empty values for detail view fallback
          emergencyContact: "",
          licenseStatus: "Valid",
          address: "",
          flagsCount: 0,
          bookings: [],
          activityLog: [],
          reviews: [],
          documents: {
            driversLicense: { filename: "", size: "" },
            citizenshipDocument: { filename: "", size: "" }
          }
        };
      });
      setCustomers(mappedCustomers);
      // Assuming API returns total pages, if not just set a default for now
      setTotalPages(data.total_pages || 1);
      setIsEmpty(mappedCustomers.length === 0);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setToastMessage("Error: Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await customersService.exportCustomers();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "customers_export.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setToastMessage("Export successful");
    } catch (error) {
      console.error("Export failed:", error);
      setToastMessage("Error: Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSuspend = async (reason: string) => {
    if (!suspendUser?.userId) return;
    setIsActionLoading(true);
    try {
      await customersService.suspendCustomer(suspendUser.userId, { reason });
      setToastMessage(`${suspendUser.name} suspended successfully.`);
      await fetchCustomers();
    } catch (error) {
      console.error("Suspend failed:", error);
      setToastMessage(`Error: Failed to suspend ${suspendUser.name}`);
    } finally {
      setIsActionLoading(false);
      setSuspendUser(null);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateUser?.userId) return;
    setIsActionLoading(true);
    try {
      await customersService.deactivateCustomer(deactivateUser.userId);
      setToastMessage(`${deactivateUser.name} deactivated successfully.`);
      await fetchCustomers();
    } catch (error) {
      console.error("Deactivate failed:", error);
      setToastMessage(`Error: Failed to deactivate ${deactivateUser.name}`);
    } finally {
      setIsActionLoading(false);
      setDeactivateUser(null);
    }
  };

  const handleReactivate = async () => {
    if (!reactivateUser?.userId) return;
    setIsActionLoading(true);
    try {
      await customersService.reactivateCustomer(reactivateUser.userId);
      setToastMessage(`${reactivateUser.name} reactivated successfully.`);
      await fetchCustomers();
    } catch (error) {
      console.error("Reactivate failed:", error);
      setToastMessage(`Error: Failed to reactivate ${reactivateUser.name}`);
    } finally {
      setIsActionLoading(false);
      setReactivateUser(null);
    }
  };

  const handleUnsuspend = async () => {
    if (!unsuspendUser?.userId) return;
    setIsActionLoading(true);
    try {
      await customersService.unsuspendCustomer(unsuspendUser.userId);
      setToastMessage(`${unsuspendUser.name} unsuspended successfully.`);
      await fetchCustomers();
    } catch (error) {
      console.error("Unsuspend failed:", error);
      setToastMessage(`Error: Failed to unsuspend ${unsuspendUser.name}`);
    } finally {
      setIsActionLoading(false);
      setUnsuspendUser(null);
    }
  };

  // Automatically hide toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  /* ─── Filter + Sort ─── */
  const filtered = (() => {
    let result = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    if (activeFilters.verificationStatus && activeFilters.verificationStatus.length > 0) {
      result = result.filter(c => activeFilters.verificationStatus.includes(c.verificationStatus));
    }

    if (sortOption === "Name A to Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Name Z to A") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "Most Bookings") {
      result.sort((a, b) => b.totalBookings - a.totalBookings);
    } else if (sortOption === "Fewest Bookings") {
      result.sort((a, b) => a.totalBookings - b.totalBookings);
    }

    return result;
  })();

  /* ─── Detail view ─── */
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  if (selectedCustomerId && selectedCustomer) {
    return (
      <CustomerDetailView
        customer={selectedCustomer}
        onBack={(refresh) => {
          setSelectedCustomerId(null);
          if (refresh) fetchCustomers();
        }}
        showToast={(msg) => setToastMessage(msg)}
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastWrapper}>
          <div className={`${styles.toast} ${toastMessage.startsWith("Error:") ? styles.toastError : ""}`}>
            {!toastMessage.startsWith("Error:") && <CheckCircleIcon />}
            {toastMessage}
            <button
              className={styles.toastClose}
              onClick={() => setToastMessage(null)}
              aria-label="Close notification"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      {/* ─── Empty State ─── */}
      {isEmpty && !isLoading ? (
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
              <FilterBar 
                searchValue={searchQuery} 
                onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
                filterDropdown={
                  <FilterDropdown
                    tabs={[
                      { id: 'verificationStatus', label: 'Status', options: ['Verified', 'Pending Verification', 'Suspended'] }
                    ]}
                    onApply={setActiveFilters}
                  />
                }
                sortDropdown={
                  <SortDropdown
                    options={[
                      { label: "Name A to Z", value: "Name A to Z" },
                      { label: "Name Z to A", value: "Name Z to A" },
                      { label: "Most Bookings", value: "Most Bookings" },
                      { label: "Fewest Bookings", value: "Fewest Bookings" }
                    ]}
                    onSortSelect={setSortOption}
                  />
                }
              />
            </div>
            <div className={styles.toolbarRight}>
              <button 
                className={styles.exportBtn} 
                onClick={handleExport}
                disabled={isExporting}
                id="customers-export-btn"
              >
                {isExporting ? "Exporting..." : "Export Users"}
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
                {isLoading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "40px" }}>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenKebab(null);
                                    setSelectedCustomerId(customer.id);
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  className={styles.kebabItem}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenKebab(null);
                                    setReactivateUser(customer);
                                  }}
                                >
                                  Reactivate Account
                                </button>
                                <button
                                  className={styles.kebabItem}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenKebab(null);
                                    setDeactivateUser(customer);
                                  }}
                                >
                                  Deactivate Account
                                </button>
                                <button
                                  className={styles.kebabItem}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenKebab(null);
                                    setUnsuspendUser(customer);
                                  }}
                                >
                                  Unsuspend User
                                </button>
                                <button
                                  className={`${styles.kebabItem} ${styles.kebabItemDanger}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenKebab(null);
                                    setSuspendUser(customer);
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
                  </>
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

      {/* Modals */}
      {suspendUser && (
        <SuspendUserModal
          isOpen={!!suspendUser}
          onClose={() => setSuspendUser(null)}
          onSubmit={handleSuspend}
          userName={suspendUser.name}
          isLoading={isActionLoading}
        />
      )}

      {deactivateUser && (
        <ConfirmActionModal
          isOpen={!!deactivateUser}
          title="Deactivate Account"
          message={`Are you sure you want to deactivate ${deactivateUser.name}'s account? They will not be able to log in until the account is reactivated.`}
          confirmText="Deactivate"
          onConfirm={handleDeactivate}
          onClose={() => setDeactivateUser(null)}
          isLoading={isActionLoading}
          isDanger
        />
      )}

      {reactivateUser && (
        <ConfirmActionModal
          isOpen={!!reactivateUser}
          title="Reactivate Account"
          message={`Are you sure you want to reactivate ${reactivateUser.name}'s account? They will be able to log in again.`}
          confirmText="Reactivate"
          onConfirm={handleReactivate}
          onClose={() => setReactivateUser(null)}
          isLoading={isActionLoading}
          isDanger={false}
        />
      )}

      {unsuspendUser && (
        <ConfirmActionModal
          isOpen={!!unsuspendUser}
          title="Unsuspend User"
          message={`Are you sure you want to unsuspend ${unsuspendUser.name}'s account?`}
          confirmText="Unsuspend"
          onConfirm={handleUnsuspend}
          onClose={() => setUnsuspendUser(null)}
          isLoading={isActionLoading}
          isDanger={false}
        />
      )}
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
function CheckCircleIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}


