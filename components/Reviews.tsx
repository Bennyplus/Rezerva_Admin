"use client";

const REVIEWS = [
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
          {REVIEWS.map((review, index) => {
            let className = "";
            if (index === 0 || index === 4 || index === 7) {
              className = "review-card--wide";
            } else if (index === 2) {
              className = "review-card--tall";
            }
            return (
              <ReviewCard
                key={review.id}
                review={review}
                className={className}
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

function ReviewCard({
  review,
  className = ""
}: {
  review: (typeof REVIEWS)[0],
  className?: string
}) {
  const hasCustomBg = ["r2", "r4", "r8"].includes(review.id);

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
        <img
          src={review.avatar || ""}
          alt={review.author}
          className="review-card__avatar"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=random`;
          }}
        />
        <div className="review-card__author-info">
          <p className="review-card__name">{review.author}</p>
          <p className="review-card__date">{review.date}</p>
        </div>
      </div>
    </article>
  );
}


