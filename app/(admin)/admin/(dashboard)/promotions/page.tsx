"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import StatCard from "@/components/admin/StatCard";
import SelectPromotionTypeModal, {
  PromotionTypeOption,
} from "@/components/admin/SelectPromotionTypeModal";
import CreatePromotionForm from "@/components/admin/CreatePromotionForm";
import {
  promotionsService,
  PromotionItem,
  PromotionsStats,
  PromotionStatus,
} from "@/services/promotions-services";
import styles from "./page.module.css";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [stats, setStats] = useState<PromotionsStats>({
    activePromotions: 0,
    totalRedemptions: 0,
    revenueImpact: 0,
    newUsersFromReferrals: 0,
  });
  const [loading, setLoading] = useState(true);

  // View Mode: "list" (table view) | "create" (form view)
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [selectedPromotionType, setSelectedPromotionType] =
    useState<PromotionTypeOption>("Coupon Code");
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Kebab Actions
  const [activeKebabId, setActiveKebabId] = useState<string | number | null>(
    null,
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const filterRef = useRef<HTMLDivElement>(null);
  const kebabRef = useRef<HTMLDivElement>(null);

  // Fetch promotions and stats
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [promoRes, statsRes] = await Promise.all([
        promotionsService.getPromotions(currentPage, searchQuery, statusFilter),
        promotionsService.getStats(),
      ]);

      setPromotions(promoRes.results || []);
      if (statsRes) {
        setStats(statsRes);
      }
    } catch (err) {
      console.error("Failed to load promotions data:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setActiveKebabId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered & Paginated items
  const filteredPromotions = useMemo(() => {
    return promotions.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [promotions, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredPromotions.length / resultsPerPage) || 1;
  const paginatedPromotions = useMemo(() => {
    const start = (currentPage - 1) * resultsPerPage;
    return filteredPromotions.slice(start, start + resultsPerPage);
  }, [filteredPromotions, currentPage, resultsPerPage]);

  const handleToggleStatus = async (item: PromotionItem) => {
    const nextStatus: PromotionStatus =
      item.status === "active" ? "inactive" : "active";
    try {
      await promotionsService.toggleStatus(item.id, nextStatus);
      fetchData();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    } finally {
      setActiveKebabId(null);
    }
  };

  const handleDeletePromotion = async (id: string | number) => {
    try {
      await promotionsService.deletePromotion(id);
      fetchData();
    } catch (err) {
      console.error("Failed to delete promotion:", err);
    } finally {
      setActiveKebabId(null);
    }
  };

  const handleSelectType = (type: PromotionTypeOption) => {
    setSelectedPromotionType(type);
    setIsTypeModalOpen(false);
    setViewMode("create");
  };

  return (
    <div className={styles.container}>
      {/* ─── Create Promotion Form View ─── */}
      {viewMode === "create" ? (
        <CreatePromotionForm
          promotionType={selectedPromotionType}
          onCancel={() => setViewMode("list")}
          onSuccess={() => {
            setViewMode("list");
            fetchData();
          }}
        />
      ) : (
        /* ─── Dashboard List View ─── */
        <>
          {/* ─── 4 Metric Stat Cards ─── */}
          <div className={styles.statsGrid}>
            <StatCard
              label="Active Promotions"
              value={stats.activePromotions}
              id="active-promotions-card"
            />
            <StatCard
              label="Total Redemptions"
              value={stats.totalRedemptions}
              id="total-redemptions-card"
            />
            <StatCard
              label="Revenue Impact"
              value={
                typeof stats.revenueImpact === "number"
                  ? `₦${stats.revenueImpact.toLocaleString()}`
                  : String(stats.revenueImpact).startsWith("₦")
                    ? stats.revenueImpact
                    : `₦${stats.revenueImpact}`
              }
              id="revenue-impact-card"
            />
            <StatCard
              label="New Users From Referrals"
              value={stats.newUsersFromReferrals}
              id="new-users-referrals-card"
            />
          </div>

          {/* ─── Toolbar (Search, Filter, Create) ─── */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              {/* Search */}
              <div className={styles.searchWrapper}>
                <SearchIcon className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  id="promotions-search-input"
                />
              </div>

              {/* Filter Dropdown */}
              <div className={styles.filterContainer} ref={filterRef}>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${
                    statusFilter !== "all" ? styles.filterBtnActive : ""
                  }`}
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  id="promotions-filter-btn"
                >
                  <FilterIcon />
                  <span>
                    {statusFilter === "all"
                      ? "Filter"
                      : statusFilter.charAt(0).toUpperCase() +
                        statusFilter.slice(1)}
                  </span>
                </button>

                {isFilterOpen && (
                  <div className={styles.filterPopover}>
                    <button
                      type="button"
                      className={`${styles.filterOption} ${
                        statusFilter === "all" ? styles.filterOptionActive : ""
                      }`}
                      onClick={() => {
                        setStatusFilter("all");
                        setIsFilterOpen(false);
                        setCurrentPage(1);
                      }}
                    >
                      All Statuses
                    </button>
                    <button
                      type="button"
                      className={`${styles.filterOption} ${
                        statusFilter === "active"
                          ? styles.filterOptionActive
                          : ""
                      }`}
                      onClick={() => {
                        setStatusFilter("active");
                        setIsFilterOpen(false);
                        setCurrentPage(1);
                      }}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      className={`${styles.filterOption} ${
                        statusFilter === "inactive"
                          ? styles.filterOptionActive
                          : ""
                      }`}
                      onClick={() => {
                        setStatusFilter("inactive");
                        setIsFilterOpen(false);
                        setCurrentPage(1);
                      }}
                    >
                      Inactive
                    </button>
                    <button
                      type="button"
                      className={`${styles.filterOption} ${
                        statusFilter === "draft"
                          ? styles.filterOptionActive
                          : ""
                      }`}
                      onClick={() => {
                        setStatusFilter("draft");
                        setIsFilterOpen(false);
                        setCurrentPage(1);
                      }}
                    >
                      Draft
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Create Promotion Button */}
            <button
              type="button"
              className={styles.createBtn}
              onClick={() => setIsTypeModalOpen(true)}
              id="create-promotion-btn"
            >
              Create Promotion
            </button>
          </div>

          {/* ─── Promotions Table / Loading / Empty ─── */}
          <div className={styles.tableCard}>
            {loading ? (
              <div
                className={styles.loadingWrapper}
                id="promotions-loading-spinner"
              >
                <Spinner size={36} color="#375DFB" />
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Promotion</th>
                      <th className={styles.th}>Type</th>
                      <th className={styles.th}>Valid Until</th>
                      <th className={styles.th}>Redemptions</th>
                      <th className={styles.th}>Status</th>
                      <th className={styles.th} style={{ width: 48 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPromotions.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>
                              {searchQuery
                                ? "No matching promotions found"
                                : "No promotions created yet"}
                            </p>
                            <p className={styles.emptyText}>
                              {searchQuery
                                ? "Try refining your search term or filter to find promotions."
                                : "Start creating your first discount, coupon, or referral campaign."}
                            </p>
                            {!searchQuery && (
                              <button
                                type="button"
                                className={styles.createBtn}
                                onClick={() => setIsTypeModalOpen(true)}
                                style={{ marginTop: 12 }}
                              >
                                Create Promotion
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedPromotions.map((item) => {
                        const isMenuOpen = activeKebabId === item.id;
                        return (
                          <tr key={item.id} className={styles.tr}>
                            <td className={styles.td}>
                              <span className={styles.promoName}>
                                {item.name}
                              </span>
                            </td>
                            <td className={styles.td}>
                              <span className={styles.promoType}>
                                {item.type}
                              </span>
                            </td>
                            <td className={styles.td}>
                              <span className={styles.validUntil}>
                                {item.validUntil}
                              </span>
                            </td>
                            <td className={styles.td}>
                              <span className={styles.redemptions}>
                                {item.redemptions}
                              </span>
                            </td>
                            <td className={styles.td}>
                              <span
                                className={`${styles.statusBadge} ${
                                  item.status === "active"
                                    ? styles.statusActive
                                    : item.status === "draft"
                                      ? styles.statusDraft
                                      : styles.statusInactive
                                }`}
                              >
                                <span className={styles.statusDot} />
                                {item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)}
                              </span>
                            </td>
                            <td
                              className={`${styles.td} ${styles.actionsCell}`}
                            >
                              <button
                                type="button"
                                className={styles.kebabBtn}
                                aria-label={`Actions for ${item.name}`}
                                id={`promo-actions-${item.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveKebabId(isMenuOpen ? null : item.id);
                                }}
                              >
                                <MoreVerticalIcon />
                              </button>

                              {/* Kebab Dropdown Menu */}
                              {isMenuOpen && (
                                <div
                                  className={styles.kebabPopover}
                                  ref={kebabRef}
                                >
                                  <button
                                    type="button"
                                    className={styles.kebabItem}
                                    onClick={() => handleToggleStatus(item)}
                                    id={`toggle-status-${item.id}`}
                                  >
                                    {item.status === "active"
                                      ? "Deactivate"
                                      : "Activate"}
                                  </button>
                                  <button
                                    type="button"
                                    className={`${styles.kebabItem} ${styles.kebabItemDanger}`}
                                    onClick={() =>
                                      handleDeletePromotion(item.id)
                                    }
                                    id={`delete-promo-${item.id}`}
                                  >
                                    Delete Promotion
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredPromotions.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                resultsPerPage={resultsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </>
      )}

      {/* ─── Select Promotion Type Modal ─── */}
      <SelectPromotionTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelect={handleSelectType}
      />
    </div>
  );
}

/* ─── Inline Icons ─── */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
    </svg>
  );
}

function FilterIcon() {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function MoreVerticalIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={12} cy={12} r={1} />
      <circle cx={12} cy={5} r={1} />
      <circle cx={12} cy={19} r={1} />
    </svg>
  );
}
