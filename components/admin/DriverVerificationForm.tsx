"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/admin/Spinner";
import styles from "./DriverVerificationForm.module.css";
import {
  driverVerificationService,
  DriverVerificationConfig,
  DEFAULT_DRIVER_VERIFICATION,
  DOCUMENT_OPTIONS,
} from "@/services/driver-verification-service";

export default function DriverVerificationForm() {
  const [config, setConfig] = useState<DriverVerificationConfig>({
    ...DEFAULT_DRIVER_VERIFICATION,
  });
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch live config on mount
  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const live = await driverVerificationService.getConfig();
        if (live && isMounted) {
          setConfig(live);
        }
      } catch (err) {
        console.error("Failed to load driver verification config:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field: keyof DriverVerificationConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleSubmit = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    try {
      await driverVerificationService.updateConfig(config);
      setDirty(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update driver verification:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper} id="driver-verification-form-loading">
        <Spinner size={36} color="#375DFB" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ─── Header ─── */}
      <div className={styles.header}>
        <h2 className={styles.title}>Driver Verification</h2>
        <p className={styles.subtitle}>
          Configure the verification requirements drivers must complete before offering trips.
        </p>
      </div>

      {/* ─── Required Driver Documents (Dropdown) ─── */}
      <div className={styles.formRow}>
        <label className={styles.formLabel} htmlFor="driver-docs-select">
          Required Driver Documents
        </label>
        <select
          id="driver-docs-select"
          className={styles.formSelect}
          value={config.required_driver_documents}
          onChange={(e) => handleChange("required_driver_documents", e.target.value)}
        >
          <option value="" disabled className={styles.selectPlaceholder}>
            e.g license
          </option>
          {DOCUMENT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Document Re-Verification Interval (Text) ─── */}
      <div className={styles.formRow}>
        <label className={styles.formLabel} htmlFor="reverification-interval">
          Document Re-Verification Interval
        </label>
        <input
          id="reverification-interval"
          type="text"
          className={styles.formInput}
          placeholder="e.g 12 months"
          value={config.document_reverification_interval}
          onChange={(e) =>
            handleChange("document_reverification_interval", e.target.value)
          }
        />
      </div>

      {/* ─── Submit ─── */}
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.submitBtn}
          disabled={!dirty || saving}
          onClick={handleSubmit}
          id="update-driver-verification-btn"
        >
          {saving ? "Saving..." : "Update Driver Verification"}
        </button>
      </div>

      {/* ─── Success Toast ─── */}
      {showSuccess && (
        <div className={styles.successToast}>
          Driver Verification updated successfully
        </div>
      )}
    </div>
  );
}
