"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui";
import type { Vehicle } from "@/types/vehicle";

type VehicleDetailsDrawerProps = {
  vehicle: Vehicle | null;
  onClose: () => void;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "INR",
});

const numberFormatter = new Intl.NumberFormat("en-IN");

export default function VehicleDetailsDrawer({
  onClose,
  vehicle,
}: VehicleDetailsDrawerProps) {
  useEffect(() => {
    if (!vehicle) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, vehicle]);

  if (!vehicle) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close vehicle details"
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
              Vehicle Details
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              {vehicle.vehicleName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            aria-label="Close vehicle details"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 text-slate-500">
            Vehicle image placeholder
          </div>

          <div className="grid gap-4">
            <DetailItem label="Registration Number" value={vehicle.registrationNumber} />
            <DetailItem label="Model" value={vehicle.model} />
            <DetailItem label="Vehicle Type" value={vehicle.type} />
            <DetailItem
              label="Capacity"
              value={`${numberFormatter.format(vehicle.maximumLoadCapacity)} kg`}
            />
            <DetailItem
              label="Current Odometer"
              value={`${numberFormatter.format(vehicle.currentOdometer)} km`}
            />
            <DetailItem
              label="Acquisition Cost"
              value={currencyFormatter.format(vehicle.acquisitionCost)}
            />
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="text-sm text-slate-400">Current Status</span>
              <Badge status={vehicle.status} />
            </div>
          </div>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <h3 className="text-sm font-semibold text-slate-50">
              Recent Activity
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Recent Activity placeholder
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-100">{value}</dd>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="m5 5 10 10M15 5 5 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
