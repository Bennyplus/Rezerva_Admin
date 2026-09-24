"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/admin/Pagination";
import FilterDropdown from "@/components/admin/FilterDropdown";
import SortDropdown from "@/components/admin/SortDropdown";
import Spinner from "@/components/admin/Spinner";
import MoreIcon from "@/components/admin/icons/MoreIcon";
import ViewReviewModal from "@/components/admin/ViewReviewModal";
import {
  type AdminReview,
  type ReviewStats,
  reviewsService,
  INITIAL_REVIEW_STATS,
  INITIAL_REVIEWS,
} from "@/services/reviews-service";
import styles from "./reviews.module.css";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>(INITIAL_REVIEW_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<"filter" | "sort" | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ status: string[] }>({ status: [] });
  const [sortOption, setSortOption] = useState<string>("");
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const [statsData, reviewsData] = await Promise.all([
        reviewsService.getStats(),
        reviewsService.getReviews(),
      ]);
      setStats(statsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
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

  /* ─── Filter & Sort ─── */
  const filteredReviews = (() => {
    let result = reviews.filter(
      (r) =>
        r.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reviewedUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reviewComment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reviewerUserType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeFilters.status && activeFilters.status.length > 0) {
      result = result.filter((r) => activeFilters.status.includes(r.status));
    }

    if (sortOption === "highest_rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "lowest_rating") {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  })();

  const resultsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / resultsPerPage));
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const displayStats: ReviewStats = {
    totalReviews: stats.totalReviews || reviews.length,
    averageDriverRating:
      stats.averageDriverRating ||
      (reviews.filter((r) => r.reviewerUserType === "Driver").length > 0
        ? (
            reviews
              .filter((r) => r.reviewerUserType === "Driver")
              .reduce((sum, r) => sum + r.rating, 0) /
            reviews.filter((r) => r.reviewerUserType === "Driver").length
          ).toFixed(1)
        : 0),
    averagePassengerRating:
      stats.averagePassengerRating ||
      (reviews.filter((r) => r.reviewerUserType === "Passenger").length > 0
        ? (
            reviews
              .filter((r) => r.reviewerUserType === "Passenger")
              .reduce((sum, r) => sum + r.rating, 0) /
            reviews.filter((r) => r.reviewerUserType === "Passenger").length
          ).toFixed(1)
        : 0),
    flaggedReviews:
      stats.flaggedReviews || reviews.filter((r) => r.status === "Flagged").length,
  };

  /* ─── Action Handlers ─── */
  const handleFlagReview = async (id: string) => {
    try {
      await reviewsService.flagReview(id);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Flagged" } : r))
      );
      if (selectedReview?.id === id) {
        setSelectedReview((prev) => (prev ? { ...prev, status: "Flagged" } : null));
      }
    } catch (err) {
      console.error("Failed to flag review:", err);
    }
  };

  const handleRemoveReview = async (id: string) => {
    try {
      await reviewsService.removeReview(id);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Removed" } : r))
      );
      if (selectedReview?.id === id) {
        setSelectedReview((prev) => (prev ? { ...prev, status: "Removed" } : null));
      }
    } catch (err) {
      console.error("Failed to remove review:", err);
    }
  };

  const handleRestoreReview = async (id: string) => {
    try {
      await reviewsService.restoreReview(id);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Active" } : r))
      );
      if (selectedReview?.id === id) {
        setSelectedReview((prev) => (prev ? { ...prev, status: "Active" } : null));
      }
    } catch (err) {
      console.error("Failed to restore review:", err);
    }
  };

  return (
    <div className={styles.page}>
      {/* ─── Top Stats Cards (Screenshot 1 & 2) ─── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Reviews</span>
          <span className={styles.statValue}>{displayStats.totalReviews}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Average Driver Rating</span>
          <span className={styles.statValue}>{displayStats.averageDriverRating}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Average Passenger Rating</span>
          <span className={styles.statValue}>{displayStats.averagePassengerRating}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Flagged Reviews</span>
          <span className={styles.statValue}>{displayStats.flaggedReviews}</span>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      ) : reviews.length === 0 ? (
        /* ─── State 1: Inactive / Empty State (Screenshot 1) ─── */
        <div className={styles.emptyCard} id="reviews-empty-state">
          <h2 className={styles.emptyTitle}>No Reviews Yet</h2>
          <p className={styles.emptySubtitle}>
            Reviews will show up when customers make them
          </p>
        </div>
      ) : (
        /* ─── State 2: Table Data State (Screenshot 2) ─── */
        <>
          {/* Toolbar */}
          <div className={styles.toolbar} id="reviews-toolbar">
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
                  id="reviews-filter-btn"
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
                          options: ["Active", "Flagged", "Removed"],
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

              {/* Sort by */}
              <div
                className={styles.popoverWrapper}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.toolBtn}
                  onClick={() =>
                    setActiveDropdown((prev) => (prev === "sort" ? null : "sort"))
                  }
                  id="reviews-sort-btn"
                >
                  <SortIcon />
                  Sort by
                </button>
                {activeDropdown === "sort" && (
                  <div className={styles.dropdownContainer}>
                    <SortDropdown
                      options={[
                        { label: "Highest Rating", value: "highest_rating" },
                        { label: "Lowest Rating", value: "lowest_rating" },
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

          {/* Reviews Table */}
          <div className={styles.tableCard} id="reviews-table">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Reviewer</th>
                    <th>Reviewer User Type</th>
                    <th>Reviewed User</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Status</th>
                    <th className={styles.actionsCol} />
                  </tr>
                </thead>
                <tbody>
                  {paginatedReviews.map((r) => (
                    <tr
                      key={r.id}
                      className={styles.tableRow}
                      onClick={() => setSelectedReview(r)}
                    >
                      {/* Reviewer */}
                      <td className={styles.reviewerCell}>{r.reviewerName}</td>

                      {/* Reviewer User Type */}
                      <td className={styles.userTypeCell}>{r.reviewerUserType}</td>

                      {/* Reviewed User */}
                      <td className={styles.reviewedUserCell}>{r.reviewedUserName}</td>

                      {/* Rating */}
                      <td>
                        <div className={styles.ratingCell}>
                          <SolidBlueStarIcon />
                          <span className={styles.ratingNum}>{r.rating}</span>
                        </div>
                      </td>

                      {/* Review */}
                      <td className={styles.reviewSnippetCell}>
                        <span title={r.reviewComment}>{r.reviewComment}</span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            r.status === "Active"
                              ? styles.badgeActive
                              : r.status === "Flagged"
                              ? styles.badgeFlagged
                              : styles.badgeRemoved
                          }`}
                        >
                          <span className={styles.badgeDot} />
                          {r.status}
                        </span>
                      </td>

                      {/* Kebab Action (Screenshot 3) */}
                      <td
                        className={styles.actionsCol}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className={styles.kebabWrap}>
                          <button
                            className={styles.moreBtn}
                            onClick={() =>
                              setOpenKebab((prev) => (prev === r.id ? null : r.id))
                            }
                            aria-label={`Actions for review by ${r.reviewerName}`}
                            id={`kebab-${r.id}`}
                          >
                            <MoreIcon />
                          </button>

                          {openKebab === r.id && (
                            <div className={styles.kebabMenu}>
                              <button
                                className={styles.kebabItem}
                                onClick={() => {
                                  setOpenKebab(null);
                                  setSelectedReview(r);
                                }}
                              >
                                View Review
                              </button>
                              <button
                                className={styles.kebabItem}
                                onClick={() => {
                                  setOpenKebab(null);
                                  handleFlagReview(r.id);
                                }}
                              >
                                Flag Review
                              </button>
                              <button
                                className={styles.kebabItem}
                                onClick={() => {
                                  setOpenKebab(null);
                                  handleRemoveReview(r.id);
                                }}
                              >
                                Remove Review
                              </button>
                              <button
                                className={styles.kebabItem}
                                onClick={() => {
                                  setOpenKebab(null);
                                  handleRestoreReview(r.id);
                                }}
                              >
                                Restore Review
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredReviews.length === 0 && (
                    <tr>
                      <td colSpan={7} className={styles.emptyRow}>
                        No reviews found matching your search.
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

      {/* ─── View Review Modal (Screenshot 4) ─── */}
      <ViewReviewModal
        review={selectedReview}
        isOpen={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        onRemove={(id) => {
          handleRemoveReview(id);
          setSelectedReview(null);
        }}
        onFlag={(id) => {
          handleFlagReview(id);
          setSelectedReview(null);
        }}
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
