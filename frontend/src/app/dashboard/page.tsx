"use client";

import { ReactNode, useMemo, useState, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  SearchBar,
  Select,
  StatCard,
  Table,
  PageTransition,
  PageSection,
  type TableColumn,
} from "@/components/ui";
import {
  dashboardFilters,
  dashboardStats,
  quickActions,
  recentActivity,
  recentTrips,
  vehicleStatusOverview,
  type DashboardFilterKey,
  type DashboardStat,
  type RecentActivity,
  type RecentTrip,
  type VehicleStatus,
} from "@/constants/dashboard";
import SmartInsights from "@/components/dashboard/SmartInsights";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDashboardKpis, shouldFetchDashboard } from "@/store/slices/dashboardSlice";
import { 
  selectDashboardKpis, 
  selectDashboardLoading, 
  selectDashboardLastFetched 
} from "@/store/selectors/dashboardSelectors";

type DashboardFiltersState = Record<DashboardFilterKey, string>;

const initialFilters: DashboardFiltersState = {
  vehicleType: "All",
  status: "All",
  region: "All",
};

const tripColumns: TableColumn<RecentTrip>[] = [
  { key: "tripId", header: "Trip ID", accessor: "tripId" },
  { key: "vehicle", header: "Vehicle", accessor: "vehicle" },
  { key: "driver", header: "Driver", accessor: "driver" },
  {
    key: "status",
    header: "Status",
    render: (trip) => <Badge status={trip.status} />,
  },
  { key: "distance", header: "Distance", accessor: "distance" },
  { key: "cargo", header: "Cargo", accessor: "cargo" },
];

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFiltersState>(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useAppDispatch();
  const dashboardKpis = useAppSelector(selectDashboardKpis);
  const isLoading = useAppSelector(selectDashboardLoading);
  const lastFetched = useAppSelector(selectDashboardLastFetched);

  // Fetch dashboard KPIs on mount and when cache is stale
  useEffect(() => {
    if (shouldFetchDashboard(lastFetched)) {
      dispatch(fetchDashboardKpis({}));
    }
  }, [dispatch, lastFetched]);

  const filteredTrips = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return recentTrips.filter((trip) => {
      const matchesVehicleType =
        filters.vehicleType === "All" || trip.vehicleType === filters.vehicleType;
      const matchesStatus =
        filters.status === "All" ||
        trip.status === filters.status ||
        (filters.status === "Maintenance" && trip.status === "Pending");
      const matchesRegion = filters.region === "All" || trip.region === filters.region;
      const matchesSearch =
        !query ||
        [trip.tripId, trip.vehicle, trip.driver, trip.cargo, trip.distance]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesVehicleType && matchesStatus && matchesRegion && matchesSearch;
    });
  }, [filters, searchQuery]);

  function updateFilter(key: DashboardFilterKey, value: string) {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  }

  return (
    <PageTransition className="space-y-6">
      <PageSection>
        <header>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-base text-foreground/60">Fleet Overview</p>
        </header>
      </PageSection>

      <PageSection>
        <SmartInsights />
      </PageSection>

      <PageSection>
        <Card bodyClassName="p-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(280px,1.4fr)]">
            {dashboardFilters.map((filter) => (
              <Select
                key={filter.key}
                label={filter.label}
                placeholder={filter.placeholder}
                value={filters[filter.key]}
                options={filter.options}
                onChange={(event) => updateFilter(filter.key, event.target.value)}
              />
            ))}
            <div className="md:col-span-2 xl:col-span-1">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Search
              </label>
              <SearchBar
                placeholder="Search trips or vehicles"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onClear={() => setSearchQuery("")}
              />
            </div>
          </div>
        </Card>
      </PageSection>

      <PageSection>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading && !dashboardKpis ? (
            <div className="col-span-full text-center text-slate-400">Loading dashboard...</div>
          ) : dashboardKpis ? (
            <>
              <StatCard
                title="Active Vehicles"
                value={dashboardKpis.activeVehicles.toString()}
                icon={<DashboardIcon name="truck" />}
                color="blue"
                className="transition duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-black/30"
              />
              <StatCard
                title="Available Vehicles"
                value={dashboardKpis.availableVehicles.toString()}
                icon={<DashboardIcon name="check" />}
                color="green"
                className="transition duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-black/30"
              />
              <StatCard
                title="Maintenance"
                value={dashboardKpis.inMaintenance.toString()}
                icon={<DashboardIcon name="wrench" />}
                color="orange"
                className="transition duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-black/30"
              />
              <StatCard
                title="Active Drivers"
                value={dashboardKpis.driversOnDuty.toString()}
                icon={<DashboardIcon name="users" />}
                color="blue"
                className="transition duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-black/30"
              />
              <StatCard
                title="Active Trips"
                value={dashboardKpis.activeTrips.toString()}
                icon={<DashboardIcon name="clock" />}
                color="amber"
                className="transition duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-black/30"
              />
              <StatCard
                title="Fleet Utilization"
                value={`${dashboardKpis.fleetUtilization}%`}
                icon={<DashboardIcon name="gauge" />}
                color="green"
                className="transition duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-black/30"
              />
            </>
          ) : (
            dashboardStats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={<DashboardIcon name={stat.icon} />}
                color={stat.color}
                className="transition duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-black/30"
              />
            ))
          )}
        </section>
      </PageSection>

      <PageSection>
        <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-6">
            <Card
              title="Recent Trips"
              subtitle="Latest fleet movements and dispatch activity"
              bodyClassName="p-0"
            >
              <Table
                columns={tripColumns}
                data={filteredTrips}
                getRowKey={(trip) => trip.tripId}
                emptyTitle="No trips match your filters"
                emptyDescription="Adjust filters or search terms to view recent trip activity."
                className="rounded-none border-0 bg-transparent"
              />
            </Card>

            <Card title="Vehicle Status Overview" subtitle="Current fleet distribution">
              <div className="space-y-5">
                {vehicleStatusOverview.map((status) => (
                  <VehicleStatusBar key={status.label} status={status} />
                ))}
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card title="Recent Activity" subtitle="Operational timeline">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <ActivityItem
                    key={activity.title}
                    activity={activity}
                    isLast={index === recentActivity.length - 1}
                  />
                ))}
              </div>
            </Card>

            <Card title="Quick Actions" subtitle="Common transport workflows">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    type="button"
                    variant="secondary"
                    className="justify-start border border-slate-800 bg-slate-950/60 hover:border-amber-500/40 hover:bg-slate-800"
                    leftIcon={<PlusIcon />}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </Card>
          </aside>
        </section>
      </PageSection>
    </PageTransition>
  );
}

