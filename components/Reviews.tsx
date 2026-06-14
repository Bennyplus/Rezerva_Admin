"use client";

import { useState, useEffect } from "react";
import { marketingService } from "@/services/marketing-service";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  message: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
  avatar?: string;
  image?: string;
  photo?: string;
}

interface ReviewType {
  id: string;
  title: string;
  stars: number;
  body: string;
  author: string;
  date: string;
  avatar?: string;
  image?: string;
}

const STATIC_REVIEWS: ReviewType[] = [
  {
    id: "r1",
    title: "Wonderful Experience",
    stars: 4.5,
    body: "I had a wonderful experience with this vehicle. It was clean, comfortable, and drove perfectly throughout my trip.",
    author: "Sandra Smith",
    date: "30 April 2026",
    avatar: "https://i.pravatar.cc/150?u=sandra",
  },
  {
    id: "r2",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids. It was exactly what I needed. Stylish and very comfortable.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: "https://i.pravatar.cc/150?u=michael",
  },
  {
    id: "r3",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids. Stylish and very comfortable. Perfect for our weekend trip with the kids. It was exactly what I needed. Stylish and very comfortable.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: "https://i.pravatar.cc/150?u=michael2",
  },
  {
    id: "r4",
    title: "Perfect for special occasions",
    stars: 5,
    body: "I rented this for an event and it was exactly what I needed. Stylish and very comfortable.",
    author: "Aisha Carie",
    date: "30 April 2026",
    avatar: "https://i.pravatar.cc/150?u=aisha",
  },
  {
    id: "r5",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids. Very spacious and comfortable. Perfect for our weekend trip with the kids.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: "https://i.pravatar.cc/150?u=michael3",
  },
  {
    id: "r6",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids. Very spacious and comfortable. Perfect for our weekend trip with the kids.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: "https://i.pravatar.cc/150?u=michael4",
  },
  {
    id: "r7",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: "https://i.pravatar.cc/150?u=michael5",
  },
  {
    id: "r8",
    title: "Perfect for special occasions",
    stars: 5,
    body: "I rented this for an event and it was exactly what I needed. Stylish and very comfortable.",
    author: "Aisha Carie",
    date: "30 April 2026",
    avatar: "https://i.pravatar.cc/150?u=aisha2",
  },
];

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTestimonials() {
      setIsLoading(true);
      try {
        const data = await marketingService.getTestimonials();
        if (data && data.length > 0) {
          // Map first 8 testimonials
          const mapped: ReviewType[] = data.slice(0, 8).map((t: Testimonial) => {
            let formattedDate = "19 April 2026";
            if (t.created_at) {
              try {
                formattedDate = new Date(t.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
              } catch (e) {
                console.error("Error formatting date:", e);
              }
            }
            return {
              id: `r-${t.id}`,
              title: t.role || "Review",
              stars: t.rating || 5,
              body: t.message || "",
              author: t.name || "Anonymous",
              date: formattedDate,
              image: t.image || t.avatar || t.photo || "",
              avatar: t.avatar || t.photo || "",
            };
          });
          setReviews(mapped);
        } else {
          // Fallback to static reviews if empty response
          setReviews(STATIC_REVIEWS);
        }
      } catch (error) {
        console.error("Failed to load testimonials, falling back to static reviews:", error);
        setReviews(STATIC_REVIEWS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  // Use either the mapped reviews or empty array while loading
  const displayReviews = isLoading ? Array(8).fill(null) : reviews;

  return (
    <section
      id="reviews"
      className="reviews section"
      aria-labelledby="reviews-heading"
    >
      <div className="container">
        <header className="reviews__header">
          <h2 id="reviews-heading" className="heading-2 reviews__heading">
            Loved By Users
          </h2>
          <p className="reviews__subtext">
            Real experiences from people who trust Drifully for their everyday
            journeys.
          </p>
        </header>

        <div className="reviews__grid" role="list">
          {displayReviews.map((review, index) => {
            let className = "";
            if (index === 0 || index === 4 || index === 7) {
              className = "review-card--wide";
            } else if (index === 2) {
              className = "review-card--tall";
            }
            
            // Card 2, 4, and 8 (0-indexed as 1, 3, and 7) have custom background
            const isCustomBg = index === 1 || index === 3 || index === 7;

            if (isLoading) {
              return (
                <ReviewCardSkeleton
                  key={`skeleton-${index}`}
                  className={className}
                />
              );
            }

            return (
              <ReviewCard
                key={review.id}
                review={review}
                className={className}
                hasCustomBg={isCustomBg}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="star-rating" aria-label={`${stars} out of 5 stars`}>
      <div className="star-rating__bg" aria-hidden="true">
        {"★★★★★"}
      </div>
      <div
        className="star-rating__fill"
        aria-hidden="true"
        style={{ width: `${(stars / 5) * 100}%` }}
      >
        {"★★★★★"}
      </div>
    </div>
  );
}

function ReviewCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <article
      className={`review-card review-card--skeleton ${className}`}
      role="presentation"
    >
      <div className="review-card__top">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-stars" />
      </div>

      <div className="review-card__body" style={{ margin: 0 }}>
        <div className="skeleton-line skeleton-body-line" />
        <div className="skeleton-line skeleton-body-line" />
        <div className="skeleton-line skeleton-body-line" />
      </div>

      <div className="review-card__author">
        <div className="skeleton-line skeleton-avatar" />
        <div className="review-card__author-info" style={{ flexGrow: 1 }}>
          <div className="skeleton-line skeleton-name" />
          <div className="skeleton-line skeleton-date" />
        </div>
      </div>
    </article>
  );
}

function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

function ReviewCard({
  review,
  className = "",
  hasCustomBg = false
}: {
  review: ReviewType,
  className?: string,
  hasCustomBg?: boolean
}) {
  const [imgError, setImgError] = useState(false);

  const initials = getInitials(review.author);
  const avatarBg = getAvatarColor(review.author);

  return (
    <article
      className={`review-card ${className}`}
      role="listitem"
      id={review.id}
      style={hasCustomBg ? { backgroundColor: "var(--color-surface)" } : undefined}
    >
      <div className="review-card__top">
        <h3 className="review-card__title">{review.title}</h3>
        <StarRating stars={review.stars} />
      </div>

      <p className="review-card__body">{review.body}</p>

      <div className="review-card__author">
        {(review.image || review.avatar) && !imgError ? (
          <img
            src={review.image || review.avatar}
            alt={review.author}
            className="review-card__avatar"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="review-card__avatar-initials"
            style={{ backgroundColor: avatarBg }}
            aria-label={review.author}
          >
            {initials}
          </div>
        )}
        <div className="review-card__author-info">
          <p className="review-card__name">{review.author}</p>
          <p className="review-card__date">{review.date}</p>
        </div>
      </div>
    </article>
  );
}


