"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import EmergencyIncidentsTable from "@/components/admin/emergency-incidents/EmergencyIncidentsTable";
import EmergencyIncidentDetailView from "@/components/admin/emergency-incidents/EmergencyIncidentDetailView";
import {
  emergencyIncidentsService,
  EmergencyIncident,
  EmergencySummary,
} from "@/services/emergency-incidents-service";
import styles from "./emergency-incidents.module.css";

function extractLocationStr(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val.location || val.name || val.address || "";
  return String(val);
}

function extractTimestampStr(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val.timestamp || val.time || val.date || "";
  return String(val);
}

export default function EmergencyIncidentsPage() {
  const [summary, setSummary] = useState<EmergencySummary>({
    activeEmergencies: 0,
    criticalAlerts: 0,
    resolvedToday: 0,
    averageResponseTime: "0m 0s",
  });
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await emergencyIncidentsService.getDashboard();
      if (data?.stats) {
        setSummary({
          activeEmergencies: data.stats.active_emergencies ?? 0,
          criticalAlerts: data.stats.critical_alerts ?? 0,
          resolvedToday: data.stats.resolved_today ?? 0,
          averageResponseTime: data.stats.average_response_time ?? "0m 0s",
        });
      }

      if (data?.incident_history) {
        const normalized: EmergencyIncident[] = data.incident_history.map((item) => ({
          id: item.id,
          sosId: item.sos_id,
          timestamp: extractTimestampStr(item.timestamp) || item.timestamp || "",
          triggeredBy: item.triggered_by || "",
          userType: (item.user_type as any) || "",
          priority: (item.priority as any) || "Low",
          location: extractLocationStr(item.location_name || item.location),
          status: (item.status as any) || "Active",
        }));
        setIncidents(normalized);
      }
    } catch (err) {
      console.error("Failed to load emergency incidents:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectIncident = async (incident: EmergencyIncident) => {
    setSelectedIncident(incident);
    try {
      if (incident.sosId) {
        const detail = await emergencyIncidentsService.getIncidentDetails(incident.sosId);
        if (detail) {
          setSelectedIncident((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              driverName: detail.driver_name || detail.driver || prev.driverName,
              driverId: detail.driver_id || prev.driverId,
              passengerName: detail.passenger_name || detail.passenger || prev.passengerName,
              passengerId: detail.passenger_id || prev.passengerId,
              bookingId: detail.booking_id || detail.booking || prev.bookingId,
              tripStartTime: detail.trip_start_time || detail.start_time || prev.tripStartTime,
              pickUp: extractLocationStr(detail.pickup || detail.pick_up) || prev.pickUp,
              dropOff: extractLocationStr(detail.dropoff || detail.drop_off) || prev.dropOff,
              vehicle: detail.vehicle || prev.vehicle,
              driverCurrentLocation: extractLocationStr(detail.driver_current_location) || extractLocationStr(detail.location) || prev.driverCurrentLocation,
              passengerCurrentLocation: extractLocationStr(detail.passenger_current_location) || prev.passengerCurrentLocation,
              locationTimestamp: extractTimestampStr(detail.driver_current_location) || extractTimestampStr(detail.location_timestamp) || prev.locationTimestamp,
              lastLocationUpdate: extractLocationStr(detail.last_location_update) || prev.lastLocationUpdate,
              victimReport: detail.victim_report || prev.victimReport,
              timeline: Array.isArray(detail.timeline) ? detail.timeline : prev.timeline,
              raw: detail,
            };
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch incident details:", err);
    }
  };

  if (selectedIncident) {
    return (
      <div className={styles.page}>
        <EmergencyIncidentDetailView
          incident={selectedIncident}
          onBack={() => setSelectedIncident(null)}
          onExport={() => console.log("Exporting log for:", selectedIncident.sosId)}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Top 4 Stat Cards ── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Active Emergencies"
          value={summary.activeEmergencies ?? 0}
          id="stat-active-emergencies"
        />
        <StatCard
          label="Critical Alerts"
          value={summary.criticalAlerts ?? 0}
          id="stat-critical-alerts"
        />
        <StatCard
          label="Resolved Today"
          value={summary.resolvedToday ?? 0}
          id="stat-resolved-today"
        />
        <StatCard
          label="Average Response Time"
          value={summary.averageResponseTime ?? "0m 0s"}
          id="stat-avg-response-time"
        />
      </div>

      {/* ── Content View ── */}
      {isLoading ? (
        <div className={styles.loadingCard}>
          <Spinner size={36} color="#2F68FE" />
          <p className={styles.loadingSubtitle}>Loading emergency incidents…</p>
        </div>
      ) : incidents.length === 0 ? (
        /* Screen 1: Inactive State (No Data) */
        <div className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No Incident History</h2>
          <p className={styles.emptySubtitle}>There are no recorded emergency incidents.</p>
        </div>
      ) : (
        /* Screen 2: Table View */
        <EmergencyIncidentsTable
          incidents={incidents}
          onSelectIncident={handleSelectIncident}
        />
      )}
    </div>
  );
}
