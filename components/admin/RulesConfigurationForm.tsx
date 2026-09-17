"use client";

import { useState, useEffect } from "react";
import styles from "./RulesConfigurationForm.module.css";
import {
  platformRulesService,
  PlatformRules,
  DEFAULT_PLATFORM_RULES,
} from "@/services/platform-rules-service";

interface RulesConfigurationFormProps {
  initialRules?: PlatformRules;
  onRuleUpdated?: (section: string) => void;
}

export default function RulesConfigurationForm({
  initialRules = DEFAULT_PLATFORM_RULES,
  onRuleUpdated,
}: RulesConfigurationFormProps) {
  // State for all 6 sections
  const [pricing, setPricing] = useState(initialRules.pricingAndFees);
  const [dirtyPricing, setDirtyPricing] = useState(false);
  const [savingPricing, setSavingPricing] = useState(false);

  const [noShow, setNoShow] = useState(initialRules.noShowFee);
  const [dirtyNoShow, setDirtyNoShow] = useState(false);
  const [savingNoShow, setSavingNoShow] = useState(false);

  const [booking, setBooking] = useState(initialRules.bookingRules);
  const [dirtyBooking, setDirtyBooking] = useState(false);
  const [savingBooking, setSavingBooking] = useState(false);

  const [capacity, setCapacity] = useState(initialRules.vehicleCapacity);
  const [dirtyCapacity, setDirtyCapacity] = useState(false);
  const [savingCapacity, setSavingCapacity] = useState(false);

  const [recurring, setRecurring] = useState(initialRules.recurringTripRules);
  const [dirtyRecurring, setDirtyRecurring] = useState(false);
  const [savingRecurring, setSavingRecurring] = useState(false);

  const [autoCancel, setAutoCancel] = useState(initialRules.autoCancellation);
  const [dirtyAutoCancel, setDirtyAutoCancel] = useState(false);
  const [savingAutoCancel, setSavingAutoCancel] = useState(false);

  // Success toast indicator per section
  const [savedSection, setSavedSection] = useState<string | null>(null);

  // Fetch live rules from backend on mount
  useEffect(() => {
    const fetchLiveRules = async () => {
      try {
        const live = await platformRulesService.getRules();
        if (live) {
          setPricing(live.pricingAndFees);
          setNoShow(live.noShowFee);
          setBooking(live.bookingRules);
          setCapacity(live.vehicleCapacity);
          setRecurring(live.recurringTripRules);
          setAutoCancel(live.autoCancellation);
        }
      } catch (err) {
        console.error("Failed to load live rules:", err);
      }
    };
    fetchLiveRules();
  }, []);

  const triggerSaveNotification = (sectionName: string) => {
    setSavedSection(sectionName);
    onRuleUpdated?.(sectionName);
    setTimeout(() => setSavedSection(null), 3000);
  };

  /* ─── Handlers ─── */
  const handleUpdatePricing = async () => {
    if (!dirtyPricing || savingPricing) return;
    setSavingPricing(true);
    try {
      await platformRulesService.updatePricingAndFees(pricing);
      setDirtyPricing(false);
      triggerSaveNotification("Pricing & Fees");
    } finally {
      setSavingPricing(false);
    }
  };

  const handleUpdateNoShow = async () => {
    if (!dirtyNoShow || savingNoShow) return;
    setSavingNoShow(true);
    try {
      await platformRulesService.updateNoShowFee(noShow);
      setDirtyNoShow(false);
      triggerSaveNotification("No Show Fee");
    } finally {
      setSavingNoShow(false);
    }
  };

  const handleUpdateBooking = async () => {
    if (!dirtyBooking || savingBooking) return;
    setSavingBooking(true);
    try {
      await platformRulesService.updateBookingRules(booking);
      setDirtyBooking(false);
      triggerSaveNotification("Booking Rules");
    } finally {
      setSavingBooking(false);
    }
  };

  const handleUpdateCapacity = async () => {
    if (!dirtyCapacity || savingCapacity) return;
    setSavingCapacity(true);
    try {
      await platformRulesService.updateVehicleCapacityRules(capacity);
      setDirtyCapacity(false);
      triggerSaveNotification("Vehicle Capacity Rules");
    } finally {
      setSavingCapacity(false);
    }
  };

  const handleUpdateRecurring = async () => {
    if (!dirtyRecurring || savingRecurring) return;
    setSavingRecurring(true);
    try {
      await platformRulesService.updateRecurringTripRules(recurring);
      setDirtyRecurring(false);
      triggerSaveNotification("Recurring Trip Rules");
    } finally {
      setSavingRecurring(false);
    }
  };

  const handleUpdateAutoCancel = async () => {
    if (!dirtyAutoCancel || savingAutoCancel) return;
    setSavingAutoCancel(true);
    try {
      await platformRulesService.updateAutoCancellationRules(autoCancel);
      setDirtyAutoCancel(false);
      triggerSaveNotification("Auto Cancellation");
    } finally {
      setSavingAutoCancel(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* ─── Global Flash Notification ─── */}
      {savedSection && (
        <div className={styles.notificationBanner} role="alert">
          <span>{savedSection} updated successfully</span>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SECTION 1: Pricing & Fees (Screenshot 2)
         ═════════════════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="heading-pricing-fees">
        <div className={styles.sectionHeader}>
          <h2 id="heading-pricing-fees" className={styles.sectionTitle}>
            Pricing &amp; Fees
          </h2>
          <p className={styles.sectionSubtitle}>
            Configure platform commissions, cancellation fees, and pricing policies.
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.fieldsList}>
          {/* Platform Commission */}
          <div className={styles.fieldRow}>
            <label htmlFor="platform-commission-input" className={styles.fieldLabel}>
              Platform Comission
            </label>
            <div className={styles.fieldControl}>
              <div className={styles.inputWithPrefix}>
                <span className={styles.inputPrefix}>%</span>
                <input
                  id="platform-commission-input"
                  type="text"
                  className={styles.textInput}
                  placeholder="0.00"
                  value={pricing.platformCommission}
                  onChange={(e) => {
                    setPricing({ ...pricing, platformCommission: e.target.value });
                    setDirtyPricing(true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Cancellation Fee */}
          <div className={styles.fieldRow}>
            <label htmlFor="cancellation-fee-amount" className={styles.fieldLabel}>
              Cancellation Fee
            </label>
            <div className={styles.fieldControl}>
              <div className={styles.compoundRow}>
                <div className={styles.selectWrapper} style={{ width: "180px" }}>
                  <select
                    className={styles.selectInput}
                    value={pricing.cancellationFeeType}
                    onChange={(e) => {
                      setPricing({
                        ...pricing,
                        cancellationFeeType: e.target.value as "flat" | "percentage",
                      });
                      setDirtyPricing(true);
                    }}
                    aria-label="Cancellation fee type"
                  >
                    <option value="flat">e.g Flat fee</option>
                    <option value="percentage">e.g Percentage</option>
                  </select>
                  <ChevronDownIcon />
                </div>

                <div className={styles.inputWithPrefix} style={{ flex: 1 }}>
                  <span className={styles.inputPrefix}>
                    {pricing.cancellationFeeType === "percentage" ? "%" : "$"}
                  </span>
                  <input
                    id="cancellation-fee-amount"
                    type="text"
                    className={styles.textInput}
                    placeholder="0.00"
                    value={pricing.cancellationFeeAmount}
                    onChange={(e) => {
                      setPricing({ ...pricing, cancellationFeeAmount: e.target.value });
                      setDirtyPricing(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grace Period */}
          <div className={styles.fieldRow}>
            <label htmlFor="cancellation-grace-period" className={styles.fieldLabel}>
              Grace Period Before Cancellation Fee
            </label>
            <div className={styles.fieldControl}>
              <div className={styles.selectWrapper}>
                <select
                  id="cancellation-grace-period"
                  className={styles.selectInput}
                  value={pricing.cancellationGracePeriod}
                  onChange={(e) => {
                    setPricing({ ...pricing, cancellationGracePeriod: e.target.value });
                    setDirtyPricing(true);
                  }}
                >
                  <option value="1 Hour">e.g 1 Hour</option>
                  <option value="2 Hours">e.g 2 Hours</option>
                  <option value="3 Hours">e.g 3 Hours</option>
                  <option value="6 Hours">e.g 6 Hours</option>
                  <option value="12 Hours">e.g 12 Hours</option>
                  <option value="24 Hours">e.g 24 Hours</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actionRow}>
          <button
            type="button"
            className={`${styles.updateBtn} ${dirtyPricing ? styles.updateBtnActive : ""}`}
            disabled={!dirtyPricing || savingPricing}
            onClick={handleUpdatePricing}
            id="update-pricing-fees-btn"
          >
            {savingPricing ? "Updating..." : "Update Pricing & Fees"}
          </button>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 2: No Show Fee (Screenshot 2)
         ═════════════════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="heading-no-show-fee">
        <div className={styles.sectionHeader}>
          <h2 id="heading-no-show-fee" className={styles.sectionTitle}>
            No Show Fee
          </h2>
          <p className={styles.sectionSubtitle}>
            Fee charged for missed confirmed trips
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.fieldsList}>
          {/* Driver No-Show Fee */}
          <div className={styles.fieldRow}>
            <label htmlFor="driver-no-show-amount" className={styles.fieldLabel}>
              Driver No-Show Fee
            </label>
            <div className={styles.fieldControl}>
              <div className={styles.compoundRow}>
                <div className={styles.selectWrapper} style={{ width: "180px" }}>
                  <select
                    className={styles.selectInput}
                    value={noShow.driverNoShowFeeType}
                    onChange={(e) => {
                      setNoShow({
                        ...noShow,
                        driverNoShowFeeType: e.target.value as "flat" | "percentage",
                      });
                      setDirtyNoShow(true);
                    }}
                    aria-label="Driver no show fee type"
                  >
                    <option value="flat">e.g Flat fee</option>
                    <option value="percentage">e.g Percentage</option>
                  </select>
                  <ChevronDownIcon />
                </div>

                <div className={styles.inputWithPrefix} style={{ flex: 1 }}>
                  <span className={styles.inputPrefix}>
                    {noShow.driverNoShowFeeType === "percentage" ? "%" : "$"}
                  </span>
                  <input
                    id="driver-no-show-amount"
                    type="text"
                    className={styles.textInput}
                    placeholder="0.00"
                    value={noShow.driverNoShowFeeAmount}
                    onChange={(e) => {
                      setNoShow({ ...noShow, driverNoShowFeeAmount: e.target.value });
                      setDirtyNoShow(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Passenger No-Show Fee */}
          <div className={styles.fieldRow}>
            <label htmlFor="passenger-no-show-amount" className={styles.fieldLabel}>
              Passenger No-Show Fee
            </label>
            <div className={styles.fieldControl}>
              <div className={styles.compoundRow}>
                <div className={styles.selectWrapper} style={{ width: "180px" }}>
                  <select
                    className={styles.selectInput}
                    value={noShow.passengerNoShowFeeType}
                    onChange={(e) => {
                      setNoShow({
                        ...noShow,
                        passengerNoShowFeeType: e.target.value as "flat" | "percentage",
                      });
                      setDirtyNoShow(true);
                    }}
                    aria-label="Passenger no show fee type"
                  >
                    <option value="percentage">e.g Percentage</option>
                    <option value="flat">e.g Flat fee</option>
                  </select>
                  <ChevronDownIcon />
                </div>

                <div className={styles.inputWithPrefix} style={{ flex: 1 }}>
                  <span className={styles.inputPrefix}>
                    {noShow.passengerNoShowFeeType === "flat" ? "$" : "%"}
                  </span>
                  <input
                    id="passenger-no-show-amount"
                    type="text"
                    className={styles.textInput}
                    placeholder="0.00"
                    value={noShow.passengerNoShowFeeAmount}
                    onChange={(e) => {
                      setNoShow({ ...noShow, passengerNoShowFeeAmount: e.target.value });
                      setDirtyNoShow(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actionRow}>
          <button
            type="button"
            className={`${styles.updateBtn} ${dirtyNoShow ? styles.updateBtnActive : ""}`}
            disabled={!dirtyNoShow || savingNoShow}
            onClick={handleUpdateNoShow}
            id="update-no-show-btn"
          >
            {savingNoShow ? "Updating..." : "Update No Show Fee"}
          </button>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 3: Booking Rules (Screenshot 2)
         ═════════════════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="heading-booking-rules">
        <div className={styles.sectionHeader}>
          <h2 id="heading-booking-rules" className={styles.sectionTitle}>
            Booking Rules
          </h2>
          <p className={styles.sectionSubtitle}>
            Configure the rules and limits for creating, booking, and managing trips
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.fieldsList}>
          {/* Minimum / Maximum Advance Booking */}
          <div className={styles.fieldRow}>
            <div className={styles.labelWithInfo}>
              <label htmlFor="min-advance-booking" className={styles.fieldLabel}>
                Minimum/Maximum Advance Booking
              </label>
              <span
                className={styles.infoIcon}
                title="Specify minimum and maximum advance booking time limits (Days:Hours:Minutes)"
                aria-label="Info about advance booking"
              >
                ⓘ
              </span>
            </div>
            <div className={styles.fieldControl}>
              <div className={styles.compoundRow}>
                <div className={styles.compoundInputHalf}>
                  <input
                    id="min-advance-booking"
                    type="text"
                    className={styles.textInput}
                    placeholder="Min 0:0:0"
                    value={booking.minAdvanceBooking}
                    onChange={(e) => {
                      setBooking({ ...booking, minAdvanceBooking: e.target.value });
                      setDirtyBooking(true);
                    }}
                  />
                </div>
                <div className={styles.compoundInputHalf}>
                  <input
                    id="max-advance-booking"
                    type="text"
                    className={styles.textInput}
                    placeholder="Max 0:0:0"
                    value={booking.maxAdvanceBooking}
                    onChange={(e) => {
                      setBooking({ ...booking, maxAdvanceBooking: e.target.value });
                      setDirtyBooking(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Cut-off Before Departure */}
          <div className={styles.fieldRow}>
            <label htmlFor="booking-cutoff-departure" className={styles.fieldLabel}>
              Booking Cut-off Before Departure
            </label>
            <div className={styles.fieldControl}>
              <div className={styles.inputWithSuffix}>
                <input
                  id="booking-cutoff-departure"
                  type="text"
                  className={styles.textInput}
                  placeholder="e.g 15 minutes before departure"
                  value={booking.bookingCutoffBeforeDeparture}
                  onChange={(e) => {
                    setBooking({ ...booking, bookingCutoffBeforeDeparture: e.target.value });
                    setDirtyBooking(true);
                  }}
                />
                <span className={styles.inputSuffixIcon} aria-hidden="true">
                  <ClockIcon />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actionRow}>
          <button
            type="button"
            className={`${styles.updateBtn} ${dirtyBooking ? styles.updateBtnActive : ""}`}
            disabled={!dirtyBooking || savingBooking}
            onClick={handleUpdateBooking}
            id="update-booking-rules-btn"
          >
            {savingBooking ? "Updating..." : "Update Booking Rules"}
          </button>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 4: Vehicle Capacity Rules (Screenshot 3)
         ═════════════════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="heading-vehicle-capacity">
        <div className={styles.sectionHeader}>
          <h2 id="heading-vehicle-capacity" className={styles.sectionTitle}>
            Vehicle Capacity Rules
          </h2>
          <p className={styles.sectionSubtitle}>
            Configure passenger capacity limits and seating rules for all registered vehicles.
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.fieldsList}>
          {/* Sedan */}
          <div className={styles.fieldRow}>
            <label htmlFor="capacity-sedan" className={styles.fieldLabel}>
              Sedan
            </label>
            <div className={styles.fieldControl}>
              <input
                id="capacity-sedan"
                type="text"
                className={styles.textInput}
                placeholder="e.g 3"
                value={capacity.sedan}
                onChange={(e) => {
                  setCapacity({ ...capacity, sedan: e.target.value });
                  setDirtyCapacity(true);
                }}
              />
            </div>
          </div>

          {/* Hatchback */}
          <div className={styles.fieldRow}>
            <label htmlFor="capacity-hatchback" className={styles.fieldLabel}>
              Hatchback
            </label>
            <div className={styles.fieldControl}>
              <input
                id="capacity-hatchback"
                type="text"
                className={styles.textInput}
                placeholder="e.g 3"
                value={capacity.hatchback}
                onChange={(e) => {
                  setCapacity({ ...capacity, hatchback: e.target.value });
                  setDirtyCapacity(true);
                }}
              />
            </div>
          </div>

          {/* SUV */}
          <div className={styles.fieldRow}>
            <label htmlFor="capacity-suv" className={styles.fieldLabel}>
              SUV
            </label>
            <div className={styles.fieldControl}>
              <input
                id="capacity-suv"
                type="text"
                className={styles.textInput}
                placeholder="e.g 4"
                value={capacity.suv}
                onChange={(e) => {
                  setCapacity({ ...capacity, suv: e.target.value });
                  setDirtyCapacity(true);
                }}
              />
            </div>
          </div>

          {/* Minivan */}
          <div className={styles.fieldRow}>
            <label htmlFor="capacity-minivan" className={styles.fieldLabel}>
              Minivan
            </label>
            <div className={styles.fieldControl}>
              <input
                id="capacity-minivan"
                type="text"
                className={styles.textInput}
                placeholder="e.g 7"
                value={capacity.minivan}
                onChange={(e) => {
                  setCapacity({ ...capacity, minivan: e.target.value });
                  setDirtyCapacity(true);
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actionRow}>
          <button
            type="button"
            className={`${styles.updateBtn} ${dirtyCapacity ? styles.updateBtnActive : ""}`}
            disabled={!dirtyCapacity || savingCapacity}
            onClick={handleUpdateCapacity}
            id="update-vehicle-capacity-btn"
          >
            {savingCapacity ? "Updating..." : "Update Vehicle Capacity"}
          </button>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 5: Recurring Trip Rules (Screenshot 3)
         ═════════════════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="heading-recurring-trips">
        <div className={styles.sectionHeader}>
          <h2 id="heading-recurring-trips" className={styles.sectionTitle}>
            Recurring Trip Rules
          </h2>
          <p className={styles.sectionSubtitle}>
            Configure how recurring trips are created, scheduled, and managed across the platform.
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.fieldsList}>
          {/* Max Recurrence Length */}
          <div className={styles.fieldRow}>
            <label htmlFor="max-recurrence-length" className={styles.fieldLabel}>
              Max Recurrence Length
            </label>
            <div className={styles.fieldControl}>
              <div className={styles.selectWrapper}>
                <select
                  id="max-recurrence-length"
                  className={styles.selectInput}
                  value={recurring.maxRecurrenceLength}
                  onChange={(e) => {
                    setRecurring({ ...recurring, maxRecurrenceLength: e.target.value });
                    setDirtyRecurring(true);
                  }}
                >
                  <option value="1 week">e.g 1 week</option>
                  <option value="2 weeks">e.g 2 weeks</option>
                  <option value="3 weeks">e.g 3 weeks</option>
                  <option value="4 weeks">e.g 4 weeks</option>
                  <option value="6 weeks">e.g 6 weeks</option>
                  <option value="8 weeks">e.g 8 weeks</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          {/* Publish Schedule Ahead */}
          <div className={styles.fieldRow}>
            <label htmlFor="publish-schedule-ahead" className={styles.fieldLabel}>
              Publish Schedule Ahead
            </label>
            <div className={styles.fieldControl}>
              <div className={styles.selectWrapper}>
                <select
                  id="publish-schedule-ahead"
                  className={styles.selectInput}
                  value={recurring.publishScheduleAhead}
                  onChange={(e) => {
                    setRecurring({ ...recurring, publishScheduleAhead: e.target.value });
                    setDirtyRecurring(true);
                  }}
                >
                  <option value="1 week">e.g 1 week</option>
                  <option value="2 weeks">e.g 2 weeks</option>
                  <option value="3 weeks">e.g 3 weeks</option>
                  <option value="4 weeks">e.g 4 weeks</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actionRow}>
          <button
            type="button"
            className={`${styles.updateBtn} ${dirtyRecurring ? styles.updateBtnActive : ""}`}
            disabled={!dirtyRecurring || savingRecurring}
            onClick={handleUpdateRecurring}
            id="update-recurring-rules-btn"
          >
            {savingRecurring ? "Updating..." : "Update Recurring Trip Rules"}
          </button>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 6: Auto Cancellation (Screenshot 3)
         ═════════════════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="heading-auto-cancellation">
        <div className={styles.sectionHeader}>
          <h2 id="heading-auto-cancellation" className={styles.sectionTitle}>
            Auto Cancellation
          </h2>
          <p className={styles.sectionSubtitle}>
            Configure when pending bookings and inactive trips are automatically cancelled.
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.fieldsList}>
          {/* Auto-cancel toggle */}
          <div className={styles.fieldRow}>
            <label htmlFor="auto-cancel-toggle" className={styles.fieldLabel}>
              Auto-cancel when no passengers booked
            </label>
            <div className={styles.fieldControl}>
              <button
                type="button"
                id="auto-cancel-toggle"
                role="switch"
                aria-checked={autoCancel.autoCancelNoPassengers}
                className={`${styles.toggleSwitch} ${
                  autoCancel.autoCancelNoPassengers ? styles.toggleSwitchActive : ""
                }`}
                onClick={() => {
                  setAutoCancel({
                    ...autoCancel,
                    autoCancelNoPassengers: !autoCancel.autoCancelNoPassengers,
                  });
                  setDirtyAutoCancel(true);
                }}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>

          {/* Cancellation Threshold */}
          <div className={styles.fieldRow}>
            <label htmlFor="cancellation-threshold" className={styles.fieldLabel}>
              Cancellation Threshold
            </label>
            <div className={styles.fieldControl}>
              <div className={styles.selectWrapper}>
                <select
                  id="cancellation-threshold"
                  className={styles.selectInput}
                  value={autoCancel.cancellationThreshold}
                  onChange={(e) => {
                    setAutoCancel({ ...autoCancel, cancellationThreshold: e.target.value });
                    setDirtyAutoCancel(true);
                  }}
                >
                  <option value="1 hour">e.g 1 hour</option>
                  <option value="2 hours">e.g 2 hours</option>
                  <option value="3 hours">e.g 3 hours</option>
                  <option value="6 hours">e.g 6 hours</option>
                  <option value="12 hours">e.g 12 hours</option>
                  <option value="24 hours">e.g 24 hours</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actionRow}>
          <button
            type="button"
            className={`${styles.updateBtn} ${dirtyAutoCancel ? styles.updateBtnActive : ""}`}
            disabled={!dirtyAutoCancel || savingAutoCancel}
            onClick={handleUpdateAutoCancel}
            id="update-auto-cancel-btn"
          >
            {savingAutoCancel ? "Updating..." : "Update Auto Cancellation"}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─── Inline Icons ─── */
function ChevronDownIcon() {
  return (
    <svg
      className={styles.selectArrow}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ClockIcon() {
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
      <circle cx={12} cy={12} r={10} />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
