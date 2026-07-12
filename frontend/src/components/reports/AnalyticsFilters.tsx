"use client";

import { Select } from "@/components/ui";
import {
  reportDateRangeOptions,
  reportRegionOptions,
  reportVehicleTypeOptions,
} from "@/constants/reports";
import type {
  ReportDateRange,
  ReportFiltersState,
  ReportRegion,
} from "@/types/report";
import type { VehicleType } from "@/types/vehicle";

type AnalyticsFiltersProps = {
  filters: ReportFiltersState;
  onChange: <K extends keyof ReportFiltersState>(
    key: K,
    value: ReportFiltersState[K],
  ) => void;
};

export default function AnalyticsFilters({
  filters,
  onChange,
}: AnalyticsFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="min-w-[160px]">
        <Select
          label="Vehicle Type"
          value={filters.vehicleType}
          options={reportVehicleTypeOptions}
          onChange={(e) =>
            onChange("vehicleType", e.target.value as "All" | VehicleType)
          }
        />
      </div>
      <div className="min-w-[160px]">
        <Select
          label="Region"
          value={filters.region}
          options={reportRegionOptions}
          onChange={(e) =>
            onChange("region", e.target.value as ReportRegion)
          }
        />
      </div>
      <div className="min-w-[160px]">
        <Select
          label="Date Range"
          value={filters.dateRange}
          options={reportDateRangeOptions}
          onChange={(e) =>
            onChange("dateRange", e.target.value as ReportDateRange)
          }
        />
      </div>
      <p className="pb-1 text-xs text-slate-500">
        Charts update based on selected filters.
      </p>
    </div>
  );
}
