"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import SuspendDriverModal from "@/components/admin/SuspendDriverModal";
import DriverDetailView from "@/components/admin/DriverDetailView";
import FilterDropdown from "@/components/admin/FilterDropdown";
import SortDropdown from "@/components/admin/SortDropdown";
import AddDriverModal from "@/components/admin/AddDriverModal";
import Spinner from "@/components/admin/Spinner";
import MoreIcon from "@/components/admin/icons/MoreIcon";
import { type Driver, driversService } from "@/services/drivers-service";
import styles from "./drivers.module.css";

type TabType = "pending" | "drivers";

export interface PendingDriverItem {
  id: string;
  name: string;
  driverCode: string;
  phone: string;
  email: string;
  status: "Under Review" | "Pending" | "Verified" | "Rejected";
  avatar?: string;
  licenseNumber?: string;
}

const INITIAL_PENDING_DRIVERS: PendingDriverItem[] = [
  {
    id: "pend-1",
    name: "Bessie Cooper",
    driverCode: "DRI-ID01-123",
    phone: "(252) 555-0126",
    email: "sara.cruz@example.com",
    status: "Under Review",
    avatar: "/images/reliableandsecure-female.png",
  },
  {
    id: "pend-2",
    name: "Jacob Jones",
    driverCode: "DRI-ID01-123",
    phone: "(205) 555-0100",
    email: "alma.lawson@example.com",
    status: "Pending",
    avatar: "/images/man-img.png",
  },
  {
    id: "pend-3",
    name: "Courtney Henry",
    driverCode: "DRI-ID01-123",
    phone: "(307) 555-0133",
    email: "michael.mitc@example.com",
    status: "Verified",
    avatar: "/images/man-img.png",
  },
  {
    id: "pend-4",
    name: "Jerome Bell",
    driverCode: "DRI-ID01-123",
    phone: "(603) 555-0123",
    email: "willie.jennings@example.com",
    status: "Rejected",
    avatar: "/images/reliableandsecure-female.png",
  },
  {
    id: "pend-5",
    name: "Dianne Russell",
    driverCode: "DRI-ID01-123",
    phone: "(319) 555-0115",
    email: "kenzi.lawson@example.com",
    status: "Pending",
    avatar: "/images/man-img.png",
  },
  {
    id: "pend-6",
    name: "Cameron Williamson",
    driverCode: "DRI-ID01-123",
    phone: "(201) 555-0124",
    email: "debbie.baker@example.com",
    status: "Rejected",
    avatar: "/images/man-img.png",
  },
];

