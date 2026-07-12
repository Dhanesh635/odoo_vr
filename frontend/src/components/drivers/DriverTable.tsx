"use client";

import { Badge, Button, EmptyState, Table, type TableColumn } from "@/components/ui";
import type { Driver, LicenseStatus } from "@/types/driver";

type DriverTableProps = {
  drivers: Driver[];
  onAddDriver: () => void;
  onView: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function DriverTable({
  drivers,
  onAddDriver,
  onDelete,
  onEdit,
  onView,
}: DriverTableProps) {
  const columns: TableColumn<Driver>[] = [
    { key: "fullName", header: "Driver Name", accessor: "fullName" },
    {
      key: "licenseNumber",
      header: "License Number",
      accessor: "licenseNumber",
    },
    {
      key: "licenseCategory",
      header: "License Category",
      accessor: "licenseCategory",
    },
    { key: "phoneNumber", header: "Phone Number", accessor: "phoneNumber" },
    {
      key: "licenseExpiryDate",
      header: "License Expiry Date",
      render: (driver) => formatDate(driver.licenseExpiryDate),
    },
    {
      key: "safetyScore",
      header: "Safety Score",
      render: (driver) => <SafetyScore value={driver.safetyScore} />,
    },
    {
      key: "status",
      header: "Status",
      render: (driver) => <Badge status={driver.status} />,
    },
  ];

  if (drivers.length === 0) {
    return (
      <EmptyState
        title="No Drivers Found"
        description="Click Add Driver to register your first driver."
        action={<Button onClick={onAddDriver}>Add Driver</Button>}
      />
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <Table
          columns={columns}
          data={drivers}
          getRowKey={(driver) => driver.id}
          actions={(driver) => (
            <div className="flex justify-end gap-2">
              <IconButton label="View" onClick={() => onView(driver)}>
                <ViewIcon />
              </IconButton>
              <IconButton label="Edit" onClick={() => onEdit(driver)}>
                <EditIcon />
              </IconButton>
              <IconButton
                label="Delete"
                tone="danger"
                onClick={() => onDelete(driver)}
              >
                <TrashIcon />
              </IconButton>
            </div>
          )}
        />
      </div>

      <div className="grid gap-4 md:hidden">
        {drivers.map((driver) => (
          <article
            key={driver.id}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-black/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {driver.licenseNumber}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-50">
                  {driver.fullName}
                </h2>
              </div>
              <Badge status={driver.status} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <DriverMeta label="Category" value={driver.licenseCategory} />
              <DriverMeta label="Phone" value={driver.phoneNumber} />
              <DriverMeta
                label="Expiry"
                value={formatDate(driver.licenseExpiryDate)}
              />
              <div>
                <dt className="text-xs text-slate-500">License</dt>
                <dd className="mt-1">
                  <LicenseStatusBadge status={driver.licenseStatus} />
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <SafetyScore value={driver.safetyScore} />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <IconButton label="View" onClick={() => onView(driver)}>
                <ViewIcon />
              </IconButton>
              <IconButton label="Edit" onClick={() => onEdit(driver)}>
                <EditIcon />
              </IconButton>
              <IconButton
                label="Delete"
                tone="danger"
                onClick={() => onDelete(driver)}
              >
                <TrashIcon />
              </IconButton>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function SafetyScore({ value }: { value: number }) {
  const colorClass =
    value >= 90 ? "bg-emerald-400" : value >= 75 ? "bg-yellow-400" : "bg-red-400";

  return (
    <div className="min-w-32">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-200">{value}</span>
        <span className="text-slate-500">/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={["h-full rounded-full", colorClass].join(" ")}
          style={{ width: `${value}%` }}
          aria-label={`Safety score ${value} out of 100`}
        />
      </div>
    </div>
  );
}

export function LicenseStatusBadge({ status }: { status: LicenseStatus }) {
  const classes: Record<LicenseStatus, string> = {
    Valid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    "Expiring Soon": "border-orange-500/30 bg-orange-500/10 text-orange-300",
    Expired: "border-red-500/30 bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
        classes[status],
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function DriverMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-200">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function IconButton({
  children,
  label,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        tone === "danger"
          ? "border-red-500/20 text-red-300 hover:bg-red-500/10"
          : "border-slate-700 text-slate-300 hover:border-amber-500/40 hover:bg-slate-800 hover:text-amber-200",
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function ViewIcon() {
  return <Icon path="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />;
}

function EditIcon() {
  return <Icon path="m4 16.5-.5 4 4-.5L18 9.5 14.5 6 4 16.5ZM13.5 7 17 10.5" />;
}

function TrashIcon() {
  return <Icon path="M4 7h16M9 7V5h6v2m-8 3 .8 9h8.4L17 10" />;
}

function Icon({ path }: { path: string }) {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
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
