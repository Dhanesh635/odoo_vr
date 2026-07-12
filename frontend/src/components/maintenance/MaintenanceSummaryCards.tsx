import { StatCard } from "@/components/ui";
import type { MaintenanceRecord } from "@/types/maintenance";

type MaintenanceSummaryCardsProps = {
  records: MaintenanceRecord[];
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function WrenchIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ActiveIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7v5l3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="m5 12 5 5L20 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CostIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2v2m0 16v2M6 12H4m16 0h-2m-1.5-6.5-1.41 1.41M7.91 16.09l-1.41 1.41m0-11.01 1.41 1.41M16.09 16.09l1.41 1.41"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TimeIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7v5l3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function calcAvgRepairDays(records: MaintenanceRecord[]): string {
  const completed = records.filter(
    (r) => r.status === "Completed" && r.completedAt,
  );
  if (completed.length === 0) return "—";

  const totalDays =
    completed.reduce((sum, r) => {
      const start = new Date(r.startDate).getTime();
      const end = new Date(r.completedAt!).getTime();
      return sum + (end - start) / (1000 * 60 * 60 * 24);
    }, 0) / completed.length;

  return `${totalDays.toFixed(1)} days`;
}

export default function MaintenanceSummaryCards({
  records,
}: MaintenanceSummaryCardsProps) {
  const total = records.length;
  const active = records.filter(
    (r) => r.status === "In Progress" || r.status === "Scheduled",
  ).length;
  const completed = records.filter((r) => r.status === "Completed").length;
  const inShop = records.filter((r) => r.status === "In Progress").length;

  const totalCost = records.reduce(
    (sum, r) => sum + (r.actualCost ?? r.estimatedCost),
    0,
  );

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Total Jobs"
        value={total}
        icon={<WrenchIcon />}
        color="orange"
      />
      <StatCard
        title="Active Jobs"
        value={active}
        icon={<ActiveIcon />}
        color="yellow"
      />
      <StatCard
        title="Completed"
        value={completed}
        icon={<CheckIcon />}
        color="green"
      />
      <StatCard
        title="Vehicles In Shop"
        value={inShop}
        icon={<TruckIcon />}
        color="amber"
      />
      <StatCard
        title="Total Cost"
        value={currencyFormatter.format(totalCost)}
        icon={<CostIcon />}
        color="purple"
      />
      <StatCard
        title="Avg Repair Time"
        value={calcAvgRepairDays(records)}
        icon={<TimeIcon />}
        color="blue"
      />
    </div>
  );
}