export default function DriversPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<PendingDriverItem[]>(INITIAL_PENDING_DRIVERS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<Driver | PendingDriverItem | null>(null);
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("Name A to Z");
  const [activeDriverFilters, setActiveDriverFilters] = useState<{ status: string[] }>({ status: [] });

  const [activeDropdown, setActiveDropdown] = useState<"filter" | "sort" | null>(null);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const data = await driversService.getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
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

  /* ─── Filter & Sort for Active Tab ─── */
  const filteredDrivers = (() => {
    let result = drivers.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.driverCode && d.driverCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.phone.includes(searchQuery)
    );

    if (activeDriverFilters.status && activeDriverFilters.status.length > 0) {
      result = result.filter((d) => activeDriverFilters.status.includes(d.status));
    }

    if (sortOption === "Name A to Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Name Z to A") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  })();

  const filteredPendingDrivers = (() => {
    let result = pendingDrivers.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.driverCode && d.driverCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.phone.includes(searchQuery)
    );

    if (activeDriverFilters.status && activeDriverFilters.status.length > 0) {
      result = result.filter((d) => activeDriverFilters.status.includes(d.status));
    }

    if (sortOption === "Name A to Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Name Z to A") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  })();

  const resultsPerPage = 9;
  const currentListLength =
    activeTab === "pending" ? filteredPendingDrivers.length : filteredDrivers.length;
  const totalPages = Math.max(1, Math.ceil(currentListLength / resultsPerPage));

  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const paginatedPendingDrivers = filteredPendingDrivers.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  /* ─── Suspend handler ─── */
  const handleSuspendConfirm = async (reason?: string) => {
    if (!suspendTarget) return;
    try {
      await driversService.suspendUser(suspendTarget.id, reason || "User suspended by admin");
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === suspendTarget.id
            ? { ...d, status: "Suspended" as const, availability: "Offline" as const }
            : d
        )
      );
      setPendingDrivers((prev) =>
        prev.map((d) =>
          d.id === suspendTarget.id ? { ...d, status: "Rejected" as const } : d
        )
      );
      setSuspendTarget(null);
    } catch (error) {
      console.error("Failed to suspend user:", error);
      throw error;
    }
  };

  /* ─── Deactivate handler ─── */
  const handleDeactivate = async (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId ? { ...d, status: "Deactivated" as const } : d
      )
    );
  };

  /* ─── Add Driver Handler ─── */
  const handleAddDriverSuccess = (newDriver: {
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
  }) => {
    const createdItem: PendingDriverItem = {
      id: `pend-${Date.now()}`,
      name: newDriver.name,
      driverCode: `DRI-ID01-${Math.floor(100 + Math.random() * 900)}`,
      phone: newDriver.phone,
      email: newDriver.email,
      status: "Under Review",
      avatar: "/images/admin/profile-Avatar.svg",
      licenseNumber: newDriver.licenseNumber,
    };
    setPendingDrivers((prev) => [createdItem, ...prev]);
    setActiveTab("pending");
  };

  /* ─── Detail view ─── */
  const selectedDriver = (() => {
    if (!selectedDriverId) return null;
    const fromDrivers = drivers.find((d) => d.id === selectedDriverId);
    if (fromDrivers) return fromDrivers;

    const fromPending = pendingDrivers.find((d) => d.id === selectedDriverId);
    if (fromPending) {
      const fallback: Driver = {
        id: fromPending.id,
        name: fromPending.name,
        driverCode: fromPending.driverCode,
        avatar: fromPending.avatar || "/images/man-img.png",
        rating: 5,
        phone: fromPending.phone,
        email: fromPending.email,
        licenseNo: fromPending.licenseNumber || "LGST1234-WRE-ERTYUI-2345678",
        licenseStatus: "Valid",
        status: fromPending.status === "Verified" ? "Active" : "Inactive",
        availability: "Available",
        location: "Lagos, Nigeria",
        totalTrips: 0,
        reports: 0,
        currentBooking: null,
        assignedTrips: 0,
        verificationStatus: fromPending.status === "Verified" ? "Verified" : "Unverified",
        accountNumber: "123456789098",
        bankName: "Zenith Bank",
        totalEarnings: "$0.00",
        tripsHistory: [],
        documents: {
          driversLicense: { label: "Drivers License", filename: "drivers_license.pdf", size: "120 KB" },
          vehicleDocuments: { label: "Vehicle Documents", filename: "vehicle_documents.pdf", size: "120 KB" },
          nin: { label: "NIN", filename: "nin_document.pdf", size: "120 KB" },
        },
      };
      return fallback;
    }
    return null;
  })();

  if (selectedDriverId && selectedDriver) {
    return (
      <DriverDetailView
        driver={selectedDriver}
        onBack={() => setSelectedDriverId(null)}
        onSuspend={(id) => {
          setDrivers((prev) =>
            prev.map((d) =>
              d.id === id
                ? { ...d, status: "Suspended" as const, availability: "Offline" as const }
                : d
            )
          );
        }}
        onDeactivate={(id) => handleDeactivate(id)}
      />
    );
  }

  return (
    <div className={styles.page}>
      {/* ─── Tabs Navigation ─── */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === "pending" ? styles.tabBtnActive : ""}`}
          onClick={() => {
            setActiveTab("pending");
            setCurrentPage(1);
          }}
          id="tab-pending-drivers"
        >
          Pending Drivers
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "drivers" ? styles.tabBtnActive : ""}`}
          onClick={() => {
            setActiveTab("drivers");
            setCurrentPage(1);
          }}
          id="tab-drivers"
        >
          Drivers
        </button>
      </div>

      {/* ─── Toolbar (Search, Filter, Sort by, Add Driver) ─── */}
      <div className={styles.toolbar} id="drivers-toolbar">
        <div className={styles.toolbarLeft}>
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

          <div className={styles.actionsWrap}>
            {/* Filter Popover */}
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
                        options:
                          activeTab === "pending"
                            ? ["Under Review", "Pending", "Verified", "Rejected"]
                            : ["Active", "Inactive", "Suspended", "Deactivated"],
                      },
                    ]}
                    onApply={(filters) => {
                      setActiveDriverFilters({ status: filters.status || [] });
                      setActiveDropdown(null);
                    }}
                    onClose={() => setActiveDropdown(null)}
                  />
                </div>
              )}
            </div>

            {/* Sort By Popover */}
            <div
              className={styles.popoverWrapper}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.toolBtn}
                onClick={() =>
                  setActiveDropdown((prev) => (prev === "sort" ? null : "sort"))
                }
                id="sort-btn"
              >
                <SortIcon />
                Sort by
              </button>
              {activeDropdown === "sort" && (
                <div className={styles.dropdownContainer}>
                  <SortDropdown
                    options={[
                      { label: "Name A to Z", value: "Name A to Z" },
                      { label: "Name Z to A", value: "Name Z to A" },
                    ]}
                    onSortSelect={(val) => {
                      setSortOption(val);
                      setActiveDropdown(null);
                    }}
                    onClose={() => setActiveDropdown(null)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Add Driver Button (Screenshot 1) */}
        <div className={styles.toolbarRight}>
          <button
            className={styles.addDriverBtn}
            onClick={() => setIsAddDriverOpen(true)}
            id="add-driver-btn"
          >
            <PlusIcon />
            Add Driver
          </button>
        </div>
      </div>

      {/* ─── Drivers Table ─── */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      ) : activeTab === "pending" ? (
        /* ─── Pending Drivers Table (Screenshot 1) ─── */
        <div className={styles.tableCard} id="pending-drivers-table">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th className={styles.actionsHeader} />
                </tr>
              </thead>
              <tbody>
                {paginatedPendingDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className={styles.tableRow}
                    onClick={() => setSelectedDriverId(driver.id)}
                  >
                    {/* Name + Driver ID */}
                    <td>
                      <div className={styles.driverCell}>
                        <div className={styles.avatarWrap}>
                          <Image
                            src={driver.avatar || "/images/admin/profile-Avatar.svg"}
                            alt={driver.name}
                            width={40}
                            height={40}
                            className={styles.avatarImg}
                            unoptimized={Boolean(driver.avatar?.startsWith("http"))}
                          />
                        </div>
                        <div className={styles.driverInfo}>
                          <span className={styles.driverName}>{driver.name}</span>
                          <span className={styles.driverCode}>
                            {driver.driverCode || `DRI-ID01-${driver.id}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone Number */}
                    <td className={styles.phoneCell}>{driver.phone}</td>

                    {/* Email */}
                    <td className={styles.emailCell}>
                      <span title={driver.email}>{driver.email}</span>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <PendingDriverStatusBadge status={driver.status} />
                    </td>

                    {/* Kebab Action */}
                    <td
                      className={styles.actionsCol}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.kebabWrap}>
                        <button
                          className={styles.moreBtn}
                          aria-label={`Actions for ${driver.name}`}
                          id={`kebab-${driver.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenKebab((prev) =>
                              prev === driver.id ? null : driver.id
                            );
                          }}
                        >
                          <MoreIcon />
                        </button>

                        {/* Kebab Menu Popup */}
                        {openKebab === driver.id && (
                          <div className={styles.kebabMenu}>
                            <button
                              className={styles.kebabItem}
                              onClick={() => {
                                setOpenKebab(null);
                                setSelectedDriverId(driver.id);
                              }}
                            >
                              View Details
                            </button>
                            <button
                              className={styles.kebabItem}
                              onClick={() => {
                                setOpenKebab(null);
                                setPendingDrivers((prev) =>
                                  prev.map((d) =>
                                    d.id === driver.id
                                      ? { ...d, status: "Verified" as const }
                                      : d
                                  )
                                );
                              }}
                            >
                              Verify Driver
                            </button>
                            <button
                              className={styles.kebabItem}
                              onClick={() => {
                                setOpenKebab(null);
                                setSuspendTarget(driver);
                              }}
                            >
                              Suspend Driver
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPendingDrivers.length === 0 && (
                  <tr>
                    <td colSpan={5} className={styles.emptyRow}>
                      No pending drivers found.
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
      ) : (
        /* ─── All Drivers Table ─── */
        <div className={styles.tableCard} id="drivers-table">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Total Trips</th>
                  <th>Account Status</th>
                  <th>Ratings</th>
                  <th className={styles.actionsHeader} />
                </tr>
              </thead>
              <tbody>
                {paginatedDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className={styles.tableRow}
                    onClick={() => setSelectedDriverId(driver.id)}
                  >
                    {/* Name + Driver ID */}
                    <td>
                      <div className={styles.driverCell}>
                        <div className={styles.avatarWrap}>
                          <Image
                            src={driver.avatar || "/images/admin/profile-Avatar.svg"}
                            alt={driver.name}
                            width={40}
                            height={40}
                            className={styles.avatarImg}
                            unoptimized={Boolean(driver.avatar?.startsWith("http"))}
                          />
                        </div>
                        <div className={styles.driverInfo}>
                          <span className={styles.driverName}>{driver.name}</span>
                          <span className={styles.driverCode}>
                            {driver.driverCode || `DRI-ID01-${driver.id}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone Number */}
                    <td className={styles.phoneCell}>{driver.phone}</td>

                    {/* Email */}
                    <td className={styles.emailCell}>
                      <span title={driver.email}>{driver.email}</span>
                    </td>

                    {/* Total Trips */}
                    <td className={styles.tripsCell}>{driver.totalTrips}</td>

                    {/* Account Status */}
                    <td>
                      <DriverStatusBadge status={driver.status} />
                    </td>

                    {/* Ratings */}
                    <td>
                      <div className={styles.ratingCell}>
                        <SolidBlueStarIcon />
                        <span className={styles.ratingNum}>
                          {Math.round(driver.rating)}
                        </span>
                      </div>
                    </td>

                    {/* Kebab Action */}
                    <td
                      className={styles.actionsCol}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.kebabWrap}>
                        <button
                          className={styles.moreBtn}
                          aria-label={`Actions for ${driver.name}`}
                          id={`kebab-${driver.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenKebab((prev) =>
                              prev === driver.id ? null : driver.id
                            );
                          }}
                        >
                          <MoreIcon />
                        </button>

                        {/* Kebab Menu Popup */}
                        {openKebab === driver.id && (
                          <div className={styles.kebabMenu}>
                            <button
                              className={styles.kebabItem}
                              onClick={() => {
                                setOpenKebab(null);
                                setSelectedDriverId(driver.id);
                              }}
                            >
                              View Details
                            </button>
                            <button
                              className={styles.kebabItem}
                              onClick={() => {
                                setOpenKebab(null);
                                handleDeactivate(driver.id);
                              }}
                            >
                              Deactivate Driver
                            </button>
                            <button
                              className={styles.kebabItem}
                              onClick={() => {
                                setOpenKebab(null);
                                setSuspendTarget(driver);
                              }}
                            >
                              Suspend Driver
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDrivers.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      No drivers found.
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

      {/* Suspend Driver Modal */}
      <SuspendDriverModal
        isOpen={!!suspendTarget}
        driverName={suspendTarget?.name ?? ""}
        onDismiss={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
      />

      {/* Add New Driver Modal (Screenshot 2) */}
      <AddDriverModal
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        onAddDriver={handleAddDriverSuccess}
      />
    </div>
  );
}

/* ─── Status Badges ─── */
function DriverStatusBadge({ status }: { status: string }) {
  if (status === "Suspended") {
    return <span className={`${styles.badge} ${styles.badgeSuspended}`}>Suspended</span>;
  }
  if (status === "Deactivated") {
    return (
      <span className={`${styles.badge} ${styles.badgeDeactivated}`}>
        <span className={styles.badgeDot} />
        Deactivated
      </span>
    );
  }
  if (status === "Inactive") {
    return (
      <span className={`${styles.badge} ${styles.badgeInactive}`}>
        <span className={styles.badgeDot} />
        Inactive
      </span>
    );
  }
  return (
    <span className={`${styles.badge} ${styles.badgeActive}`}>
      <span className={styles.badgeDot} />
      Active
    </span>
  );
}

function PendingDriverStatusBadge({
  status,
}: {
  status: "Under Review" | "Pending" | "Verified" | "Rejected";
}) {
  if (status === "Under Review") {
    return (
      <span className={styles.badgeUnderReview}>
        <ClockOrangeIcon />
        Under Review
      </span>
    );
  }
  if (status === "Pending") {
    return (
      <span className={styles.badgePending}>
        <SlashCircleIcon />
        Pending
      </span>
    );
  }
  if (status === "Verified") {
    return (
      <span className={styles.badgeVerified}>
        <CheckCircleGreenIcon />
        Verified
      </span>
    );
  }
  return (
    <span className={styles.badgeRejected}>
      <XCircleRedIcon />
      Rejected
    </span>
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

function SortIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#344054" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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

function PlusIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ClockOrangeIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#F79009" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SlashCircleIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

function CheckCircleGreenIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11.5 14.5 16 10" />
    </svg>
  );
}

function XCircleRedIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#F04438" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
