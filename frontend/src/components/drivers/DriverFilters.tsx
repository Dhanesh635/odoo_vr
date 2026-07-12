"use client";

import { SearchBar, Select } from "@/components/ui";
import {
  driverSortOptions,
  driverStatusOptions,
  licenseStatusOptions,
  type DriverSortKey,
} from "@/constants/drivers";
import type { DriverStatus, LicenseStatus } from "@/types/driver";

export type DriverFiltersState = {
  search: string;
  status: "All" | DriverStatus;
  licenseStatus: "All" | LicenseStatus;
  sortBy: DriverSortKey;
};

type DriverFiltersProps = {
  filters: DriverFiltersState;
  onChange: <TKey extends keyof DriverFiltersState>(
    key: TKey,
    value: DriverFiltersState[TKey],
  ) => void;
};

export default function DriverFilters({
  filters,
  onChange,
}: DriverFiltersProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(280px,1.4fr)_repeat(3,minmax(170px,1fr))]">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Search
        </label>
        <SearchBar
          placeholder="Search by driver name or license number"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          onClear={() => onChange("search", "")}
        />
      </div>

      <Select
        label="Status"
        value={filters.status}
        options={driverStatusOptions}
        onChange={(event) =>
          onChange("status", event.target.value as DriverFiltersState["status"])
        }
      />

      <Select
        label="License Status"
        value={filters.licenseStatus}
        options={licenseStatusOptions}
        onChange={(event) =>
          onChange(
            "licenseStatus",
            event.target.value as DriverFiltersState["licenseStatus"],
          )
        }
      />

      <Select
        label="Sort By"
        value={filters.sortBy}
        options={driverSortOptions}
        onChange={(event) =>
          onChange("sortBy", event.target.value as DriverSortKey)
        }
      />
    </div>
  );
}
