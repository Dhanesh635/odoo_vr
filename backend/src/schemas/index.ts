// ============================================================
// Shared Enums — TransitOps
// Centralized so services/controllers/DTOs import one source
// of truth instead of re-declaring string unions.
// ============================================================

export enum UserRole {
  FLEET_MANAGER = 'FLEET_MANAGER',
  DRIVER = 'DRIVER',
  SAFETY_OFFICER = 'SAFETY_OFFICER',
  FINANCIAL_ANALYST = 'FINANCIAL_ANALYST',
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  ON_TRIP = 'ON_TRIP',
  IN_SHOP = 'IN_SHOP',
  RETIRED = 'RETIRED',
}

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  ON_TRIP = 'ON_TRIP',
  OFF_DUTY = 'OFF_DUTY',
  SUSPENDED = 'SUSPENDED',
}

export enum TripStatus {
  DRAFT = 'DRAFT',
  DISPATCHED = 'DISPATCHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MaintenanceStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export enum ExpenseType {
  TOLL = 'TOLL',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER',
}
