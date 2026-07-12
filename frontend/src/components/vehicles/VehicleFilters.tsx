"use client";

import { SearchBar, Select } from "@/components/ui";
import {
  vehicleSortOptions,
  vehicleStatusOptions,
  vehicleTypeOptions,
  type VehicleSortKey,
} from "@/constants/vehicles";
import type { VehicleStatus, VehicleType } from "@/types/vehicle";

export type VehicleFiltersState = {
  search: string;
  type: "All" | VehicleType;
  status: "All" | VehicleStatus;
  sortBy: VehicleSortKey;
};

type VehicleFiltersProps = {
  filters: VehicleFiltersState;
  onChange: <TKey extends keyof VehicleFiltersState>(
    key: TKey,
    value: VehicleFiltersState[TKey],
  ) => void;
};

export default function VehicleFilters({
  filters,
  onChange,
}: VehicleFiltersProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(280px,1.4fr)_repeat(3,minmax(170px,1fr))]">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Search
        </label>
        <SearchBar
          placeholder="Search by registration number or vehicle name"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          onClear={() => onChange("search", "")}
        />
      </div>

      <Select
        label="Vehicle Type"
        value={filters.type}
        options={vehicleTypeOptions}
        onChange={(event) =>
          onChange("type", event.target.value as VehicleFiltersState["type"])
        }
      />

      <Select
        label="Status"
        value={filters.status}
        options={vehicleStatusOptions}
        onChange={(event) =>
          onChange("status", event.target.value as VehicleFiltersState["status"])
        }
      />

      <Select
        label="Sort By"
        value={filters.sortBy}
        options={vehicleSortOptions}
        onChange={(event) =>
          onChange("sortBy", event.target.value as VehicleSortKey)
        }
      />
    </div>
  );
}
