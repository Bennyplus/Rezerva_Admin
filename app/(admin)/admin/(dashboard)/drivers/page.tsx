"use client";

import { useState } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import AddDriverModal from "@/components/admin/AddDriverModal";
import SuspendDriverModal from "@/components/admin/SuspendDriverModal";
import DriverDetailView from "@/components/admin/DriverDetailView";
import { ADMIN_DRIVERS, DRIVER_STATS, type Driver } from "@/data/admin-drivers";
import styles from "./drivers.module.css";

type ViewMode = "list" | "grid";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(ADMIN_DRIVERS);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<Driver | null>(null);
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalPages = 16;
  const resultsPerPage = 9;

  /* Filter */
  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.licenseNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ─── Detail view ─── */
  const selectedDriver = drivers.find((d) => d.id === selectedDriverId);
  if (selectedDriverId && selectedDriver) {
    return (
      <DriverDetailView
        driver={selectedDriver}
        onBack={() => setSelectedDriverId(null)}
        onSuspend={(id) => {
          const d = drivers.find((dr) => dr.id === id);
          if (d) setSuspendTarget(d);
        }}
      />
    );
  }

  /* ─── Add driver handler ─── */
  const handleAddDriver = (data: {
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    passportPhoto: File | null;
    proofOfAddress: File | null;
    driversLicense: File | null;
    nin: File | null;
  }) => {
    const newDriver: Driver = {
      id: `drv-${Date.now()}`,
      name: data.name,
      avatar: "/images/admin/profile-Avatar.svg",
      rating: 0,
      phone: data.phone,
      email: data.email,
      licenseNo: data.licenseNumber,
      licenseStatus: "Valid",
      status: "Active",
      availability: "Available",
      location: "Lagos",
      totalTrips: 0,
      reports: 0,
      currentBooking: null,
      assignedTrips: 0,
      bookingHistory: [],
      documents: {
        driversLicense: { label: "Drivers License", filename: data.driversLicense?.name ?? "—", size: "—" },
        nin: { label: "NIN", filename: data.nin?.name ?? "—", size: "—" },
        proofOfAddress: { label: "Proof Of Address", filename: data.proofOfAddress?.name ?? "—", size: "—" },
        nin2: { label: "NIN", filename: data.nin?.name ?? "—", size: "—" },
      },
    };
    setDrivers((prev) => [newDriver, ...prev]);
    showToast(`${data.name} has been successfully added as a driver.`);
  };

  /* ─── Suspend handler ─── */
  const handleSuspendConfirm = () => {
    if (!suspendTarget) return;
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === suspendTarget.id ? { ...d, status: "Suspended", availability: "Offline" } : d
      )
    );
    showToast(`${suspendTarget.name} has been suspended.`);
    setSuspendTarget(null);
    // Also exit detail view if we're in one
    setSelectedDriverId(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className={styles.page} onClick={() => setOpenKebab(null)}>
      {/* Toast */}
      {toastMessage && (
        <div className={styles.toastWrapper}>
          <div className={styles.toast}>
            <CheckCircleIcon />
            {toastMessage}
            <button
              className={styles.toastClose}
              onClick={() => setToastMessage(null)}
              aria-label="Close notification"
            >
              <XSmall />
            </button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className={styles.statsGrid} id="drivers-stats">
        {DRIVER_STATS.map((stat) => (
          <StatCard key={stat.id} label={stat.label} value={stat.value} id={`stat-${stat.id}`} />
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar} id="drivers-toolbar">
        <div className={styles.toolbarLeft}>
          {/* Search */}
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              id="drivers-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Filter */}
          <button className={styles.toolBtn} id="drivers-filter-btn">
            <FilterIcon /> Filter
          </button>
          {/* Sort */}
          <button className={styles.toolBtn} id="drivers-sort-btn">
            <SortIcon /> Sort by
          </button>
          {/* View toggles */}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              id="drivers-grid-view"
            >
              <GridIcon />
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
              id="drivers-list-view"
            >
              <ListIcon />
            </button>
          </div>
        </div>
        <div className={styles.toolbarRight}>
          <button
            className={styles.addBtnSmall}
            id="add-driver-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusIcon /> Add Driver
          </button>
        </div>
      </div>

      {/* ─── List View ─── */}
      {viewMode === "list" ? (
        <div className={styles.tableCard} id="drivers-table">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Drivers License</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className={styles.tableRow}
                    onClick={() => setSelectedDriverId(driver.id)}
                  >
                    <td>
                      <div className={styles.driverCell}>
                        <div className={styles.avatarWrap}>
                          <Image
                            src={driver.avatar}
                            alt={driver.name}
                            width={36}
                            height={36}
                            className={styles.avatarImg}
                          />
                        </div>
                        <div className={styles.driverInfo}>
                          <span className={styles.driverName}>{driver.name}</span>
                          <span className={styles.driverRating}>{driver.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </td>
                    <td>{driver.phone}</td>
                    <td className={styles.emailCell}>{driver.email}</td>
                    <td>{driver.licenseNo}</td>
                    <td>
                      <DriverStatusBadge status={driver.status} />
                    </td>
                    <td>{driver.location}</td>
                    <td
                      className={styles.actionsCol}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.kebabWrap}>
                        <button
                          className={styles.moreBtn}
                          aria-label={`More actions for ${driver.name}`}
                          id={`kebab-${driver.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenKebab((prev) => (prev === driver.id ? null : driver.id));
                          }}
                        >
                          <MoreIcon />
                        </button>
                        {openKebab === driver.id && (
                          <div className={styles.kebabMenu}>
                            <button
                              className={styles.kebabItem}
                              onClick={() => { setOpenKebab(null); setSelectedDriverId(driver.id); }}
                            >
                              View
                            </button>
                            <button
                              className={`${styles.kebabItem} ${styles.kebabItemDanger}`}
                              onClick={() => { setOpenKebab(null); setSuspendTarget(driver); }}
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
                    <td colSpan={7} className={styles.emptyRow}>No drivers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            resultsPerPage={resultsPerPage}
            onPageChange={setCurrentPage}
            variant="table"
          />
        </div>
      ) : (
        /* ─── Grid View ─── */
        <>
          <div className={styles.cardGrid} id="drivers-grid">
            {filteredDrivers.slice(0, 6).map((driver) => (
              <div
                key={driver.id}
                className={styles.driverCard}
                onClick={() => setSelectedDriverId(driver.id)}
              >
                {/* Full-bleed photo */}
                <div className={styles.cardPhoto}>
                  <Image
                    src={driver.avatar}
                    alt={driver.name}
                    width={400}
                    height={240}
                    className={styles.cardPhotoImg}
                  />
                  {/* Overlay row */}
                  <div className={styles.cardOverlay}>
                    <span className={styles.cardLocation}>
                      <LocationIcon /> {driver.location}
                    </span>
                    <DriverStatusBadge status={driver.status} />
                  </div>
                </div>
                {/* Card info */}
                <div className={styles.cardBody}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardName}>{driver.name}</span>
                    <span className={styles.cardEmail}>{driver.email}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardPhone}>{driver.phone}</span>
                    <span className={styles.cardLicense}>{driver.licenseNo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            resultsPerPage={6}
            onPageChange={setCurrentPage}
            variant="standalone"
          />
        </>
      )}

      {/* Modals */}
      <AddDriverModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDriver}
      />
      <SuspendDriverModal
        isOpen={!!suspendTarget}
        driverName={suspendTarget?.name ?? ""}
        onDismiss={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
      />
    </div>
  );
}

/* ─── Status Badge ─── */
function DriverStatusBadge({ status }: { status: string }) {
  const cls =
    status === "Active"    ? styles.badgeActive :
    status === "Suspended" ? styles.badgeSuspended :
    styles.badgeInactive;
  return (
    <span className={`${styles.badge} ${cls}`}>
      <span className={styles.badgeDot} />
      {status}
    </span>
  );
}

/* ─── Inline Icons ─── */
const s = 16;
const ip = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function PlusIcon()   { return <svg {...ip}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function SearchIcon() { return <svg {...ip} strokeWidth={1.8}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>; }
function FilterIcon() { return <svg {...ip} strokeWidth={1.8}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>; }
function SortIcon()   { return <svg {...ip} strokeWidth={1.8}><line x1="4" y1="6" x2="13" y2="6" /><line x1="4" y1="12" x2="10" y2="12" /><line x1="4" y1="18" x2="7" y2="18" /><line x1="18" y1="6" x2="18" y2="18" /><polyline points="15 15 18 18 21 15" /></svg>; }
function GridIcon()   { return <svg {...ip} strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>; }
function ListIcon()   { return <svg {...ip} strokeWidth={1.8}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>; }
function MoreIcon()   { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }
function LocationIcon() { return <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>; }
function CheckCircleIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>; }
function XSmall() { return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }
