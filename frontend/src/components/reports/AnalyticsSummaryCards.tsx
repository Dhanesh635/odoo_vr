import { StatCard } from "@/components/ui";
import type { AnalyticsSummary } from "@/types/report";

type Props = { summary: AnalyticsSummary };

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

function GaugeIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M12 2a10 10 0 0 1 7.39 16.74M4.61 18.74A10 10 0 0 1 12 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="m12 12-3-5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
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
function FuelIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 22h12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M7 6h4v4H7z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
function TripIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m5 12 5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
function RouteIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
function ROIIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <polyline points="16 7 22 7 22 13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function AnalyticsSummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard title="Fleet Utilization" value={`${summary.fleetUtilization}%`} icon={<GaugeIcon />} color="amber" />
      <StatCard title="Operational Cost" value={fmt.format(summary.totalOperationalCost)} icon={<CostIcon />} color="red" />
      <StatCard title="Avg Fuel Efficiency" value={`${summary.avgFuelEfficiency} km/L`} icon={<FuelIcon />} color="green" />
      <StatCard title="Completed Trips" value={summary.completedTrips} icon={<TripIcon />} color="blue" />
      <StatCard title="Avg Trip Distance" value={`${summary.avgTripDistance} km`} icon={<RouteIcon />} color="purple" />
      <StatCard title="Vehicle ROI" value={`${summary.vehicleROI}%`} icon={<ROIIcon />} color="emerald" />
    </div>
  );
}
