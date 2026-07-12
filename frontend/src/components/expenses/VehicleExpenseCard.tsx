import type { VehicleExpenseSummary } from "@/types/expense";

type VehicleExpenseCardProps = {
  summary: VehicleExpenseSummary;
};

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const vehicleTypeIcon: Record<string, React.ReactNode> = {
  Truck: (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  Van: (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <rect x="9" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="21" r="1" fill="currentColor" />
      <circle cx="20" cy="21" r="1" fill="currentColor" />
    </svg>
  ),
  "Mini Truck": (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M1 3h13v11H1zM14 7h4l3 3v4h-7V7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="5" cy="17" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
};

export default function VehicleExpenseCard({ summary }: VehicleExpenseCardProps) {
  const efficiencyColor =
    summary.avgFuelEfficiency === null
      ? "text-slate-500"
      : summary.avgFuelEfficiency >= 13
        ? "text-emerald-400"
        : summary.avgFuelEfficiency >= 10
          ? "text-amber-400"
          : "text-red-400";

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm shadow-black/20">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20">
          {vehicleTypeIcon[summary.vehicleType] ?? vehicleTypeIcon["Van"]}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-50">{summary.vehicleName}</h3>
          <p className="text-xs text-slate-500">{summary.vehicleType}</p>
        </div>
      </div>

      {/* Cost breakdown */}
      <dl className="mt-4 space-y-2.5">
        <CostRow
          label="Fuel"
          value={fmt.format(summary.fuelCost)}
          barColor="bg-amber-500"
          fraction={summary.totalCost > 0 ? summary.fuelCost / summary.totalCost : 0}
        />
        <CostRow
          label="Maintenance"
          value={fmt.format(summary.maintenanceCost)}
          barColor="bg-orange-500"
          fraction={summary.totalCost > 0 ? summary.maintenanceCost / summary.totalCost : 0}
        />
        <CostRow
          label="Other"
          value={fmt.format(summary.otherCost)}
          barColor="bg-slate-500"
          fraction={summary.totalCost > 0 ? summary.otherCost / summary.totalCost : 0}
        />
      </dl>

      {/* Total + efficiency */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
        <div>
          <p className="text-xs text-slate-500">Total Cost</p>
          <p className="text-lg font-bold text-slate-50">
            {fmt.format(summary.totalCost)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Avg Efficiency</p>
          <p className={["text-lg font-bold", efficiencyColor].join(" ")}>
            {summary.avgFuelEfficiency !== null
              ? `${summary.avgFuelEfficiency.toFixed(1)} km/L`
              : "—"}
          </p>
        </div>
      </div>
    </article>
  );
}

function CostRow({
  barColor,
  fraction,
  label,
  value,
}: {
  label: string;
  value: string;
  barColor: string;
  fraction: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <dt className="text-slate-400">{label}</dt>
        <dd className="font-semibold text-slate-200">{value}</dd>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={["h-full rounded-full transition-all", barColor].join(" ")}
          style={{ width: `${Math.round(fraction * 100)}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
