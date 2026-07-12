"use client";

import { Button, EmptyState, Table, type TableColumn } from "@/components/ui";
import type { FuelLog } from "@/types/expense";

type FuelLogTableProps = {
  logs: FuelLog[];
  onAdd: () => void;
  onView: (log: FuelLog) => void;
  onDelete: (log: FuelLog) => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function FuelLogTable({
  logs,
  onAdd,
  onDelete,
  onView,
}: FuelLogTableProps) {
  const columns: TableColumn<FuelLog>[] = [
    { key: "fuelLogId", header: "Fuel Log ID", accessor: "fuelLogId" },
    { key: "vehicleName", header: "Vehicle", accessor: "vehicleName" },
    {
      key: "date",
      header: "Date",
      render: (l) => dateFormatter.format(new Date(l.date)),
    },
    {
      key: "fuelQuantity",
      header: "Qty (L)",
      render: (l) => `${l.fuelQuantity} L`,
    },
    {
      key: "fuelCost",
      header: "Fuel Cost",
      render: (l) => fmt.format(l.fuelCost),
    },
    {
      key: "distanceCovered",
      header: "Distance",
      render: (l) => `${l.distanceCovered} km`,
    },
    {
      key: "fuelEfficiency",
      header: "Efficiency",
      render: (l) => (
        <EfficiencyBadge value={l.fuelEfficiency} />
      ),
    },
  ];

  if (logs.length === 0) {
    return (
      <EmptyState
        title="No Fuel Logs Found"
        description="Start tracking fuel usage to monitor fleet efficiency."
        action={
          <Button onClick={onAdd} leftIcon={<PlusIcon />}>
            Add Fuel Log
          </Button>
        }
      />
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          data={logs}
          getRowKey={(l) => l.id}
          actions={(l) => (
            <div className="flex items-center justify-end gap-1.5">
              <IconButton label="View" onClick={() => onView(l)}>
                <ViewIcon />
              </IconButton>
              <IconButton label="Delete" tone="danger" onClick={() => onDelete(l)}>
                <TrashIcon />
              </IconButton>
            </div>
          )}
        />
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {logs.map((log) => (
          <article
            key={log.id}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-black/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {log.fuelLogId}
                </p>
                <h2 className="mt-1 text-base font-semibold text-slate-50">
                  {log.vehicleName}
                </h2>
              </div>
              <EfficiencyBadge value={log.fuelEfficiency} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Meta label="Date" value={dateFormatter.format(new Date(log.date))} />
              <Meta label="Quantity" value={`${log.fuelQuantity} L`} />
              <Meta label="Cost" value={fmt.format(log.fuelCost)} />
              <Meta label="Distance" value={`${log.distanceCovered} km`} />
              {log.fuelStation && (
                <div className="col-span-2">
                  <Meta label="Station" value={log.fuelStation} />
                </div>
              )}
            </dl>
            <div className="mt-4 flex justify-end gap-2">
              <IconButton label="View" onClick={() => onView(log)}>
                <ViewIcon />
              </IconButton>
              <IconButton label="Delete" tone="danger" onClick={() => onDelete(log)}>
                <TrashIcon />
              </IconButton>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function EfficiencyBadge({ value }: { value: number }) {
  const colorClass =
    value >= 13
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : value >= 10
        ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
        : "border-red-500/30 bg-red-500/10 text-red-300";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        colorClass,
      ].join(" ")}
    >
      {value.toFixed(1)} km/L
    </span>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-200">{value}</dd>
    </div>
  );
}

type Tone = "default" | "danger";

function IconButton({
  children,
  label,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: Tone;
}) {
  const toneClasses: Record<Tone, string> = {
    default:
      "border-slate-700 text-slate-300 hover:border-amber-500/40 hover:bg-slate-800 hover:text-amber-200",
    danger: "border-red-500/20 text-red-300 hover:bg-red-500/10",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        toneClasses[tone],
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function SvgIcon({ paths }: { paths: string[] }) {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {paths.map((p, i) => (
        <path key={i} d={p} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      ))}
    </svg>
  );
}
function ViewIcon() {
  return <SvgIcon paths={["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />;
}
function TrashIcon() {
  return <SvgIcon paths={["M4 7h16", "M9 7V5h6v2", "m8 10 .8 9h8.4L18 10"]} />;
}
function PlusIcon() {
  return <SvgIcon paths={["M12 5v14M5 12h14"]} />;
}
