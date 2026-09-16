"use client";

import { useState, useMemo } from "react";
import styles from "./RolePermissionsForm.module.css";
import { Permission } from "@/services/role-services";

interface RolePermissionsFormProps {
  onBack: () => void;
  onSubmit: (name: string, description: string, permissions: number[]) => Promise<void>;
  initialName?: string;
  initialDescription?: string;
  initialPermissions?: any[];
  allPermissions?: Permission[];
}

interface DefaultPermissionItem {
  name: string;
  action: string;
  codename: string;
  defaultId: number;
}

interface DefaultGroup {
  module: string;
  resourceKey: string;
  items: DefaultPermissionItem[];
}

/**
 * Baseline permission groups matching the design UI screenshot:
 * 1. Vehicles: Create, Edit, Approve/Disapprove, Deactivate
 * 2. Bookings: View, Modify, Cancel
 * 3. Notifications: Create, View, Modify
 * 4. Users: Add Role, Add Team Member, Approve/Disapprove, Verify Customer, Modify, Cancel
 */
const DEFAULT_GROUPS: DefaultGroup[] = [
  {
    module: "Vehicles",
    resourceKey: "vehicles",
    items: [
      { name: "Create", action: "create", codename: "vehicles.create", defaultId: 1 },
      { name: "Edit", action: "edit", codename: "vehicles.edit", defaultId: 2 },
      { name: "Approve/Disapprove", action: "approve_disapprove", codename: "vehicles.approve_disapprove", defaultId: 3 },
      { name: "Deactivate", action: "deactivate", codename: "vehicles.deactivate", defaultId: 4 },
    ],
  },
  {
    module: "Bookings",
    resourceKey: "bookings",
    items: [
      { name: "View", action: "view", codename: "bookings.view", defaultId: 5 },
      { name: "Modify", action: "modify", codename: "bookings.modify", defaultId: 6 },
      { name: "Cancel", action: "cancel", codename: "bookings.cancel", defaultId: 7 },
    ],
  },
  {
    module: "Notifications",
    resourceKey: "notifications",
    items: [
      { name: "Create", action: "create", codename: "notifications.create", defaultId: 8 },
      { name: "View", action: "view", codename: "notifications.view", defaultId: 9 },
      { name: "Modify", action: "modify", codename: "notifications.modify", defaultId: 10 },
    ],
  },
  {
    module: "Users",
    resourceKey: "users",
    items: [
      { name: "Add Role", action: "add_role", codename: "users.add_role", defaultId: 11 },
      { name: "Add Team Member", action: "add_team_member", codename: "users.add_team_member", defaultId: 12 },
      { name: "Approve/Disapprove", action: "approve_disapprove", codename: "users.approve_disapprove", defaultId: 13 },
      { name: "Verify Customer", action: "verify_customer", codename: "users.verify_customer", defaultId: 14 },
      { name: "Modify", action: "modify", codename: "users.modify", defaultId: 15 },
      { name: "Cancel", action: "cancel", codename: "users.cancel", defaultId: 16 },
    ],
  },
];

