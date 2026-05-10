"use client";

import { useState } from "react";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import RolePermissionsForm from "@/components/admin/RolePermissionsForm";
import AddTeamMemberModal from "@/components/admin/AddTeamMemberModal";
import { ADMIN_ROLES, ADMIN_TEAM_MEMBERS, formatPermissions, type Role, type TeamMember } from "@/data/admin-teams";
import styles from "./teams.module.css";

type View = "list" | "create-role";
type Tab = "roles" | "team";

export default function TeamsPage() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [activeTab, setActiveTab] = useState<Tab>("roles");
  
  const [roles, setRoles] = useState<Role[]>(ADMIN_ROLES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(ADMIN_TEAM_MEMBERS);
  
  const [currentPage, setCurrentPage] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalPages = 16;
  const resultsPerPage = 9;

  /* Filter roles by search */
  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.permissions.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  /* Filter team members by search */
  const filteredTeamMembers = teamMembers.filter((m) => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
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

  /* Handle Add Team Member */
  const handleAddMemberSubmit = (name: string, email: string, roleId: string) => {
    const assignedRole = roles.find(r => r.id === roleId);
    const roleName = assignedRole?.name || "Member";
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      avatar: "/images/admin/profile-Avatar.svg",
      role: roleName,
      status: "Active",
      joinedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    setTeamMembers(prev => [newMember, ...prev]);
    setIsAddModalOpen(false);
    
    // Show toast
    setToastMessage(`${name} has been successfully assigned ${roleName}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
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
  const isEmpty = roles.length === 0 && teamMembers.length === 0;

  return (
    <div className={styles.page}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastWrapper}>
          <div className={styles.toast}>
            <CheckCircleIcon />
            {toastMessage}
            <button 
              className={styles.toastClose} 
              onClick={() => setToastMessage(null)}
              aria-label="Close notification"
            >
              <CloseSmallIcon />
            </button>
          </div>
        </div>
      )}

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
            /* ─── Team Management Tab ─── */
            <>
              {/* Toolbar */}
              <div className={styles.toolbar} id="team-toolbar">
                <div className={styles.toolbarLeft}>
                  {/* Search */}
                  <div className={styles.searchBox}>
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search..."
                      className={styles.searchInput}
                      id="team-search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {/* Filter */}
                  <button className={styles.toolBtn} id="team-filter-btn">
                    <FilterIcon />
                    Filter
                  </button>
                </div>
                <div className={styles.toolbarRight}>
                  <button
                    className={styles.addBtnSmall}
                    id="add-member-btn"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <PlusIcon />
                    Add Team Member
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created On</th>
                      <th className={styles.actionsCol} />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeamMembers.map((member) => (
                      <tr key={member.id}>
                        <td>{member.name}</td>
                        <td>{member.email}</td>
                        <td>{member.role}</td>
                        <td className={styles.dateCell}>{member.joinedAt}</td>
                        <td className={styles.actionsCol}>
                          <button
                            className={styles.moreBtn}
                            aria-label={`More actions for ${member.name}`}
                          >
                            <MoreIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTeamMembers.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                          No team members found.
                        </td>
                      </tr>
                    )}
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
          )}
        </div>
      )}

      {/* Dev toggle — switch empty/populated */}
      <div className={styles.devToggleWrap}>
        <button
          className={styles.stateToggle}
          onClick={() => {
            setRoles((prev) => (prev.length > 0 ? [] : ADMIN_ROLES));
            setTeamMembers((prev) => (prev.length > 0 ? [] : ADMIN_TEAM_MEMBERS));
          }}
          id="toggle-teams-state"
          title="Toggle empty/populated (dev only)"
        >
          {roles.length > 0 ? "Show Empty State" : "Show Populated State"} →
        </button>
      </div>

      <AddTeamMemberModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddMemberSubmit} 
      />
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
function CheckCircleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function CloseSmallIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
