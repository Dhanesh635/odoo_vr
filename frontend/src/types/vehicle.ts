import type { BadgeStatus } from "@/components/ui";

export type VehicleType = "Truck" | "Van" | "Mini Truck";
export type VehicleStatus = Extract<
  BadgeStatus,
  "Available" | "On Trip" | "In Shop" | "Retired"
>;

export type Vehicle = {
  id: string;
  registrationNumber: string;
  vehicleName: string;
  model: string;
  type: VehicleType;
  maximumLoadCapacity: number;
  currentOdometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  createdAt: string;
};

export type VehicleFormValues = {
  registrationNumber: string;
  vehicleName: string;
  type: VehicleType | "";
  maximumLoadCapacity: string;
  currentOdometer: string;
  acquisitionCost: string;
  status: VehicleStatus | "";
};
