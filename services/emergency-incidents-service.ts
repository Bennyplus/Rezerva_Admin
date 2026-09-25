import { publicApi } from "@/lib/api-client";

export type PriorityLevel = "Low" | "Medium" | "High";
export type UserType = "Passenger" | "Driver" | "";
export type IncidentStatus = "Active" | "Resolved" | "Investigating" | "";

export interface TimelineItem {
  id?: string;
  title: string;
  timestamp: string;
  completed?: boolean;
}

export interface VictimReport {
  category: string;
  description: string;
  notes?: string;
}

export interface EmergencyIncident {
  id: string | number;
  sosId: string;
  timestamp: string;
  triggeredBy: string;
  userType: UserType;
  priority: PriorityLevel;
  location: string;
  status: IncidentStatus;
  
  // Details from /emergency/incidents/?sos_id=...
  driverName?: string;
  driverId?: string;
  driverPhone?: string;
  passengerName?: string;
  passengerId?: string;
  passengerPhone?: string;
  bookingId?: string;
  tripStartTime?: string;
  pickUp?: string;
  dropOff?: string;
  vehicle?: string;
  driverCurrentLocation?: string;
  passengerCurrentLocation?: string;
  locationTimestamp?: string;
  lastLocationUpdate?: string;
  victimReport?: VictimReport;
  timeline?: TimelineItem[];
  raw?: any;
}

export interface EmergencySummary {
  activeEmergencies: number;
  criticalAlerts: number;
  resolvedToday: number;
  averageResponseTime: string | number;
}

export interface BackendEmergencyStats {
  active_emergencies: number;
  critical_alerts: number;
  resolved_today: number;
  average_response_time: string | number;
}

export interface BackendIncidentItem {
  id: number;
  sos_id: string;
  timestamp: string;
  triggered_by: string;
  user_type: string;
  priority: string;
  location_name?: string;
  location?: string;
  status: string;
}

export interface EmergencyDashboardResponse {
  stats: BackendEmergencyStats;
  incident_history: BackendIncidentItem[];
}

export const emergencyIncidentsService = {
  getDashboard: async (): Promise<EmergencyDashboardResponse> => {
    const res = await publicApi.get("", {
      params: { path: "administration/emergency/dashboard/" },
    });
    return res.data;
  },

  getIncidentDetails: async (sosId: string): Promise<any> => {
    const res = await publicApi.get("", {
      params: { path: "administration/emergency/incidents/", sos_id: sosId },
    });
    return Array.isArray(res.data) ? res.data[0] : res.data;
  },
};
