import type { Vehicle, VehicleStatus, VehicleType } from "@/types/vehicle";

export type VehicleSortKey =
  | "Newest"
  | "Oldest"
  | "Registration Number"
  | "Vehicle Name"
  | "Capacity";

export type VehicleFilterOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

export const vehicleTypeOptions: VehicleFilterOption<"All" | VehicleType>[] = [
  { label: "All", value: "All" },
  { label: "Truck", value: "Truck" },
  { label: "Van", value: "Van" },
  { label: "Mini Truck", value: "Mini Truck" },
];

export const vehicleStatusOptions: VehicleFilterOption<"All" | VehicleStatus>[] =
  [
    { label: "All", value: "All" },
    { label: "Available", value: "Available" },
    { label: "On Trip", value: "On Trip" },
    { label: "In Shop", value: "In Shop" },
    { label: "Retired", value: "Retired" },
  ];

export const vehicleSortOptions: VehicleFilterOption<VehicleSortKey>[] = [
  { label: "Newest", value: "Newest" },
  { label: "Oldest", value: "Oldest" },
  { label: "Registration Number", value: "Registration Number" },
  { label: "Vehicle Name", value: "Vehicle Name" },
  { label: "Capacity", value: "Capacity" },
];

export const vehicleFormTypeOptions: VehicleFilterOption<VehicleType>[] = [
  { label: "Truck", value: "Truck" },
  { label: "Van", value: "Van" },
  { label: "Mini Truck", value: "Mini Truck" },
];

export const vehicleFormStatusOptions: VehicleFilterOption<VehicleStatus>[] = [
  { label: "Available", value: "Available" },
  { label: "On Trip", value: "On Trip" },
  { label: "In Shop", value: "In Shop" },
  { label: "Retired", value: "Retired" },
];

export const vehicles: Vehicle[] = [
  {
    id: "vehicle-1",
    registrationNumber: "RJ14AB1234",
    vehicleName: "Van-05",
    model: "Transit Cargo VX",
    type: "Van",
    maximumLoadCapacity: 500,
    currentOdometer: 42500,
    acquisitionCost: 1250000,
    status: "Available",
    createdAt: "2026-07-10",
  },
  {
    id: "vehicle-2",
    registrationNumber: "CG04XY5678",
    vehicleName: "Truck-01",
    model: "HaulMax 1500",
    type: "Truck",
    maximumLoadCapacity: 1500,
    currentOdometer: 98000,
    acquisitionCost: 2400000,
    status: "On Trip",
    createdAt: "2026-07-08",
  },
  {
    id: "vehicle-3",
    registrationNumber: "MH12AA9012",
    vehicleName: "Mini-03",
    model: "Urban Mini Load",
    type: "Mini Truck",
    maximumLoadCapacity: 800,
    currentOdometer: 65300,
    acquisitionCost: 1580000,
    status: "In Shop",
    createdAt: "2026-07-06",
  },
];
