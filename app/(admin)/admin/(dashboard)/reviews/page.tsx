"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Review } from "@/data/admin-reviews";
import Pagination from "@/components/admin/Pagination";
import ReviewDetailsModal from "@/components/admin/ReviewDetailsModal";
import RemoveReviewModal from "@/components/admin/RemoveReviewModal";
import FilterBar from "@/components/admin/FilterBar";
import Spinner from "@/components/admin/Spinner";
import MoreIcon from "@/components/admin/icons/MoreIcon";
import { customersService } from "@/services/customers-service";
import styles from "./reviews.module.css";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openKebab, setOpenKebab] = useState<string | null>(null);

  // Modals state
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviewToRemove, setReviewToRemove] = useState<Review | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const resultsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await customersService.getCustomerReviews();
      const mappedReviews: Review[] = (data || []).map((r: any) => ({
        id: r.id || r.review_id,
        customerName: r.customer_name || "Unknown",
        reviewText: r.review || "",
        starRating: r.rating || 0,
        datePosted: r.date_posted || "",
        status: r.status || "Published",
        // Fallbacks for Review interface
        phone: r.phone || "",
        email: r.email || "",
        bookingId: r.booking_id || "",
        bookingDate: r.booking_date || "",
        vehicleName: r.vehicle_name || "",
        bookingType: r.booking_type || ""
      }));
      setReviews(mappedReviews);
      // Fallback for total pages if API doesn't return it natively
      setTotalPages(data.total_pages || Math.max(1, Math.ceil(mappedReviews.length / resultsPerPage)));
      setIsEmpty(mappedReviews.length === 0);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveReview = async () => {
    if (!reviewToRemove) return;
    setIsActionLoading(true);
    try {
      await customersService.removeReview(reviewToRemove.id);
      setToastMessage("Review removed successfully.");
      await fetchReviews();
    } catch (error) {
      console.error("Remove failed:", error);
      setToastMessage("Error: Failed to remove review");
    } finally {
      setIsActionLoading(false);
      setReviewToRemove(null);
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Search filtering
  const filteredReviews = reviews.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Client-side pagination if backend returns everything at once
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className={styles.page} onClick={() => setOpenKebab(null)}>
      {isEmpty && !isLoading ? (
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
              <FilterBar 
                searchValue={searchQuery} 
                onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} 
              />
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
                {isLoading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "40px" }}>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {paginatedReviews.map((review) => (
                      <tr key={review.id} onClick={(e) => e.stopPropagation()}>
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
                          <span className={`${styles.badge} ${review.status === "Published" || review.status === "Approved" ? styles.badgePublished : styles.badgeRemoved}`}>
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
                  </>
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.max(1, Math.ceil(filteredReviews.length / resultsPerPage))}
              resultsPerPage={resultsPerPage}
              onPageChange={setCurrentPage}
              variant="table"
            />
          )}
        </div>
      )}

      {/* Dev toggle */}
      {/* <div className={styles.devToggleWrap}>
        <button
          className={styles.stateToggle}
          onClick={() => setIsEmpty((v) => !v)}
          id="toggle-reviews-state"
        >
          {isEmpty ? "Show Populated State" : "Show Empty State"} →
        </button>
      </div> */}

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
          onConfirm={handleRemoveReview}
          isLoading={isActionLoading}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastWrapper}>
          <div className={`${styles.toast} ${toastMessage.startsWith("Error") ? styles.toastError : ""}`}>
            {!toastMessage.startsWith("Error") && <CheckCircleIcon />}
            {toastMessage}
            <button
              className={styles.toastClose}
              onClick={() => setToastMessage(null)}
              aria-label="Close notification"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function CheckCircleIcon() {
  return (
    <img src="/images/admin/checkmark.svg" alt="Check circle" />
  );
}

function CloseIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
