import type { VehicleType } from "@/types/vehicle";

// ─── Enums / Unions ────────────────────────────────────────────────────────────

export type MaintenanceStatus =
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type ServiceType =
  | "Oil Change"
  | "Brake Repair"
  | "Engine Service"
  | "Tyre Replacement"
  | "General Inspection";

export type MaintenancePriority = "Low" | "Medium" | "High" | "Critical";

export type MaintenanceSortKey = "Newest" | "Oldest" | "Highest Cost";

// ─── Timeline ──────────────────────────────────────────────────────────────────

export type MaintenanceTimelineEventType =
  | "scheduled"
  | "vehicle_received"
  | "inspection_started"
  | "repair_started"
  | "quality_check"
  | "completed"
  | "cancelled";

export type MaintenanceTimelineEvent = {
  type: MaintenanceTimelineEventType;
  label: string;
  timestamp: string | null;
};

// ─── Core Record ───────────────────────────────────────────────────────────────

export type MaintenanceRecord = {
  id: string;
  maintenanceId: string;        // e.g. "MT001"
  vehicleId: string;
  vehicleName: string;
  vehicleType: VehicleType;
  registrationNumber: string;
  serviceType: ServiceType;
  technician: string;
  priority: MaintenancePriority;
  description: string;
  startDate: string;            // ISO date
  expectedCompletion: string;   // ISO date
  completedAt: string | null;   // ISO datetime
  cancelledAt: string | null;
  estimatedCost: number;        // INR
  actualCost: number | null;
  serviceNotes: string;
  status: MaintenanceStatus;
  createdAt: string;
  timeline: MaintenanceTimelineEvent[];
};

// ─── Form Values ───────────────────────────────────────────────────────────────

export type MaintenanceFormValues = {
  vehicleId: string;
  serviceType: ServiceType | "";
  technician: string;
  priority: MaintenancePriority | "";
  description: string;
  startDate: string;
  expectedCompletion: string;
  estimatedCost: string;
  notes: string;
};

export type MaintenanceCompleteFormValues = {
  actualCost: string;
  serviceNotes: string;
};

// ─── Filters ───────────────────────────────────────────────────────────────────

export type MaintenanceFiltersState = {
  search: string;
  status: "All" | MaintenanceStatus;
  vehicleType: "All" | VehicleType;
  serviceType: "All" | ServiceType;
  sortBy: MaintenanceSortKey;
};
