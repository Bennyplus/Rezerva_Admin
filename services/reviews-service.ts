import { publicApi } from "@/lib/api-client";

export interface ReviewStats {
  totalReviews: number | string;
  averageDriverRating: number | string;
  averagePassengerRating: number | string;
  flaggedReviews: number | string;
}

export interface AdminReview {
  id: string;
  reviewerName: string;
  reviewerUserType: "Driver" | "Passenger";
  reviewedUserName: string;
  rating: number;
  reviewComment: string;
  status: "Active" | "Flagged" | "Removed";
  tripId: string;
  dateSubmitted: string;
}

export const INITIAL_REVIEW_STATS: ReviewStats = {
  totalReviews: 0,
  averageDriverRating: 0,
  averagePassengerRating: 0,
  flaggedReviews: 0,
};

export const INITIAL_REVIEWS: AdminReview[] = [
  {
    id: "d9ce402b-25df-40a3-b912-7c0259cd7c1e",
    reviewerName: "Fade Bayo",
    reviewerUserType: "Driver",
    reviewedUserName: "Valerie",
    rating: 5,
    reviewComment: "He didnt smell so great and i told him and he crashed out",
    status: "Active",
    tripId: "TRIP-123-2333",
    dateSubmitted: "13 Aug 2026 12:30 AM",
  },
  {
    id: "2f733dad-c523-41e8-a042-82c41e07aa9b",
    reviewerName: "Fade Bayo",
    reviewerUserType: "Driver",
    reviewedUserName: "Edward Prosper",
    rating: 5,
    reviewComment: "Lovely personality",
    status: "Active",
    tripId: "TRIP-123-2334",
    dateSubmitted: "13 Aug 2026 12:35 AM",
  },
];

function formatDate(dateStr?: string): string {
  if (!dateStr) return "13 Aug 2026 12:30 AM";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return (
      d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " " +
      d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  } catch {
    return dateStr;
  }
}

function mapReview(item: any): AdminReview {
  let userType: "Driver" | "Passenger" = "Driver";
  if (item?.reviewer_user_type) {
    userType =
      item.reviewer_user_type.toLowerCase() === "driver"
        ? "Driver"
        : "Passenger";
  }

  let status: "Active" | "Flagged" | "Removed" = "Active";
  if (item?.status) {
    const s = String(item.status).toLowerCase();
    if (s === "flagged") status = "Flagged";
    else if (s === "removed" || s === "inactive") status = "Removed";
  } else if (item?.is_flagged) {
    status = "Flagged";
  } else if (item?.is_active === false) {
    status = "Removed";
  }

  return {
    id: String(item.id || item.rating_id || ""),
    reviewerName: item.reviewer || item.reviewer_name || "N/A",
    reviewerUserType: userType,
    reviewedUserName: item.reviewed_user || item.reviewed_user_name || "N/A",
    rating:
      typeof item.stars === "number"
        ? item.stars
        : typeof item.rating === "number"
        ? item.rating
        : 5,
    reviewComment:
      item.feedback || item.review || item.comment || "No feedback provided",
    status,
    tripId: item.trip_id || item.trip || `TRIP-${String(item.id || "123").slice(0, 8)}`,
    dateSubmitted:
      item.date_submitted || item.created_at
        ? formatDate(item.date_submitted || item.created_at)
        : "13 Aug 2026 12:30 AM",
  };
}

export const reviewsService = {
  getReviews: async (ratingId?: string): Promise<AdminReview[]> => {
    try {
      const params: Record<string, any> = {
        path: "administration/reviews/",
      };
      if (ratingId) {
        params.rating_id = ratingId;
      }
      const response = await publicApi.get("", { params });
      const raw =
        response?.data?.results ||
        response?.data?.data ||
        (Array.isArray(response?.data) ? response.data : []);

      if (raw.length === 0) {
        return INITIAL_REVIEWS;
      }
      return raw.map((item: any) => mapReview(item));
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      return INITIAL_REVIEWS;
    }
  },

  getStats: async (): Promise<ReviewStats> => {
    try {
      const response = await publicApi.get("", {
        params: {
          path: "administration/reviews/stats/",
        },
      });
      if (response?.data) {
        return {
          totalReviews: response.data.total_reviews ?? 0,
          averageDriverRating: response.data.average_driver_rating ?? 0,
          averagePassengerRating: response.data.average_passenger_rating ?? 0,
          flaggedReviews: response.data.flagged_reviews ?? 0,
        };
      }
      return INITIAL_REVIEW_STATS;
    } catch {
      return INITIAL_REVIEW_STATS;
    }
  },

  toggleReviewStatus: async (
    ratingId: string,
    action: "restore" | "remove"
  ): Promise<any> => {
    try {
      const response = await publicApi.post(
        "",
        {},
        {
          params: {
            path: "administration/reviews/toggle-status/",
            rating_id: ratingId,
            action,
          },
          successMessage:
            action === "restore"
              ? "Review has been restored."
              : "Review has been removed.",
        } as any
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to ${action} review ${ratingId}:`, error);
      throw error;
    }
  },

  removeReview: async (ratingId: string): Promise<any> => {
    return reviewsService.toggleReviewStatus(ratingId, "remove");
  },

  restoreReview: async (ratingId: string): Promise<any> => {
    return reviewsService.toggleReviewStatus(ratingId, "restore");
  },

  flagReview: async (
    ratingId: string,
    action: "flag" | "unflag" = "flag"
  ): Promise<any> => {
    try {
      const response = await publicApi.post(
        "",
        {},
        {
          params: {
            path: "administration/reviews/flag/",
            rating_id: ratingId,
            action,
          },
          successMessage:
            action === "flag"
              ? "Review has been flagged."
              : "Review has been unflagged.",
        } as any
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to ${action} review ${ratingId}:`, error);
      throw error;
    }
  },
};
