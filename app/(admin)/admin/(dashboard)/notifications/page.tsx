"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/StatCard";
import Pagination from "@/components/admin/Pagination";
import CreateNotificationForm from "@/components/admin/CreateNotificationForm";
import NotificationDetailsModal from "@/components/admin/NotificationDetailsModal";
import Spinner from "@/components/admin/Spinner";
import { notificationsService } from "@/services/notifications-services";
import { NOTIFICATION_STATS } from "@/data/admin-notifications";
import FilterBar from "@/components/admin/FilterBar";
import FilterDropdown from "@/components/admin/FilterDropdown";
import SortDropdown from "@/components/admin/SortDropdown";
import MoreIcon from "@/components/admin/icons/MoreIcon";
import styles from "./notifications.module.css";

export default function NotificationsPage() {
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"list" | "create">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const [editingNotification, setEditingNotification] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // data states
  const [notificationlist, setNotificationList] = useState<any[]>([]);

  // filter/sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<{
    statuses: string[];
    channels: string[];
    recipients: string[];
  }>({ statuses: [], channels: [], recipients: [] });
  const [sortOption, setSortOption] = useState<string>("date_desc");

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const data = await notificationsService.getNotifications(currentPage);
      setNotificationList(data.results || []);
      setTotalCount(data.count || 0);
      setIsEmpty(!data.results || data.results.length === 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setFetchError(
        error instanceof Error
          ? error.message
          : "Unable to load notifications.",
      );
      setIsEmpty(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNotification = async (id: string | number) => {
    setActiveDropdown(null);
    try {
      setIsLoading(true);
      await notificationsService.sendNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error(`Failed to send notification ${id}`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    setActiveDropdown(null);
    setSelectedNotificationId(id);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  // Client-side filtering & sorting for properties not supported by backend yet
  const filteredAndSortedList = useMemo(() => {
    let result = [...notificationlist];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (notif) =>
          notif?.title?.toLowerCase().includes(q) ||
          notif?.delivery_channel?.toLowerCase().includes(q),
      );
    }

    if (activeFilters.statuses.length > 0) {
      result = result.filter((notif) =>
        activeFilters.statuses.includes(notif?.status),
      );
    }

    if (activeFilters.channels.length > 0) {
      const channelsLower = activeFilters.channels.map((c) => c.toLowerCase());
      result = result.filter((notif) =>
        channelsLower.includes(notif?.delivery_channel?.toLowerCase()),
      );
    }

    result.sort((a, b) => {
      if (sortOption === "title_asc")
        return (a?.title || "").localeCompare(b?.title || "");
      if (sortOption === "title_desc")
        return (b?.title || "").localeCompare(a?.title || "");
      if (sortOption === "date_asc")
        return (
          new Date(a?.created_at || 0).getTime() -
          new Date(b?.created_at || 0).getTime()
        );
      if (sortOption === "date_desc")
        return (
          new Date(b?.created_at || 0).getTime() -
          new Date(a?.created_at || 0).getTime()
        );
      return 0;
    });

    return result;
  }, [notificationlist, searchQuery, activeFilters, sortOption]);

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
      <div style={{ position: "relative" }}>
        {submitError && (
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "13px",
              color: "#B91C1C",
            }}
          >
            <span>⚠ {submitError}</span>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#B91C1C",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1,
              }}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}
        <CreateNotificationForm
          initialData={editingNotification}
          onCancel={() => {
            setCurrentView("list");
            setSubmitError(null);
            setEditingNotification(null);
          }}
          onSave={async (data) => {
            setSubmitError(null);
            try {
              await notificationsService.createNotification(data);
              setCurrentView("list");
              setEditingNotification(null);
              fetchNotifications();
            } catch (error: any) {
              const msg = error?.response?.data
                ? Object.values(error.response.data).flat().join(" ")
                : "Failed to create notification. Please try again.";
              setSubmitError(msg);
            }
          }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          minHeight: "60vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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

      {fetchError || isEmpty ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard} id="notifications-empty-state">
          <h2 className={styles.emptyTitle}>No Notifications Yet</h2>
          <p className={styles.emptySubtitle}>
            Send updates, promotions, and important announcements to your users
            instantly.
          </p>
          <button
            className={styles.createBtn}
            onClick={() => setCurrentView("create")}
          >
            Create A New Notification
          </button>
        </div>
      ) : (
        /* ─── Populated State ─── */
        <>
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <FilterBar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filterDropdown={
                  <FilterDropdown
                    tabs={[
                      {
                        id: "statuses",
                        label: "Status",
                        options: ["Active", "Inactive"],
                      },
                      {
                        id: "channels",
                        label: "Channel",
                        options: ["Push", "Email", "In-App"],
                      },
                      {
                        id: "recipients",
                        label: "Recipients",
                        options: ["All", "Drivers", "Customers"],
                      },
                    ]}
                    onApply={(filters) =>
                      setActiveFilters({
                        statuses: filters.statuses || [],
                        channels: filters.channels || [],
                        recipients: filters.recipients || [],
                      })
                    }
                  />
                }
                sortDropdown={
                  <SortDropdown
                    options={[
                      { label: "Newest to Oldest", value: "date_desc" },
                      { label: "Oldest to Newest", value: "date_asc" },
                      { label: "Title A to Z", value: "title_asc" },
                      { label: "Title Z to A", value: "title_desc" },
                    ]}
                    onSortSelect={setSortOption}
                  />
                }
              />
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
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        aria-label="Select all notifications"
                      />
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
                  {filteredAndSortedList.map((notif) => (
                    <tr key={notif?.id}>
                      <td className={styles.checkCol}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          aria-label={`Select notification ${notif?.title}`}
                        />
                      </td>
                      <td>{notif?.title}</td>
                      <td style={{ textTransform: "capitalize" }}>
                        {notif?.delivery_channel}
                      </td>
                      <td>{notif?.recipient_count}</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          data-status={notif?.status}
                        >
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
                              <button
                                className={styles.dropdownItem}
                                onClick={() => handleViewDetails(notif.id)}
                              >
                                View Details
                              </button>
                              <button
                                className={styles.dropdownItem}
                                onClick={() => handleSendNotification(notif.id)}
                              >
                                Send / Publish
                              </button>
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
              totalPages={Math.ceil(totalCount / 10) || 1}
              resultsPerPage={10}
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
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
