import type { BadgeStatus, StatCardColor } from "@/components/ui";

export type FilterOption = {
  label: string;
  value: string;
};

export type DashboardFilterKey = "vehicleType" | "status" | "region";

export type DashboardFilter = {
  key: DashboardFilterKey;
  label: string;
  placeholder: string;
  options: FilterOption[];
};

export type DashboardStat = {
  title: string;
  value: string;
  icon: "truck" | "check" | "wrench" | "users" | "clock" | "gauge";
  color: StatCardColor;
};

export type RecentTrip = {
  tripId: string;
  vehicle: string;
  driver: string;
  status: BadgeStatus;
  distance: string;
  cargo: string;
  vehicleType: "Truck" | "Van" | "Mini Truck";
  region: "North" | "South" | "East" | "West";
};

export type VehicleStatus = {
  label: string;
  value: number;
  color: "green" | "blue" | "orange" | "red";
};

export type RecentActivity = {
  title: string;
  icon: "vehicle" | "trip" | "maintenance" | "fuel" | "driver";
};

export type QuickAction = {
  label: string;
};

export const dashboardFilters: DashboardFilter[] = [
  {
    key: "vehicleType",
    label: "Vehicle Type",
    placeholder: "Vehicle Type",
    options: [
      { label: "All", value: "All" },
      { label: "Truck", value: "Truck" },
      { label: "Van", value: "Van" },
      { label: "Mini Truck", value: "Mini Truck" },
    ],
  },
  {
    key: "status",
    label: "Status",
    placeholder: "Status",
    options: [
      { label: "All", value: "All" },
      { label: "Available", value: "Available" },
      { label: "On Trip", value: "On Trip" },
      { label: "Maintenance", value: "Maintenance" },
    ],
  },
  {
    key: "region",
    label: "Region",
    placeholder: "Region",
    options: [
      { label: "All", value: "All" },
      { label: "North", value: "North" },
      { label: "South", value: "South" },
      { label: "East", value: "East" },
      { label: "West", value: "West" },
    ],
  },
];

export const dashboardStats: DashboardStat[] = [
  {
    title: "Active Vehicles",
    value: "53",
    icon: "truck",
    color: "blue",
  },
  {
    title: "Available Vehicles",
    value: "42",
    icon: "check",
    color: "green",
  },
  {
    title: "Vehicles In Maintenance",
    value: "5",
    icon: "wrench",
    color: "orange",
  },
  {
    title: "Drivers On Duty",
    value: "18",
    icon: "users",
    color: "purple",
  },
  {
    title: "Pending Trips",
    value: "4",
    icon: "clock",
    color: "yellow",
  },
  {
    title: "Fleet Utilization",
    value: "81%",
    icon: "gauge",
    color: "emerald",
  },
];

export const recentTrips: RecentTrip[] = [
  {
    tripId: "TR001",
    vehicle: "Van-05",
    driver: "Alex",
    status: "Completed",
    distance: "120 km",
    cargo: "450 kg",
    vehicleType: "Van",
    region: "North",
  },
  {
    tripId: "TR002",
    vehicle: "Truck-01",
    driver: "John",
    status: "On Trip",
    distance: "340 km",
    cargo: "800 kg",
    vehicleType: "Truck",
    region: "West",
  },
  {
    tripId: "TR003",
    vehicle: "Mini-03",
    driver: "Emma",
    status: "Pending",
    distance: "70 km",
    cargo: "150 kg",
    vehicleType: "Mini Truck",
    region: "East",
  },
];

export const vehicleStatusOverview: VehicleStatus[] = [
  { label: "Available", value: 42, color: "green" },
  { label: "On Trip", value: 18, color: "blue" },
  { label: "Maintenance", value: 5, color: "orange" },
  { label: "Retired", value: 2, color: "red" },
];

export const recentActivity: RecentActivity[] = [
  { title: "Vehicle TR005 assigned", icon: "vehicle" },
  { title: "Trip TR003 dispatched", icon: "trip" },
  { title: "Maintenance completed", icon: "maintenance" },
  { title: "Fuel log added", icon: "fuel" },
  { title: "Driver license verified", icon: "driver" },
];

export const quickActions: QuickAction[] = [
  { label: "Add Vehicle" },
  { label: "Register Driver" },
  { label: "Create Trip" },
  { label: "Maintenance Log" },
  { label: "Fuel Entry" },
];
