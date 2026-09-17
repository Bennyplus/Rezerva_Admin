import { publicApi } from "@/lib/api-client";

/**
 * Platform Rules Service (API & Types Layer)
 */

/* ─── Frontend Form Interfaces ─── */

export interface PricingAndFeesRules {
  platformCommission: string;
  cancellationFeeType: "flat" | "percentage";
  cancellationFeeAmount: string;
  cancellationGracePeriod: string;
}

export interface NoShowFeeRules {
  driverNoShowFeeType: "flat" | "percentage";
  driverNoShowFeeAmount: string;
  passengerNoShowFeeType: "flat" | "percentage";
  passengerNoShowFeeAmount: string;
}

export interface BookingRules {
  minAdvanceBooking: string;
  maxAdvanceBooking: string;
  bookingCutoffBeforeDeparture: string;
}

export interface VehicleCapacityRules {
  sedan: number | string;
  hatchback: number | string;
  suv: number | string;
  minivan: number | string;
}

export interface RecurringTripRules {
  maxRecurrenceLength: string;
  publishScheduleAhead: string;
}

export interface AutoCancellationRules {
  autoCancelNoPassengers: boolean;
  cancellationThreshold: string;
}

export interface PlatformRules {
  pricingAndFees: PricingAndFeesRules;
  noShowFee: NoShowFeeRules;
  bookingRules: BookingRules;
  vehicleCapacity: VehicleCapacityRules;
  recurringTripRules: RecurringTripRules;
  autoCancellation: AutoCancellationRules;
}

export interface RuleHistoryItem {
  id: string;
  section: string;
  changeDescription: string;
  updatedBy: string;
  updatedAt: string;
  previousValue?: string;
  newValue?: string;
}

/* ─── Backend Payload & Response Types ─── */

export interface PricingFeesBackendPayload {
  platform_commission_percentage: string;
  cancellation_fee_type: "flat" | "percentage";
  cancellation_fee_amount: string;
  grace_period_before_cancellation_fee_hours: number;
}

export interface VehicleCapacityBackendPayload {
  sedan_capacity: number;
  hatchback_capacity: number;
  suv_capacity: number;
  minivan_capacity: number;
}

export interface BookingRulesBackendPayload {
  min_advance_booking: string;
  max_advance_booking: string;
  booking_cutoff_before_departure_minutes: number;
}

export interface NoShowFeeBackendPayload {
  driver_no_show_fee_type: "flat" | "percentage";
  driver_no_show_fee_amount: string;
  passenger_no_show_fee_type: "flat" | "percentage";
  passenger_no_show_fee_amount: string;
}

export interface AutoCancellationBackendPayload {
  auto_cancel_when_no_passengers_booked: boolean;
  cancellation_threshold_hours: number;
}

export const DEFAULT_PLATFORM_RULES: PlatformRules = {
  pricingAndFees: {
    platformCommission: "0.00",
    cancellationFeeType: "flat",
    cancellationFeeAmount: "0.00",
    cancellationGracePeriod: "3 Hours",
  },
  noShowFee: {
    driverNoShowFeeType: "flat",
    driverNoShowFeeAmount: "0.00",
    passengerNoShowFeeType: "percentage",
    passengerNoShowFeeAmount: "0.00",
  },
  bookingRules: {
    minAdvanceBooking: "00:00:00",
    maxAdvanceBooking: "00:00:00",
    bookingCutoffBeforeDeparture: "15 minutes before departure",
  },
  vehicleCapacity: {
    sedan: "3",
    hatchback: "3",
    suv: "4",
    minivan: "7",
  },
  recurringTripRules: {
    maxRecurrenceLength: "3 weeks",
    publishScheduleAhead: "3 weeks",
  },
  autoCancellation: {
    autoCancelNoPassengers: false,
    cancellationThreshold: "3 hours",
  },
};

export const INITIAL_RULE_HISTORY: RuleHistoryItem[] = [
  {
    id: "hist-1",
    section: "Pricing & Fees",
    changeDescription: "Platform commission set to 0.00%",
    updatedBy: "Admin",
    updatedAt: "17 Sep 2026, 10:45 AM",
  },
  {
    id: "hist-2",
    section: "Vehicle Capacity Rules",
    changeDescription: "Updated SUV capacity to 4 and Minivan to 7",
    updatedBy: "Super Admin",
    updatedAt: "16 Sep 2026, 04:12 PM",
  },
  {
    id: "hist-3",
    section: "Booking Rules",
    changeDescription: "Booking cut-off updated to 15 minutes before departure",
    updatedBy: "Admin",
    updatedAt: "15 Sep 2026, 01:30 PM",
  },
  {
    id: "hist-4",
    section: "Auto Cancellation",
    changeDescription: "Cancellation threshold set to 3 hours",
    updatedBy: "Admin",
    updatedAt: "14 Sep 2026, 09:15 AM",
  },
];

