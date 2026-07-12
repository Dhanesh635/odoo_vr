import { StatCard } from "@/components/ui";
import type { Expense, FuelLog } from "@/types/expense";

type ExpenseSummaryCardsProps = {
  fuelLogs: FuelLog[];
  expenses: Expense[];
};

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function FuelIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M3 22h12M15 8h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h0v5a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M7 6h4v4H7z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
function WrenchIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}
function CostIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14.5 9.5a2.5 2.5 0 0 0-5 0c0 3 5 3 5 6a2.5 2.5 0 0 1-5 0M12 7v1m0 8v1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
function GaugeIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M12 2a10 10 0 0 1 7.39 16.74" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M4.61 18.74A10 10 0 0 1 12 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="m12 12-3-5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function ExpenseSummaryCards({
  expenses,
  fuelLogs,
}: ExpenseSummaryCardsProps) {
  const totalFuelCost = fuelLogs.reduce((s, f) => s + f.fuelCost, 0);
  const totalMaintenanceCost = expenses
    .filter((e) => e.expenseType === "Maintenance" || e.expenseType === "Repairs")
    .reduce((s, e) => s + e.amount, 0);
  const otherExpenses = expenses
    .filter((e) => e.expenseType !== "Maintenance" && e.expenseType !== "Repairs")
    .reduce((s, e) => s + e.amount, 0);
  const operationalCost = totalFuelCost + totalMaintenanceCost + otherExpenses;

  const avgEfficiency =
    fuelLogs.length > 0
      ? (
          fuelLogs.reduce((s, f) => s + f.fuelEfficiency, 0) / fuelLogs.length
        ).toFixed(1)
      : "—";

  // Monthly spend = this month
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyFuel = fuelLogs
    .filter((f) => f.date.startsWith(thisMonth))
    .reduce((s, f) => s + f.fuelCost, 0);
  const monthlyExp = expenses
    .filter((e) => e.date.startsWith(thisMonth))
    .reduce((s, e) => s + e.amount, 0);
  const monthlyTotal = monthlyFuel + monthlyExp;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard title="Total Fuel Cost" value={fmt.format(totalFuelCost)} icon={<FuelIcon />} color="amber" />
      <StatCard title="Maintenance Cost" value={fmt.format(totalMaintenanceCost)} icon={<WrenchIcon />} color="orange" />
      <StatCard title="Other Expenses" value={fmt.format(otherExpenses)} icon={<TagIcon />} color="purple" />
      <StatCard title="Operational Cost" value={fmt.format(operationalCost)} icon={<CostIcon />} color="red" />
      <StatCard title="Avg Fuel Efficiency" value={avgEfficiency === "—" ? "—" : `${avgEfficiency} km/L`} icon={<GaugeIcon />} color="green" />
      <StatCard title="Monthly Spending" value={fmt.format(monthlyTotal)} icon={<CalendarIcon />} color="blue" />
    </div>
  );
}
