"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/admin/Spinner";
import styles from "./SupportSlasForm.module.css";
import {
  supportSlasService,
  SupportSlasConfig,
  DEFAULT_SUPPORT_SLAS_CONFIG,
  PriorityLevelsConfig,
  SLA_TIME_OPTIONS,
  TIMELAPSE_OPTIONS,
} from "@/services/support-slas-service";

export default function SupportSlasForm() {
  const [config, setConfig] = useState<SupportSlasConfig>({
    ...DEFAULT_SUPPORT_SLAS_CONFIG,
  });
  const [loading, setLoading] = useState(true);

  // New category input state
  const [newCategory, setNewCategory] = useState("");

  // Section-specific dirty flags
  const [categoriesDirty, setCategoriesDirty] = useState(false);
  const [priorityDirty, setPriorityDirty] = useState(false);
  const [escalationDirty, setEscalationDirty] = useState(false);

  // Saving states
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load config on mount
  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const live = await supportSlasService.getConfig();
        if (live && isMounted) {
          setConfig(live);
        }
      } catch (err) {
        console.error("Failed to load Support & SLAs config:", err);
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

  const showSuccessToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  /* ─── Category Handlers ─── */
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed || config.categories.includes(trimmed)) return;
    setConfig((prev) => ({
      ...prev,
      categories: [...prev.categories, trimmed],
    }));
    setNewCategory("");
    setCategoriesDirty(true);
  };

  const handleRemoveCategory = (cat: string) => {
    setConfig((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
    setCategoriesDirty(true);
  };

  const handleUpdateCategories = async () => {
    if (!categoriesDirty || savingSection) return;
    setSavingSection("categories");
    try {
      await supportSlasService.updateCategories(config.categories);
      setCategoriesDirty(false);
      showSuccessToast("Ticket categories updated successfully");
    } catch (err) {
      console.error("Failed to update categories:", err);
    } finally {
      setSavingSection(null);
    }
  };

  /* ─── Priority SLA Matrix Handlers ─── */
  const handlePriorityChange = (
    priority: keyof PriorityLevelsConfig,
    field: "responseSla" | "resolutionSla",
    val: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      priorityLevels: {
        ...prev.priorityLevels,
        [priority]: {
          ...prev.priorityLevels[priority],
          [field]: val,
        },
      },
    }));
    setPriorityDirty(true);
  };

  const handleUpdatePriorityLevels = async () => {
    if (!priorityDirty || savingSection) return;
    setSavingSection("priority");
    try {
      await supportSlasService.updatePriorityLevels(config.priorityLevels);
      setPriorityDirty(false);
      showSuccessToast("Priority levels updated successfully");
    } catch (err) {
      console.error("Failed to update priority levels:", err);
    } finally {
      setSavingSection(null);
    }
  };

  /* ─── Auto-Escalation Handlers ─── */
  const handleEscalationToggle = () => {
    setConfig((prev) => ({
      ...prev,
      autoEscalation: {
        ...prev.autoEscalation,
        autoEscalation: !prev.autoEscalation.autoEscalation,
      },
    }));
    setEscalationDirty(true);
  };

  const handleTimelapseChange = (val: string) => {
    setConfig((prev) => ({
      ...prev,
      autoEscalation: {
        ...prev.autoEscalation,
        timelapse: val,
      },
    }));
    setEscalationDirty(true);
  };

  const handleUpdateAutoEscalation = async () => {
    if (!escalationDirty || savingSection) return;
    setSavingSection("escalation");
    try {
      await supportSlasService.updateAutoEscalation(config.autoEscalation);
      setEscalationDirty(false);
      showSuccessToast("Auto-escalation rules updated successfully");
    } catch (err) {
      console.error("Failed to update auto-escalation rules:", err);
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper} id="support-slas-form-loading">
        <Spinner size={36} color="#375DFB" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ─── 1. Ticket Categories Section ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Ticket Categories</h2>
          <p className={styles.subtitle}>
            Configure the support ticket categories available to passengers and drivers.
          </p>
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel} htmlFor="category-input">
            Category
          </label>
          <div className={styles.inputColumn}>
            <div className={styles.categoryInputWrap}>
              <input
                id="category-input"
                type="text"
                className={styles.formInput}
                placeholder="e.g Billing Issue"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
            </div>

            <button
              type="button"
              className={styles.addCategoryBtn}
              onClick={handleAddCategory}
              id="add-category-btn"
            >
              <PlusIcon />
              <span>Add Category</span>
            </button>

            {config.categories.length > 0 && (
              <div className={styles.categoryChips}>
                {config.categories.map((cat) => (
                  <span key={cat} className={styles.categoryChip}>
                    {cat}
                    <button
                      type="button"
                      className={styles.chipRemoveBtn}
                      onClick={() => handleRemoveCategory(cat)}
                      aria-label={`Remove ${cat}`}
                    >
                      <CrossIcon />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!categoriesDirty || savingSection === "categories"}
            onClick={handleUpdateCategories}
            id="update-ticket-categories-btn"
          >
            {savingSection === "categories" ? "Saving..." : "Update Categories"}
          </button>
        </div>
      </section>

      {/* ─── 2. Priority Levels Section ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Priority Levels</h2>
          <p className={styles.subtitle}>
            Configure ticket priority levels and response requirements for support requests.
          </p>
        </div>

        <div className={styles.priorityTableWrap}>
          <div className={styles.priorityHeaderRow}>
            <span className={styles.priorityColHeader}>Priority</span>
            <span className={styles.priorityColHeader}>Response SLA</span>
            <span className={styles.priorityColHeader}>Resolution SLA</span>
          </div>

          {(
            [
              { key: "critical", label: "Critical" },
              { key: "high", label: "High" },
              { key: "medium", label: "Medium" },
              { key: "low", label: "Low" },
            ] as const
          ).map(({ key, label }) => (
            <div key={key} className={styles.priorityRow}>
              <span className={styles.priorityLabel}>{label}</span>

              <select
                id={`response-sla-${key}`}
                className={styles.formSelect}
                value={config.priorityLevels[key].responseSla}
                onChange={(e) =>
                  handlePriorityChange(key, "responseSla", e.target.value)
                }
              >
                <option value="" disabled className={styles.selectPlaceholder}>
                  e.g 15mins
                </option>
                {SLA_TIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                id={`resolution-sla-${key}`}
                className={styles.formSelect}
                value={config.priorityLevels[key].resolutionSla}
                onChange={(e) =>
                  handlePriorityChange(key, "resolutionSla", e.target.value)
                }
              >
                <option value="" disabled className={styles.selectPlaceholder}>
                  e.g 15mins
                </option>
                {SLA_TIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!priorityDirty || savingSection === "priority"}
            onClick={handleUpdatePriorityLevels}
            id="update-priority-levels-btn"
          >
            {savingSection === "priority" ? "Saving..." : "Update Priority Levels"}
          </button>
        </div>
      </section>

      {/* ─── 3. Auto-Escalation Rules Section ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Auto-Escalation Rules</h2>
          <p className={styles.subtitle}>
            Configure when unresolved support tickets are automatically escalated to higher support levels.
          </p>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formLabel}>Auto Escalation</span>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              id="auto-escalation-toggle"
              className={styles.toggleInput}
              checked={config.autoEscalation.autoEscalation}
              onChange={handleEscalationToggle}
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel} htmlFor="timelapse-select">
            Timelapse
          </label>
          <select
            id="timelapse-select"
            className={styles.formSelect}
            value={config.autoEscalation.timelapse}
            onChange={(e) => handleTimelapseChange(e.target.value)}
          >
            <option value="" disabled className={styles.selectPlaceholder}>
              e.g 2 hours
            </option>
            {TIMELAPSE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!escalationDirty || savingSection === "escalation"}
            onClick={handleUpdateAutoEscalation}
            id="update-auto-escalation-btn"
          >
            {savingSection === "escalation" ? "Saving..." : "Update Auto Escalation"}
          </button>
        </div>
      </section>

      {/* ─── Success Toast ─── */}
      {toastMessage && <div className={styles.successToast}>{toastMessage}</div>}
    </div>
  );
}

/* ─── Inline Icons ─── */
function PlusIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
