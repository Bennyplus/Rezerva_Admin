"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  promotionsService,
  CreatePromotionPayload,
  PromotionStatus,
  EligibilityGroupChoice,
  typeDisplayToSlug,
} from "@/services/promotions-services";
import styles from "./CreatePromotionForm.module.css";

interface CreatePromotionFormProps {
  promotionType?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS: { label: string; value: PromotionStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const USAGE_LIMIT_OPTIONS = [
  "Unlimited",
  "Total Usage Limit",
];

function formatDateToIso(d: Date | null): string | undefined {
  if (!d) return undefined;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateToDisplay(d: Date | null): string {
  if (!d) return "Ongoing";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CreatePromotionForm({
  promotionType = "Coupon Code",
  onCancel,
  onSuccess,
}: CreatePromotionFormProps) {
  // Form State
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<PromotionStatus | "">("");
  const [usageLimit, setUsageLimit] = useState("");
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [discountValue, setDiscountValue] = useState("");

  // Dropdown open states
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);

  // Submitting state & errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const statusRef = useRef<HTMLDivElement>(null);
  const usageRef = useRef<HTMLDivElement>(null);

  // Eligibility choices from backend
  const [eligibilityChoices, setEligibilityChoices] = useState<EligibilityGroupChoice[]>([]);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(true);

  // Fetch dynamic eligibility groups from BE
  useEffect(() => {
    let isMounted = true;
    setIsLoadingEligibility(true);
    promotionsService
      .getEligibilityGroups()
      .then((choices) => {
        if (isMounted) {
          setEligibilityChoices(choices || []);
        }
      })
      .catch((err) => {
        console.warn("Could not load eligibility groups:", err);
        if (isMounted) {
          setEligibilityChoices([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingEligibility(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusOpen(false);
      }
      if (usageRef.current && !usageRef.current.contains(e.target as Node)) {
        setIsUsageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute field labels based on promotion type
  const titleName = useMemo(() => {
    if (promotionType.toLowerCase().includes("coupon")) return "Coupon Code";
    if (promotionType.toLowerCase().includes("referral")) return "Referral Campaign";
    if (promotionType.toLowerCase().includes("discount")) return "Ride Discount";
    if (promotionType.toLowerCase().includes("seasonal")) return "Seasonal Promotion";
    return promotionType;
  }, [promotionType]);

  const nameFieldLabel = useMemo(() => {
    if (promotionType.toLowerCase().includes("coupon")) return "Coupon Name";
    if (promotionType.toLowerCase().includes("referral")) return "Campaign Name";
    return "Promotion Name";
  }, [promotionType]);

  // Checkbox toggle handler
  const handleToggleEligibility = (id: string) => {
    setEligibility((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (errors.eligibility) {
      setErrors((prev) => ({ ...prev, eligibility: "" }));
    }
  };

  // Form validity check
  const isFormValid = useMemo(() => {
    return name.trim().length > 0;
  }, [name]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = `${nameFieldLabel} is required`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: CreatePromotionPayload = {
        name: name.trim(),
        promotion_type: typeDisplayToSlug(titleName),
        type: titleName,
        start_date: formatDateToIso(startDate),
        end_date: formatDateToIso(endDate),
        startDate: formatDateToIso(startDate),
        endDate: formatDateToIso(endDate),
        validUntil: formatDateToDisplay(endDate),
        status: (status as PromotionStatus) || "active",
        usageLimit: usageLimit || "Unlimited",
        eligibility,
        percent_discount: discountValue.trim() || undefined,
        discountValue: discountValue.trim() || undefined,
      };

      await promotionsService.createPromotion(payload);
      onSuccess();
    } catch (err) {
      console.error("Failed to create promotion:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* ─── Top Bar Navigation & Actions ─── */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Back to promotions list"
          id="create-promo-back-btn"
        >
          <ArrowLeftIcon />
        </button>

        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.topCancelBtn}
            onClick={onCancel}
            disabled={isSubmitting}
            id="create-promo-top-cancel-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.topSubmitBtn} ${
              isFormValid && !isSubmitting ? styles.topSubmitBtnActive : ""
            }`}
            onClick={() => handleSubmit()}
            disabled={!isFormValid || isSubmitting}
            id="create-promo-top-submit-btn"
          >
            {isSubmitting ? "Creating…" : "Create Promotions"}
          </button>
        </div>
      </div>

      {/* ─── Centered Form Card ─── */}
      <div className={styles.formCardWrapper}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h2 className={styles.cardTitle}>Create New {titleName}</h2>

          {/* 1. Name Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="promo-name" className={styles.label}>
              {nameFieldLabel}
            </label>
            <input
              id="promo-name"
              type="text"
              className={`${styles.input} ${
                errors.name ? styles.inputError : ""
              }`}
              placeholder="e.g Welcome24"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              disabled={isSubmitting}
            />
            {errors.name && <p className={styles.fieldError}>{errors.name}</p>}
          </div>

          {/* 2. Start Date & End Date (2-column row) */}
          <div className={styles.twoColRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="promo-start-date" className={styles.label}>
                Start Date
              </label>
              <div className={styles.inputWithIcon}>
                <DatePicker
                  id="promo-start-date"
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  selectsStart
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  placeholderText="e.g 11 Jul 2026"
                  dateFormat="d MMM yyyy"
                  className={styles.input}
                  wrapperClassName={styles.datePickerWrapper}
                  disabled={isSubmitting}
                  showPopperArrow={false}
                />
                <span className={styles.inputIconRight}>
                  <CalendarIcon />
                </span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="promo-end-date" className={styles.label}>
                End Date
              </label>
              <div className={styles.inputWithIcon}>
                <DatePicker
                  id="promo-end-date"
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  minDate={startDate || undefined}
                  placeholderText="e.g 24 Aug 2027"
                  dateFormat="d MMM yyyy"
                  className={styles.input}
                  wrapperClassName={styles.datePickerWrapper}
                  disabled={isSubmitting}
                  showPopperArrow={false}
                />
                <span className={styles.inputIconRight}>
                  <CalendarIcon />
                </span>
              </div>
            </div>
          </div>

          {/* 3. Status Dropdown */}
          <div className={styles.fieldGroup} ref={statusRef}>
            <label className={styles.label}>Status</label>
            <button
              type="button"
              className={`${styles.selectTrigger} ${
                isStatusOpen ? styles.selectTriggerActive : ""
              }`}
              onClick={() => setIsStatusOpen((prev) => !prev)}
              disabled={isSubmitting}
              id="promo-status-dropdown-btn"
            >
              <span className={!status ? styles.placeholderText : ""}>
                {status
                  ? status.charAt(0).toUpperCase() + status.slice(1)
                  : "e.g Draft"}
              </span>
              <ChevronDownIcon />
            </button>

            {isStatusOpen && (
              <div className={styles.selectPopover}>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.selectOption} ${
                      status === opt.value ? styles.selectOptionSelected : ""
                    }`}
                    onClick={() => {
                      setStatus(opt.value);
                      setIsStatusOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Usage Limit Dropdown */}
          <div className={styles.fieldGroup} ref={usageRef}>
            <label className={styles.label}>Usage Limit</label>
            <button
              type="button"
              className={`${styles.selectTrigger} ${
                isUsageOpen ? styles.selectTriggerActive : ""
              }`}
              onClick={() => setIsUsageOpen((prev) => !prev)}
              disabled={isSubmitting}
              id="promo-usage-dropdown-btn"
            >
              <span className={!usageLimit ? styles.placeholderText : ""}>
                {usageLimit || "e.g Unlimited"}
              </span>
              <ChevronDownIcon />
            </button>

            {isUsageOpen && (
              <div className={styles.selectPopover}>
                {USAGE_LIMIT_OPTIONS.map((limit) => (
                  <button
                    key={limit}
                    type="button"
                    className={`${styles.selectOption} ${
                      usageLimit === limit ? styles.selectOptionSelected : ""
                    }`}
                    onClick={() => {
                      setUsageLimit(limit);
                      setIsUsageOpen(false);
                    }}
                  >
                    {limit}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Eligibility Checkbox Grid */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Eligibility</label>
            {isLoadingEligibility ? (
              <p className={styles.helperText}>Loading eligibility groups…</p>
            ) : eligibilityChoices.length === 0 ? (
              <p className={styles.helperText}>No eligibility groups available</p>
            ) : (
              <div className={styles.eligibilityGrid}>
                {eligibilityChoices.map((item) => (
                  <label key={item.value} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkboxInput}
                      checked={eligibility.includes(item.value)}
                      onChange={() => handleToggleEligibility(item.value)}
                      disabled={isSubmitting}
                    />
                    <span className={styles.checkboxText}>{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 6. Percent Discount (Optional) */}
          <div className={styles.fieldGroup}>
            <label htmlFor="promo-discount-val" className={styles.label}>
              Percent Discount <span className={styles.labelOptional}>(Optional)</span>
            </label>
            <input
              id="promo-discount-val"
              type="text"
              className={styles.input}
              placeholder="e.g 20% off or N2000 off"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* 7. Bottom Action Buttons */}
          <div className={styles.cardFooter}>
            <button
              type="button"
              className={styles.cardCancelBtn}
              onClick={onCancel}
              disabled={isSubmitting}
              id="create-promo-card-cancel-btn"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`${styles.cardSubmitBtn} ${
                isFormValid && !isSubmitting ? styles.cardSubmitBtnActive : ""
              }`}
              disabled={!isFormValid || isSubmitting}
              id="create-promo-card-submit-btn"
            >
              {isSubmitting ? "Creating…" : "Create Promotion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Inline Icons ─── */
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

function CalendarIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
