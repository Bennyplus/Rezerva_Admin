import React from 'react';
import Image from 'next/image';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  hideFilter?: boolean;
  hideSort?: boolean;
  filterDropdown?: React.ReactNode;
  sortDropdown?: React.ReactNode;
}

export default function FilterBar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onFilterClick,
  onSortClick,
  hideFilter = false,
  hideSort = false,
  filterDropdown,
  sortDropdown,
}: FilterBarProps) {
  const [internalSearch, setInternalSearch] = React.useState("");
  
  const currentSearch = searchValue !== undefined ? searchValue : internalSearch;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchBox}>
        <Image
          src="/images/admin/sidebar-icons/search-glass.svg"
          alt="Search"
          width={18}
          height={18}
          className={styles.searchIcon}
        />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className={styles.searchInput}
          value={currentSearch}
          onChange={handleSearchChange}
        />
      </div>
      {!hideFilter && (
        <div className={styles.popoverWrapper} onMouseDown={(e) => e.stopPropagation()}>
          <button className={styles.toolBtn} onClick={onFilterClick}>
            <Image
              src="/images/admin/sidebar-icons/filter.svg"
              alt="Filter"
              width={16}
              height={16}
            />
            Filter
          </button>
          {filterDropdown}
        </div>
      )}
      {!hideSort && (
        <div className={styles.popoverWrapper} onMouseDown={(e) => e.stopPropagation()}>
          <button className={styles.toolBtn} onClick={onSortClick}>
            <Image
              src="/images/admin/sidebar-icons/sort.svg"
              alt="Sort"
              width={16}
              height={16}
            />
            Sort By
          </button>
          {sortDropdown}
        </div>
      )}
    </div>
  );
}
