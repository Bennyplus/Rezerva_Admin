"use client";

import { useState } from "react";
import CustomSelect from "./CustomSelect";
import styles from "./AddTeamMemberModal.module.css";
import { ADMIN_ROLES } from "@/data/admin-teams";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string, roleId: string) => void;
}

export default function AddTeamMemberModal({ isOpen, onClose, onSubmit }: AddTeamMemberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");

  if (!isOpen) return null;

  const roleOptions = ADMIN_ROLES.map(role => ({
    value: role.id,
    label: role.name
  }));

  const isValid = name.trim().length > 0 && email.trim().length > 0 && roleId !== "";

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(name, email, roleId);
      // Reset after submit
      setName("");
      setEmail("");
      setRoleId("");
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setRoleId("");
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>Add Team Member</h2>
            <p className={styles.subtitle}>Add a new team member</p>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g Prosper Edward"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="e.g Prosper@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
          <button className={styles.cancelBtn} onClick={handleClose}>
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Add Team Member
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
