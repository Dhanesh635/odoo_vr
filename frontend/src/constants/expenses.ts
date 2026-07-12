import type {
  DateRangeFilter,
  Expense,
  ExpenseFiltersState,
  ExpenseSortKey,
  ExpenseType,
  FuelLog,
} from "@/types/expense";
import type { VehicleType } from "@/types/vehicle";

// ─── Option helpers ────────────────────────────────────────────────────────────

export type ExpenseFilterOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

// ─── Filter Options ────────────────────────────────────────────────────────────

export const expenseTypeOptions: ExpenseFilterOption<"All" | ExpenseType>[] = [
  { label: "All Types", value: "All" },
  { label: "Fuel", value: "Fuel" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Toll", value: "Toll" },
  { label: "Parking", value: "Parking" },
  { label: "Insurance", value: "Insurance" },
  { label: "Repairs", value: "Repairs" },
  { label: "Other", value: "Other" },
];

export const expenseTypeFormOptions: ExpenseFilterOption<ExpenseType>[] = [
  { label: "Fuel", value: "Fuel" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Toll", value: "Toll" },
  { label: "Parking", value: "Parking" },
  { label: "Insurance", value: "Insurance" },
  { label: "Repairs", value: "Repairs" },
  { label: "Other", value: "Other" },
];

export const dateRangeOptions: ExpenseFilterOption<DateRangeFilter>[] = [
  { label: "All Time", value: "All" },
  { label: "This Week", value: "This Week" },
  { label: "This Month", value: "This Month" },
  { label: "Last 3 Months", value: "Last 3 Months" },
];

export const expenseSortOptions: ExpenseFilterOption<ExpenseSortKey>[] = [
  { label: "Newest", value: "Newest" },
  { label: "Oldest", value: "Oldest" },
  { label: "Highest Cost", value: "Highest Cost" },
];

export const vehicleTypeOptions: ExpenseFilterOption<"All" | VehicleType>[] = [
  { label: "All", value: "All" },
  { label: "Truck", value: "Truck" },
  { label: "Van", value: "Van" },
  { label: "Mini Truck", value: "Mini Truck" },
];

// ─── Initial Filters ───────────────────────────────────────────────────────────

export const initialExpenseFilters: ExpenseFiltersState = {
  search: "",
  vehicleId: "All",
  expenseType: "All",
  dateRange: "All",
  sortBy: "Newest",
};

// ─── Mock Fuel Logs ────────────────────────────────────────────────────────────

export const mockFuelLogs: FuelLog[] = [
  {
    id: "fuel-1",
    fuelLogId: "FL001",
    vehicleId: "vehicle-1",
    vehicleName: "Van-05",
    vehicleType: "Van",
    date: "2026-07-12",
    fuelQuantity: 45,
    fuelCost: 4800,
    distanceCovered: 620,
    fuelEfficiency: 13.8,
    fuelStation: "HP Petrol Pump, Raipur",
    remarks: "Full tank refill before Nagpur trip.",
    createdAt: "2026-07-12T08:00:00.000Z",
  },
  {
    id: "fuel-2",
    fuelLogId: "FL002",
    vehicleId: "vehicle-2",
    vehicleName: "Truck-01",
    vehicleType: "Truck",
    date: "2026-07-11",
    fuelQuantity: 80,
    fuelCost: 8600,
    distanceCovered: 720,
    fuelEfficiency: 9.0,
    fuelStation: "Indian Oil, Bilaspur Highway",
    remarks: "",
    createdAt: "2026-07-11T07:30:00.000Z",
  },
  {
    id: "fuel-3",
    fuelLogId: "FL003",
    vehicleId: "vehicle-3",
    vehicleName: "Mini-03",
    vehicleType: "Mini Truck",
    date: "2026-07-10",
    fuelQuantity: 30,
    fuelCost: 3200,
    distanceCovered: 390,
    fuelEfficiency: 13.0,
    fuelStation: "BPCL, Durg Road",
    remarks: "Partial fill.",
    createdAt: "2026-07-10T09:00:00.000Z",
  },
  {
    id: "fuel-4",
    fuelLogId: "FL004",
    vehicleId: "vehicle-1",
    vehicleName: "Van-05",
    vehicleType: "Van",
    date: "2026-07-05",
    fuelQuantity: 42,
    fuelCost: 4500,
    distanceCovered: 588,
    fuelEfficiency: 14.0,
    fuelStation: "HP Petrol Pump, Raipur",
    remarks: "",
    createdAt: "2026-07-05T10:00:00.000Z",
  },
  {
    id: "fuel-5",
    fuelLogId: "FL005",
    vehicleId: "vehicle-2",
    vehicleName: "Truck-01",
    vehicleType: "Truck",
    date: "2026-06-28",
    fuelQuantity: 90,
    fuelCost: 9650,
    distanceCovered: 810,
    fuelEfficiency: 9.0,
    fuelStation: "Essar Fuel, Indore Road",
    remarks: "Return trip Indore–Bhopal.",
    createdAt: "2026-06-28T06:30:00.000Z",
  },
  {
    id: "fuel-6",
    fuelLogId: "FL006",
    vehicleId: "vehicle-3",
    vehicleName: "Mini-03",
    vehicleType: "Mini Truck",
    date: "2026-06-20",
    fuelQuantity: 28,
    fuelCost: 3000,
    distanceCovered: 364,
    fuelEfficiency: 13.0,
    fuelStation: "BPCL, Durg Road",
    remarks: "",
    createdAt: "2026-06-20T08:00:00.000Z",
  },
];

// ─── Mock Expenses ─────────────────────────────────────────────────────────────

export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    expenseId: "EX001",
    vehicleId: "vehicle-1",
    vehicleName: "Van-05",
    vehicleType: "Van",
    expenseType: "Toll",
    amount: 650,
    date: "2026-07-12",
    description: "Raipur–Nagpur expressway toll.",
    createdAt: "2026-07-12T08:30:00.000Z",
  },
  {
    id: "exp-2",
    expenseId: "EX002",
    vehicleId: "vehicle-2",
    vehicleName: "Truck-01",
    vehicleType: "Truck",
    expenseType: "Insurance",
    amount: 22000,
    date: "2026-07-01",
    description: "Annual comprehensive insurance renewal.",
    createdAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "exp-3",
    expenseId: "EX003",
    vehicleId: "vehicle-3",
    vehicleName: "Mini-03",
    vehicleType: "Mini Truck",
    expenseType: "Maintenance",
    amount: 2800,
    date: "2026-06-10",
    description: "Oil change and air filter replacement.",
    createdAt: "2026-06-10T13:00:00.000Z",
  },
  {
    id: "exp-4",
    expenseId: "EX004",
    vehicleId: "vehicle-1",
    vehicleName: "Van-05",
    vehicleType: "Van",
    expenseType: "Parking",
    amount: 200,
    date: "2026-07-11",
    description: "Overnight parking at Nagpur warehouse.",
    createdAt: "2026-07-11T20:00:00.000Z",
  },
  {
    id: "exp-5",
    expenseId: "EX005",
    vehicleId: "vehicle-2",
    vehicleName: "Truck-01",
    vehicleType: "Truck",
    expenseType: "Repairs",
    amount: 13800,
    date: "2026-07-10",
    description: "Brake pad and drum replacement (MT002).",
    createdAt: "2026-07-10T14:30:00.000Z",
  },
  {
    id: "exp-6",
    expenseId: "EX006",
    vehicleId: "vehicle-1",
    vehicleName: "Van-05",
    vehicleType: "Van",
    expenseType: "Maintenance",
    amount: 17600,
    date: "2026-06-21",
    description: "Tyre replacement — all four wheels (MT004).",
    createdAt: "2026-06-21T11:00:00.000Z",
  },
  {
    id: "exp-7",
    expenseId: "EX007",
    vehicleId: "vehicle-3",
    vehicleName: "Mini-03",
    vehicleType: "Mini Truck",
    expenseType: "Toll",
    amount: 280,
    date: "2026-07-10",
    description: "Raipur city bypass toll.",
    createdAt: "2026-07-10T09:30:00.000Z",
  },
  {
    id: "exp-8",
    expenseId: "EX008",
    vehicleId: "vehicle-2",
    vehicleName: "Truck-01",
    vehicleType: "Truck",
    expenseType: "Toll",
    amount: 1200,
    date: "2026-07-11",
    description: "NH-44 tolls — Bhopal to Indore.",
    createdAt: "2026-07-11T07:45:00.000Z",
  },
  {
    id: "exp-9",
    expenseId: "EX009",
    vehicleId: "vehicle-1",
    vehicleName: "Van-05",
    vehicleType: "Van",
    expenseType: "Insurance",
    amount: 14500,
    date: "2026-06-01",
    description: "Annual insurance renewal — Van-05.",
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "exp-10",
    expenseId: "EX010",
    vehicleId: "vehicle-3",
    vehicleName: "Mini-03",
    vehicleType: "Mini Truck",
    expenseType: "Other",
    amount: 450,
    date: "2026-07-09",
    description: "Driver meal allowance — Durg run.",
    createdAt: "2026-07-09T14:00:00.000Z",
  },
];

// ─── Monthly bar chart static data ────────────────────────────────────────────

export const monthlyExpenseData = [
  { month: "Feb", Fuel: 18000, Maintenance: 5000, Other: 2000 },
  { month: "Mar", Fuel: 22000, Maintenance: 8000, Other: 3500 },
  { month: "Apr", Fuel: 19500, Maintenance: 12000, Other: 1800 },
  { month: "May", Fuel: 24000, Maintenance: 3000, Other: 4200 },
  { month: "Jun", Fuel: 21000, Maintenance: 20400, Other: 2300 },
  { month: "Jul", Fuel: 30750, Maintenance: 16400, Other: 16780 },
];
