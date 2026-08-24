"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import Pagination from "@/components/admin/Pagination";
import { AdminVehicle, VEHICLE_STATS_EMPTY } from "@/data/admin-vehicles";
import { vehiclesService } from "@/services/vehicles-service";
import FilterBar from "@/components/admin/FilterBar";
import VehicleDetailsModal from "@/components/admin/VehicleDetailsModal";
import DeclineVehicleModal from "@/components/admin/DeclineVehicleModal";
import VehiclesFilterModal from "@/components/admin/VehiclesFilterModal";
import SortDropdown from "@/components/admin/SortDropdown";
import styles from "./vehicles.module.css";

type ViewMode = "list" | "grid";

function VehiclesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilters = {
    status: searchParams.get("status") || "",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    seats: searchParams.get("seats") || "",
    fuel_type: searchParams.get("fuel_type") || "",
    transmission: searchParams.get("transmission") || "",
  };

  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSort, setLocalSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [vehicleToDecline, setVehicleToDecline] = useState<AdminVehicle | null>(
    null,
  );
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<AdminVehicle | null>(
    null,
  );

  const [stats, setStats] = useState(VEHICLE_STATS_EMPTY);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(9);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiFilters: Record<string, string> = {};
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value) apiFilters[key] = value;
        });

        const rawData =
          activeTab === "pending"
            ? await vehiclesService.getPendingVehicles(currentPage, apiFilters)
            : await vehiclesService.getVehicles(currentPage, apiFilters);
        const vehicleList: any[] = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData.results)
            ? rawData.results
            : Array.isArray(rawData.vehicles)
              ? rawData.vehicles
              : [];

        const mappedVehicles: AdminVehicle[] = vehicleList.map(
          (v: any, index: number) => {
            const rawStatus = v.status ? String(v.status).toLowerCase() : "";
            let mappedStatus: AdminVehicle["status"] = "Available";
            if (rawStatus.includes("maintenance")) mappedStatus = "Maintenance";
            else if (rawStatus.includes("book")) mappedStatus = "Booked";
            else if (rawStatus.includes("inactive")) mappedStatus = "Inactive";
            else if (rawStatus.includes("available"))
              mappedStatus = "Available";

            const carName = v.car || v.model || v.name || "Toyota Camry";
            const brandName =
              typeof v.brand === "string"
                ? v.brand
                : carName.split(" ")[0] || "Toyota";

            const primaryDoc =
              v.documents && v.documents.length > 0
                ? v.documents[0].file
                : null;
            const img =
              v.image && v.image.length > 0
                ? Array.isArray(v.image)
                  ? v.image.find((i: any) => i.is_primary)?.image ||
                    v.image[0].image
                  : v.image
                : primaryDoc || "/images/3rd-img.png";

            return {
              id: v.id ?? index + 1,
              name: carName,
              brand: brandName,
              driverName: v.driver_name || "Fade Bayo",
              plateNumber: v.plate_number || v.chasis_number || "KTU-812-FP",
              image: img,
              images: Array.isArray(v.image)
                ? v.image
                : v.documents
                  ? v.documents.map((d: any) => ({
                      image: d.file,
                      is_primary: true,
                    }))
                  : [],
              category: typeof v.category === "string" ? v.category : "Sedan",
              dailyPrice: parseFloat(v.daily_price || v.dailyPrice) || 0,
              capacity: parseInt(v.capacity) || 4,
              status: mappedStatus,
              chassisNo: v.plate_number || v.chasis_number || "N/A",
              location: v.location || "Lagos",
              documents: v.documents || [],
            };
          },
        );

        setVehicles(mappedVehicles);
        setTotalPages(
          rawData.total_pages ||
            (Array.isArray(rawData)
              ? 1
              : Math.ceil((rawData.count || mappedVehicles.length) / 9)) ||
            1,
        );
        setResultsPerPage(rawData.results_per_page || 9);

        const total =
          rawData.total_vehicles !== undefined
            ? rawData.total_vehicles
            : mappedVehicles.length;
        const available =
          rawData.available_vehicles !== undefined
            ? rawData.available_vehicles
            : mappedVehicles.filter((v) => v.status === "Available").length;
        const booked =
          rawData.booked_vehicles !== undefined
            ? rawData.booked_vehicles
            : mappedVehicles.filter((v) => v.status === "Booked").length;
        const maintenance =
          rawData.under_maintenance !== undefined
            ? rawData.under_maintenance
            : mappedVehicles.filter((v) => v.status === "Maintenance").length;

        setStats([
          { id: "total-vehicles", label: "Total Vehicles", value: total },
          {
            id: "available-vehicles",
            label: "Available Vehicles",
            value: available,
          },
          { id: "booked-vehicles", label: "Booked Vehicles", value: booked },
          {
            id: "under-maintenance",
            label: "Under maintenance",
            value: maintenance,
          },
        ]);
      } catch (error) {
        console.error("Failed to load vehicle data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchParams, activeTab]);

  const handleTabChange = (tab: "all" | "pending") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuIndex !== null) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuIndex]);

  const toggleSelectAll = () => {
    if (selectedRows.size === currentList.length && currentList.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentList.map((_, i: number) => i)));
    }
  };

  const toggleRow = (idx: number) => {
    const next = new Set(selectedRows);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedRows(next);
  };

  const handleApprove = async (vehicle: AdminVehicle) => {
    try {
      setOpenMenuIndex(null);
      await vehiclesService.approveVehicle(vehicle.id!);
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicle.id ? { ...v, status: "Available" } : v,
        ),
      );
    } catch (error) {
      console.error("Failed to approve vehicle:", error);
    }
  };

  const handleDeclineClick = (vehicle: AdminVehicle) => {
    setOpenMenuIndex(null);
    setVehicleToDecline(vehicle);
    setDeclineModalOpen(true);
  };

  const handleConfirmDecline = async (reason: string) => {
    if (!vehicleToDecline) return;
    try {
      await vehiclesService.declineVehicle(vehicleToDecline.id!, reason);
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleToDecline.id ? { ...v, status: "Inactive" } : v,
        ),
      );
    } catch (error) {
      console.error("Failed to decline vehicle:", error);
    }
  };

  const handleViewDocuments = async (vehicle: AdminVehicle) => {
    setOpenMenuIndex(null);
    try {
      const docs = await vehiclesService.getVehicleDocuments(vehicle.id!);
      setSelectedVehicle({
        ...vehicle,
        documents: docs && docs.length > 0 ? docs : vehicle.documents,
      });
    } catch (error) {
      console.error("Failed to fetch vehicle documents:", error);
      setSelectedVehicle(vehicle);
    }
    setShowDetailModal(true);
  };

  const handleApplyFilters = (filters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortSelect = (sort: string) => {
    setLocalSort(sort);
  };

  // Filtered dataset
  const displayedVehicles = vehicles
    .filter((v) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(query) ||
        v.brand.toLowerCase().includes(query) ||
        (v.driverName && v.driverName.toLowerCase().includes(query)) ||
        (v.plateNumber && v.plateNumber.toLowerCase().includes(query)) ||
        v.category.toLowerCase().includes(query) ||
        v.chassisNo.toLowerCase().includes(query) ||
        (v.location && v.location.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      if (!localSort) return 0;
      switch (localSort) {
        case "model_asc":
          return a.name.localeCompare(b.name);
        case "model_desc":
          return b.name.localeCompare(a.name);
        case "price_asc":
          return a.dailyPrice - b.dailyPrice;
        case "price_desc":
          return b.dailyPrice - a.dailyPrice;
        default:
          return 0;
      }
    });

  // Current list depending on active tab
  const currentList = displayedVehicles;

  const isEmpty = currentList.length === 0;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          minHeight: "60vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Tabs Bar ── */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabItem} ${activeTab === "all" ? styles.tabItemActive : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All
        </button>
        <button
          className={`${styles.tabItem} ${activeTab === "pending" ? styles.tabItemActive : ""}`}
          onClick={() => handleTabChange("pending")}
        >
          Pending Vehicles
        </button>
      </div>

      {isEmpty ? (
        /* ── Empty State ── */
        <div className={styles.emptyCard} id="vehicles-empty-state">
          <div className={styles.illustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No vehicles illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>
            {activeTab === "pending"
              ? "No pending vehicles"
              : "No vehicles yet"}
          </h2>
          <p className={styles.emptySubtitle}>
            {activeTab === "pending"
              ? "All submitted vehicles have been reviewed."
              : "No vehicles available at this time"}
          </p>
        </div>
      ) : (
        /* ── Populated State ── */
        <>
          {/* Toolbar */}
          <div className={styles.toolbar} id="vehicles-toolbar">
            <div className={styles.toolbarLeft}>
              <FilterBar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filterDropdown={
                  <VehiclesFilterModal
                    isOpen={true}
                    onClose={() => {}}
                    onApply={handleApplyFilters}
                    onClear={() => router.push(pathname)}
                    initialFilters={currentFilters}
                  />
                }
                sortDropdown={
                  <SortDropdown
                    options={[
                      { label: "Model A to Z", value: "model_asc" },
                      { label: "Model Z to A", value: "model_desc" },
                      { label: "Price Low to High", value: "price_asc" },
                      { label: "Price High to Low", value: "price_desc" },
                    ]}
                    onSortSelect={handleSortSelect}
                  />
                }
              />

              {activeTab === "all" && (
                /* View toggles */
                <div className={styles.viewToggle}>
                  <button
                    className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <GridIcon />
                  </button>
                  <button
                    className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <ListIcon />
                  </button>
                </div>
              )}
            </div>
          </div>

          {activeTab === "pending" ? (
            /* ── Pending Vehicles Table matching Screenshot ── */
            <div className={styles.tableCard} id="pending-vehicles-table">
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Driver Name</th>
                      <th>Name and Model</th>
                      <th>Insurance Expiry</th>
                      <th>Capacity</th>
                      <th>Plate Number</th>
                      <th className={styles.actionsCol}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentList.map((v, idx: number) => {
                      const doc =
                        v.documents && v.documents.length > 0
                          ? v.documents[0]
                          : null;
                      const expiryFormatted = doc?.expires_on
                        ? new Date(doc.expires_on).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "15 May 2020 8:00 am";

                      return (
                        <tr key={idx}>
                          <td style={{ fontWeight: 500, color: "#111827" }}>
                            {v.driverName || "Fade Bayo"}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span
                                style={{ fontWeight: 600, color: "#111827" }}
                              >
                                {v.name || "Camry 2026"}
                              </span>
                              <span
                                style={{ fontSize: "12px", color: "#868C98" }}
                              >
                                {v.brand || "Toyota"}
                              </span>
                            </div>
                          </td>
                          <td style={{ color: "#525866" }}>
                            {expiryFormatted}
                          </td>
                          <td style={{ color: "#111827" }}>
                            {v.capacity} Seats
                          </td>
                          <td className={styles.chassisCell}>
                            {v.plateNumber || "KTU-812-FP"}
                          </td>
                          <td className={styles.actionsCol}>
                            <div
                              className={styles.actionsWrapper}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className={styles.moreBtn}
                                aria-label="More actions"
                                onClick={() =>
                                  setOpenMenuIndex(
                                    openMenuIndex === idx ? null : idx,
                                  )
                                }
                              >
                                <MoreIcon />
                              </button>
                              {openMenuIndex === idx && (
                                <div className={styles.kebabMenu}>
                                  <button
                                    className={styles.kebabMenuItem}
                                    onClick={() => handleApprove(v)}
                                  >
                                    Approve Vehicle
                                  </button>
                                  <button
                                    className={styles.kebabMenuItem}
                                    onClick={() => handleDeclineClick(v)}
                                  >
                                    Decline Vehicle
                                  </button>
                                  <button
                                    className={styles.kebabMenuItem}
                                    onClick={() => handleViewDocuments(v)}
                                  >
                                    View Vehicle Document
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
          ) : viewMode === "list" ? (
            /* ── All Vehicles List View ── */
            <div className={styles.tableCard} id="vehicles-table">
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.checkCol}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={
                            selectedRows.size === currentList.length &&
                            currentList.length > 0
                          }
                          onChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </th>
                      <th>Name &amp; Model</th>
                      <th>Driver</th>
                      <th>Plate Number</th>
                      <th>
                        Capacity
                        <SortArrowIcon />
                      </th>
                      <th>Documents</th>
                      <th>Status</th>
                      <th className={styles.actionsCol}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentList.map((v, idx: number) => (
                      <tr
                        key={idx}
                        className={
                          selectedRows.has(idx) ? styles.rowSelected : ""
                        }
                      >
                        <td className={styles.checkCol}>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selectedRows.has(idx)}
                            onChange={() => toggleRow(idx)}
                            aria-label={`Select ${v.name}`}
                          />
                        </td>
                        <td>
                          <div className={styles.vehicleCell}>
                            <div className={styles.vehicleInfo}>
                              <span className={styles.vehicleName}>
                                {v.name}
                              </span>
                              <span className={styles.vehicleBrand}>
                                {v.brand}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 500, color: "#111827" }}>
                          {v.driverName || "Edward Propser"}
                        </td>
                        <td className={styles.chassisCell}>
                          {v.plateNumber || v.chassisNo}
                        </td>
                        <td>{v.capacity} Seats</td>
                        <td>
                          {v.documents && v.documents.length > 0 ? (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#3B63F6",
                                fontWeight: 500,
                                background: "#EFF6FF",
                                padding: "4px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              {v.documents.length} Doc (
                              {v.documents[0].document_type})
                            </span>
                          ) : (
                            <span
                              style={{ fontSize: "12px", color: "#9CA3AF" }}
                            >
                              No documents
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`${styles.badge} ${styles[`status${v.status}`]}`}
                          >
                            <span className={styles.badgeDot} />
                            {v.status}
                          </span>
                        </td>
                        <td className={styles.actionsCol}>
                          <div
                            className={styles.actionsWrapper}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className={styles.moreBtn}
                              aria-label="More actions"
                              onClick={() =>
                                setOpenMenuIndex(
                                  openMenuIndex === idx ? null : idx,
                                )
                              }
                            >
                              <MoreIcon />
                            </button>
                            {openMenuIndex === idx && (
                              <div className={styles.kebabMenu}>
                                <button
                                  className={styles.kebabMenuItem}
                                  onClick={() => handleApprove(v)}
                                >
                                  Approve Vehicle
                                </button>
                                <button
                                  className={styles.kebabMenuItem}
                                  onClick={() => handleDeclineClick(v)}
                                >
                                  Decline Vehicle
                                </button>
                                <button
                                  className={styles.kebabMenuItem}
                                  onClick={() => handleViewDocuments(v)}
                                >
                                  View Vehicle Document
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
            /* ── Grid / Card View ── */
            <>
              <div className={styles.cardGrid} id="vehicles-grid">
                {currentList.slice(0, 6).map((v, idx: number) => (
                  <div key={idx} className={styles.vehicleCard}>
                    {/* Card Image */}
                    <div className={styles.cardImage}>
                      <Image
                        src={v.image}
                        alt={v.name}
                        width={400}
                        height={220}
                        className={styles.cardImg}
                      />
                    </div>

                    {/* Card Body */}
                    <div className={styles.cardBody}>
                      {/* Row 1: Driver Name & Capacity */}
                      <div className={styles.cardMeta}>
                        <span className={styles.cardLocation}>
                          <DriverIcon />
                          {v.driverName}
                        </span>
                        <span className={styles.cardPrice}>
                          {v.plateNumber}
                        </span>
                      </div>

                      {/* Row 2: Vehicle name */}
                      <div className={styles.cardInfo}>
                        <h3 className={styles.cardName}>{v.name}</h3>
                        <span className={styles.cardCapacity}>
                          <SeatsIcon />
                          {v.capacity} Seats
                        </span>
                      </div>

                      {/* Row 3: Category, Status, Chassis */}
                      <div className={styles.cardFooter}>
                        <span className={styles.cardCategory}>
                          {v.category}
                        </span>
                        <span
                          className={`${styles.badge} ${styles[`status${v.status}`]}`}
                        >
                          <span className={styles.badgeDot} />
                          {v.status}
                        </span>
                        <span className={styles.cardChassis}>
                          {v.plateNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                resultsPerPage={6}
                onPageChange={setCurrentPage}
                variant="standalone"
              />
            </>
          )}
        </>
      )}

      {showDetailModal && selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={() => setShowDetailModal(false)}
          onStatusChange={(id, status) => {
            setSelectedVehicle((prev) =>
              prev ? { ...prev, status: status as any } : null,
            );
            setShowDetailModal(false);
          }}
        />
      )}

      {/* Decline Vehicle Modal */}
      <DeclineVehicleModal
        isOpen={declineModalOpen}
        vehicle={vehicleToDecline}
        onClose={() => {
          setDeclineModalOpen(false);
          setVehicleToDecline(null);
        }}
        onConfirm={handleConfirmDecline}
      />
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            minHeight: "60vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner size={40} />
        </div>
      }
    >
      <VehiclesPageContent />
    </Suspense>
  );
}

/* ─── Inline Icons ─── */
const s = 16;
const iconProps = {
  width: s,
  height: s,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function PlusIcon() {
  return (
    <svg {...iconProps}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg {...iconProps} strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg {...iconProps} strokeWidth={1.8}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function MoreIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
function SortArrowIcon() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      style={{ marginLeft: 4, opacity: 0.4 }}
    >
      <polyline points="6 9 12 3 18 9" />
      <polyline points="6 15 12 21 18 15" />
    </svg>
  );
}
function DriverIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function SeatsIcon() {
  return (
    <Image
      src="/images/admin/vehicle-profile.svg"
      alt=""
      width={14}
      height={14}
    />
  );
}
