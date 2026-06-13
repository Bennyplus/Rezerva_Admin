"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import AddDriverModal from "@/components/admin/AddDriverModal";
import SuspendDriverModal from "@/components/admin/SuspendDriverModal";
import DriverDetailView from "@/components/admin/DriverDetailView";
import FilterBar from "@/components/admin/FilterBar";
import Spinner from "@/components/admin/Spinner";
import { type Driver } from "@/data/admin-drivers";
import { driversService } from "@/services/drivers-service";
import styles from "./drivers.module.css";

type ViewMode = "list" | "grid";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<Driver | null>(null);
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const data = await driversService.getDrivers();
      setDrivers(data);
      if (data.length === 0) setIsEmpty(true);
      else setIsEmpty(false);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

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
  const handleAddDriver = async (data: {
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    passportPhoto: File | null;
    proofOfAddress: File | null;
    driversLicense: File | null;
    nin: File | null;
  }) => {
    try {
      const formData = new FormData();
      formData.append("full_name", data.name);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone);
      formData.append("license_number", data.licenseNumber);
      if (data.driversLicense) formData.append("drivers_license", data.driversLicense);
      if (data.nin) formData.append("nin_document", data.nin);
      if (data.passportPhoto) formData.append("passport_photo", data.passportPhoto);

      await driversService.addDriver(formData);
      showToast(`${data.name} has been successfully added as a driver.`);
      fetchDrivers(); // refresh list
    } catch (error) {
      console.error("Failed to add driver:", error);
      showToast("Failed to add driver. Please try again.");
    }
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

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <Spinner />
        </div>
      ) : isEmpty ? (
        <div className={styles.emptyCard} id="drivers-empty-state">
          <div className={styles.illustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No drivers illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>No drivers yet</h2>
          <p className={styles.emptySubtitle}>Add your first driver to start assigning trips</p>
          <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon />
            Add Driver
          </button>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className={styles.toolbar} id="drivers-toolbar">
            <div className={styles.toolbarLeft}>
              <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
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
                      <th className={styles.checkCol}>
                        <input type="checkbox" className={styles.checkbox} aria-label="Select all drivers" />
                      </th>
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
                        <td className={styles.checkCol} onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className={styles.checkbox} aria-label={`Select driver ${driver.name}`} />
                        </td>
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
                        <td colSpan={8} className={styles.emptyRow}>No drivers found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredDrivers.length > 10 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  resultsPerPage={resultsPerPage}
                  onPageChange={setCurrentPage}
                  variant="table"
                />
              )}
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
              {filteredDrivers.length > 10 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  resultsPerPage={6}
                  onPageChange={setCurrentPage}
                  variant="standalone"
                />
              )}
            </>
          )}
        </>
      )}

      {/* Dev toggle */}
      {/* <div className={styles.devToggleWrap}>
        <button
          className={styles.stateToggle}
          onClick={() => setIsEmpty((v) => !v)}
          id="toggle-drivers-state"
        >
          {isEmpty ? "Show Populated State" : "Show Empty State"} →
        </button>
      </div> */}

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
    status === "Active" ? styles.badgeActive :
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

function PlusIcon() { return <svg {...ip}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function GridIcon() { return <svg {...ip} strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>; }
function ListIcon() { return <svg {...ip} strokeWidth={1.8}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>; }
function MoreIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }
function LocationIcon() { return <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>; }
function CheckCircleIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>; }
function XSmall() { return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }
