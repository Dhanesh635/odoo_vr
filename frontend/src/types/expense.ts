import type { VehicleType } from "@/types/vehicle";

// ─── Unions ────────────────────────────────────────────────────────────────────

export type ExpenseType =
  | "Fuel"
  | "Maintenance"
  | "Toll"
  | "Parking"
  | "Insurance"
  | "Repairs"
  | "Other";

export type DateRangeFilter =
  | "All"
  | "This Week"
  | "This Month"
  | "Last 3 Months";

export type ExpenseSortKey = "Newest" | "Oldest" | "Highest Cost";

// ─── Fuel Log ──────────────────────────────────────────────────────────────────

export type FuelLog = {
  id: string;
  fuelLogId: string;          // e.g. "FL001"
  vehicleId: string;
  vehicleName: string;
  vehicleType: VehicleType;
  date: string;               // ISO date
  fuelQuantity: number;       // litres
  fuelCost: number;           // INR
  distanceCovered: number;    // km
  fuelEfficiency: number;     // km/L  (computed on save)
  fuelStation: string;
  remarks: string;
  createdAt: string;
};

// ─── Expense ───────────────────────────────────────────────────────────────────

export type Expense = {
  id: string;
  expenseId: string;          // e.g. "EX001"
  vehicleId: string;
  vehicleName: string;
  vehicleType: VehicleType;
  expenseType: ExpenseType;
  amount: number;             // INR
  date: string;               // ISO date
  description: string;
  createdAt: string;
};

// ─── Form Values ───────────────────────────────────────────────────────────────

export type FuelLogFormValues = {
  vehicleId: string;
  date: string;
  fuelQuantity: string;
  fuelCost: string;
  distanceCovered: string;
  fuelStation: string;
  remarks: string;
};

export type ExpenseFormValues = {
  vehicleId: string;
  expenseType: ExpenseType | "";
  amount: string;
  date: string;
  description: string;
};

// ─── Vehicle Summary ───────────────────────────────────────────────────────────

export type VehicleExpenseSummary = {
  vehicleId: string;
  vehicleName: string;
  vehicleType: VehicleType;
  fuelCost: number;
  maintenanceCost: number;
  otherCost: number;
  totalCost: number;
  avgFuelEfficiency: number | null;
};

// ─── Filters ───────────────────────────────────────────────────────────────────

export type ExpenseFiltersState = {
  search: string;
  vehicleId: "All" | string;
  expenseType: "All" | ExpenseType;
  dateRange: DateRangeFilter;
  sortBy: ExpenseSortKey;
};

// ─── Chart Data ────────────────────────────────────────────────────────────────

export type PieChartEntry = {
  name: string;
  value: number;
  color: string;
};

export type BarChartEntry = {
  month: string;
  Fuel: number;
  Maintenance: number;
  Other: number;
};
