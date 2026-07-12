"use client";

import { Badge, Button, EmptyState, Table, type TableColumn } from "@/components/ui";
import type { Vehicle } from "@/types/vehicle";

type VehicleTableProps = {
  vehicles: Vehicle[];
  onAddVehicle: () => void;
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "INR",
});

const numberFormatter = new Intl.NumberFormat("en-IN");

export default function VehicleTable({
  onAddVehicle,
  onDelete,
  onEdit,
  onView,
  vehicles,
}: VehicleTableProps) {
  const columns: TableColumn<Vehicle>[] = [
    {
      key: "registrationNumber",
      header: "Registration Number",
      accessor: "registrationNumber",
    },
    { key: "vehicleName", header: "Vehicle Name", accessor: "vehicleName" },
    { key: "type", header: "Type", accessor: "type" },
    {
      key: "maximumLoadCapacity",
      header: "Maximum Load Capacity",
      render: (vehicle) => `${numberFormatter.format(vehicle.maximumLoadCapacity)} kg`,
    },
    {
      key: "currentOdometer",
      header: "Current Odometer",
      render: (vehicle) => `${numberFormatter.format(vehicle.currentOdometer)} km`,
    },
    {
      key: "acquisitionCost",
      header: "Acquisition Cost",
      render: (vehicle) => currencyFormatter.format(vehicle.acquisitionCost),
    },
    {
      key: "status",
      header: "Status",
      render: (vehicle) => <Badge status={vehicle.status} />,
    },
  ];

  if (vehicles.length === 0) {
    return (
      <EmptyState
        title="No Vehicles Found"
        description="Click Add Vehicle to register your first vehicle."
        action={<Button onClick={onAddVehicle}>Add Vehicle</Button>}
      />
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <Table
          columns={columns}
          data={vehicles}
          getRowKey={(vehicle) => vehicle.id}
          actions={(vehicle) => (
            <div className="flex justify-end gap-2">
              <IconButton label="View" onClick={() => onView(vehicle)}>
                <ViewIcon />
              </IconButton>
              <IconButton label="Edit" onClick={() => onEdit(vehicle)}>
                <EditIcon />
              </IconButton>
              <IconButton
                label="Delete"
                tone="danger"
                onClick={() => onDelete(vehicle)}
              >
                <TrashIcon />
              </IconButton>
            </div>
          )}
        />
      </div>

      <div className="grid gap-4 md:hidden">
        {vehicles.map((vehicle) => (
          <article
            key={vehicle.id}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-black/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {vehicle.registrationNumber}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-50">
                  {vehicle.vehicleName}
                </h2>
              </div>
              <Badge status={vehicle.status} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <VehicleMeta label="Type" value={vehicle.type} />
              <VehicleMeta
                label="Capacity"
                value={`${numberFormatter.format(vehicle.maximumLoadCapacity)} kg`}
              />
              <VehicleMeta
                label="Odometer"
                value={`${numberFormatter.format(vehicle.currentOdometer)} km`}
              />
              <VehicleMeta
                label="Cost"
                value={currencyFormatter.format(vehicle.acquisitionCost)}
              />
            </dl>

            <div className="mt-4 flex justify-end gap-2">
              <IconButton label="View" onClick={() => onView(vehicle)}>
                <ViewIcon />
              </IconButton>
              <IconButton label="Edit" onClick={() => onEdit(vehicle)}>
                <EditIcon />
              </IconButton>
              <IconButton
                label="Delete"
                tone="danger"
                onClick={() => onDelete(vehicle)}
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

function VehicleMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-200">{value}</dd>
    </div>
  );
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
