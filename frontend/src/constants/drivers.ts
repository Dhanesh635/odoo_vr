import type {
  Driver,
  DriverStatus,
  LicenseCategory,
  LicenseStatus,
} from "@/types/driver";

export type DriverSortKey = "Newest" | "Oldest" | "Driver Name" | "Safety Score";

export type DriverFilterOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

export const driverStatusOptions: DriverFilterOption<"All" | DriverStatus>[] = [
  { label: "All", value: "All" },
  { label: "Available", value: "Available" },
  { label: "On Trip", value: "On Trip" },
  { label: "Off Duty", value: "Off Duty" },
  { label: "Suspended", value: "Suspended" },
];

export const licenseStatusOptions: DriverFilterOption<"All" | LicenseStatus>[] =
  [
    { label: "All", value: "All" },
    { label: "Valid", value: "Valid" },
    { label: "Expiring Soon", value: "Expiring Soon" },
    { label: "Expired", value: "Expired" },
  ];

export const driverSortOptions: DriverFilterOption<DriverSortKey>[] = [
  { label: "Newest", value: "Newest" },
  { label: "Oldest", value: "Oldest" },
  { label: "Driver Name", value: "Driver Name" },
  { label: "Safety Score", value: "Safety Score" },
];

export const licenseCategoryOptions: DriverFilterOption<LicenseCategory>[] = [
  { label: "HMV", value: "HMV" },
  { label: "LMV", value: "LMV" },
];

export const driverFormStatusOptions: DriverFilterOption<DriverStatus>[] = [
  { label: "Available", value: "Available" },
  { label: "On Trip", value: "On Trip" },
  { label: "Off Duty", value: "Off Duty" },
  { label: "Suspended", value: "Suspended" },
];

export const drivers: Driver[] = [
  {
    id: "driver-1",
    fullName: "Alex Johnson",
    phoneNumber: "9876543210",
    email: "alex.johnson@transitops.local",
    licenseNumber: "DL123456789",
    licenseCategory: "HMV",
    licenseExpiryDate: "2028-08-15",
    licenseStatus: "Valid",
    safetyScore: 96,
    status: "Available",
    createdAt: "2026-07-10",
  },
  {
    id: "driver-2",
    fullName: "John Smith",
    phoneNumber: "9123456780",
    email: "john.smith@transitops.local",
    licenseNumber: "DL876543210",
    licenseCategory: "LMV",
    licenseExpiryDate: "2027-12-10",
    licenseStatus: "Valid",
    safetyScore: 88,
    status: "On Trip",
    createdAt: "2026-07-08",
  },
  {
    id: "driver-3",
    fullName: "Emma Brown",
    phoneNumber: "9988776655",
    email: "emma.brown@transitops.local",
    licenseNumber: "DL998877665",
    licenseCategory: "HMV",
    licenseExpiryDate: "2025-03-02",
    licenseStatus: "Expired",
    safetyScore: 73,
    status: "Suspended",
    createdAt: "2026-07-06",
  },
];
