"use client";

import { SearchBar, Select } from "@/components/ui";
import {
  tripSortOptions,
  tripStatusOptions,
  tripVehicleTypeOptions,
} from "@/constants/trips";
import type { TripFiltersState, TripSortKey, TripStatus } from "@/types/trip";
import type { VehicleType } from "@/types/vehicle";

type TripFiltersProps = {
  filters: TripFiltersState;
  onChange: <TKey extends keyof TripFiltersState>(
    key: TKey,
    value: TripFiltersState[TKey],
  ) => void;
};

export default function TripFilters({ filters, onChange }: TripFiltersProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(260px,1.4fr)_repeat(3,minmax(160px,1fr))]">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Search
        </label>
        <SearchBar
          placeholder="Search by Trip ID, Vehicle or Driver"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          onClear={() => onChange("search", "")}
        />
      </div>

      <Select
        label="Status"
        value={filters.status}
        options={tripStatusOptions}
        onChange={(event) =>
          onChange("status", event.target.value as "All" | TripStatus)
        }
      />

      <Select
        label="Vehicle Type"
        value={filters.vehicleType}
        options={tripVehicleTypeOptions}
        onChange={(event) =>
          onChange("vehicleType", event.target.value as "All" | VehicleType)
        }
      />

      <Select
        label="Sort By"
        value={filters.sortBy}
        options={tripSortOptions}
        onChange={(event) =>
          onChange("sortBy", event.target.value as TripSortKey)
        }
      />
    </div>
  );
}
