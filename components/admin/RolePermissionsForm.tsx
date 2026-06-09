"use client";

import { useState, useMemo } from "react";
import styles from "./RolePermissionsForm.module.css";

interface RolePermissionsFormProps {
  onBack: () => void;
  onSubmit: (name: string, description: string, permissions: number[]) => Promise<void>;
  initialName?: string;
  initialDescription?: string;
  initialPermissions?: any[];
  allPermissions: any[];
}

export default function RolePermissionsForm({ onBack, onSubmit, initialName, initialDescription, initialPermissions, allPermissions }: RolePermissionsFormProps) {
  const [roleName, setRoleName] = useState(initialName || "");
  const [description, setDescription] = useState(initialDescription || "");
  
  // Initialize with IDs
  const initialIds = (initialPermissions || []).map(p => typeof p === 'object' && p !== null ? p.id : Number(p)).filter(Boolean);
  const [selected, setSelected] = useState<Set<number>>(new Set(initialIds));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = roleName.trim().length > 0;
  const isAllSelected = selected.size === allPermissions.length && allPermissions.length > 0;

  // Build the matrix dynamically from allPermissions
  const permissionMatrix = useMemo(() => {
    const matrix: Record<string, any[]> = {};
    allPermissions.forEach((p) => {
      const resource = p.resource || p.module || "Other";
      const resourceName = resource.charAt(0).toUpperCase() + resource.slice(1);
      if (!matrix[resourceName]) {
        matrix[resourceName] = [];
      }
      matrix[resourceName].push(p);
    });
    return Object.entries(matrix).map(([module, permissions]) => ({ module, permissions }));
  }, [allPermissions]);

  /* Toggle a single permission */
  const togglePermission = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  /* Toggle Select All */
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allPermissions.map(p => p.id)));
    }
  };

  /* Handle form submission */
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(roleName.trim(), description.trim(), [...selected]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ─── Top Actions ─── */}
      <div className={styles.topActions}>
        <button
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Go back"
          id="create-role-back-btn"
        >
          <ArrowLeftIcon />
        </button>
      </div>

      {/* ─── Header Row ─── */}
      <div className={styles.headerRow}>
        <div className={styles.nameField}>
          <label htmlFor="role-name-input" className={styles.nameLabel}>
            Role Name
          </label>
          <input
            id="role-name-input"
            type="text"
            className={styles.nameInput}
            placeholder="e.g Vehicles manager"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.nameField}>
          <label htmlFor="role-description-input" className={styles.nameLabel}>
            Description
          </label>
          <input
            id="role-description-input"
            type="text"
            className={styles.nameInput}
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
          aria-label="Create role"
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

      {/* ─── Permission Matrix ─── */}
      <div className={styles.matrix}>
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
            <span>Select All</span>
          </label>
        </div>

        <div className={styles.scrollArea}>
          {permissionMatrix.map((group) => (
            <div key={group.module} className={styles.group} id={`perm-group-${group.module.toLowerCase()}`}>
              <h3 className={styles.groupTitle}>{group.module}</h3>
              <div className={styles.permRow}>
                {group.permissions.map((perm) => {
                  const key = perm.id;
                  const label = perm.action || perm.codename || String(perm.id);
                  const displayLabel = label.split("_").map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
                  return (
                    <label key={key} className={styles.checkLabel} id={`perm-${key}`}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selected.has(key)}
                        onChange={() => togglePermission(key)}
                        aria-label={`${group.module} — ${displayLabel}`}
                      />
                      <span style={{ color: "rgba(134, 140, 152, 1)" }}>{displayLabel}</span>
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

/* ─── Icons ─── */
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

