import { Card } from "@/components/ui";
import { tripStatisticsData } from "@/constants/reports";

export default function TripStatisticsChart() {
  const { total, completed, cancelled, dispatched, avgCargo, avgDistance } =
    tripStatisticsData;

  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const cancelledPct = total > 0 ? Math.round((cancelled / total) * 100) : 0;
  const dispatchedPct = total > 0 ? Math.round((dispatched / total) * 100) : 0;

  return (
    <Card title="Trip Statistics" subtitle="Aggregate trip performance metrics">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile label="Total Trips" value={total} accent="amber" />
        <StatTile
          label="Completed"
          value={`${completed}`}
          sub={`${completedPct}%`}
          accent="green"
        />
        <StatTile
          label="Dispatched"
          value={`${dispatched}`}
          sub={`${dispatchedPct}%`}
          accent="blue"
        />
        <StatTile
          label="Cancelled"
          value={`${cancelled}`}
          sub={`${cancelledPct}%`}
          accent="red"
        />
        <StatTile label="Avg Cargo" value={`${avgCargo} kg`} accent="purple" />
        <StatTile label="Avg Distance" value={`${avgDistance} km`} accent="orange" />
      </div>
    </Card>
  );
}

const accentBg: Record<string, string> = {
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  blue: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  red: "bg-red-500/10 text-red-300 border-red-500/20",
  purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  orange: "bg-orange-500/10 text-orange-300 border-orange-500/20",
};

function StatTile({
  accent,
  label,
  sub,
  value,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div
      className={[
        "flex flex-col rounded-xl border p-4",
        accentBg[accent] ?? accentBg.amber,
      ].join(" ")}
    >
      <p className="text-xs font-medium opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {sub ? (
        <p className="mt-1 text-xs opacity-70">{sub} of total</p>
      ) : null}
    </div>
  );
}