export default function RolePermissionsForm({
  onBack,
  onSubmit,
  initialName = "",
  initialDescription = "",
  initialPermissions = [],
  allPermissions = [],
}: RolePermissionsFormProps) {
  const [roleName, setRoleName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Normalize initial selected permission IDs
  const initialIds = useMemo(() => {
    return initialPermissions
      .map((p) => {
        if (typeof p === "number") return p;
        if (typeof p === "string" && !isNaN(Number(p))) return Number(p);
        if (typeof p === "object" && p !== null && p.id !== undefined) return Number(p.id);
        return null;
      })
      .filter((id): id is number => id !== null);
  }, [initialPermissions]);

  const [selected, setSelected] = useState<Set<number>>(new Set(initialIds));

  // Build the rendered permission groups mapped with backend permission IDs
  const groups = useMemo(() => {
    // If backend has returned a list of permissions, create a lookup map
    const backendPermMap = new Map<string, Permission>();
    allPermissions.forEach((p) => {
      const res = (p.resource || "").toLowerCase().trim();
      const act = (p.action || "").toLowerCase().replace(/[\/\s_-]+/g, "_").trim();
      const code = (p.codename || "").toLowerCase().trim();

      if (code) backendPermMap.set(code, p);
      if (res && act) backendPermMap.set(`${res}:${act}`, p);
    });

    return DEFAULT_GROUPS.map((grp) => {
      const mappedItems = grp.items.map((item) => {
        const key1 = item.codename.toLowerCase();
        const key2 = `${grp.resourceKey}:${item.action.toLowerCase().replace(/[\/\s_-]+/g, "_")}`;
        const matched = backendPermMap.get(key1) || backendPermMap.get(key2);

        const finalId = matched ? matched.id : item.defaultId;

        return {
          ...item,
          id: finalId,
          codename: matched?.codename || item.codename,
        };
      });

      return {
        module: grp.module,
        items: mappedItems,
      };
    });
  }, [allPermissions]);

  // Collect all IDs across all groups
  const allIds = useMemo(() => {
    const ids: number[] = [];
    groups.forEach((g) => {
      g.items.forEach((item) => ids.push(item.id));
    });
    return ids;
  }, [groups]);

  const isAllSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const isValid = roleName.trim().length > 0;

  // Toggle single permission
  const togglePermission = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  // Toggle Select All
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(roleName.trim(), description.trim(), Array.from(selected));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ─── Top Actions: Back Button ─── */}
      <div className={styles.topActions}>
        <button
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Go back"
          id="create-role-back-btn"
          type="button"
        >
          <ArrowLeftIcon />
        </button>
      </div>

      {/* ─── Header Row: Role Name, Description & Action Button ─── */}
      <div className={styles.headerRow}>
        <div className={styles.nameField}>
          <label htmlFor="role-name-input" className={styles.fieldLabel}>
            Role Name
          </label>
          <input
            id="role-name-input"
            type="text"
            className={styles.textInput}
            placeholder="Vehicles manager"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.descriptionField}>
          <label htmlFor="role-description-input" className={styles.fieldLabel}>
            Description
          </label>
          <input
            id="role-description-input"
            type="text"
            className={styles.textInput}
            placeholder="Brief description of this role"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          id="create-role-btn"
          className={`${styles.createBtn} ${isValid ? styles.createBtnActive : ""}`}
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          aria-label={initialName ? "Save Role" : "Create Role"}
          type="button"
        >
          {isSubmitting ? (
            <>
              {initialName ? "Saving..." : "Create Role"}
              <span className={styles.spinner} aria-hidden="true" />
            </>
          ) : (
            initialName ? "Save Role" : "Create Role"
          )}
        </button>
      </div>

      {/* ─── Permissions Card Container ─── */}
      <div className={styles.matrixCard}>
        {/* Select All */}
        <div className={styles.selectAllRow}>
          <label className={styles.checkLabel} id="select-all-label">
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isAllSelected}
              onChange={toggleSelectAll}
              aria-label="Select all permissions"
              id="select-all-checkbox"
            />
            <span className={styles.selectAllText}>Select All</span>
          </label>
        </div>

        {/* Scrollable Groups Area */}
        <div className={styles.scrollArea}>
          {groups.map((group) => (
            <div
              key={group.module}
              className={styles.group}
              id={`perm-group-${group.module.toLowerCase()}`}
            >
              <h3 className={styles.groupTitle}>{group.module}</h3>
              <div className={styles.permRow}>
                {group.items.map((item) => {
                  const isChecked = selected.has(item.id);
                  return (
                    <label
                      key={item.codename}
                      className={styles.checkLabel}
                      id={`perm-${item.id}`}
                    >
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isChecked}
                        onChange={() => togglePermission(item.id)}
                        aria-label={`${group.module} — ${item.name}`}
                      />
                      <span className={styles.checkItemLabel}>{item.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Arrow Left Icon ─── */
function ArrowLeftIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
