"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import CreateNotificationForm from "@/components/admin/CreateNotificationForm";
import NotificationDetailsModal from "@/components/admin/NotificationDetailsModal";
import Spinner from "@/components/admin/Spinner";
import { notificationsService } from "@/services/notifications-services";
import { NOTIFICATION_STATS, ADMIN_NOTIFICATIONS } from "@/data/admin-notifications";
import FilterBar from "@/components/admin/FilterBar";
import styles from "./notifications.module.css";

export default function NotificationsPage() {
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"list" | "create">("list");
  const [currentPage, setCurrentPage] = useState(2);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  // data states
  const [notificationlist, setNotificationList] = useState<any[]>([]);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const data = await notificationsService.getNotifications(currentPage);
      setNotificationList(data);
      setIsEmpty(!Array.isArray(data) || data.length === 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setFetchError(error instanceof Error ? error.message : "Unable to load notifications.");
      setIsEmpty(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    setActiveDropdown(null);
    try {
      await notificationsService.duplicateNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error(`Failed to duplicate notification ${id}`, error);
    }
  };

  const handleCancelSchedule = async (id: string) => {
    setActiveDropdown(null);
    try {
      await notificationsService.cancelScheduledNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error(`Failed to cancel schedule for notification ${id}`, error);
    }
  };

  const handleDeactivate = async (id: string) => {
    setActiveDropdown(null);
    try {
      await notificationsService.deactivateNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error(`Failed to deactivate notification ${id}`, error);
    }
  };

  const handleViewDetails = (id: string) => {
    setActiveDropdown(null);
    setSelectedNotificationId(id);
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

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

  if (isLoading) {
      return (
        <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size={40} />
        </div>
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

      {fetchError ? (
        <div className={styles.errorCard}>
          <h2 className={styles.errorTitle}>Unable to fetch notifications</h2>
          <p className={styles.errorSubtitle}>{fetchError}</p>
          <button className={styles.retryBtn} onClick={fetchNotifications}>
            Retry
          </button>
        </div>
      ) : isEmpty ? (
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
              <FilterBar />
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
                    <th className={styles.checkCol}>
                      <input type="checkbox" className={styles.checkbox} aria-label="Select all notifications" />
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
                  {notificationlist.map((notif) => (
                    <tr key={notif?.id}>
                      <td className={styles.checkCol}>
                        <input type="checkbox" className={styles.checkbox} aria-label={`Select notification ${notif?.title}`} />
                      </td>
                      <td>{notif?.title}</td>
                      <td style={{ textTransform: "capitalize" }}>{notif?.delivery_channel}</td>
                      <td>{notif?.recipient_count}</td>
                      <td>
                        <span className={styles.statusBadge} data-status={notif?.status}>
                          <span className={styles.statusDot} />
                          {notif?.status}
                        </span>
                      </td>
                      <td>{notif?.created_at?.slice(0, 10)}</td>
                      <td>
                        <div style={{ position: "relative" }}>
                          <button
                            className={styles.moreBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(notif?.id);
                            }}
                          >
                            <MoreIcon />
                          </button>
                          {activeDropdown === notif.id && (
                            <div className={styles.dropdown}>
                              <button className={styles.dropdownItem}>Edit Notification</button>
                              <button 
                                className={styles.dropdownItem}
                                onClick={() => handleViewDetails(notif.id)}
                              >
                                View Details
                              </button>
                              <button className={styles.dropdownItem} onClick={() => handleCancelSchedule(notif.id)}>Cancel Schedule</button>
                              <button className={styles.dropdownItem} onClick={() => handleDuplicate(notif.id)}>Duplicate</button>
                              <button className={styles.dropdownItem} onClick={() => handleDeactivate(notif.id)}>Deactivate</button>
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
          notificationId={selectedNotificationId}
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

function MoreIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  );
}