function VehicleStatusBar({ status }: { status: VehicleStatus }) {
  const totalVehicles = vehicleStatusOverview.reduce(
    (total, item) => total + item.value,
    0,
  );
  const percentage = Math.round((status.value / totalVehicles) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-200">{status.label}</span>
        <span className="text-slate-400">{status.value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className={[
            "h-full rounded-full transition-all duration-500",
            vehicleStatusColorClasses[status.color],
          ].join(" ")}
          style={{ width: `${percentage}%` }}
          aria-label={`${status.label}: ${status.value}`}
        />
      </div>
    </div>
  );
}

function ActivityItem({
  activity,
  isLast,
}: {
  activity: RecentActivity;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-3">
      {!isLast ? (
        <span className="absolute left-5 top-10 h-[calc(100%-1rem)] w-px bg-slate-800" />
      ) : null}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20">
        <ActivityIcon name={activity.icon} />
      </div>
      <div className="pt-2">
        <p className="text-sm font-medium text-slate-200">{activity.title}</p>
      </div>
    </div>
  );
}

const vehicleStatusColorClasses: Record<VehicleStatus["color"], string> = {
  blue: "bg-sky-400",
  green: "bg-emerald-400",
  orange: "bg-orange-400",
  red: "bg-red-400",
};

function DashboardIcon({ name }: { name: DashboardStat["icon"] }) {
  const paths: Record<DashboardStat["icon"], string> = {
    truck: "M4 16V8.5A2.5 2.5 0 0 1 6.5 6h7l3.5 4v6M6 17.5h.01M16 17.5h.01M4 13h16",
    check: "m5 12 4 4L19 6",
    wrench:
      "M14.5 6.5 17 4l3 3-2.5 2.5M14 7l3 3-8.5 8.5a2.1 2.1 0 0 1-3-3L14 7Z",
    users:
      "M16 18a4 4 0 0 0-8 0M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6 5a3 3 0 0 0-2.5-2.95M6 17a3 3 0 0 1 2.5-2.95",
    clock: "M12 7v5l3 2m5-2a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
    gauge: "M4 14a8 8 0 1 1 16 0M12 14l4-4M8 18h8",
  };

  return <Icon path={paths[name]} />;
}

function ActivityIcon({ name }: { name: RecentActivity["icon"] }) {
  const paths: Record<RecentActivity["icon"], string> = {
    vehicle:
      "M4 16V8.5A2.5 2.5 0 0 1 6.5 6h7l3.5 4v6M6 17.5h.01M16 17.5h.01M4 13h16",
    trip: "M6 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.5 13.5l7-7",
    maintenance:
      "M14.5 6.5 17 4l3 3-2.5 2.5M14 7l3 3-8.5 8.5a2.1 2.1 0 0 1-3-3L14 7Z",
    fuel: "M6 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M8 8h6m2-1h2l1 2v8a2 2 0 0 1-2 2h-1",
    driver:
      "M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 8a7 7 0 0 1 14 0",
  };

  return <Icon path={paths[name]} />;
}

function PlusIcon() {
  return <Icon path="M12 5v14M5 12h14" />;
}

function Icon({ path }: { path: string }): ReactNode {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d={path}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
