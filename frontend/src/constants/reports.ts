import type {
  AnalyticsSummary,
  DriverPerformanceRow,
  ExpensiveVehicleRow,
  ExpenseBreakdownEntry,
  FuelEfficiencyEntry,
  InsightCard,
  MaintenanceTrendEntry,
  MonthlyOperationalCostEntry,
  MonthlyUtilizationEntry,
  QuickStat,
  ReportDateRange,
  ReportFiltersState,
  ReportRegion,
  TopVehicleRow,
  TripStatisticsData,
  VehicleROIEntry,
} from "@/types/report";
import type { VehicleType } from "@/types/vehicle";

// ─── Filter options ────────────────────────────────────────────────────────────

export type ReportFilterOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

export const reportVehicleTypeOptions: ReportFilterOption<"All" | VehicleType>[] =
  [
    { label: "All Types", value: "All" },
    { label: "Truck", value: "Truck" },
    { label: "Van", value: "Van" },
    { label: "Mini Truck", value: "Mini Truck" },
  ];

export const reportRegionOptions: ReportFilterOption<ReportRegion>[] = [
  { label: "All Regions", value: "All" },
  { label: "North", value: "North" },
  { label: "South", value: "South" },
  { label: "East", value: "East" },
  { label: "West", value: "West" },
];

export const reportDateRangeOptions: ReportFilterOption<ReportDateRange>[] = [
  { label: "This Week", value: "This Week" },
  { label: "This Month", value: "This Month" },
  { label: "Quarter", value: "Quarter" },
  { label: "Year", value: "Year" },
];

export const initialReportFilters: ReportFiltersState = {
  vehicleType: "All",
  region: "All",
  dateRange: "This Month",
};

// ─── Summary KPIs ──────────────────────────────────────────────────────────────

export const analyticsSummary: AnalyticsSummary = {
  fleetUtilization: 82,
  totalOperationalCost: 840000,
  avgFuelEfficiency: 13.7,
  completedTrips: 452,
  avgTripDistance: 318,
  vehicleROI: 22,
};

// ─── Fleet utilization chart ───────────────────────────────────────────────────

export const monthlyUtilizationData: MonthlyUtilizationEntry[] = [
  { month: "Jan", utilization: 68, target: 80 },
  { month: "Feb", utilization: 72, target: 80 },
  { month: "Mar", utilization: 75, target: 80 },
  { month: "Apr", utilization: 70, target: 80 },
  { month: "May", utilization: 78, target: 80 },
  { month: "Jun", utilization: 76, target: 80 },
  { month: "Jul", utilization: 82, target: 80 },
];

// ─── Fuel efficiency chart ─────────────────────────────────────────────────────

export const fuelEfficiencyData: FuelEfficiencyEntry[] = [
  { vehicle: "Van-05", efficiency: 13.9, benchmark: 13.0 },
  { vehicle: "Truck-01", efficiency: 9.0, benchmark: 9.5 },
  { vehicle: "Mini-03", efficiency: 13.0, benchmark: 12.5 },
];

// ─── Expense breakdown (pie) ───────────────────────────────────────────────────

export const expenseBreakdownData: ExpenseBreakdownEntry[] = [
  { name: "Fuel", value: 33750, color: "#f59e0b" },
  { name: "Maintenance", value: 34600, color: "#f97316" },
  { name: "Insurance", value: 36500, color: "#a855f7" },
  { name: "Tolls", value: 2130, color: "#38bdf8" },
  { name: "Other", value: 730, color: "#64748b" },
];

// ─── Monthly operational cost (area chart) ────────────────────────────────────

export const monthlyOperationalCostData: MonthlyOperationalCostEntry[] = [
  { month: "Jan", cost: 95000 },
  { month: "Feb", cost: 102000 },
  { month: "Mar", cost: 110000 },
  { month: "Apr", cost: 98000 },
  { month: "May", cost: 115000 },
  { month: "Jun", cost: 121000 },
  { month: "Jul", cost: 127800 },
];

// ─── Vehicle ROI chart ─────────────────────────────────────────────────────────

export const vehicleROIData: VehicleROIEntry[] = [
  { vehicle: "Van-05", roi: 28, revenue: 180000, cost: 140625 },
  { vehicle: "Truck-01", roi: 18, revenue: 320000, cost: 271186 },
  { vehicle: "Mini-03", roi: 20, revenue: 120000, cost: 100000 },
];

// ─── Trip statistics ───────────────────────────────────────────────────────────

export const tripStatisticsData: TripStatisticsData = {
  total: 452,
  completed: 398,
  cancelled: 18,
  dispatched: 36,
  avgCargo: 485,
  avgDistance: 318,
};

// ─── Driver performance table ──────────────────────────────────────────────────

