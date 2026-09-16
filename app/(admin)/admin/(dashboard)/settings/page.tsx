"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Pagination from "@/components/admin/Pagination";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import RolePermissionsForm from "@/components/admin/RolePermissionsForm";
import { roleService, Role, Permission } from "@/services/role-services";
import styles from "./page.module.css";

type SettingsTab =
  | "roles"
  | "platform-rules"
  | "vehicle-registration"
  | "driver-verification"
  | "payments-wallet"
  | "support-slas";

interface TabItem {
  id: SettingsTab;
  label: string;
}

const SETTINGS_TABS: TabItem[] = [
  { id: "roles", label: "Roles" },
  { id: "platform-rules", label: "Platform Rules" },
  { id: "vehicle-registration", label: "Vehicle & Registration" },
  { id: "driver-verification", label: "Driver Verification" },
  { id: "payments-wallet", label: "Payments & Wallet" },
  { id: "support-slas", label: "Support & SLA's" },
];

export interface FormattedRoleItem {
  id: number | string;
  name: string;
  description: string;
  permissions: Permission[];
  permissionsText: string;
  createdOn: string;
  isActive: boolean;
}

/**
 * Format permission resource list for display in the table
 */
function formatPermissionsText(permissions: Permission[] = []): string {
  if (!permissions || permissions.length === 0) {
    return "No permissions";
  }

  const distinctResources = Array.from(
    new Set(
      permissions.map((p) => {
        const res = p.resource || p.codename?.split(".")[0] || "";
        return res ? res.charAt(0).toUpperCase() + res.slice(1) : "";
      }).filter(Boolean)
    )
  );

  return distinctResources.length > 0
    ? distinctResources.join(", ")
    : `${permissions.length} permissions assigned`;
}

/**
 * Format ISO date string into DD MMM YYYY (e.g. 30 Apr 2026)
 */
function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("roles");

  // Live roles state from roleService
  const [roles, setRoles] = useState<FormattedRoleItem[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [totalRolesCount, setTotalRolesCount] = useState(0);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Actions & Form state
  const [activeKebabId, setActiveKebabId] = useState<string | number | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [editingRole, setEditingRole] = useState<FormattedRoleItem | null>(null);

  // Modals state
  const [deactivateRole, setDeactivateRole] = useState<FormattedRoleItem | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const [removeRole, setRemoveRole] = useState<FormattedRoleItem | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const kebabRef = useRef<HTMLDivElement>(null);

  // Close kebab when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setActiveKebabId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch roles from roleService
  const fetchRoles = useCallback(async () => {
    try {
      setLoadingRoles(true);
      const res = await roleService.getRoles(currentPage, searchQuery);
      const results: Role[] = res.results || [];
      setTotalRolesCount(res.count || results.length);

      const formatted: FormattedRoleItem[] = results.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description || "",
        permissions: r.permissions || [],
        permissionsText: formatPermissionsText(r.permissions),
        createdOn: formatDate(r.created_at),
        isActive: Boolean(r.is_active),
      }));

      setRoles(formatted);

      // Extract distinct permissions from roles to enrich permissions matrix if endpoint doesn't return any
      const permsMap = new Map<number, Permission>();
      results.forEach((r) => {
        (r.permissions || []).forEach((p) => {
          if (p && p.id) {
            permsMap.set(p.id, p);
          }
        });
      });
      if (permsMap.size > 0) {
        setAllPermissions((prev) => {
          const merged = new Map<number, Permission>();
          prev.forEach((p) => merged.set(p.id, p));
          permsMap.forEach((p, id) => merged.set(id, p));
          return Array.from(merged.values());
        });
      }
    } catch (error) {
      console.error("Failed to load roles:", error);
    } finally {
      setLoadingRoles(false);
    }
  }, [currentPage, searchQuery]);

  // Initial load of roles and backend permissions
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const perms = await roleService.getPermissions();
        if (Array.isArray(perms) && perms.length > 0) {
          setAllPermissions(perms);
        }
      } catch (err) {
        console.error("Failed to load permissions:", err);
      }
    };
    loadPermissions();
  }, []);

  // Filtered roles based on status filter
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && role.isActive) ||
        (filterStatus === "inactive" && !role.isActive);

      return matchesStatus;
    });
  }, [roles, filterStatus]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(totalRolesCount / resultsPerPage));

  // Role Save handler (Create / Update)
  const handleSaveRole = async (
    name: string,
    description: string,
    permissionIds: number[]
  ) => {
    if (editingRole) {
      await roleService.updateRole(editingRole.id, {
        name,
        description,
        permission_ids: permissionIds,
      });
    } else {
      await roleService.createRole({
        name,
        description,
        permission_ids: permissionIds,
      });
    }

    await fetchRoles();
    setIsCreatingRole(false);
    setEditingRole(null);
  };

  // Deactivate role handler
  const handleConfirmDeactivate = async () => {
    if (!deactivateRole) return;
    setIsDeactivating(true);
    try {
      await roleService.deactivateRole(deactivateRole.id);
      await fetchRoles();
      setDeactivateRole(null);
    } catch (err) {
      console.error("Deactivate role error:", err);
    } finally {
      setIsDeactivating(false);
    }
  };

  // Remove role handler
  const handleConfirmRemove = async () => {
    if (!removeRole) return;
    setIsRemoving(true);
    try {
      await roleService.deleteRole(removeRole.id);
      await fetchRoles();
      setRemoveRole(null);
    } catch (err) {
      console.error("Delete role error:", err);
    } finally {
      setIsRemoving(false);
    }
  };

  // If in create or edit role view, render RolePermissionsForm
  if (isCreatingRole) {
    return (
      <div className={styles.page}>
        <RolePermissionsForm
          onBack={() => {
            setIsCreatingRole(false);
            setEditingRole(null);
          }}
          onSubmit={handleSaveRole}
          initialName={editingRole?.name}
          initialDescription={editingRole?.description}
          initialPermissions={editingRole?.permissions}
          allPermissions={allPermissions}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ─── Tabs Bar ─── */}
      <div className={styles.tabsBar} role="tablist" aria-label="Settings categories">
        {SETTINGS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              id={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── Tab Content: Roles ─── */}
      {activeTab === "roles" ? (
        <>
          {/* Toolbar: Search, Filter, Add Role */}
          <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
              <SearchIcon className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                id="roles-search-input"
              />
            </div>

            <button
              type="button"
              className={`${styles.filterBtn} ${filterStatus !== "all" ? styles.filterActive : ""}`}
              onClick={() => {
                setFilterStatus((prev) => {
                  if (prev === "all") return "active";
                  if (prev === "active") return "inactive";
                  return "all";
                });
              }}
              id="roles-filter-btn"
              title={`Filter status: ${filterStatus}`}
            >
              <FilterIcon />
              <span>
                {filterStatus === "all"
                  ? "Filter"
                  : filterStatus === "active"
                  ? "Active Only"
                  : "Inactive Only"}
              </span>
            </button>

            <button
              type="button"
              className={styles.addRoleBtn}
              onClick={() => {
                setEditingRole(null);
                setIsCreatingRole(true);
              }}
              id="add-role-btn"
            >
              Add Role
            </button>
          </div>

          {/* Roles Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Role Name</th>
                    <th className={styles.th}>Permissions</th>
                    <th className={styles.th}>Created On</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th} style={{ width: 48 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRoles ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyState}>
                        Loading roles...
                      </td>
                    </tr>
                  ) : filteredRoles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyState}>
                        {searchQuery ? "No matching roles found" : "No roles created yet"}
                      </td>
                    </tr>
                  ) : (
                    filteredRoles.map((role) => {
                      const isMenuOpen = activeKebabId === role.id;
                      return (
                        <tr key={role.id} className={styles.tr}>
                          <td className={styles.td}>
                            <span className={styles.roleName}>{role.name}</span>
                          </td>
                          <td className={styles.td}>
                            <div className={styles.permissionsText} title={role.permissionsText}>
                              {role.permissionsText}
                            </div>
                          </td>
                          <td className={styles.td}>
                            <span className={styles.createdOn}>{role.createdOn}</span>
                          </td>
                          <td className={styles.td}>
                            <span
                              className={`${styles.statusBadge} ${
                                role.isActive ? styles.statusActive : styles.statusInactive
                              }`}
                            >
                              <span className={styles.statusDot} />
                              {role.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className={`${styles.td} ${styles.actionsCell}`}>
                            <button
                              type="button"
                              className={styles.kebabBtn}
                              aria-label={`Actions for ${role.name}`}
                              id={`role-actions-${role.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveKebabId(isMenuOpen ? null : role.id);
                              }}
                            >
                              <MoreVerticalIcon />
                            </button>

                            {/* Kebab Dropdown Menu */}
                            {isMenuOpen && (
                              <div className={styles.kebabPopover} ref={kebabRef}>
                                <button
                                  type="button"
                                  className={styles.kebabItem}
                                  onClick={() => {
                                    setActiveKebabId(null);
                                    setEditingRole(role);
                                    setIsCreatingRole(true);
                                  }}
                                  id={`edit-role-${role.id}`}
                                >
                                  Edit Role
                                </button>
                                <button
                                  type="button"
                                  className={styles.kebabItem}
                                  onClick={() => {
                                    setActiveKebabId(null);
                                    setDeactivateRole(role);
                                  }}
                                  id={`deactivate-role-${role.id}`}
                                >
                                  {role.isActive ? "Deactivate role" : "Activate role"}
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.kebabItem} ${styles.kebabItemDanger}`}
                                  onClick={() => {
                                    setActiveKebabId(null);
                                    setRemoveRole(role);
                                  }}
                                  id={`remove-role-${role.id}`}
                                >
                                  Remove Role
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loadingRoles && totalRolesCount > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                resultsPerPage={resultsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </>
      ) : (
        /* ─── Other Tabs Placeholder ─── */
        <div className={styles.card} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              {SETTINGS_TABS.find((t) => t.id === activeTab)?.label}
            </h3>
            <p className={styles.cardSubtitle}>
              Configure and manage platform {SETTINGS_TABS.find((t) => t.id === activeTab)?.label.toLowerCase()} preferences.
            </p>
          </div>
        </div>
      )}

      {/* ─── Deactivate Role Confirmation Modal ─── */}
      <ConfirmActionModal
        isOpen={Boolean(deactivateRole)}
        onClose={() => setDeactivateRole(null)}
        onConfirm={handleConfirmDeactivate}
        title="Deactivate Role?"
        message="Are you sure you want to deactivate this role? Users assigned to this role may lose access to certain permissions."
        confirmText="Deactivate Role"
        cancelText="Dismiss"
        isDanger={true}
        isLoading={isDeactivating}
      />

      {/* ─── Remove Role Confirmation Modal ─── */}
      <ConfirmActionModal
        isOpen={Boolean(removeRole)}
        onClose={() => setRemoveRole(null)}
        onConfirm={handleConfirmRemove}
        title="Remove Role?"
        message={`Are you sure you want to remove the "${removeRole?.name}" role? This action cannot be undone.`}
        confirmText="Remove Role"
        cancelText="Dismiss"
        isDanger={true}
        isLoading={isRemoving}
      />
    </div>
  );
}

/* ─── Inline Icons ─── */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function MoreVerticalIcon() {
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
      <circle cx={12} cy={12} r={1} />
      <circle cx={12} cy={5} r={1} />
      <circle cx={12} cy={19} r={1} />
    </svg>
  );
}
