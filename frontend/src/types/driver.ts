import type { BadgeStatus } from "@/components/ui";

export type DriverStatus = Extract<
  BadgeStatus,
  "Available" | "On Trip" | "Off Duty" | "Suspended"
>;

export type LicenseStatus = "Valid" | "Expiring Soon" | "Expired";
export type LicenseCategory = "HMV" | "LMV";

export type Driver = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiryDate: string;
  licenseStatus: LicenseStatus;
  safetyScore: number;
  status: DriverStatus;
  createdAt: string;
};

export type DriverFormValues = {
  fullName: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory | "";
  licenseExpiryDate: string;
  safetyScore: string;
  status: DriverStatus | "";
};
