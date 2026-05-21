"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import CreateNotificationForm from "@/components/admin/CreateNotificationForm";
import NotificationDetailsModal from "@/components/admin/NotificationDetailsModal";
import { NOTIFICATION_STATS, ADMIN_NOTIFICATIONS } from "@/data/admin-notifications";
import styles from "./notifications.module.css";

export default function NotificationsPage() {
  const [isEmpty, setIsEmpty] = useState(ADMIN_NOTIFICATIONS.length === 0);
  const [currentView, setCurrentView] = useState<"list" | "create">("list");
  const [currentPage, setCurrentPage] = useState(2);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = () => setActiveDropdown(null);
    if (activeDropdown) {
      window.addEventListener("click", handleClick);
    }
    return () => window.removeEventListener("click", handleClick);
  }, [activeDropdown]);

  if (currentView === "create") {
    return (
      <CreateNotificationForm
        onCancel={() => setCurrentView("list")}
        onSave={(data) => {
          console.log("Saving notification:", data);
          setCurrentView("list");
        }}
      />
    );
  }

  return (
    <div className={styles.page}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {NOTIFICATION_STATS.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={isEmpty ? "0" : stat.value.toString()}
            id={stat.id}
          />
        ))}
      </div>

      {isEmpty ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard} id="notifications-empty-state">
          <div className={styles.illustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No notifications illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>No Notifications Yet</h2>
          <p className={styles.emptySubtitle}>
            Send updates, promotions, and important announcements to your users instantly.
          </p>
          <button
            className={styles.createBtn}
            onClick={() => setCurrentView("create")}
          >
            <PlusIcon />
            Create A New Notification
          </button>

          <div style={{ marginTop: "40px" }}>
            <button
              onClick={() => setIsEmpty(false)}
              className={styles.toolBtn}
              style={{ fontSize: "11px", opacity: 0.5 }}
            >
              (Dev: Show Data)
            </button>
          </div>
        </div>
      ) : (
        /* ─── Populated State ─── */
        <>
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <div className={styles.searchBox}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.searchInput}
                />
              </div>
              <button className={styles.toolBtn}>
                <FilterIcon />
                Filter
              </button>
              <button className={styles.toolBtn}>
                <SortIcon />
                Sort by
              </button>
            </div>
            <div className={styles.toolbarRight}>
              <button
                className={styles.createBtnSmall}
                onClick={() => setCurrentView("create")}
              >
                <PlusIcon />
                Create A New Notification
              </button>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>
                      <input type="checkbox" className={styles.checkbox} />
                    </th>
                    <th>Title</th>
                    <th>Channel</th>
                    <th>Recipients</th>
                    <th>Status</th>
                    <th>Created On</th>
                    <th style={{ width: "40px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_NOTIFICATIONS.map((notif) => (
                    <tr key={notif.id}>
                      <td>
                        <input type="checkbox" className={styles.checkbox} />
                      </td>
                      <td>{notif.title}</td>
                      <td>{notif.channel}</td>
                      <td>{notif.recipients}</td>
                      <td>
                        <span className={styles.statusBadge}>
                          <span className={styles.statusDot} />
                          {notif.status}
                        </span>
                      </td>
                      <td>{notif.createdOn}</td>
                      <td>
                        <div style={{ position: "relative" }}>
                          <button
                            className={styles.moreBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(notif.id);
                            }}
                          >
                            <MoreIcon />
                          </button>
                          {activeDropdown === notif.id && (
                            <div className={styles.dropdown}>
                              <button className={styles.dropdownItem}>Edit Notification</button>
                              <button 
                                className={styles.dropdownItem}
                                onClick={() => {
                                  setSelectedNotificationId(notif.id);
                                  setActiveDropdown(null);
                                }}
                              >
                                View Details
                              </button>
                              <button className={styles.dropdownItem}>Cancel Schedule</button>
                              <button className={styles.dropdownItem}>Duplicate</button>
                              <button className={styles.dropdownItem}>Deactivate</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={16}
              resultsPerPage={9}
              onPageChange={setCurrentPage}
              variant="table"
            />
          </div>
        </>
      )}

      {selectedNotificationId && (
        <NotificationDetailsModal
          notification={ADMIN_NOTIFICATIONS.find((n) => n.id === selectedNotificationId)}
          onClose={() => setSelectedNotificationId(null)}
        />
      )}
    </div>
  );
}

/* ─── Icons ─── */
function PlusIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="13" y2="6" /><line x1="4" y1="12" x2="10" y2="12" /><line x1="4" y1="18" x2="7" y2="18" /><line x1="18" y1="6" x2="18" y2="18" /><polyline points="15 15 18 18 21 15" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  );
}
