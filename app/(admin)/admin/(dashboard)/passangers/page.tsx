"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import FilterDropdown from "@/components/admin/FilterDropdown";
import SuspendDriverModal from "@/components/admin/SuspendDriverModal";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import PassengerDetailView from "@/components/admin/PassengerDetailView";
import Spinner from "@/components/admin/Spinner";
import MoreIcon from "@/components/admin/icons/MoreIcon";
import { type Passenger, passengersService } from "@/services/passengers-service";
import styles from "./passangers.module.css";

export default function PassengersPage() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPassengerId, setSelectedPassengerId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Dropdown & Popovers
  const [activeDropdown, setActiveDropdown] = useState<"filter" | null>(null);
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ status: string[] }>({ status: [] });

  // Action Modals
  const [suspendTarget, setSuspendTarget] = useState<Passenger | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Passenger | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchPassengers = async () => {
    setIsLoading(true);
    try {
      const data = await passengersService.getPassengers();
      setPassengers(data);
    } catch (error) {
      console.error("Failed to fetch passengers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenKebab(null);
      setActiveDropdown(null);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  /* Filter + Sort */
  const filteredPassengers = (() => {
    let result = passengers.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.passengerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery)
    );

    if (activeFilters.status && activeFilters.status.length > 0) {
      result = result.filter((p) => activeFilters.status.includes(p.status));
    }

    return result;
  })();

  const resultsPerPage = 9;
  const totalPages = 16;
  const paginatedPassengers =
    filteredPassengers.length > resultsPerPage
      ? filteredPassengers.slice(
          (currentPage - 1) * resultsPerPage,
          currentPage * resultsPerPage
        )
      : filteredPassengers;

  /* Checkbox Selection */
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(paginatedPassengers.map((p) => p.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* Suspend & Deactivate Confirmations */
  const handleSuspendConfirm = async (reason: string) => {
    if (!suspendTarget) return;
    try {
      await passengersService.suspendPassenger(suspendTarget.id, reason);
      setPassengers((prev) =>
        prev.map((p) => (p.id === suspendTarget.id ? { ...p, status: "Suspended" } : p))
      );
      setSuspendTarget(null);
    } catch (error) {
      console.error("Failed to suspend passenger:", error);
      throw error;
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!deactivateTarget) return;
    try {
      setIsActionLoading(true);
      await passengersService.deactivatePassenger(deactivateTarget.id);
      setPassengers((prev) =>
        prev.map((p) =>
          p.id === deactivateTarget.id ? { ...p, status: "Deactivated" } : p
        )
      );
      setDeactivateTarget(null);
    } catch (error) {
      console.error("Failed to deactivate passenger:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  /* Detail View */
  const selectedPassenger = passengers.find((p) => p.id === selectedPassengerId);
  if (selectedPassengerId && selectedPassenger) {
    return (
      <PassengerDetailView
        passenger={selectedPassenger}
        onBack={() => setSelectedPassengerId(null)}
        onSuspend={(id) => {
          setPassengers((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: "Suspended" } : p))
          );
        }}
        onDeactivate={(id) => {
          setPassengers((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: "Deactivated" } : p))
          );
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      ) : passengers.length === 0 ? (
        /* ─── State 1: Inactive / Empty State (Screenshot 1) ─── */
        <div className={styles.emptyCard} id="passengers-empty-state">
          <h2 className={styles.emptyTitle}>No users found</h2>
          <p className={styles.emptySubtitle}>
            Users will appear here once registrations begin
          </p>
        </div>
      ) : (
        /* ─── State 2: Table Data State (Screenshot 2) ─── */
        <>
          {/* Toolbar */}
          <div className={styles.toolbar} id="passengers-toolbar">
            <div className={styles.toolbarLeft}>
              {/* Search box */}
              <div className={styles.searchBox}>
                <SearchGlassIcon />
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Filter */}
              <div
                className={styles.popoverWrapper}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.toolBtn}
                  onClick={() =>
                    setActiveDropdown((prev) => (prev === "filter" ? null : "filter"))
                  }
                  id="filter-btn"
                >
                  <FilterIcon />
                  Filter
                </button>
                {activeDropdown === "filter" && (
                  <div className={styles.dropdownContainer}>
                    <FilterDropdown
                      tabs={[
                        {
                          id: "status",
                          label: "Status",
                          options: ["Active", "Inactive", "Suspended", "Deactivated"],
                        },
                      ]}
                      onApply={(filters) => {
                        setActiveFilters({ status: filters.status || [] });
                        setActiveDropdown(null);
                      }}
                      onClose={() => setActiveDropdown(null)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Export Users */}
            <div className={styles.toolbarRight}>
              <button
                className={styles.exportBtn}
                onClick={() => passengersService.exportPassengers()}
                id="export-users-btn"
              >
                Export Users
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className={styles.tableCard} id="passengers-table">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.checkCol}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={
                          paginatedPassengers.length > 0 &&
                          selectedRows.size === paginatedPassengers.length
                        }
                        onChange={handleSelectAll}
                        aria-label="Select all passengers"
                      />
                    </th>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Total Trips</th>
                    <th>Ratings</th>
                    <th>Reports Received</th>
                    <th className={styles.actionsHeader} />
                  </tr>
                </thead>
                <tbody>
                  {paginatedPassengers.map((passenger) => {
                    const isSelected = selectedRows.has(passenger.id);
                    return (
                      <tr
                        key={passenger.id}
                        className={styles.tableRow}
                        onClick={() => setSelectedPassengerId(passenger.id)}
                      >
                        {/* Checkbox */}
                        <td
                          className={styles.checkCol}
                          onClick={(e) => handleSelectRow(passenger.id, e)}
                        >
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={isSelected}
                            onChange={() => {}}
                            aria-label={`Select ${passenger.name}`}
                          />
                        </td>

                        {/* Name + Passenger ID */}
                        <td>
                          <div className={styles.driverCell}>
                            <div className={styles.avatarWrap}>
                              <Image
                                src={
                                  passenger.avatar || "/images/admin/profile-Avatar.svg"
                                }
                                alt={passenger.name}
                                width={40}
                                height={40}
                                className={styles.avatarImg}
                                unoptimized={Boolean(passenger.avatar?.startsWith("http"))}
                              />
                            </div>
                            <div className={styles.driverInfo}>
                              <span className={styles.driverName}>{passenger.name}</span>
                              <span className={styles.driverCode}>
                                {passenger.passengerCode || "US-ID-123-ER"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Phone Number */}
                        <td className={styles.phoneCell}>{passenger.phone}</td>

                        {/* Email */}
                        <td className={styles.emailCell}>
                          <span title={passenger.email}>{passenger.email}</span>
                        </td>

                        {/* Total Trips */}
                        <td className={styles.tripsCell}>{passenger.totalTrips}</td>

                        {/* Ratings */}
                        <td>
                          <div className={styles.ratingCell}>
                            <SolidBlueStarIcon />
                            <span className={styles.ratingNum}>
                              {passenger.rating ?? 0}
                            </span>
                          </div>
                        </td>

                        {/* Reports Received */}
                        <td className={styles.reportsCell}>
                          {passenger.reportsReceived ?? 0}
                        </td>

                        {/* Actions (Kebab Menu) */}
                        <td
                          className={styles.actionsCol}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className={styles.kebabWrap}>
                            <button
                              className={styles.moreBtn}
                              aria-label={`Actions for ${passenger.name}`}
                              id={`kebab-${passenger.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenKebab((prev) =>
                                  prev === passenger.id ? null : passenger.id
                                );
                              }}
                            >
                              <MoreIcon />
                            </button>

                            {openKebab === passenger.id && (
                              <div className={styles.kebabMenu}>
                                <button
                                  className={styles.kebabItem}
                                  onClick={() => {
                                    setOpenKebab(null);
                                    setSelectedPassengerId(passenger.id);
                                  }}
                                >
                                  View Details
                                </button>
                                <button
                                  className={styles.kebabItem}
                                  onClick={() => {
                                    setOpenKebab(null);
                                    setDeactivateTarget(passenger);
                                  }}
                                >
                                  Deactivate Account
                                </button>
                                <button
                                  className={styles.kebabItem}
                                  onClick={() => {
                                    setOpenKebab(null);
                                    setSuspendTarget(passenger);
                                  }}
                                >
                                  Suspend User
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredPassengers.length === 0 && (
                    <tr>
                      <td colSpan={8} className={styles.emptyRow}>
                        No passengers found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              resultsPerPage={resultsPerPage}
              onPageChange={setCurrentPage}
              variant="table"
            />
          </div>
        </>
      )}

      {/* Suspend User Modal */}
      <SuspendDriverModal
        isOpen={!!suspendTarget}
        driverName={suspendTarget?.name ?? ""}
        onDismiss={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
      />

      {/* Deactivate User Modal */}
      <ConfirmActionModal
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Account"
        message={`Are you sure you want to deactivate ${deactivateTarget?.name}'s account? The user will not be able to log in or request rides.`}
        confirmText="Deactivate Account"
        variant="danger"
        isLoading={isActionLoading}
      />
    </div>
  );
}

/* ─── SVG Icons ─── */
function SearchGlassIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#344054" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}

function SolidBlueStarIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="#2F68FE" stroke="#2F68FE" strokeWidth={1}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
