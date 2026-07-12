"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui";
import TripTimeline from "./TripTimeline";
import TripStatusStepper from "./TripStatusStepper";
import { motion, AnimatePresence } from "framer-motion";
import { slideInRight } from "@/lib/motion";
import type { Trip, TripStatus } from "@/types/trip";

type TripDetailsDrawerProps = {
  trip: Trip | null;
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

function formatDate(value: string | null) {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return dateTimeFormatter.format(new Date(value));
}

export default function TripDetailsDrawer({ onClose, trip }: TripDetailsDrawerProps) {
  useEffect(() => {
    if (!trip) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [trip, onClose]);

  return (
    <AnimatePresence>
      {trip ? (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trip-drawer-title"
        >
          {/* Backdrop */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            type="button"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close trip details"
          />

          {/* Panel */}
          <motion.aside
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
              Trip Details
            </p>
            <h2
              id="trip-drawer-title"
              className="mt-1 text-lg font-semibold text-slate-50"
            >
              {trip.tripId} — {trip.source} → {trip.destination}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 focus-ring"
            aria-label="Close trip details"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">

          {/* Status stepper */}
          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Progress
            </h3>
            <TripStatusStepper status={trip.status} />
          </section>

          {/* Trip Info */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Trip Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Trip ID" value={trip.tripId} />
              <DetailItem label="Status">
                <TripStatusBadge status={trip.status} />
              </DetailItem>
              <DetailItem label="Source" value={trip.source} />
              <DetailItem label="Destination" value={trip.destination} />
              <DetailItem
                label="Expected Start"
                value={formatDate(trip.expectedStartDate)}
              />
              <DetailItem
                label="Expected Delivery"
                value={formatDate(trip.expectedDeliveryDate)}
              />
              <DetailItem
                label="Created"
                value={formatDateTime(trip.createdAt)}
              />
              <DetailItem
                label="Dispatch Time"
                value={formatDateTime(trip.dispatchedAt)}
              />
              {trip.completedAt ? (
                <DetailItem
                  label="Completion Time"
                  value={formatDateTime(trip.completedAt)}
                />
              ) : null}
              {trip.cancelledAt ? (
                <DetailItem
                  label="Cancelled At"
                  value={formatDateTime(trip.cancelledAt)}
                />
              ) : null}
            </div>
          </section>

          {/* Vehicle & Driver */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Vehicle &amp; Driver
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Vehicle" value={trip.vehicleName} />
              <DetailItem label="Vehicle Type" value={trip.vehicleType} />
              <DetailItem label="Driver" value={trip.driverName} />
            </div>
          </section>

          {/* Cargo & Distance */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Cargo &amp; Distance
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Cargo Weight" value={`${trip.cargoWeight} kg`} />
              <DetailItem
                label="Planned Distance"
                value={`${trip.plannedDistance} km`}
              />
              {trip.finalOdometer !== null ? (
                <DetailItem
                  label="Final Odometer"
                  value={`${trip.finalOdometer} km`}
                />
              ) : null}
              {trip.fuelUsed !== null ? (
                <DetailItem label="Fuel Used" value={`${trip.fuelUsed} L`} />
              ) : null}
            </div>
          </section>

          {/* Notes */}
          {trip.notes || trip.deliveryNotes ? (
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Notes
              </h3>
              <div className="space-y-3">
                {trip.notes ? (
                  <NoteBlock label="Trip Notes" text={trip.notes} />
                ) : null}
                {trip.deliveryNotes ? (
                  <NoteBlock label="Delivery Notes" text={trip.deliveryNotes} />
                ) : null}
              </div>
            </section>
          ) : null}

          {/* Timeline */}
          <section>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Timeline
            </h3>
            <TripTimeline events={trip.timeline} />
          </section>
        </div>
      </motion.aside>
    </div>
      ) : null}
    </AnimatePresence>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function DetailItem({
  children,
  label,
  value,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-100">
        {children ?? value ?? "—"}
      </dd>
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

function TripStatusBadge({ status }: { status: TripStatus }) {
  if (status === "Dispatched") {
    return (
      <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300">
        Dispatched
      </span>
    );
  }
  return <Badge status={status} />;
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
