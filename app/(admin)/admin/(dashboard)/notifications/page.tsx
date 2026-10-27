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

const NOTIFICATION_FILTER_TABS = [
  {
    id: "statuses",
    label: "Status",
    options: ["Sent", "Draft", "Scheduled", "Active", "Inactive"],
  },
  {
    id: "channels",
    label: "Channel",
    options: ["Email", "SMS", "Push", "In-App", "All Channels"],
  },
  {
    id: "recipients",
    label: "Recipients",
    options: ["All Users", "All Vendors", "All Admins", "Specific Users"],
  },
];

const NOTIFICATION_SORT_OPTIONS = [
  { label: "Newest to Oldest", value: "date_desc" },
  { label: "Oldest to Newest", value: "date_asc" },
  { label: "Title A to Z", value: "title_asc" },
  { label: "Title Z to A", value: "title_desc" },
];

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

  const totalActiveFilters =
    (activeFilters.statuses?.length || 0) +
    (activeFilters.channels?.length || 0) +
    (activeFilters.recipients?.length || 0);

  const activeSortLabel =
    NOTIFICATION_SORT_OPTIONS.find((s) => s.value === sortOption)?.label || "Sort By";

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters, sortOption]);

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  // Client-side filtering & sorting for properties not supported by backend yet
  const filteredAndSortedList = useMemo(() => {
    let result = [...notificationlist];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (notif) =>
          (notif?.title || "").toLowerCase().includes(q) ||
          (notif?.delivery_channel || notif?.channel || "")
            .toLowerCase()
            .includes(q) ||
          (notif?.recipient_type || notif?.recipients || "")
            .toLowerCase()
            .includes(q) ||
          (notif?.status || "").toLowerCase().includes(q),
      );
    }

    if (activeFilters.statuses && activeFilters.statuses.length > 0) {
      const selectedStatuses = activeFilters.statuses.map((s) => s.toLowerCase());
      result = result.filter((notif) => {
        const notifStatus = (notif?.status || "").toLowerCase();
        return selectedStatuses.includes(notifStatus);
      });
    }

    if (activeFilters.channels && activeFilters.channels.length > 0) {
      const channelsLower = activeFilters.channels.map((c) =>
        c === "All Channels" ? "all" : c.toLowerCase().replace(/[\s-]+/g, "_"),
      );
      result = result.filter((notif) => {
        const ch = (notif?.delivery_channel || notif?.channel || "")
          .toLowerCase()
          .replace(/[\s-]+/g, "_");
        return channelsLower.some(
          (f) =>
            f === "all" ||
            ch === "all" ||
            ch === f ||
            ch.includes(f) ||
            f.includes(ch),
        );
      });
    }

    if (activeFilters.recipients && activeFilters.recipients.length > 0) {
      const recLower = activeFilters.recipients.map((r) =>
        r === "Specific Users" ? "specific" : r.toLowerCase().replace(/[\s-]+/g, "_"),
      );
      result = result.filter((notif) => {
        const rec = (notif?.recipient_type || notif?.recipients || "")
          .toLowerCase()
          .replace(/[\s-]+/g, "_");
        return recLower.some(
          (f) => rec === f || rec.includes(f) || f.includes(rec),
        );
      });
    }

    result.sort((a, b) => {
      if (sortOption === "title_asc") {
        return (a?.title || "").localeCompare(b?.title || "");
      }
      if (sortOption === "title_desc") {
        return (b?.title || "").localeCompare(a?.title || "");
      }
      if (sortOption === "date_asc") {
        const dateA = new Date(a?.created_at || a?.createdOn || 0).getTime();
        const dateB = new Date(b?.created_at || b?.createdOn || 0).getTime();
        return (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
      }
      if (sortOption === "date_desc") {
        const dateA = new Date(a?.created_at || a?.createdOn || 0).getTime();
        const dateB = new Date(b?.created_at || b?.createdOn || 0).getTime();
        return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
      }
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
                isFilterActive={totalActiveFilters > 0}
                filterCount={totalActiveFilters}
                sortLabel={activeSortLabel}
                filterDropdown={
                  <FilterDropdown
                    initialFilters={activeFilters}
                    tabs={NOTIFICATION_FILTER_TABS}
                    onApply={(filters) => {
                      setActiveFilters({
                        statuses: filters.statuses || [],
                        channels: filters.channels || [],
                        recipients: filters.recipients || [],
                      });
                      setCurrentPage(1);
                    }}
                  />
                }
                sortDropdown={
                  <SortDropdown
                    options={NOTIFICATION_SORT_OPTIONS}
                    selectedOption={sortOption}
                    onSortSelect={(val) => {
                      setSortOption(val);
                      setCurrentPage(1);
                    }}
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
                  {filteredAndSortedList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          padding: "48px 16px",
                          color: "#6B7280",
                          fontSize: "14px",
                        }}
                      >
                        No notifications found matching your search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedList.map((notif) => (
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
                          {notif?.delivery_channel || notif?.channel || "-"}
                        </td>
                        <td>
                          {notif?.recipient_count ??
                            notif?.recipients ??
                            notif?.recipient_type ??
                            "-"}
                        </td>
                        <td>
                          <span
                            className={styles.statusBadge}
                            data-status={notif?.status?.toLowerCase()}
                          >
                            <span className={styles.statusDot} />
                            {notif?.status}
                          </span>
                        </td>
                        <td>
                          {(notif?.created_at
                            ? notif.created_at.slice(0, 10)
                            : notif?.createdOn) || "-"}
                        </td>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={
                searchQuery || totalActiveFilters > 0
                  ? Math.max(1, Math.ceil(filteredAndSortedList.length / 10))
                  : Math.max(1, Math.ceil(totalCount / 10))
              }
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
