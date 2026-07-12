import { Card, Table, type TableColumn } from "@/components/ui";
import { driverPerformanceData } from "@/constants/reports";
import type { DriverPerformanceRow } from "@/types/report";

const statusColors: Record<DriverPerformanceRow["status"], string> = {
  Available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "On Trip": "border-sky-500/30 bg-sky-500/10 text-sky-300",
  "Off Duty": "border-slate-500/30 bg-slate-500/10 text-slate-300",
  Suspended: "border-red-500/30 bg-red-500/10 text-red-300",
};

function SafetyBar({ value }: { value: number }) {
  const color = value >= 90 ? "bg-emerald-400" : value >= 75 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
        <div className={["h-full rounded-full", color].join(" ")} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-slate-300">{value}</span>
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-amber-400">★</span>
      <span className="text-sm text-slate-200">{value.toFixed(1)}</span>
    </div>
  );
}

export default function DriverPerformanceTable() {
  const columns: TableColumn<DriverPerformanceRow>[] = [
    { key: "name", header: "Driver", accessor: "name" },
    { key: "completedTrips", header: "Completed Trips", render: (r) => <span className="font-semibold text-slate-100">{r.completedTrips}</span> },
    { key: "safetyScore", header: "Safety Score", render: (r) => <SafetyBar value={r.safetyScore} /> },
    { key: "fuelEfficiency", header: "Fuel Efficiency", render: (r) => `${r.fuelEfficiency} km/L` },
    { key: "avgRating", header: "Avg Rating", render: (r) => <StarRating value={r.avgRating} /> },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <span className={["inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", statusColors[r.status]].join(" ")}>
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <Card title="Driver Performance" subtitle="Completed trips, safety scores and ratings">
      <div className="-mx-5 -mb-5">
        <Table
          columns={columns}
          data={driverPerformanceData}
          getRowKey={(r) => r.id}
          className="rounded-none border-0"
        />
      </div>
    </Card>
  );
}
