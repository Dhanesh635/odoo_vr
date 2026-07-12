"use client";

import { SearchBar, Select } from "@/components/ui";
import {
  maintenanceServiceTypeOptions,
  maintenanceSortOptions,
  maintenanceStatusOptions,
  maintenanceVehicleTypeOptions,
} from "@/constants/maintenance";
import type {
  MaintenanceFiltersState,
  MaintenanceSortKey,
  MaintenanceStatus,
  ServiceType,
} from "@/types/maintenance";
import type { VehicleType } from "@/types/vehicle";

type MaintenanceFiltersProps = {
  filters: MaintenanceFiltersState;
  onChange: <TKey extends keyof MaintenanceFiltersState>(
    key: TKey,
    value: MaintenanceFiltersState[TKey],
  ) => void;
};

export default function MaintenanceFilters({
  filters,
  onChange,
}: MaintenanceFiltersProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(240px,1.4fr)_repeat(4,minmax(150px,1fr))]">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Search
        </label>
        <SearchBar
          placeholder="Search by vehicle or maintenance ID"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          onClear={() => onChange("search", "")}
        />
      </div>

      <Select
        label="Status"
        value={filters.status}
        options={maintenanceStatusOptions}
        onChange={(e) =>
          onChange("status", e.target.value as "All" | MaintenanceStatus)
        }
      />

      <Select
        label="Vehicle Type"
        value={filters.vehicleType}
        options={maintenanceVehicleTypeOptions}
        onChange={(e) =>
          onChange("vehicleType", e.target.value as "All" | VehicleType)
        }
      />

      <Select
        label="Service Type"
        value={filters.serviceType}
        options={maintenanceServiceTypeOptions}
        onChange={(e) =>
          onChange("serviceType", e.target.value as "All" | ServiceType)
        }
      />

      <Select
        label="Sort By"
        value={filters.sortBy}
        options={maintenanceSortOptions}
        onChange={(e) =>
          onChange("sortBy", e.target.value as MaintenanceSortKey)
        }
      />
    </div>
  );
}
