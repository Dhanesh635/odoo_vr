import type { VehicleType } from "@/types/vehicle";

// ─── Filter ────────────────────────────────────────────────────────────────────

export type ReportDateRange = "This Week" | "This Month" | "Quarter" | "Year";
export type ReportRegion = "All" | "North" | "South" | "East" | "West";

export type ReportFiltersState = {
  vehicleType: "All" | VehicleType;
  region: ReportRegion;
  dateRange: ReportDateRange;
};

// ─── Summary KPIs ──────────────────────────────────────────────────────────────

export type AnalyticsSummary = {
  fleetUtilization: number;       // %
  totalOperationalCost: number;   // INR
  avgFuelEfficiency: number;      // km/L
  completedTrips: number;
  avgTripDistance: number;        // km
  vehicleROI: number;             // %
};

// ─── Chart data ────────────────────────────────────────────────────────────────

export type MonthlyUtilizationEntry = {
  month: string;
  utilization: number;            // %
  target: number;                 // %
};

export type FuelEfficiencyEntry = {
  vehicle: string;
  efficiency: number;             // km/L
  benchmark: number;
};

export type ExpenseBreakdownEntry = {
  name: string;
  value: number;
  color: string;
};

export type MonthlyOperationalCostEntry = {
  month: string;
  cost: number;
};

export type VehicleROIEntry = {
  vehicle: string;
  roi: number;                    // %
  revenue: number;
  cost: number;
};

export type TripStatisticsData = {
  total: number;
  completed: number;
  cancelled: number;
  dispatched: number;
  avgCargo: number;               // kg
  avgDistance: number;            // km
};

export type DriverPerformanceRow = {
  id: string;
  name: string;
  completedTrips: number;
  safetyScore: number;
  fuelEfficiency: number;         // km/L
  avgRating: number;              // 1–5
  status: "Available" | "On Trip" | "Off Duty" | "Suspended";
};

export type MaintenanceTrendEntry = {
  month: string;
  jobs: number;
  avgRepairDays: number;
};

// ─── Insights ─────────────────────────────────────────────────────────────────

export type InsightType = "positive" | "warning" | "info" | "negative";

export type InsightCard = {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  icon: "trend-up" | "trend-down" | "warning" | "star" | "wrench" | "license";
};

// ─── Rankings ─────────────────────────────────────────────────────────────────

export type TopVehicleRow = {
  rank: number;
  vehicle: string;
  type: VehicleType;
  trips: number;
  fuelEfficiency: number;
  roi: number;
};

export type ExpensiveVehicleRow = {
  vehicle: string;
  type: VehicleType;
  maintenanceCost: number;
  fuelCost: number;
  operationalCost: number;
};

// ─── Quick stats ──────────────────────────────────────────────────────────────

export type QuickStat = {
  label: string;
  value: string | number;
  icon: "drivers" | "vehicles" | "shop" | "active" | "fuel" | "expense";
  color: "blue" | "green" | "orange" | "amber" | "purple" | "red";
};
