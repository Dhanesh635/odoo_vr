import type { BadgeStatus } from "@/components/ui";
import type { VehicleType } from "@/types/vehicle";

// ─── Status ────────────────────────────────────────────────────────────────────

export type TripStatus = Extract<
  BadgeStatus,
  "Draft" | "Completed" | "Cancelled" | "Pending"
> | "Dispatched";

// ─── Timeline ──────────────────────────────────────────────────────────────────

export type TripTimelineEventType =
  | "created"
  | "vehicle_assigned"
  | "driver_assigned"
  | "dispatched"
  | "reached"
  | "completed"
  | "cancelled";

export type TripTimelineEvent = {
  type: TripTimelineEventType;
  label: string;
  timestamp: string | null; // ISO string or null if not yet occurred
};

// ─── Core Trip ─────────────────────────────────────────────────────────────────

export type Trip = {
  id: string;
  tripId: string; // human-readable, e.g. "TR001"
  source: string;
  destination: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: VehicleType;
  driverId: string;
  driverName: string;
  cargoWeight: number; // kg
  plannedDistance: number; // km
  status: TripStatus;
  expectedStartDate: string; // ISO date string
  expectedDeliveryDate: string; // ISO date string
  notes: string;
  createdAt: string; // ISO date string
  dispatchedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  // Completion details
  finalOdometer: number | null;
  fuelUsed: number | null;
  deliveryNotes: string;
  // Timeline
  timeline: TripTimelineEvent[];
};

// ─── Form Values ───────────────────────────────────────────────────────────────

export type TripFormValues = {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: string;
  plannedDistance: string;
  expectedStartDate: string;
  expectedDeliveryDate: string;
  notes: string;
};

export type TripCompleteFormValues = {
  finalOdometer: string;
  fuelUsed: string;
  deliveryNotes: string;
};

// ─── Filters ───────────────────────────────────────────────────────────────────

export type TripSortKey = "Latest" | "Oldest" | "Longest Distance";

export type TripFiltersState = {
  search: string;
  status: "All" | TripStatus;
  vehicleType: "All" | VehicleType;
  sortBy: TripSortKey;
};
