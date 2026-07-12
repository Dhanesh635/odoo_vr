"use client";

import { Badge, Button, EmptyState, Table, type TableColumn } from "@/components/ui";
import type { Trip, TripStatus } from "@/types/trip";

type TripTableProps = {
  trips: Trip[];
  onCreateTrip: () => void;
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onDispatch: (trip: Trip) => void;
  onComplete: (trip: Trip) => void;
  onCancel: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// Badge only accepts a subset of statuses — map TripStatus → BadgeStatus
function TripBadgeStatus({ status }: { status: TripStatus }) {
  // "Dispatched" isn't in BadgeStatus, render manually
  if (status === "Dispatched") {
    return (
      <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300">
        Dispatched
      </span>
    );
  }
  return <Badge status={status} />;
}

export default function TripTable({
  onCancel,
  onComplete,
  onCreateTrip,
  onDelete,
  onDispatch,
  onEdit,
  onView,
  trips,
}: TripTableProps) {
  const columns: TableColumn<Trip>[] = [
    { key: "tripId", header: "Trip ID", accessor: "tripId" },
    { key: "source", header: "Source", accessor: "source" },
    { key: "destination", header: "Destination", accessor: "destination" },
    { key: "vehicleName", header: "Vehicle", accessor: "vehicleName" },
    { key: "driverName", header: "Driver", accessor: "driverName" },
    {
      key: "cargoWeight",
      header: "Cargo Weight",
      render: (trip) => `${trip.cargoWeight} kg`,
    },
    {
      key: "plannedDistance",
      header: "Distance",
      render: (trip) => `${trip.plannedDistance} km`,
    },
    {
      key: "status",
      header: "Status",
      render: (trip) => <TripBadgeStatus status={trip.status} />,
    },
  ];

  if (trips.length === 0) {
    return (
      <EmptyState
        title="No Trips Yet"
        description="Create your first trip to start dispatching transport operations."
        action={
          <Button onClick={onCreateTrip} leftIcon={<PlusIcon />}>
            Create Trip
          </Button>
        }
      />
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          data={trips}
          getRowKey={(trip) => trip.id}
          actions={(trip) => <TripRowActions trip={trip} onView={onView} onEdit={onEdit} onDispatch={onDispatch} onComplete={onComplete} onCancel={onCancel} onDelete={onDelete} />}
        />
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {trips.map((trip) => (
          <article
            key={trip.id}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-black/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {trip.tripId}
                </p>
                <h2 className="mt-1 text-base font-semibold text-slate-50">
                  {trip.source} → {trip.destination}
                </h2>
              </div>
              <TripBadgeStatus status={trip.status} />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <TripMeta label="Vehicle" value={trip.vehicleName} />
              <TripMeta label="Driver" value={trip.driverName} />
              <TripMeta label="Cargo" value={`${trip.cargoWeight} kg`} />
              <TripMeta label="Distance" value={`${trip.plannedDistance} km`} />
              <TripMeta
                label="Expected Delivery"
                value={dateFormatter.format(new Date(trip.expectedDeliveryDate))}
              />
            </dl>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <TripRowActions
                trip={trip}
                onView={onView}
                onEdit={onEdit}
                onDispatch={onDispatch}
                onComplete={onComplete}
                onCancel={onCancel}
                onDelete={onDelete}
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

// ─── Row Actions ────────────────────────────────────────────────────────────────

type TripRowActionsProps = {
  trip: Trip;
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onDispatch: (trip: Trip) => void;
  onComplete: (trip: Trip) => void;
  onCancel: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
};

function TripRowActions({
  onCancel,
  onComplete,
  onDelete,
  onDispatch,
  onEdit,
  onView,
  trip,
}: TripRowActionsProps) {
  const isDraft = trip.status === "Draft";
  const isDispatched = trip.status === "Dispatched";
  const isTerminal = trip.status === "Completed" || trip.status === "Cancelled";

  return (
    <div className="flex items-center justify-end gap-1.5 flex-wrap">
      <IconButton label="View" onClick={() => onView(trip)}>
        <ViewIcon />
      </IconButton>

      {!isTerminal ? (
        <IconButton label="Edit" onClick={() => onEdit(trip)}>
          <EditIcon />
        </IconButton>
      ) : null}

      {isDraft ? (
        <IconButton label="Dispatch" tone="info" onClick={() => onDispatch(trip)}>
          <DispatchIcon />
        </IconButton>
      ) : null}

      {isDispatched ? (
        <IconButton label="Complete" tone="success" onClick={() => onComplete(trip)}>
          <CompleteIcon />
        </IconButton>
      ) : null}

      {!isTerminal ? (
        <IconButton label="Cancel" tone="warning" onClick={() => onCancel(trip)}>
          <CancelIcon />
        </IconButton>
      ) : null}

      <IconButton label="Delete" tone="danger" onClick={() => onDelete(trip)}>
        <TrashIcon />
      </IconButton>
    </div>
  );
}

// ─── Helper Components ──────────────────────────────────────────────────────────

function TripMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-200">{value}</dd>
    </div>
  );
}

type IconButtonTone = "default" | "danger" | "success" | "info" | "warning";

function IconButton({
  children,
  label,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: IconButtonTone;
}) {
  const toneClasses: Record<IconButtonTone, string> = {
    default:
      "border-slate-700 text-slate-300 hover:border-amber-500/40 hover:bg-slate-800 hover:text-amber-200",
    danger: "border-red-500/20 text-red-300 hover:bg-red-500/10",
    success: "border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/10",
    info: "border-sky-500/20 text-sky-300 hover:bg-sky-500/10",
    warning: "border-orange-500/20 text-orange-300 hover:bg-orange-500/10",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        toneClasses[tone],
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function Icon({ path, paths }: { path?: string; paths?: string[] }) {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {path ? (
        <path
          d={path}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ) : null}
      {paths?.map((p, i) => (
        <path
          key={i}
          d={p}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ))}
    </svg>
  );
}

function ViewIcon() {
  return (
    <Icon paths={["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />
  );
}
function EditIcon() {
  return <Icon paths={["m4 16.5-.5 4 4-.5L18 9.5 14.5 6 4 16.5Z", "M13.5 7 17 10.5"]} />;
}
function TrashIcon() {
  return <Icon paths={["M4 7h16", "M9 7V5h6v2", "m8 10 .8 9h8.4L18 10"]} />;
}
function DispatchIcon() {
  return <Icon path="M5 12h14M12 5l7 7-7 7" />;
}
function CompleteIcon() {
  return <Icon path="m5 12 5 5L20 7" />;
}
function CancelIcon() {
  return <Icon path="m6 6 12 12M18 6 6 18" />;
}
function PlusIcon() {
  return <Icon path="M12 5v14M5 12h14" />;
}
