"use client";

import { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import styles from "./AddTeamMemberModal.module.css";
import { type Role } from "@/data/admin-teams";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roleId: string) => void;
  roles: Role[];
  user: { id: string; name: string; roleId?: string } | null;
  isLoading?: boolean;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onSubmit,
  roles,
  user,
  isLoading = false
}: EditUserModalProps) {
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (user && isOpen) {
      setRoleId(user.roleId || "");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.name
  }));

  const isValid = roleId !== "" && roleId !== user.roleId;

  const handleSubmit = () => {
    if (isValid && !isLoading) {
      onSubmit(roleId);
    }
  };

  const handleClose = () => {
    setRoleId("");
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={isLoading ? undefined : handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>Update Team Member Role</h2>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal" disabled={isLoading}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <div 
              className={styles.input} 
              style={{ display: "flex", alignItems: "center", background: "#F9FAFB", color: "#A1A1AA" }}
            >
              {user.name}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Role</label>
            <CustomSelect
              name="role"
              value={roleId}
              placeholder="e.g vehicle manager"
              options={roleOptions}
              onChange={(_, val) => setRoleId(val)}
              showSearch={true}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            disabled={!isValid || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
