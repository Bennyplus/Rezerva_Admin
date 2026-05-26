"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import RolePermissionsForm from "@/components/admin/RolePermissionsForm";
import AddTeamMemberModal from "@/components/admin/AddTeamMemberModal";
import { ADMIN_ROLES, ADMIN_TEAM_MEMBERS, formatPermissions, type Role, type TeamMember } from "@/data/admin-teams";
import { accountsService } from "@/services/accounts-service";
import FilterBar from "@/components/admin/FilterBar";
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
  
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const totalPages = 16;
  const resultsPerPage = 9;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await accountsService.getRoles();
      const rolesData = Array.isArray(data) ? data : data?.results || [];
      const mapped = rolesData.map((r: any) => ({
        id: r.id || r._id,
        name: r.name,
        permissions: r.permissions || [],
        createdAt: r.createdAt || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: r.status || "Active",
      }));
      setRoles(mapped.length > 0 ? mapped : ADMIN_ROLES);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setRoles(ADMIN_ROLES);
    } finally {
      setLoadingRoles(false);
    }
  };

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
    try {
      if (editingRole) {
        await accountsService.updateRole(editingRole.id, { name, permissions });
        setToastMessage(`Role "${name}" updated successfully.`);
      } else {
        await accountsService.createRole({ name, permissions });
        setToastMessage(`Role "${name}" created successfully.`);
      }
      await fetchRoles();
      setCurrentView("list");
      setEditingRole(null);
    } catch (error: any) {
      console.error("Failed to save role:", error);
      const serverMessage = error.response?.data?.message || error.message;
      setToastMessage(`Error: ${serverMessage}`);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setCurrentView("create-role");
    setActiveDropdown(null);
  };

  const handleDeleteRole = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the role "${name}"?`)) return;
    try {
      await accountsService.deleteRole(id);
      setToastMessage(`Role "${name}" deleted successfully.`);
      await fetchRoles();
    } catch (error: any) {
      console.error("Failed to delete role:", error);
      const serverMessage = error.response?.data?.message || error.message;
      setToastMessage(`Error: ${serverMessage}`);
    }
    setActiveDropdown(null);
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
        onBack={() => {
          setCurrentView("list");
          setEditingRole(null);
        }}
        onSubmit={handleCreateRole}
        initialName={editingRole?.name}
        initialPermissions={editingRole?.permissions}
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
              width={460}
              height={380}
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
                    <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} hideSort />
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
                          <div className={styles.actionsWrapper}>
                            <button
                              className={styles.moreBtn}
                              aria-label={`More actions for ${role.name}`}
                              onClick={() => setActiveDropdown(activeDropdown === role.id ? null : role.id)}
                            >
                              <MoreIcon />
                            </button>
                            {activeDropdown === role.id && (
                              <div className={styles.actionsMenu}>
                                <button
                                  className={styles.actionItem}
                                  onClick={() => handleEditRole(role)}
                                >
                                  Edit Role
                                </button>
                                <button
                                  className={`${styles.actionItem} ${styles.actionItemDanger}`}
                                  onClick={() => handleDeleteRole(role.id, role.name)}
                                >
                                  Delete
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
                    <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} hideSort />
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
