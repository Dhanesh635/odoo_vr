"use client";

import { SearchBar, Select } from "@/components/ui";
import {
  dateRangeOptions,
  expenseSortOptions,
  expenseTypeOptions,
} from "@/constants/expenses";
import { vehicles } from "@/constants/vehicles";
import type {
  DateRangeFilter,
  ExpenseFiltersState,
  ExpenseSortKey,
  ExpenseType,
} from "@/types/expense";

type ExpenseFiltersProps = {
  filters: ExpenseFiltersState;
  onChange: <K extends keyof ExpenseFiltersState>(
    key: K,
    value: ExpenseFiltersState[K],
  ) => void;
};

// Build vehicle options dynamically from mock vehicles
const vehicleOptions = [
  { label: "All Vehicles", value: "All" },
  ...vehicles.map((v) => ({ label: v.vehicleName, value: v.id })),
];

export default function ExpenseFilters({
  filters,
  onChange,
}: ExpenseFiltersProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(240px,1.4fr)_repeat(4,minmax(150px,1fr))]">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Search
        </label>
        <SearchBar
          placeholder="Search by vehicle or expense ID"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          onClear={() => onChange("search", "")}
        />
      </div>

      <Select
        label="Vehicle"
        value={filters.vehicleId}
        options={vehicleOptions}
        onChange={(e) => onChange("vehicleId", e.target.value)}
      />

      <Select
        label="Expense Type"
        value={filters.expenseType}
        options={expenseTypeOptions}
        onChange={(e) =>
          onChange("expenseType", e.target.value as "All" | ExpenseType)
        }
      />

      <Select
        label="Date Range"
        value={filters.dateRange}
        options={dateRangeOptions}
        onChange={(e) =>
          onChange("dateRange", e.target.value as DateRangeFilter)
        }
      />

      <Select
        label="Sort By"
        value={filters.sortBy}
        options={expenseSortOptions}
        onChange={(e) =>
          onChange("sortBy", e.target.value as ExpenseSortKey)
        }
      />
    </div>
  );
}
