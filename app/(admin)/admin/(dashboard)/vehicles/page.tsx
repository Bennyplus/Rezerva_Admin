"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import Pagination from "@/components/admin/Pagination";
import UploadMethodModal from "@/components/admin/UploadMethodModal";
import AddVehicleForm from "@/components/admin/AddVehicleForm";
import BulkUploadModal from "@/components/admin/BulkUploadModal";
import { AdminVehicle, VEHICLE_STATS_EMPTY } from "@/data/admin-vehicles";
import { vehiclesService } from "@/services/vehicles-service";
import FilterBar from "@/components/admin/FilterBar";
import VehicleDetailView from "@/components/admin/VehicleDetailView";
import styles from "./vehicles.module.css";

type ViewMode = "list" | "grid";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const isEmpty = vehicles.length === 0;
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [currentView, setCurrentView] = useState<"list" | "add-manual" | "detail">("list");
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<AdminVehicle | null>(null);

  const [stats, setStats] = useState(VEHICLE_STATS_EMPTY);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(9);
  
  const [brandsMap, setBrandsMap] = useState<Record<string, string>>({});
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMaps = async () => {
      const { brands, categories } = await vehiclesService.getBrandsAndCategories();
      const bMap: Record<string, string> = {};
      const cMap: Record<string, string> = {};
      if (Array.isArray(brands)) {
        brands.forEach((b: any) => { bMap[b.id.toString()] = b.name; });
      }
      if (Array.isArray(categories)) {
        categories.forEach((c: any) => { cMap[c.id.toString()] = c.name; });
      }
      setBrandsMap(bMap);
      setCategoriesMap(cMap);
    };
    fetchMaps();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuIndex !== null) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuIndex]);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const data = await vehiclesService.getVehicles(currentPage);

        const mappedVehicles: AdminVehicle[] = (data.vehicles || []).map((v: any) => {

          const rawStatus = v.status ? String(v.status).toLowerCase() : '';
          let mappedStatus: AdminVehicle['status'] = 'Available';
          if (rawStatus.includes('maintenance')) mappedStatus = 'Maintenance';
          else if (rawStatus.includes('book')) mappedStatus = 'Booked';
          else if (rawStatus.includes('inactive')) mappedStatus = 'Inactive';

          return {
            id: v.id,
            name: `${v.model || 'Unknown'}`,
            brand: brandsMap[v.brand?.toString()] || (typeof v.brand === 'string' ? v.brand : `Brand ${v.brand || 'Unknown'}`),
            image: v.image && v.image.length > 0 ? v.image[0].image : '/images/3rd-img.png',
            category: categoriesMap[v.category?.toString()] || v.category || 'Unknown',
            dailyPrice: parseFloat(v.daily_price) || 0,
            capacity: parseInt(v.capacity) || 4,
            status: mappedStatus,
            chassisNo: v.chasis_number || 'N/A',
            location: 'N/A',
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
    fetchVehicles();
  }, [currentPage]);


  const toggleSelectAll = () => {
    if (selectedRows.size === vehicles.length && vehicles.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(vehicles.map((_, i: number) => i)));
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

  if (currentView === "detail" && selectedVehicle) {
    return (
      <VehicleDetailView 
        vehicle={selectedVehicle}
        onBack={() => setCurrentView("list")}
        onStatusChange={handleStatusChange}
      />
    );
  }

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
              <FilterBar />
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
                          checked={selectedRows.size === vehicles.length && vehicles.length > 0}
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
                    {vehicles.map((v, idx: number) => (
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
                                height={28}
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
                        <td>{v.location}</td>
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
                                <button className={styles.kebabMenuItem} onClick={() => { setSelectedVehicle(v); setCurrentView("detail"); setOpenMenuIndex(null); }}>View Details</button>
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
                {vehicles.slice(0, 6).map((v, idx: number) => (
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
                        <span className={styles.cardCapacity}>
                          <SeatsIcon />
                          {v.capacity}
                        </span>
                      </div>

                      {/* Row 2: Vehicle name */}
                      <h3 className={styles.cardName}>{v.name}</h3>

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

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
      />
    </div>
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
function SeatsIcon() { return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
