"use client";

import { useEffect } from "react";
import MaintenanceStatusBadge from "./MaintenanceStatusBadge";
import MaintenanceTimeline from "./MaintenanceTimeline";
import type { MaintenanceRecord } from "@/types/maintenance";

type MaintenanceDetailsDrawerProps = {
  record: MaintenanceRecord | null;
  onClose: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const priorityColors = {
  Low: "text-slate-300 border-slate-500/30 bg-slate-500/10",
  Medium: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  High: "text-orange-300 border-orange-500/30 bg-orange-500/10",
  Critical: "text-red-300 border-red-500/30 bg-red-500/10",
} as const;

export default function MaintenanceDetailsDrawer({
  onClose,
  record,
}: MaintenanceDetailsDrawerProps) {
  useEffect(() => {
    if (!record) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [record, onClose]);

  if (!record) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="maint-drawer-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close maintenance details"
      />

      {/* Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
              Maintenance Details
            </p>
            <h2
              id="maint-drawer-title"
              className="mt-1 text-lg font-semibold text-slate-50"
            >
              {record.maintenanceId} — {record.vehicleName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">

          {/* Status + Priority chips */}
          <div className="flex flex-wrap items-center gap-3">
            <MaintenanceStatusBadge status={record.status} />
            <span
              className={[
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                priorityColors[record.priority],
              ].join(" ")}
            >
              {record.priority} Priority
            </span>
          </div>

          {/* Maintenance Info */}
          <section>
            <SectionTitle>Maintenance Information</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Maintenance ID" value={record.maintenanceId} />
              <DetailItem label="Service Type" value={record.serviceType} />
              <DetailItem label="Technician" value={record.technician} />
              <DetailItem
                label="Start Date"
                value={dateFormatter.format(new Date(record.startDate))}
              />
              <DetailItem
                label="Expected Completion"
                value={dateFormatter.format(new Date(record.expectedCompletion))}
              />
              {record.completedAt ? (
                <DetailItem
                  label="Completed At"
                  value={dateTimeFormatter.format(new Date(record.completedAt))}
                />
              ) : null}
              {record.cancelledAt ? (
                <DetailItem
                  label="Cancelled At"
                  value={dateTimeFormatter.format(new Date(record.cancelledAt))}
                />
              ) : null}
              <DetailItem
                label="Created"
                value={dateTimeFormatter.format(new Date(record.createdAt))}
              />
            </div>
          </section>

          {/* Vehicle Info */}
          <section>
            <SectionTitle>Vehicle Information</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Vehicle" value={record.vehicleName} />
              <DetailItem label="Type" value={record.vehicleType} />
              <DetailItem label="Registration" value={record.registrationNumber} />
            </div>
          </section>

          {/* Cost */}
          <section>
            <SectionTitle>Cost Details</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem
                label="Estimated Cost"
                value={currencyFormatter.format(record.estimatedCost)}
              />
              <DetailItem
                label="Actual Cost"
                value={
                  record.actualCost !== null
                    ? currencyFormatter.format(record.actualCost)
                    : "—"
                }
              />
            </div>
          </section>

          {/* Description & Notes */}
          {(record.description || record.serviceNotes) && (
            <section>
              <SectionTitle>Notes</SectionTitle>
              <div className="space-y-3">
                {record.description ? (
                  <NoteBlock label="Description" text={record.description} />
                ) : null}
                {record.serviceNotes ? (
                  <NoteBlock label="Service Notes" text={record.serviceNotes} />
                ) : null}
              </div>
            </section>
          )}

          {/* Attachments placeholder */}
          <section>
            <SectionTitle>Attachments</SectionTitle>
            <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center">
              <AttachmentIcon />
              <p className="mt-2 text-sm text-slate-500">
                No attachments yet.
              </p>
            </div>
          </section>

          {/* Timeline */}
          <section>
            <SectionTitle>Timeline</SectionTitle>
            <MaintenanceTimeline events={record.timeline} />
          </section>
        </div>
      </aside>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </h3>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-100">{value}</dd>
    </div>
  );
}

function NoteBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function AttachmentIcon() {
  return (
    <svg
      className="mx-auto h-8 w-8 text-slate-600"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
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
