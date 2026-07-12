import { StatCard } from "@/components/ui";
import type { Trip } from "@/types/trip";

type TripSummaryCardProps = {
  trips: Trip[];
};

function RouteIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12h18M3 6h18M3 18h18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ActiveIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5"
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

function PendingIcon() {
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

function CancelledIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m15 9-6 6M9 9l6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DistanceIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M12 5l7 7-7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function TripSummaryCards({ trips }: TripSummaryCardProps) {
  const total = trips.length;
  const active = trips.filter((t) => t.status === "Dispatched").length;
  const completed = trips.filter((t) => t.status === "Completed").length;
  const pending = trips.filter((t) => t.status === "Draft").length;
  const cancelled = trips.filter((t) => t.status === "Cancelled").length;

  const completedTrips = trips.filter((t) => t.status === "Completed");
  const avgDistance =
    completedTrips.length > 0
      ? Math.round(
          completedTrips.reduce((sum, t) => sum + t.plannedDistance, 0) /
            completedTrips.length,
        )
      : 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Total Trips"
        value={total}
        icon={<RouteIcon />}
        color="amber"
      />
      <StatCard
        title="Active Trips"
        value={active}
        icon={<ActiveIcon />}
        color="blue"
      />
      <StatCard
        title="Completed"
        value={completed}
        icon={<CheckIcon />}
        color="green"
      />
      <StatCard
        title="Pending"
        value={pending}
        icon={<PendingIcon />}
        color="yellow"
      />
      <StatCard
        title="Cancelled"
        value={cancelled}
        icon={<CancelledIcon />}
        color="red"
      />
      <StatCard
        title="Avg. Distance"
        value={avgDistance > 0 ? `${avgDistance} km` : "—"}
        icon={<DistanceIcon />}
        color="purple"
      />
    </div>
  );
}
