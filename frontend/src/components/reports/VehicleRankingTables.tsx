import { Card, Table, type TableColumn } from "@/components/ui";
import {
  expensiveVehiclesData,
  topVehiclesData,
} from "@/constants/reports";
import type { ExpensiveVehicleRow, TopVehicleRow } from "@/types/report";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// ─── Top Performing Vehicles ──────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  const colors = ["text-amber-400", "text-slate-300", "text-orange-500"];
  const labels = ["🥇", "🥈", "🥉"];
  return (
    <span className={["text-base font-bold", colors[rank - 1] ?? "text-slate-400"].join(" ")}>
      {labels[rank - 1] ?? rank}
    </span>
  );
}

function EfficiencyChip({ value }: { value: number }) {
  const color = value >= 13 ? "text-emerald-300" : value >= 10 ? "text-amber-300" : "text-red-300";
  return <span className={["text-sm font-semibold", color].join(" ")}>{value} km/L</span>;
}

export function TopPerformingVehicles() {
  const cols: TableColumn<TopVehicleRow>[] = [
    { key: "rank", header: "Rank", render: (r) => <RankBadge rank={r.rank} /> },
    { key: "vehicle", header: "Vehicle", render: (r) => <span className="font-semibold text-slate-100">{r.vehicle}</span> },
    { key: "type", header: "Type", accessor: "type" },
    { key: "trips", header: "Trips", render: (r) => <span className="font-semibold text-slate-100">{r.trips}</span> },
    { key: "fuelEfficiency", header: "Fuel Efficiency", render: (r) => <EfficiencyChip value={r.fuelEfficiency} /> },
    {
      key: "roi",
      header: "ROI",
      render: (r) => (
        <span className="font-bold text-emerald-400">{r.roi}%</span>
      ),
    },
  ];

  return (
    <Card title="Top Performing Vehicles" subtitle="Ranked by ROI, trips and efficiency">
      <div className="-mx-5 -mb-5">
        <Table columns={cols} data={topVehiclesData} getRowKey={(r) => r.vehicle} className="rounded-none border-0" />
      </div>
    </Card>
  );
}

// ─── Most Expensive Vehicles ──────────────────────────────────────────────────

export function MostExpensiveVehicles() {
  const cols: TableColumn<ExpensiveVehicleRow>[] = [
    { key: "vehicle", header: "Vehicle", render: (r) => <span className="font-semibold text-slate-100">{r.vehicle}</span> },
    { key: "type", header: "Type", accessor: "type" },
    {
      key: "maintenanceCost",
      header: "Maintenance",
      render: (r) => <span className="text-orange-300">{fmt.format(r.maintenanceCost)}</span>,
    },
    {
      key: "fuelCost",
      header: "Fuel",
      render: (r) => <span className="text-amber-300">{fmt.format(r.fuelCost)}</span>,
    },
    {
      key: "operationalCost",
      header: "Operational",
      render: (r) => <span className="font-bold text-red-300">{fmt.format(r.operationalCost)}</span>,
    },
  ];

  return (
    <Card title="Most Expensive Vehicles" subtitle="Total operational cost breakdown">
      <div className="-mx-5 -mb-5">
        <Table columns={cols} data={expensiveVehiclesData} getRowKey={(r) => r.vehicle} className="rounded-none border-0" />
      </div>
    </Card>
  );
}
