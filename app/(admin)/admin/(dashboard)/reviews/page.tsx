"use client";

import { useState } from "react";
import Image from "next/image";
import { ADMIN_REVIEWS, Review } from "@/data/admin-reviews";
import Pagination from "@/components/admin/Pagination";
import ReviewDetailsModal from "../../../../../components/admin/ReviewDetailsModal";
import RemoveReviewModal from "../../../../../components/admin/RemoveReviewModal";
import FilterBar from "@/components/admin/FilterBar";
import styles from "./reviews.module.css";

export default function ReviewsPage() {
  const [isEmpty, setIsEmpty] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [openKebab, setOpenKebab] = useState<string | null>(null);

  // Modals state
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviewToRemove, setReviewToRemove] = useState<Review | null>(null);

  const totalPages = 16;
  const resultsPerPage = 9;

  // Search filtering
  const filteredReviews = ADMIN_REVIEWS.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.page}>
      {isEmpty ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard} id="reviews-empty-state">
          <div className={styles.illustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No reviews illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>No reviews available</h2>
          <p className={styles.emptySubtitle}>Customer reviews and ratings will appear here</p>
        </div>
      ) : (
        /* ─── Populated State ─── */
        <div className={styles.tableCard} id="reviews-table">
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input type="checkbox" className={styles.checkbox} aria-label="Select all" />
                  </th>
                  <th>Customer Name</th>
                  <th>Review</th>
                  <th>Star Rating</th>
                  <th>Date Posted</th>
                  <th>Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review.id} onClick={() => setOpenKebab(null)}>
                    <td className={styles.checkCol}>
                      <input type="checkbox" className={styles.checkbox} aria-label={`Select ${review.customerName}`} />
                    </td>
                    <td>{review.customerName}</td>
                    <td>
                      <div className={styles.reviewText}>{review.reviewText}</div>
                    </td>
                    <td>{review.starRating}</td>
                    <td>{review.datePosted}</td>
                    <td>
                      <span className={`${styles.badge} ${review.status === "Published" ? styles.badgePublished : styles.badgeRemoved}`}>
                        <span className={styles.badgeDot} />
                        {review.status}
                      </span>
                    </td>
                    <td className={styles.actionsCol}>
                      <div className={styles.kebabWrap}>
                        <button
                          className={styles.moreBtn}
                          aria-label="More actions"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenKebab((prev) => (prev === review.id ? null : review.id));
                          }}
                        >
                          <MoreIcon />
                        </button>
                        {openKebab === review.id && (
                          <div className={styles.kebabMenu}>
                            <button
                              className={styles.kebabItem}
                              onClick={() => {
                                setOpenKebab(null);
                                setSelectedReview(review);
                              }}
                            >
                              View Details
                            </button>
                            <button
                              className={styles.kebabItem}
                              onClick={() => {
                                setOpenKebab(null);
                                setReviewToRemove(review);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredReviews.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#868C98" }}>
                      No reviews found.
                    </td>
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
      )}

      {/* Dev toggle */}
      <div className={styles.devToggleWrap}>
        <button
          className={styles.stateToggle}
          onClick={() => setIsEmpty((v) => !v)}
          id="toggle-reviews-state"
        >
          {isEmpty ? "Show Populated State" : "Show Empty State"} →
        </button>
      </div>

      {/* Modals */}
      {selectedReview && (
        <ReviewDetailsModal
          review={selectedReview}
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          onRemove={() => {
            setSelectedReview(null);
            setReviewToRemove(selectedReview);
          }}
        />
      )}

      {reviewToRemove && (
        <RemoveReviewModal
          isOpen={!!reviewToRemove}
          onClose={() => setReviewToRemove(null)}
          onConfirm={() => {
            console.log("Removing review:", reviewToRemove.id);
            setReviewToRemove(null);
          }}
        />
      )}
    </div>
  );
}

/* ─── Inline Icons ─── */
const s = 16;
const iconProps = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function MoreIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }
