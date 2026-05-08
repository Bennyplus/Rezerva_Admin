"use client";

import { useState } from "react";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import RolePermissionsForm from "@/components/admin/RolePermissionsForm";
import { ADMIN_ROLES, formatPermissions, type Role } from "@/data/admin-teams";
import styles from "./teams.module.css";

type View = "list" | "create-role";
type Tab = "roles" | "team";

export default function TeamsPage() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [activeTab, setActiveTab] = useState<Tab>("roles");
  const [roles, setRoles] = useState<Role[]>(ADMIN_ROLES);
  const [currentPage, setCurrentPage] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");

  const totalPages = 16;
  const resultsPerPage = 9;

  /* Filter roles by search */
  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.permissions.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  /* Handle role creation */
  const handleCreateRole = async (name: string, permissions: string[]) => {
    /* Simulate async API call */
    await new Promise((r) => setTimeout(r, 1200));
    const newRole: Role = {
      id: `role-${Date.now()}`,
      name,
      permissions,
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Active",
    };
    setRoles((prev) => [newRole, ...prev]);
    setCurrentView("list");
  };

  /* ─── Create Role View ─── */
  if (currentView === "create-role") {
    return (
      <RolePermissionsForm
        onBack={() => setCurrentView("list")}
        onSubmit={handleCreateRole}
      />
    );
  }

  /* ─── List View ─── */
  const isEmpty = roles.length === 0;

  return (
    <div className={styles.page}>
      {isEmpty ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard} id="teams-empty-state">
          <div className={styles.illustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No roles illustration"
              width={200}
              height={166}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>No Roles Yet</h2>
          <p className={styles.emptySubtitle}>
            Send updates, promotions, and important announcements<br />
            to your users instantly.
          </p>
          <button
            className={styles.addBtn}
            id="add-role-btn-empty"
            onClick={() => setCurrentView("create-role")}
          >
            <PlusIcon />
            Add Role
          </button>
        </div>
      ) : (
        /* ─── Populated State ─── */
        <div className={styles.tableCard} id="teams-table-card">
          {/* Tabs */}
          <div className={styles.tabBar}>
            <button
              id="tab-role-management"
              className={`${styles.tab} ${activeTab === "roles" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("roles")}
            >
              Role Management
            </button>
            <button
              id="tab-team-management"
              className={`${styles.tab} ${activeTab === "team" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("team")}
            >
              Team Management
            </button>
          </div>

          {activeTab === "roles" ? (
            /* ─── Role Management Tab ─── */
            <>
              {/* Toolbar */}
              <div className={styles.toolbar} id="roles-toolbar">
                <div className={styles.toolbarLeft}>
                  {/* Search */}
                  <div className={styles.searchBox}>
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search..."
                      className={styles.searchInput}
                      id="roles-search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {/* Filter */}
                  <button className={styles.toolBtn} id="roles-filter-btn">
                    <FilterIcon />
                    Filter
                  </button>
                </div>
                <div className={styles.toolbarRight}>
                  <button
                    className={styles.addBtnSmall}
                    id="add-role-btn"
                    onClick={() => setCurrentView("create-role")}
                  >
                    <PlusIcon />
                    Add Role
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.checkCol}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          aria-label="Select all roles"
                          id="select-all-roles"
                        />
                      </th>
                      <th>Permissions</th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th className={styles.actionsCol} />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoles.map((role) => (
                      <tr key={role.id}>
                        <td className={styles.checkCol}>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            aria-label={`Select ${role.name}`}
                          />
                        </td>
                        <td>
                          <span className={styles.rolePermText} title={role.permissions.map(p => p.split(":")[0]).join(", ")}>
                            {formatPermissions(role.permissions)}
                          </span>
                        </td>
                        <td className={styles.dateCell}>{role.createdAt}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${
                              role.status === "Active" ? styles.badgeActive : styles.badgeInactive
                            }`}
                          >
                            <span className={styles.badgeDot} />
                            {role.status}
                          </span>
                        </td>
                        <td className={styles.actionsCol}>
                          <button
                            className={styles.moreBtn}
                            aria-label={`More actions for ${role.name}`}
                          >
                            <MoreIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                resultsPerPage={resultsPerPage}
                onPageChange={setCurrentPage}
                variant="table"
              />
            </>
          ) : (
            /* ─── Team Management Tab (stub) ─── */
            <div className={styles.teamStub} id="team-management-tab">
              <div className={styles.illustration} aria-hidden="true">
                <Image
                  src="/images/admin/Items.png"
                  alt="No team members illustration"
                  width={160}
                  height={133}
                  className={styles.illustrationImg}
                />
              </div>
              <h3 className={styles.emptyTitle}>No Team Members Yet</h3>
              <p className={styles.emptySubtitle}>
                Add team members and assign roles to manage access.
              </p>
              <button className={styles.addBtnSmall} id="add-member-btn">
                <PlusIcon />
                Add Team Member
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dev toggle — switch empty/populated */}
      <div className={styles.devToggleWrap}>
        <button
          className={styles.stateToggle}
          onClick={() =>
            setRoles((prev) => (prev.length > 0 ? [] : ADMIN_ROLES))
          }
          id="toggle-teams-state"
          title="Toggle empty/populated (dev only)"
        >
          {roles.length > 0 ? "Show Empty State" : "Show Populated State"} →
        </button>
      </div>
    </div>
  );
}

/* ─── Inline Icons ─── */
const s = 16;
const iconProps = {
  width: s,
  height: s,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function PlusIcon() {
  return (
    <svg {...iconProps}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg {...iconProps} strokeWidth={1.8}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg {...iconProps} strokeWidth={1.8}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
function MoreIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
