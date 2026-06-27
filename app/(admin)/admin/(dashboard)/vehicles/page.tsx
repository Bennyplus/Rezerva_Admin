"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import Pagination from "@/components/admin/Pagination";
import UploadMethodModal from "@/components/admin/UploadMethodModal";
import AddVehicleForm from "@/components/admin/AddVehicleForm";
import BulkUploadModal from "@/components/admin/BulkUploadModal";
import { AdminVehicle, VEHICLE_STATS_EMPTY } from "@/data/admin-vehicles";
import { vehiclesService } from "@/services/vehicles-service";
import FilterBar from "@/components/admin/FilterBar";
import VehicleDetailsModal from "@/components/admin/VehicleDetailsModal";
import VehiclesFilterModal from "@/components/admin/VehiclesFilterModal";
import SortDropdown from "@/components/admin/SortDropdown";
import styles from "./vehicles.module.css";

type ViewMode = "list" | "grid";

function VehiclesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilters = {
    status: searchParams.get('status') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    seats: searchParams.get('seats') || '',
    fuel_type: searchParams.get('fuel_type') || '',
    transmission: searchParams.get('transmission') || '',
  };
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSort, setLocalSort] = useState("");
  const [loading, setLoading] = useState(true);
  const isEmpty = vehicles.length === 0;
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [currentView, setCurrentView] = useState<"list" | "add-manual">("list");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<AdminVehicle | null>(null);

  const [stats, setStats] = useState(VEHICLE_STATS_EMPTY);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(9);

  const [brandsMap, setBrandsMap] = useState<Record<string, string>>({});
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch maps first (or concurrently if we wanted, but sequential is fine here as maps might be fast/cached)
        let bMap = { ...brandsMap };
        let cMap = { ...categoriesMap };

        if (Object.keys(bMap).length === 0) {
          const { brands, categories } = await vehiclesService.getBrandsAndCategories();
          if (Array.isArray(brands)) {
            brands.forEach((b: any) => { bMap[b.id.toString()] = b.name; });
          }
          if (Array.isArray(categories)) {
            categories.forEach((c: any) => { cMap[c.id.toString()] = c.name; });
          }
          setBrandsMap(bMap);
          setCategoriesMap(cMap);
        }

        const apiFilters: Record<string, string> = {};
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value) apiFilters[key] = value;
        });

        const data = await vehiclesService.getVehicles(currentPage, apiFilters);

        const mappedVehicles: AdminVehicle[] = (data.vehicles || []).map((v: any) => {

          const rawStatus = v.status ? String(v.status).toLowerCase() : '';
          let mappedStatus: AdminVehicle['status'] = 'Available';
          if (rawStatus.includes('maintenance')) mappedStatus = 'Maintenance';
          else if (rawStatus.includes('book')) mappedStatus = 'Booked';
          else if (rawStatus.includes('inactive')) mappedStatus = 'Inactive';

          return {
            id: v.id,
            name: `${v.model || 'Unknown'}`,
            brand: bMap[v.brand?.toString()] || (typeof v.brand === 'string' ? v.brand : `Brand ${v.brand || 'Unknown'}`),
            image: v.image && v.image.length > 0 ? v.image.find((i: any) => i.is_primary)?.image || v.image[0].image : '/images/3rd-img.png',
            images: Array.isArray(v.image) ? v.image : [],
            category: cMap[v.category?.toString()] || v.category || 'N/A',
            dailyPrice: parseFloat(v.daily_price) || 0,
            capacity: parseInt(v.capacity) || 4,
            status: mappedStatus,
            chassisNo: v.chasis_number || 'N/A',
            location: v.location || 'N/A',
          };
        });

        setVehicles(mappedVehicles);
        setTotalPages(data.total_pages || 1);
        setResultsPerPage(data.results_per_page || 9);

        setStats([
          { id: "total-vehicles", label: "Total Vehicles", value: data.total_vehicles || 0 },
          { id: "available-vehicles", label: "Available Vehicles", value: data.available_vehicles || 0 },
          { id: "booked-vehicles", label: "Booked Vehicles", value: data.booked_vehicles || 0 },
          { id: "under-maintenance", label: "Under maintenance", value: data.under_maintenance || 0 },
        ]);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchParams]);

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
    if (selectedRows.size === displayedVehicles.length && displayedVehicles.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(displayedVehicles.map((_, i: number) => i)));
    }
  };

  const toggleRow = (idx: number) => {
    const next = new Set(selectedRows);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedRows(next);
  };

  const handleStatusChange = async (vehicleId: number, newStatus: string) => {
    try {
      await vehiclesService.updateVehicleStatus(vehicleId, newStatus);

      const mapStatus = (s: string): AdminVehicle['status'] => {
        if (s === 'booked') return 'Booked';
        if (s === 'maintenance') return 'Maintenance';
        if (s === 'inactive') return 'Inactive';
        if (s === 'available') return 'Available';
        return 'Available';
      };

      const mappedStatus = mapStatus(newStatus);

      setVehicles((prev) =>
        prev.map((v) => v.id === vehicleId ? { ...v, status: mappedStatus } : v)
      );

      if (selectedVehicle && selectedVehicle.id === vehicleId) {
        setSelectedVehicle({ ...selectedVehicle, status: mappedStatus });
      }

      setOpenMenuIndex(null);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
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

  if (currentView === "add-manual") {
    return (
      <AddVehicleForm
        onCancel={() => setCurrentView("list")}
        onSave={(data) => {
          console.log("Saving vehicle:", data);

          const newVehicle: AdminVehicle = {
            id: Date.now(),
            name: data.model || 'Unknown',
            brand: brandsMap[data.name?.toString()] || data.name || 'Unknown',
            image: '/images/3rd-img.png',
            category: categoriesMap[data.category?.toString()] || data.category || 'Unknown',
            dailyPrice: parseFloat(data.price_per_day) || 0,
            capacity: parseInt(data.seatingCapacity) || 4,
            status: "Available",
            chassisNo: data.chassisNumber || 'N/A',
            location: data.location || 'N/A',
          };

          setVehicles((prev) => [newVehicle, ...prev]);
          setCurrentView("list");
        }}
      />
    );
  }



  // Compute filtered & sorted vehicles for the current page
  const displayedVehicles = vehicles
    .filter((v) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(query) ||
        v.brand.toLowerCase().includes(query) ||
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

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Stat Cards */}
      <div className={styles.statsGrid} id="vehicles-stats">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            id={`stat-${stat.id}`}
          />
        ))}
      </div>

      {isEmpty ? (
        /* ─── Empty State ─── */
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
          <h2 className={styles.emptyTitle}>No vehicles yet</h2>
          <p className={styles.emptySubtitle}>Add your first vehicle to start accepting bookings</p>
          <button className={styles.addBtn} id="add-vehicle-btn" onClick={() => setShowUploadModal(true)}>
            <PlusIcon />
            Add Vehicle
          </button>
        </div>
      ) : (
        /* ─── Populated State ─── */
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
                    onClose={() => { }}
                    onApply={handleApplyFilters}
                    onClear={() => router.push(pathname)}
                    initialFilters={currentFilters}
                    categoriesMap={categoriesMap}
                  />
                }
                sortDropdown={
                  <SortDropdown 
                    options={[
                      { label: "Model A to Z", value: "model_asc" },
                      { label: "Model Z to A", value: "model_desc" },
                      { label: "Price Low to High", value: "price_asc" },
                      { label: "Price High to Low", value: "price_desc" }
                    ]}
                    onSortSelect={handleSortSelect} 
                  />
                }
              />
              {/* View toggles */}
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
            </div>

            <div className={styles.toolbarRight}>
              {/* Add Vehicle */}
              <button
                className={styles.addBtnSmall}
                id="add-vehicle-btn-toolbar"
                onClick={() => setShowUploadModal(true)}
              >
                <PlusIcon />
                Add Vehicle
              </button>
            </div>
          </div>

          {viewMode === "list" ? (
            /* ─── List View (Table) ─── */
            <div className={styles.tableCard} id="vehicles-table">
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.checkCol}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={selectedRows.size === displayedVehicles.length && displayedVehicles.length > 0}
                          onChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </th>
                      <th>Name and Model</th>
                      <th>Category</th>
                      <th>
                        Daily Price
                        <SortArrowIcon />
                      </th>
                      <th>
                        Capacity
                        <SortArrowIcon />
                      </th>
                      <th>Status</th>
                      <th>Chassis No</th>
                      <th>Location</th>
                      <th className={styles.actionsCol}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedVehicles.map((v, idx: number) => (
                      <tr key={idx} className={selectedRows.has(idx) ? styles.rowSelected : ""}>
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
                            <div className={styles.vehicleThumb}>
                              <Image
                                src={v.image}
                                alt={v.name}
                                width={40}
                                height={40}
                                className={styles.thumbImg}
                              />
                            </div>
                            <div className={styles.vehicleInfo}>
                              <span className={styles.vehicleName}>{v.name}</span>
                              <span className={styles.vehicleBrand}>{v.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td>{v.category}</td>
                        <td>${v.dailyPrice.toLocaleString()}</td>
                        <td>{v.capacity} Seats</td>
                        <td>
                          <span className={`${styles.badge} ${styles[`status${v.status}`]}`}>
                            <span className={styles.badgeDot} />
                            {v.status}
                          </span>
                        </td>
                        <td className={styles.chassisCell}>{v.chassisNo}</td>
                        <td>{v.location?.trim().split(/\s+/)[0]}</td>
                        <td className={styles.actionsCol}>
                          <div className={styles.actionsWrapper} onClick={(e) => e.stopPropagation()}>
                            <button
                              className={styles.moreBtn}
                              aria-label="More actions"
                              onClick={() => setOpenMenuIndex(openMenuIndex === idx ? null : idx)}
                            >
                              <MoreIcon />
                            </button>
                            {openMenuIndex === idx && (
                              <div className={styles.kebabMenu}>
                                <button className={styles.kebabMenuItem} onClick={() => { setSelectedVehicle(v); setShowDetailModal(true); setOpenMenuIndex(null); }}>View Details</button>
                                <button className={styles.kebabMenuItem} onClick={() => handleStatusChange(v.id!, 'booked')}>Mark As Booked</button>
                                <button className={styles.kebabMenuItem} onClick={() => handleStatusChange(v.id!, 'maintenance')}>Mark As Maintenance</button>
                                <button className={styles.kebabMenuItem} onClick={() => handleStatusChange(v.id!, 'inactive')}>Deactivate</button>
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
            /* ─── Grid / Card View ─── */
            <>
              <div className={styles.cardGrid} id="vehicles-grid">
                {displayedVehicles.slice(0, 6).map((v, idx: number) => (
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
                      {/* Row 1: Location, Price, Capacity */}
                      <div className={styles.cardMeta}>
                        <span className={styles.cardLocation}>
                          <LocationIcon />
                          {v.location}
                        </span>
                        <span className={styles.cardPrice}>
                          ${v.dailyPrice.toLocaleString()}<span className={styles.cardPriceUnit}>/day</span>
                        </span>
                      </div>

                      {/* Row 2: Vehicle name */}
                      <div className={styles.cardInfo}>
                        <h3 className={styles.cardName}>{v.name}</h3>
                        <span className={styles.cardCapacity}>
                          <SeatsIcon />
                          {v.capacity}
                        </span>
                      </div>

                      {/* Row 3: Category, Status, Chassis */}
                      <div className={styles.cardFooter}>
                        <span className={styles.cardCategory}>{v.category}</span>
                        <span className={`${styles.badge} ${styles[`status${v.status}`]}`}>
                          <span className={styles.badgeDot} />
                          {v.status}
                        </span>
                        <span className={styles.cardChassis}>{v.chassisNo}</span>
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

      {/* Upload Method Selection Modal */}
      <UploadMethodModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSelectManual={() => {
          setShowUploadModal(false);
          setCurrentView("add-manual");
        }}
        onSelectBulk={() => {
          setShowUploadModal(false);
          setShowBulkUploadModal(true);
        }}
      />

      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
      />

      {showDetailModal && selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={() => setShowDetailModal(false)}
          onStatusChange={(id, status) => {
            handleStatusChange(id, status);
            setShowDetailModal(false);
          }}
        />
      )}
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    }>
      <VehiclesPageContent />
    </Suspense>
  );
}

/* ─── Inline Icons ─── */
const s = 16;
const iconProps = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function PlusIcon() { return <svg {...iconProps}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function GridIcon() { return <svg {...iconProps} strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>; }
function ListIcon() { return <svg {...iconProps} strokeWidth={1.8}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>; }
function MoreIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }
function SortArrowIcon() { return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ marginLeft: 4, opacity: 0.4 }}><polyline points="6 9 12 3 18 9" /><polyline points="6 15 12 21 18 15" /></svg>; }
function LocationIcon() { return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>; }
function SeatsIcon() {
  return <Image src="/images/admin/vehicle-profile.svg" alt="" width={14} height={14} />;
}
