"use client";

import { Button, EmptyState, Table, type TableColumn } from "@/components/ui";
import MaintenanceStatusBadge from "./MaintenanceStatusBadge";
import type { MaintenanceRecord } from "@/types/maintenance";

type MaintenanceTableProps = {
  records: MaintenanceRecord[];
  onSchedule: () => void;
  onView: (record: MaintenanceRecord) => void;
  onEdit: (record: MaintenanceRecord) => void;
  onComplete: (record: MaintenanceRecord) => void;
  onCancel: (record: MaintenanceRecord) => void;
  onDelete: (record: MaintenanceRecord) => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function MaintenanceTable({
  onCancel,
  onComplete,
  onDelete,
  onEdit,
  onSchedule,
  onView,
  records,
}: MaintenanceTableProps) {
  const columns: TableColumn<MaintenanceRecord>[] = [
    {
      key: "maintenanceId",
      header: "Maintenance ID",
      accessor: "maintenanceId",
    },
    { key: "vehicleName", header: "Vehicle", accessor: "vehicleName" },
    { key: "serviceType", header: "Service Type", accessor: "serviceType" },
    { key: "technician", header: "Technician", accessor: "technician" },
    {
      key: "startDate",
      header: "Start Date",
      render: (r) => dateFormatter.format(new Date(r.startDate)),
    },
    {
      key: "expectedCompletion",
      header: "Expected Completion",
      render: (r) => dateFormatter.format(new Date(r.expectedCompletion)),
    },
    {
      key: "estimatedCost",
      header: "Cost",
      render: (r) =>
        currencyFormatter.format(r.actualCost ?? r.estimatedCost),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <MaintenanceStatusBadge status={r.status} />,
    },
  ];

  if (records.length === 0) {
    return (
      <EmptyState
        title="No Maintenance Records"
        description="Schedule maintenance to keep your fleet healthy."
        action={
          <Button onClick={onSchedule} leftIcon={<PlusIcon />}>
            Schedule Maintenance
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
          data={records}
          getRowKey={(r) => r.id}
          actions={(r) => (
            <RowActions
              record={r}
              onView={onView}
              onEdit={onEdit}
              onComplete={onComplete}
              onCancel={onCancel}
              onDelete={onDelete}
            />
          )}
        />
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {records.map((record) => (
          <article
            key={record.id}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-black/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {record.maintenanceId}
                </p>
                <h2 className="mt-1 text-base font-semibold text-slate-50">
                  {record.vehicleName} — {record.serviceType}
                </h2>
              </div>
              <MaintenanceStatusBadge status={record.status} />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Meta label="Technician" value={record.technician} />
              <Meta
                label="Start Date"
                value={dateFormatter.format(new Date(record.startDate))}
              />
              <Meta
                label="Expected"
                value={dateFormatter.format(new Date(record.expectedCompletion))}
              />
              <Meta
                label="Cost"
                value={currencyFormatter.format(
                  record.actualCost ?? record.estimatedCost,
                )}
              />
              <Meta label="Priority" value={record.priority} />
              <Meta label="Type" value={record.vehicleType} />
            </dl>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <RowActions
                record={record}
                onView={onView}
                onEdit={onEdit}
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

type RowActionsProps = {
  record: MaintenanceRecord;
  onView: (r: MaintenanceRecord) => void;
  onEdit: (r: MaintenanceRecord) => void;
  onComplete: (r: MaintenanceRecord) => void;
  onCancel: (r: MaintenanceRecord) => void;
  onDelete: (r: MaintenanceRecord) => void;
};

function RowActions({
  onCancel,
  onComplete,
  onDelete,
  onEdit,
  onView,
  record,
}: RowActionsProps) {
  const isTerminal =
    record.status === "Completed" || record.status === "Cancelled";
  const isCompletable =
    record.status === "In Progress" || record.status === "Scheduled";

  return (
    <div className="flex items-center justify-end gap-1.5 flex-wrap">
      <IconButton label="View" onClick={() => onView(record)}>
        <ViewIcon />
      </IconButton>

      {!isTerminal && (
        <IconButton label="Edit" onClick={() => onEdit(record)}>
          <EditIcon />
        </IconButton>
      )}

      {isCompletable && (
        <IconButton
          label="Complete Maintenance"
          tone="success"
          onClick={() => onComplete(record)}
        >
          <CompleteIcon />
        </IconButton>
      )}

      {!isTerminal && (
        <IconButton
          label="Cancel"
          tone="warning"
          onClick={() => onCancel(record)}
        >
          <CancelIcon />
        </IconButton>
      )}

      <IconButton label="Delete" tone="danger" onClick={() => onDelete(record)}>
        <TrashIcon />
      </IconButton>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-200">{value}</dd>
    </div>
  );
}

type Tone = "default" | "danger" | "success" | "warning";

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
    success: "border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/10",
    warning: "border-orange-500/20 text-orange-300 hover:bg-orange-500/10",
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

function SvgIcon({ path, paths }: { path?: string; paths?: string[] }) {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {path && (
        <path
          d={path}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      )}
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
    <SvgIcon
      paths={[
        "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z",
        "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
      ]}
    />
  );
}
function EditIcon() {
  return <SvgIcon paths={["m4 16.5-.5 4 4-.5L18 9.5 14.5 6 4 16.5Z", "M13.5 7 17 10.5"]} />;
}
function CompleteIcon() {
  return <SvgIcon path="m5 12 5 5L20 7" />;
}
function CancelIcon() {
  return <SvgIcon path="m6 6 12 12M18 6 6 18" />;
}
function TrashIcon() {
  return <SvgIcon paths={["M4 7h16", "M9 7V5h6v2", "m8 10 .8 9h8.4L18 10"]} />;
}
function PlusIcon() {
  return <SvgIcon path="M12 5v14M5 12h14" />;
}
