import type {
  MaintenanceFiltersState,
  MaintenancePriority,
  MaintenanceRecord,
  MaintenanceSortKey,
  MaintenanceStatus,
  ServiceType,
} from "@/types/maintenance";
import type { VehicleType } from "@/types/vehicle";

// ─── Filter / Sort Option type ─────────────────────────────────────────────────

export type MaintenanceFilterOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

// ─── Filter Options ────────────────────────────────────────────────────────────

export const maintenanceStatusOptions: MaintenanceFilterOption<
  "All" | MaintenanceStatus
>[] = [
  { label: "All", value: "All" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

export const maintenanceVehicleTypeOptions: MaintenanceFilterOption<
  "All" | VehicleType
>[] = [
  { label: "All", value: "All" },
  { label: "Truck", value: "Truck" },
  { label: "Van", value: "Van" },
  { label: "Mini Truck", value: "Mini Truck" },
];

export const maintenanceServiceTypeOptions: MaintenanceFilterOption<
  "All" | ServiceType
>[] = [
  { label: "All", value: "All" },
  { label: "Oil Change", value: "Oil Change" },
  { label: "Brake Repair", value: "Brake Repair" },
  { label: "Engine Service", value: "Engine Service" },
  { label: "Tyre Replacement", value: "Tyre Replacement" },
  { label: "General Inspection", value: "General Inspection" },
];

export const maintenanceSortOptions: MaintenanceFilterOption<MaintenanceSortKey>[] =
  [
    { label: "Newest", value: "Newest" },
    { label: "Oldest", value: "Oldest" },
    { label: "Highest Cost", value: "Highest Cost" },
  ];

// ─── Form Options ──────────────────────────────────────────────────────────────

export const serviceTypeFormOptions: MaintenanceFilterOption<ServiceType>[] = [
  { label: "Oil Change", value: "Oil Change" },
  { label: "Brake Repair", value: "Brake Repair" },
  { label: "Engine Service", value: "Engine Service" },
  { label: "Tyre Replacement", value: "Tyre Replacement" },
  { label: "General Inspection", value: "General Inspection" },
];

export const priorityFormOptions: MaintenanceFilterOption<MaintenancePriority>[] =
  [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
    { label: "Critical", value: "Critical" },
  ];

// ─── Initial Filters ───────────────────────────────────────────────────────────

export const initialMaintenanceFilters: MaintenanceFiltersState = {
  search: "",
  status: "All",
  vehicleType: "All",
  serviceType: "All",
  sortBy: "Newest",
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: "maint-1",
    maintenanceId: "MT001",
    vehicleId: "vehicle-1",
    vehicleName: "Van-05",
    vehicleType: "Van",
    registrationNumber: "RJ14AB1234",
    serviceType: "Oil Change",
    technician: "Rahul Sharma",
    priority: "Medium",
    description: "Routine oil and filter change. Vehicle due for 10,000 km service.",
    startDate: "2026-07-12",
    expectedCompletion: "2026-07-13",
    completedAt: null,
    cancelledAt: null,
    estimatedCost: 3200,
    actualCost: null,
    serviceNotes: "",
    status: "In Progress",
    createdAt: "2026-07-11T08:00:00.000Z",
    timeline: [
      { type: "scheduled", label: "Maintenance Scheduled", timestamp: "2026-07-11T08:00:00.000Z" },
      { type: "vehicle_received", label: "Vehicle Received", timestamp: "2026-07-12T09:00:00.000Z" },
      { type: "inspection_started", label: "Inspection Started", timestamp: "2026-07-12T09:30:00.000Z" },
      { type: "repair_started", label: "Repair Started", timestamp: "2026-07-12T10:00:00.000Z" },
      { type: "quality_check", label: "Quality Check", timestamp: null },
      { type: "completed", label: "Completed", timestamp: null },
    ],
  },
  {
    id: "maint-2",
    maintenanceId: "MT002",
    vehicleId: "vehicle-2",
    vehicleName: "Truck-01",
    vehicleType: "Truck",
    registrationNumber: "CG04XY5678",
    serviceType: "Brake Repair",
    technician: "Amit Patel",
    priority: "High",
    description: "Front brake pads worn below safe threshold. Rear drums also need inspection.",
    startDate: "2026-07-08",
    expectedCompletion: "2026-07-10",
    completedAt: "2026-07-10T14:30:00.000Z",
    cancelledAt: null,
    estimatedCost: 12500,
    actualCost: 13800,
    serviceNotes: "Rear drums replaced as well. Both axles re-greased.",
    status: "Completed",
    createdAt: "2026-07-07T10:00:00.000Z",
    timeline: [
      { type: "scheduled", label: "Maintenance Scheduled", timestamp: "2026-07-07T10:00:00.000Z" },
      { type: "vehicle_received", label: "Vehicle Received", timestamp: "2026-07-08T08:30:00.000Z" },
      { type: "inspection_started", label: "Inspection Started", timestamp: "2026-07-08T09:00:00.000Z" },
      { type: "repair_started", label: "Repair Started", timestamp: "2026-07-08T10:30:00.000Z" },
      { type: "quality_check", label: "Quality Check", timestamp: "2026-07-10T13:00:00.000Z" },
      { type: "completed", label: "Completed", timestamp: "2026-07-10T14:30:00.000Z" },
    ],
  },
  {
    id: "maint-3",
    maintenanceId: "MT003",
    vehicleId: "vehicle-3",
    vehicleName: "Mini-03",
    vehicleType: "Mini Truck",
    registrationNumber: "MH12AA9012",
    serviceType: "Engine Service",
    technician: "Suresh Kumar",
    priority: "Critical",
    description: "Engine knocking sound reported by driver. Suspected valve wear.",
    startDate: "2026-07-14",
    expectedCompletion: "2026-07-18",
    completedAt: null,
    cancelledAt: null,
    estimatedCost: 28000,
    actualCost: null,
    serviceNotes: "",
    status: "Scheduled",
    createdAt: "2026-07-12T07:00:00.000Z",
    timeline: [
      { type: "scheduled", label: "Maintenance Scheduled", timestamp: "2026-07-12T07:00:00.000Z" },
      { type: "vehicle_received", label: "Vehicle Received", timestamp: null },
      { type: "inspection_started", label: "Inspection Started", timestamp: null },
      { type: "repair_started", label: "Repair Started", timestamp: null },
      { type: "quality_check", label: "Quality Check", timestamp: null },
      { type: "completed", label: "Completed", timestamp: null },
    ],
  },
  {
    id: "maint-4",
    maintenanceId: "MT004",
    vehicleId: "vehicle-1",
    vehicleName: "Van-05",
    vehicleType: "Van",
    registrationNumber: "RJ14AB1234",
    serviceType: "Tyre Replacement",
    technician: "Rahul Sharma",
    priority: "High",
    description: "All four tyres need replacement due to uneven wear.",
    startDate: "2026-06-20",
    expectedCompletion: "2026-06-21",
    completedAt: "2026-06-21T11:00:00.000Z",
    cancelledAt: null,
    estimatedCost: 18000,
    actualCost: 17600,
    serviceNotes: "Used premium MRF tyres. Alignment adjusted.",
    status: "Completed",
    createdAt: "2026-06-19T09:00:00.000Z",
    timeline: [
      { type: "scheduled", label: "Maintenance Scheduled", timestamp: "2026-06-19T09:00:00.000Z" },
      { type: "vehicle_received", label: "Vehicle Received", timestamp: "2026-06-20T08:00:00.000Z" },
      { type: "inspection_started", label: "Inspection Started", timestamp: "2026-06-20T08:30:00.000Z" },
      { type: "repair_started", label: "Repair Started", timestamp: "2026-06-20T09:00:00.000Z" },
      { type: "quality_check", label: "Quality Check", timestamp: "2026-06-21T10:30:00.000Z" },
      { type: "completed", label: "Completed", timestamp: "2026-06-21T11:00:00.000Z" },
    ],
  },
  {
    id: "maint-5",
    maintenanceId: "MT005",
    vehicleId: "vehicle-2",
    vehicleName: "Truck-01",
    vehicleType: "Truck",
    registrationNumber: "CG04XY5678",
    serviceType: "General Inspection",
    technician: "Amit Patel",
    priority: "Low",
    description: "Quarterly fleet inspection as per compliance schedule.",
    startDate: "2026-07-05",
    expectedCompletion: "2026-07-05",
    completedAt: null,
    cancelledAt: "2026-07-04T15:00:00.000Z",
    estimatedCost: 2500,
    actualCost: null,
    serviceNotes: "",
    status: "Cancelled",
    createdAt: "2026-07-03T14:00:00.000Z",
    timeline: [
      { type: "scheduled", label: "Maintenance Scheduled", timestamp: "2026-07-03T14:00:00.000Z" },
      { type: "vehicle_received", label: "Vehicle Received", timestamp: null },
      { type: "inspection_started", label: "Inspection Started", timestamp: null },
      { type: "repair_started", label: "Repair Started", timestamp: null },
      { type: "quality_check", label: "Quality Check", timestamp: null },
      { type: "completed", label: "Completed", timestamp: null },
    ],
  },
  {
    id: "maint-6",
    maintenanceId: "MT006",
    vehicleId: "vehicle-3",
    vehicleName: "Mini-03",
    vehicleType: "Mini Truck",
    registrationNumber: "MH12AA9012",
    serviceType: "Oil Change",
    technician: "Suresh Kumar",
    priority: "Low",
    description: "Routine 5,000 km oil change.",
    startDate: "2026-06-10",
    expectedCompletion: "2026-06-10",
    completedAt: "2026-06-10T13:00:00.000Z",
    cancelledAt: null,
    estimatedCost: 2800,
    actualCost: 2800,
    serviceNotes: "No issues found. Air filter cleaned.",
    status: "Completed",
    createdAt: "2026-06-09T11:00:00.000Z",
    timeline: [
      { type: "scheduled", label: "Maintenance Scheduled", timestamp: "2026-06-09T11:00:00.000Z" },
      { type: "vehicle_received", label: "Vehicle Received", timestamp: "2026-06-10T09:00:00.000Z" },
      { type: "inspection_started", label: "Inspection Started", timestamp: "2026-06-10T09:15:00.000Z" },
      { type: "repair_started", label: "Repair Started", timestamp: "2026-06-10T09:30:00.000Z" },
      { type: "quality_check", label: "Quality Check", timestamp: "2026-06-10T12:45:00.000Z" },
      { type: "completed", label: "Completed", timestamp: "2026-06-10T13:00:00.000Z" },
    ],
  },
];