export const driverPerformanceData: DriverPerformanceRow[] = [
  {
    id: "driver-1",
    name: "Alex Johnson",
    completedTrips: 142,
    safetyScore: 96,
    fuelEfficiency: 14.2,
    avgRating: 4.8,
    status: "Available",
  },
  {
    id: "driver-2",
    name: "John Smith",
    completedTrips: 118,
    safetyScore: 88,
    fuelEfficiency: 9.3,
    avgRating: 4.3,
    status: "On Trip",
  },
  {
    id: "driver-3",
    name: "Emma Brown",
    completedTrips: 97,
    safetyScore: 73,
    fuelEfficiency: 13.1,
    avgRating: 3.9,
    status: "Suspended",
  },
  {
    id: "driver-4",
    name: "Rahul Sharma",
    completedTrips: 63,
    safetyScore: 91,
    fuelEfficiency: 13.8,
    avgRating: 4.6,
    status: "Available",
  },
  {
    id: "driver-5",
    name: "Priya Mehta",
    completedTrips: 32,
    safetyScore: 85,
    fuelEfficiency: 12.9,
    avgRating: 4.2,
    status: "Off Duty",
  },
];

// ─── Maintenance trends ────────────────────────────────────────────────────────

export const maintenanceTrendData: MaintenanceTrendEntry[] = [
  { month: "Jan", jobs: 3, avgRepairDays: 1.8 },
  { month: "Feb", jobs: 4, avgRepairDays: 2.1 },
  { month: "Mar", jobs: 2, avgRepairDays: 1.5 },
  { month: "Apr", jobs: 5, avgRepairDays: 2.4 },
  { month: "May", jobs: 3, avgRepairDays: 1.9 },
  { month: "Jun", jobs: 6, avgRepairDays: 2.8 },
  { month: "Jul", jobs: 4, avgRepairDays: 2.2 },
];

// ─── AI Insights ──────────────────────────────────────────────────────────────

export const insightCards: InsightCard[] = [
  {
    id: "insight-1",
    type: "positive",
    title: "Fleet Utilization Up 12%",
    description:
      "Fleet utilization increased by 12% this month, reaching an all-time high of 82%. Strong demand on North corridor routes.",
    icon: "trend-up",
  },
  {
    id: "insight-2",
    type: "positive",
    title: "Fuel Consumption Down 7%",
    description:
      "Fuel consumption decreased by 7% compared to last month. Route optimization and driver training have contributed significantly.",
    icon: "trend-down",
  },
  {
    id: "insight-3",
    type: "positive",
    title: "Van-05 Highest ROI",
    description:
      "Van-05 continues to deliver the best ROI at 28%, driven by efficient short-to-mid-range routes and low maintenance frequency.",
    icon: "star",
  },
  {
    id: "insight-4",
    type: "warning",
    title: "Truck-01 Frequent Maintenance",
    description:
      "Truck-01 has been flagged for maintenance 4 times in 3 months. Consider scheduling a full workshop inspection.",
    icon: "wrench",
  },
  {
    id: "insight-5",
    type: "warning",
    title: "3 Driver Licenses Expiring",
    description:
      "Three driver licenses expire within the next 30 days. Renew them to avoid compliance issues and service disruptions.",
    icon: "license",
  },
  {
    id: "insight-6",
    type: "info",
    title: "Operational Cost Trending Up",
    description:
      "Monthly operational costs have risen 5.6% over the past quarter. Insurance renewals and fuel price changes are key drivers.",
    icon: "trend-up",
  },
];

// ─── Top performing vehicles ──────────────────────────────────────────────────

export const topVehiclesData: TopVehicleRow[] = [
  { rank: 1, vehicle: "Van-05", type: "Van", trips: 186, fuelEfficiency: 13.9, roi: 28 },
  { rank: 2, vehicle: "Mini-03", type: "Mini Truck", trips: 143, fuelEfficiency: 13.0, roi: 20 },
  { rank: 3, vehicle: "Truck-01", type: "Truck", trips: 123, fuelEfficiency: 9.0, roi: 18 },
];

// ─── Most expensive vehicles ──────────────────────────────────────────────────

export const expensiveVehiclesData: ExpensiveVehicleRow[] = [
  {
    vehicle: "Truck-01",
    type: "Truck",
    maintenanceCost: 26300,
    fuelCost: 18250,
    operationalCost: 271186,
  },
  {
    vehicle: "Van-05",
    type: "Van",
    maintenanceCost: 17600,
    fuelCost: 9300,
    operationalCost: 140625,
  },
  {
    vehicle: "Mini-03",
    type: "Mini Truck",
    maintenanceCost: 5600,
    fuelCost: 6200,
    operationalCost: 100000,
  },
];

// ─── Quick statistics ─────────────────────────────────────────────────────────

export const quickStatsData: QuickStat[] = [
  { label: "Total Drivers", value: 5, icon: "drivers", color: "blue" },
  { label: "Available Vehicles", value: 1, icon: "vehicles", color: "green" },
  { label: "Vehicles In Shop", value: 1, icon: "shop", color: "orange" },
  { label: "Active Trips", value: 2, icon: "active", color: "amber" },
  { label: "Fuel Logs", value: 6, icon: "fuel", color: "purple" },
  { label: "Total Expenses", value: 10, icon: "expense", color: "red" },
];
