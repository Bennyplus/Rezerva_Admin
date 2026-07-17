"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import RolePermissionsForm from "@/components/admin/RolePermissionsForm";
import AddTeamMemberModal from "@/components/admin/AddTeamMemberModal";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import SuspendUserModal from "@/components/admin/SuspendUserModal";
import EditUserModal from "@/components/admin/EditUserModal";
import { ADMIN_ROLES, ADMIN_TEAM_MEMBERS, formatPermissions, type Role, type TeamMember } from "@/data/admin-teams";
import { accountsService } from "@/services/accounts-service";
import { teamService } from "@/services/teams-services";
import FilterBar from "@/components/admin/FilterBar";
import styles from "./teams.module.css";
import Spinner from "@/components/admin/Spinner";

type View = "list" | "create-role";
type Tab = "roles" | "team";

export default function TeamsPage() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [activeTab, setActiveTab] = useState<Tab>("roles");

  const [roles, setRoles] = useState<Role[]>(ADMIN_ROLES);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(ADMIN_TEAM_MEMBERS);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"deactivate" | "remove" | null>(null);

  const [suspendModalUser, setSuspendModalUser] = useState<{ id: string; name: string } | null>(null);
  const [editModalUser, setEditModalUser] = useState<{ id: string; name: string; roleId?: string } | null>(null);
  const [isModalActionLoading, setIsModalActionLoading] = useState(false);

  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    type: "deactivate" | "remove" | null;
    roleId: string | null;
    roleName: string | null;
  }>({
    isOpen: false,
    type: null,
    roleId: null,
    roleName: null,
  });

  const resultsPerPage = 10;

  useEffect(() => {
    const init = async () => {
      let perms = [];
      try {
        const data = await teamService.getPermissions();
        perms = Array.isArray(data) ? data : data?.results || data?.data || [];
        setPermissions(perms);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
      fetchRoles(perms);
      fetchTeamMembers();
    };
    init();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const fetchRoles = async (allPerms: any[] = permissions) => {
    try {
      setLoadingRoles(true);
      const data = await accountsService.getRoles();
      const rolesData = Array.isArray(data) ? data : data?.results || data?.data || [];
      const mapped = rolesData.map((r: any) => ({
        id: r.id || r._id,
        name: r.name,
        description: r.description,
        permissions: (r.permissions || []).map((p: any) => {
          if (typeof p === "number" || typeof p === "string") {
            const found = allPerms.find((ap: any) => String(ap.id) === String(p));
            return found || p;
          }
          return p;
        }),
        createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : (r.createdAt || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })),
        status: r.is_active === true ? "Active" : (r.is_active === false ? "Inactive" : (r.status || "Active")),
      }));
      setRoles(mapped.length > 0 ? mapped : ADMIN_ROLES);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setRoles(ADMIN_ROLES);
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setLoadingTeamMembers(true);
      const data = await accountsService.getTeamMembers();
      const membersData = Array.isArray(data) ? data : data?.results || data?.data || [];
      const mapped = membersData.map((m: any) => ({
        id: m.id || m._id || `tm-${Date.now()}-${Math.random()}`,
        name: m.user_name || m.name || m.full_name,
        email: m.user_email || m.email,
        avatar: "/images/admin/profile-Avatar.svg",
        role: (m.role_names && m.role_names.length > 0) ? m.role_names[0] : (m.role || "Member"),
        roleId: (m.role && Array.isArray(m.role) && m.role.length > 0) ? String(m.role[0]) : (m.role_id ? String(m.role_id) : undefined),
        status: m.is_active === true ? "Active" : (m.is_active === false ? "Inactive" : (m.status || "Active")),
        joinedAt: m.created_at ? new Date(m.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : (m.joinedAt || m.createdAt || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })),
      }));
      setTeamMembers(mapped.length > 0 ? mapped : ADMIN_TEAM_MEMBERS);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      setTeamMembers(ADMIN_TEAM_MEMBERS);
    } finally {
      setLoadingTeamMembers(false);
    }
  };

  /* Filter roles by search */
  const filteredRoles = roles.filter((r) => {
    const searchLower = searchQuery.toLowerCase();
    if (r.name.toLowerCase().includes(searchLower)) return true;
    return r.permissions.some((p: any) => {
      const pStr = typeof p === "string" ? p : p?.resource || p?.codename || p?.name || p?.module || p?.id || JSON.stringify(p);
      return String(pStr).toLowerCase().includes(searchLower);
    });
  });

  /* Filter team members by search */
  const filteredTeamMembers = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* Client-side Pagination Logic */
  const rolesTotalPages = Math.ceil(filteredRoles.length / resultsPerPage);
  const paginatedRoles = filteredRoles.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  const teamTotalPages = Math.ceil(filteredTeamMembers.length / resultsPerPage);
  const paginatedTeamMembers = filteredTeamMembers.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  /* Handle role creation */
  const handleCreateRole = async (name: string, description: string, selectedPerms: number[]) => {
    try {
      if (editingRole) {
        const isNameChanged = name !== editingRole.name;
        const isDescChanged = description !== (editingRole.description || "");

        // Check if permissions changed
        const initialPermIds = (editingRole.permissions || []).map((p: any) => p.id).sort().join(",");
        const newPermIdsStr = [...selectedPerms].sort().join(",");
        const isPermsChanged = initialPermIds !== newPermIdsStr;

        if (isNameChanged || isDescChanged || isPermsChanged) {
          // The backend requires all fields to be present in the PUT request
          const payload = {
            name,
            description,
            permission_ids: selectedPerms
          };
          await accountsService.updateRole(editingRole.id, payload);
          setToastMessage(`Role "${name}" updated successfully.`);
        } else {
          setToastMessage(`No changes made to role "${name}".`);
        }
      } else {
        await accountsService.createRole({ name, description, permission_ids: selectedPerms });
        setToastMessage(`Role "${name}" created successfully.`);
      }
      await fetchRoles(permissions);
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
    setActionLoadingId(id);
    setActionType("remove");
    try {
      await accountsService.deleteRole(id);
      setToastMessage(`Role "${name}" removed successfully.`);
      await fetchRoles();
    } catch (error: any) {
      console.error("Failed to remove role:", error);
      const serverMessage = error.response?.data?.message || error.message;
      setToastMessage(`Error: ${serverMessage}`);
    } finally {
      setActionLoadingId(null);
      setActionType(null);
      setActiveDropdown(null);
    }
  };

  const handleDeactivateRole = async (id: string, name: string) => {
    setActionLoadingId(id);
    setActionType("deactivate");
    try {
      await accountsService.deactivateRole(id);
      setToastMessage(`Role "${name}" deactivated successfully.`);
      await fetchRoles();
    } catch (error: any) {
      console.error("Failed to deactivate role:", error);
      const serverMessage = error.response?.data?.message || error.message;
      setToastMessage(`Error: ${serverMessage}`);
    } finally {
      setActionLoadingId(null);
      setActionType(null);
      setActiveDropdown(null);
    }
  };

  const triggerRemove = (id: string, name: string) => {
    setConfirmModalState({ isOpen: true, type: "remove", roleId: id, roleName: name });
    setActiveDropdown(null);
  };

  const triggerDeactivate = (id: string, name: string) => {
    setConfirmModalState({ isOpen: true, type: "deactivate", roleId: id, roleName: name });
    setActiveDropdown(null);
  };

  const handleConfirmAction = async () => {
    const { type, roleId, roleName } = confirmModalState;
    if (!roleId || !type) return;

    if (type === "remove") {
      await handleDeleteRole(roleId, roleName || "");
    } else if (type === "deactivate") {
      await handleDeactivateRole(roleId, roleName || "");
    }

    setConfirmModalState(prev => ({ ...prev, isOpen: false }));
  };

  /* Handle Add Team Member */
  const handleAddMemberSubmit = async (
    name: string,
    email: string,
    roleId: string,
    phone_number: string,
    country?: string | number
  ) => {
    try {
      const payload: any = {
        full_name: name,
        email,
        phone_number,
        role: [Number(roleId)]
      };
      if (country) {
        payload.country = country;
      }

      await accountsService.addTeamMember(payload);

      // Re-fetch members to update the list
      await fetchTeamMembers();

      setIsAddModalOpen(false);

      const assignedRole = roles.find(r => r.id === roleId);
      const roleName = assignedRole?.name || "Member";
      // Show toast
      // setToastMessage(`${name} has been successfully assigned ${roleName}`);
    } catch (error: any) {
      console.error("Failed to add team member:", error);
      const serverMessage = error.response?.data?.message || error.message;
      // setToastMessage(`Error: ${serverMessage}`);
    }
  };

  /* Handle Update Team Member */
  const handleUpdateTeamMember = async (roleId: string) => {
    if (!editModalUser) return;
    setIsModalActionLoading(true);
    try {
      await accountsService.updateTeamMember(editModalUser.id, { role_ids: [Number(roleId)] });
      // setToastMessage(`${editModalUser.name}'s role updated successfully.`);
      await fetchTeamMembers();
      setEditModalUser(null);
    } catch (error: any) {
      console.error("Failed to update team member:", error);
      const serverMessage = error.response?.data?.message || error.message;
      // setToastMessage(`Error: ${serverMessage}`);
    } finally {
      setIsModalActionLoading(false);
    }
  };

  /* Handle Suspend Team Member */
  const handleSuspendTeamMember = async (reason: string) => {
    if (!suspendModalUser) return;
    setIsModalActionLoading(true);
    try {
      await accountsService.suspendTeamMember(suspendModalUser.id, { reason });
      setToastMessage(`${suspendModalUser.name} suspended successfully.`);
      await fetchTeamMembers();
      setSuspendModalUser(null);
    } catch (error: any) {
      console.error("Failed to suspend team member:", error);
      const serverMessage = error.response?.data?.message || error.message;
      setToastMessage(`Error: ${serverMessage}`);
    } finally {
      setIsModalActionLoading(false);
    }
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
        initialDescription={editingRole?.description}
        initialPermissions={editingRole?.permissions}
        allPermissions={permissions}
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
          <div className={`${styles.toast} ${toastMessage.startsWith("Error:") ? styles.toastError : ""}`}>
            {!toastMessage.startsWith("Error:") && <CheckCircleIcon />}
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
              onClick={() => { setActiveTab("roles"); setCurrentPage(1); }}
            >
              Role Management
            </button>
            <button
              id="tab-team-management"
              className={`${styles.tab} ${activeTab === "team" ? styles.tabActive : ""}`}
              onClick={() => { setActiveTab("team"); setCurrentPage(1); }}
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
                      <th>Role Name</th>
                      <th>Permissions</th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th className={styles.actionsCol} />
                    </tr>
                  </thead>
                  <tbody>
                    {loadingRoles ? (
                      <tr>
                        <td colSpan={5} style={{ paddingTop: "180px" }}>
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Spinner />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedRoles.map((role) => (
                        <tr key={role.id}>
                          <td>{role.name}</td>
                          <td>
                            <span className={styles.rolePermText} title={formatPermissions(role.permissions, 1000)}>
                              {formatPermissions(role.permissions)}
                            </span>
                          </td>
                          <td className={styles.dateCell}>{role.createdAt}</td>
                          <td>
                            <span
                              className={`${styles.badge} ${role.status === "Active" ? styles.badgeActive : styles.badgeInactive
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
                                    className={`${styles.actionItem}`}
                                    onClick={() => triggerDeactivate(role.id, role.name)}
                                    disabled={actionLoadingId === role.id && actionType === "deactivate"}
                                  >
                                    {actionLoadingId === role.id && actionType === "deactivate" ? "Deactivating..." : "Deactivate Role"}
                                  </button>
                                  <button
                                    className={`${styles.actionItem}`}
                                    onClick={() => triggerRemove(role.id, role.name)}
                                    disabled={actionLoadingId === role.id && actionType === "remove"}
                                  >
                                    {actionLoadingId === role.id && actionType === "remove" ? "Removing..." : "Remove Role"}
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

              {/* Pagination */}
              {rolesTotalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={rolesTotalPages}
                  resultsPerPage={resultsPerPage}
                  onPageChange={setCurrentPage}
                  variant="table"
                />
              )}
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
                    {loadingTeamMembers ? (
                      <tr>
                        <td colSpan={5} style={{ paddingTop: "180px" }}>
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Spinner />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {paginatedTeamMembers.map((member: any) => (
                          <tr key={member.id}>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.role}</td>
                            <td className={styles.dateCell}>{member.joinedAt}</td>
                            <td className={styles.actionsCol}>
                              <div className={styles.actionsWrapper}>
                                <button
                                  className={styles.moreBtn}
                                  aria-label={`More actions for ${member.name}`}
                                  onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)}
                                >
                                  <MoreIcon />
                                </button>
                                {activeDropdown === member.id && (
                                  <div className={styles.actionsMenu}>
                                    <button
                                      className={styles.actionItem}
                                      onClick={() => {
                                        setEditModalUser({ id: member.id, name: member.name, roleId: member.roleId });
                                        setActiveDropdown(null);
                                      }}
                                    >
                                      Edit User
                                    </button>
                                    <button
                                      className={`${styles.actionItem}`}
                                      onClick={() => {
                                        setSuspendModalUser({ id: member.id, name: member.name });
                                        setActiveDropdown(null);
                                      }}
                                    >
                                      Suspend User
                                    </button>
                                  </div>
                                )}
                              </div>
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
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {teamTotalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={teamTotalPages}
                  resultsPerPage={resultsPerPage}
                  onPageChange={setCurrentPage}
                  variant="table"
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Dev toggle — switch empty/populated */}
      {/* <div className={styles.devToggleWrap}>
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
      </div> */}

      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMemberSubmit}
        roles={roles}
      />

      <EditUserModal
        isOpen={!!editModalUser}
        onClose={() => setEditModalUser(null)}
        onSubmit={handleUpdateTeamMember}
        roles={roles}
        user={editModalUser}
        isLoading={isModalActionLoading}
      />

      <SuspendUserModal
        isOpen={!!suspendModalUser}
        onClose={() => setSuspendModalUser(null)}
        onSubmit={handleSuspendTeamMember}
        userName={suspendModalUser?.name || ""}
        isLoading={isModalActionLoading}
      />

      <ConfirmActionModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmModalState.type === "deactivate" ? "Deactivate Role?" : "Remove Role?"}
        message={
          confirmModalState.type === "deactivate"
            ? "Are you sure you want to deactivate this role? Users assigned to this role may lose access to certain permissions."
            : "Are you sure you want to completely remove this role? This action cannot be undone."
        }
        confirmText={confirmModalState.type === "deactivate" ? "Deactivate Role" : "Remove Role"}
        isDanger={true}
        isLoading={actionLoadingId !== null}
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
    <Image src={"/images/admin/checkmark.svg"} alt="check" width={18} height={18} />
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
