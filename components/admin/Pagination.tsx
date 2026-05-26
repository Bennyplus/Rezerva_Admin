"use client";

import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  variant?: "table" | "standalone";
}

export default function Pagination({
  currentPage,
  totalPages,
  resultsPerPage,
  onPageChange,
  variant = "table",
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    for (let i = 1; i <= Math.min(5, totalPages); i++) pages.push(i);
    if (totalPages > 6) pages.push("...");
    if (totalPages > 5) pages.push(totalPages);
    return pages;
  };

  return (
    <div className={variant === "table" ? styles.pagination : styles.paginationStandalone}>
      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>

      <div className={styles.pageControls}>
        <button
          className={styles.pageBtn}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <ChevronsLeftIcon />
        </button>
        <button
          className={styles.pageBtn}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </button>

        {getPageNumbers().map((p, i: number) =>
          p === "..." ? (
            <span key={`dots-${i}`} className={styles.pageDots}>
              …
            </span>
          ) : (
            <button
              key={p}
              className={`${styles.pageNum} ${currentPage === p ? styles.pageNumActive : ""}`}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </button>
          )
        )}

        <button
          className={styles.pageBtn}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </button>
        <button
          className={styles.pageBtn}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          <ChevronsRightIcon />
        </button>
      </div>

      <div className={styles.resultsDropdown}>
        Showing {resultsPerPage} results
        <ChevronDownIcon />
      </div>
    </div>
  );
}

/* ─── Pagination Icons ─── */
const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ChevronLeftIcon() {
  return (
    <svg {...iconProps}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg {...iconProps}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function ChevronsLeftIcon() {
  return (
    <svg {...iconProps}>
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  );
}
function ChevronsRightIcon() {
  return (
    <svg {...iconProps}>
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
