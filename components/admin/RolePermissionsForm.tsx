"use client";

import { useState } from "react";
import { PERMISSION_MATRIX, ALL_PERMISSIONS } from "@/data/admin-teams";
import styles from "./RolePermissionsForm.module.css";

interface RolePermissionsFormProps {
  onBack: () => void;
  onSubmit: (name: string, permissions: string[]) => Promise<void>;
}

export default function RolePermissionsForm({ onBack, onSubmit }: RolePermissionsFormProps) {
  const [roleName, setRoleName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = roleName.trim().length > 0;
  const isAllSelected = selected.size === ALL_PERMISSIONS.length;

  /* Toggle a single permission */
  const togglePermission = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  /* Toggle Select All */
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(ALL_PERMISSIONS));
    }
  };

  /* Handle form submission */
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(roleName.trim(), [...selected]);
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

        <button
          id="create-role-btn"
          className={`${styles.createBtn} ${isValid ? styles.createBtnActive : ""}`}
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          aria-label="Create role"
        >
          {isSubmitting ? (
            <>
              Create Role
              <span className={styles.spinner} aria-hidden="true" />
            </>
          ) : (
            "Create Role"
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
          {PERMISSION_MATRIX.map((group) => (
            <div key={group.module} className={styles.group} id={`perm-group-${group.module.toLowerCase()}`}>
              <h3 className={styles.groupTitle}>{group.module}</h3>
              <div className={styles.permRow}>
                {group.permissions.map((perm) => {
                  const key = `${group.module}:${perm}`;
                  return (
                    <label key={key} className={styles.checkLabel} id={`perm-${key.replace(/[/:]/g, "-")}`}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selected.has(key)}
                        onChange={() => togglePermission(key)}
                        aria-label={`${group.module} — ${perm}`}
                      />
                      <span style={{ color: "rgba(134, 140, 152, 1)" }}>{perm}</span>
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