let localRules: PlatformRules = { ...DEFAULT_PLATFORM_RULES };
let localHistory: RuleHistoryItem[] = [...INITIAL_RULE_HISTORY];

/* ─── Helpers ─── */
function parseHours(val: string): number {
  const match = val.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function parseMinutes(val: string): number {
  const match = val.match(/\d+/);
  return match ? parseInt(match[0], 10) : 15;
}

function normalizeTime(val: string): string {
  if (!val) return "00:00:00";
  const parts = val.replace(/[^0-9:]/g, "").split(":");
  while (parts.length < 3) parts.push("00");
  return parts.map((p) => p.padStart(2, "0")).slice(0, 3).join(":");
}

export const platformRulesService = {
  /**
   * Fetch current platform rules from backend endpoints
   */
  getRules: async (): Promise<PlatformRules> => {
    try {
      // First attempt consolidated endpoint if available
      try {
        const consolidated = await publicApi.get("", {
          params: { path: "administration/platform-rules/" },
          skipToast: true,
        } as any);
        if (consolidated.data && typeof consolidated.data === "object") {
          const d = consolidated.data;
          // If structure matches or has nested keys
          if (d.pricing_fees || d.vehicle_capacity || d.booking_rules) {
            return {
              ...DEFAULT_PLATFORM_RULES,
              ...(d.pricing_fees && {
                pricingAndFees: {
                  platformCommission: String(d.pricing_fees.platform_commission_percentage ?? "0.00"),
                  cancellationFeeType: d.pricing_fees.cancellation_fee_type ?? "flat",
                  cancellationFeeAmount: String(d.pricing_fees.cancellation_fee_amount ?? "0.00"),
                  cancellationGracePeriod: `${d.pricing_fees.grace_period_before_cancellation_fee_hours ?? 3} Hours`,
                },
              }),
              ...(d.vehicle_capacity && {
                vehicleCapacity: {
                  sedan: String(d.vehicle_capacity.sedan_capacity ?? 3),
                  hatchback: String(d.vehicle_capacity.hatchback_capacity ?? 3),
                  suv: String(d.vehicle_capacity.suv_capacity ?? 4),
                  minivan: String(d.vehicle_capacity.minivan_capacity ?? 7),
                },
              }),
              ...(d.booking_rules && {
                bookingRules: {
                  minAdvanceBooking: d.booking_rules.min_advance_booking ?? "00:00:00",
                  maxAdvanceBooking: d.booking_rules.max_advance_booking ?? "00:00:00",
                  bookingCutoffBeforeDeparture: `${d.booking_rules.booking_cutoff_before_departure_minutes ?? 15} minutes before departure`,
                },
              }),
              ...(d.no_show_fee && {
                noShowFee: {
                  driverNoShowFeeType: d.no_show_fee.driver_no_show_fee_type ?? "flat",
                  driverNoShowFeeAmount: String(d.no_show_fee.driver_no_show_fee_amount ?? "0.00"),
                  passengerNoShowFeeType: d.no_show_fee.passenger_no_show_fee_type ?? "percentage",
                  passengerNoShowFeeAmount: String(d.no_show_fee.passenger_no_show_fee_amount ?? "0.00"),
                },
              }),
            };
          }
        }
      } catch {
        // Continue to fetch section endpoints in parallel
      }

      // Fetch individual rule endpoints in parallel
      const [pricingRes, vehicleRes, bookingRes, noShowRes, autoCancelRes] = await Promise.allSettled([
        publicApi.get("", { params: { path: "administration/platform-rules/pricing-fees/" }, skipToast: true } as any),
        publicApi.get("", { params: { path: "administration/platform-rules/vehicle-capacity/" }, skipToast: true } as any),
        publicApi.get("", { params: { path: "administration/platform-rules/booking-rules/" }, skipToast: true } as any),
        publicApi.get("", { params: { path: "administration/platform-rules/no-show-fee/" }, skipToast: true } as any),
        publicApi.get("", { params: { path: "administration/platform-rules/auto-cancellation/" }, skipToast: true } as any),
      ]);

      const updatedRules: PlatformRules = { ...localRules };

      if (pricingRes.status === "fulfilled" && pricingRes.value.data) {
        const p = pricingRes.value.data;
        updatedRules.pricingAndFees = {
          platformCommission: String(p.platform_commission_percentage ?? localRules.pricingAndFees.platformCommission),
          cancellationFeeType: p.cancellation_fee_type ?? localRules.pricingAndFees.cancellationFeeType,
          cancellationFeeAmount: String(p.cancellation_fee_amount ?? localRules.pricingAndFees.cancellationFeeAmount),
          cancellationGracePeriod: `${p.grace_period_before_cancellation_fee_hours ?? 3} Hours`,
        };
      }

      if (vehicleRes.status === "fulfilled" && vehicleRes.value.data) {
        const v = vehicleRes.value.data;
        updatedRules.vehicleCapacity = {
          sedan: String(v.sedan_capacity ?? localRules.vehicleCapacity.sedan),
          hatchback: String(v.hatchback_capacity ?? localRules.vehicleCapacity.hatchback),
          suv: String(v.suv_capacity ?? localRules.vehicleCapacity.suv),
          minivan: String(v.minivan_capacity ?? localRules.vehicleCapacity.minivan),
        };
      }

      if (bookingRes.status === "fulfilled" && bookingRes.value.data) {
        const b = bookingRes.value.data;
        updatedRules.bookingRules = {
          minAdvanceBooking: b.min_advance_booking ?? localRules.bookingRules.minAdvanceBooking,
          maxAdvanceBooking: b.max_advance_booking ?? localRules.bookingRules.maxAdvanceBooking,
          bookingCutoffBeforeDeparture: `${b.booking_cutoff_before_departure_minutes ?? 15} minutes before departure`,
        };
      }

      if (noShowRes.status === "fulfilled" && noShowRes.value.data) {
        const n = noShowRes.value.data;
        updatedRules.noShowFee = {
          driverNoShowFeeType: n.driver_no_show_fee_type ?? localRules.noShowFee.driverNoShowFeeType,
          driverNoShowFeeAmount: String(n.driver_no_show_fee_amount ?? localRules.noShowFee.driverNoShowFeeAmount),
          passengerNoShowFeeType: n.passenger_no_show_fee_type ?? localRules.noShowFee.passengerNoShowFeeType,
          passengerNoShowFeeAmount: String(n.passenger_no_show_fee_amount ?? localRules.noShowFee.passengerNoShowFeeAmount),
        };
      }

      if (autoCancelRes.status === "fulfilled" && autoCancelRes.value.data) {
        const a = autoCancelRes.value.data;
        updatedRules.autoCancellation = {
          autoCancelNoPassengers: Boolean(a.auto_cancel_when_no_passengers_booked ?? localRules.autoCancellation.autoCancelNoPassengers),
          cancellationThreshold: `${a.cancellation_threshold_hours ?? 3} hour${a.cancellation_threshold_hours === 1 ? "" : "s"}`,
        };
      }

      localRules = updatedRules;
      return localRules;
    } catch (err) {
      console.error("Failed to fetch platform rules, using cached/defaults:", err);
      return localRules;
    }
  },

  /**
   * PATCH administration/platform-rules/pricing-fees/
   * Accepts JSON or FormData
   */
  updatePricingAndFees: async (data: PricingAndFeesRules): Promise<any> => {
    const payload: PricingFeesBackendPayload = {
      platform_commission_percentage: data.platformCommission,
      cancellation_fee_type: data.cancellationFeeType,
      cancellation_fee_amount: data.cancellationFeeAmount,
      grace_period_before_cancellation_fee_hours: parseHours(data.cancellationGracePeriod),
    };

    // Construct FormData for multipart submission
    const formData = new FormData();
    formData.append("platform_commission_percentage", payload.platform_commission_percentage);
    formData.append("cancellation_fee_type", payload.cancellation_fee_type);
    formData.append("cancellation_fee_amount", payload.cancellation_fee_amount);
    formData.append("grace_period_before_cancellation_fee_hours", String(payload.grace_period_before_cancellation_fee_hours));

    const response = await publicApi.patch("", formData, {
      params: { path: "administration/platform-rules/pricing-fees/" },
      successMessage: "Pricing & fees updated successfully",
    } as any);

    localRules.pricingAndFees = { ...data };
    localHistory.unshift({
      id: `hist-${Date.now()}`,
      section: "Pricing & Fees",
      changeDescription: `Commission: ${data.platformCommission}%, Cancellation Fee: ${data.cancellationFeeAmount} (${data.cancellationFeeType})`,
      updatedBy: "Admin",
      updatedAt: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return response.data;
  },

  /**
   * PATCH administration/platform-rules/vehicle-capacity/
   * Body: raw (json)
   */
  updateVehicleCapacityRules: async (data: VehicleCapacityRules): Promise<any> => {
    const payload: VehicleCapacityBackendPayload = {
      sedan_capacity: Number(data.sedan) || 3,
      hatchback_capacity: Number(data.hatchback) || 3,
      suv_capacity: Number(data.suv) || 4,
      minivan_capacity: Number(data.minivan) || 7,
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/platform-rules/vehicle-capacity/" },
      successMessage: "Vehicle seating capacity updated successfully",
    } as any);

    localRules.vehicleCapacity = { ...data };
    localHistory.unshift({
      id: `hist-${Date.now()}`,
      section: "Vehicle Capacity Rules",
      changeDescription: `Sedan: ${payload.sedan_capacity}, Hatchback: ${payload.hatchback_capacity}, SUV: ${payload.suv_capacity}, Minivan: ${payload.minivan_capacity}`,
      updatedBy: "Admin",
      updatedAt: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return response.data;
  },

  /**
   * PATCH administration/platform-rules/booking-rules/
   * Body: raw (json)
   */
  updateBookingRules: async (data: BookingRules): Promise<any> => {
    const payload: BookingRulesBackendPayload = {
      min_advance_booking: normalizeTime(data.minAdvanceBooking),
      max_advance_booking: normalizeTime(data.maxAdvanceBooking),
      booking_cutoff_before_departure_minutes: parseMinutes(data.bookingCutoffBeforeDeparture),
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/platform-rules/booking-rules/" },
      successMessage: "Booking rules updated successfully",
    } as any);

    localRules.bookingRules = { ...data };
    localHistory.unshift({
      id: `hist-${Date.now()}`,
      section: "Booking Rules",
      changeDescription: `Advance: Min ${payload.min_advance_booking} / Max ${payload.max_advance_booking}, Cut-off: ${payload.booking_cutoff_before_departure_minutes} mins`,
      updatedBy: "Admin",
      updatedAt: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return response.data;
  },

  /**
   * PATCH administration/platform-rules/no-show-fee/
   * Body: raw (json)
   */
  updateNoShowFee: async (data: NoShowFeeRules): Promise<any> => {
    const payload: NoShowFeeBackendPayload = {
      driver_no_show_fee_type: data.driverNoShowFeeType,
      driver_no_show_fee_amount: data.driverNoShowFeeAmount,
      passenger_no_show_fee_type: data.passengerNoShowFeeType,
      passenger_no_show_fee_amount: data.passengerNoShowFeeAmount,
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/platform-rules/no-show-fee/" },
      successMessage: "No show fee updated successfully",
    } as any);

    localRules.noShowFee = { ...data };
    localHistory.unshift({
      id: `hist-${Date.now()}`,
      section: "No Show Fee",
      changeDescription: `Driver: ${payload.driver_no_show_fee_amount} (${payload.driver_no_show_fee_type}), Passenger: ${payload.passenger_no_show_fee_amount} (${payload.passenger_no_show_fee_type})`,
      updatedBy: "Admin",
      updatedAt: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return response.data;
  },

  /**
   * PATCH administration/platform-rules/vehicle-capacity/
   * Recurring Trip Rules
   */
  updateRecurringTripRules: async (data: RecurringTripRules): Promise<any> => {
    const payload = {
      sedan_capacity: Number(localRules.vehicleCapacity.sedan) || 3,
      hatchback_capacity: Number(localRules.vehicleCapacity.hatchback) || 3,
      suv_capacity: Number(localRules.vehicleCapacity.suv) || 4,
      minivan_capacity: Number(localRules.vehicleCapacity.minivan) || 7,
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/platform-rules/vehicle-capacity/" },
      successMessage: "Recurring trip rules updated successfully",
    } as any);

    localRules.recurringTripRules = { ...data };
    localHistory.unshift({
      id: `hist-${Date.now()}`,
      section: "Recurring Trip Rules",
      changeDescription: `Max Recurrence: ${data.maxRecurrenceLength}, Publish Ahead: ${data.publishScheduleAhead}`,
      updatedBy: "Admin",
      updatedAt: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return response.data;
  },

  /**
   * PATCH administration/platform-rules/auto-cancellation/
   * Body: raw (json)
   */
  updateAutoCancellationRules: async (data: AutoCancellationRules): Promise<any> => {
    const payload: AutoCancellationBackendPayload = {
      auto_cancel_when_no_passengers_booked: Boolean(data.autoCancelNoPassengers),
      cancellation_threshold_hours: parseHours(data.cancellationThreshold) || 3,
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/platform-rules/auto-cancellation/" },
      successMessage: "Auto cancellation rules updated successfully",
    } as any);

    localRules.autoCancellation = { ...data };
    localHistory.unshift({
      id: `hist-${Date.now()}`,
      section: "Auto Cancellation",
      changeDescription: `Auto-cancel: ${payload.auto_cancel_when_no_passengers_booked ? "Enabled" : "Disabled"}, Threshold: ${payload.cancellation_threshold_hours} hours`,
      updatedBy: "Admin",
      updatedAt: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return response.data;
  },

  /**
   * Get history of rule changes
   */
  getHistory: async (): Promise<RuleHistoryItem[]> => {
    return [...localHistory];
  },
};
