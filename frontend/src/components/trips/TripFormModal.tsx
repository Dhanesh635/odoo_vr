"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button, Input, Modal, Select } from "@/components/ui";
import { vehicles } from "@/constants/vehicles";
import { drivers } from "@/constants/drivers";
import type { Trip, TripFormValues } from "@/types/trip";

// ─── Types ─────────────────────────────────────────────────────────────────────

type TripFormModalProps = {
  isOpen: boolean;
  trip: Trip | null;
  onClose: () => void;
  onSave: (values: TripFormValues, tripId?: string) => void;
};

type TripFormErrors = Partial<Record<keyof TripFormValues, string>>;

// ─── Constants ─────────────────────────────────────────────────────────────────

const emptyValues: TripFormValues = {
  source: "",
  destination: "",
  vehicleId: "",
  driverId: "",
  cargoWeight: "",
  plannedDistance: "",
  expectedStartDate: "",
  expectedDeliveryDate: "",
  notes: "",
};

// Only available vehicles are selectable
const availableVehicles = vehicles.filter((v) => v.status === "Available");

// Only available drivers are selectable (no suspended, on-trip, expired-license)
const availableDrivers = drivers.filter(
  (d) => d.status === "Available" && d.licenseStatus !== "Expired",
);

// ─── Modal wrapper ─────────────────────────────────────────────────────────────

export default function TripFormModal({
  isOpen,
  onClose,
  onSave,
  trip,
}: TripFormModalProps) {
  const initialValues: TripFormValues = trip
    ? {
        source: trip.source,
        destination: trip.destination,
        vehicleId: trip.vehicleId,
        driverId: trip.driverId,
        cargoWeight: String(trip.cargoWeight),
        plannedDistance: String(trip.plannedDistance),
        expectedStartDate: trip.expectedStartDate,
        expectedDeliveryDate: trip.expectedDeliveryDate,
        notes: trip.notes,
      }
    : emptyValues;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={trip ? "Edit Trip" : "Create Trip"}
      className="max-w-2xl"
    >
      <TripForm
        key={trip?.id ?? "new-trip"}
        initialValues={initialValues}
        onCancel={onClose}
        onSave={(values) => onSave(values, trip?.id)}
      />
    </Modal>
  );
}

// ─── Form ──────────────────────────────────────────────────────────────────────

function TripForm({
  initialValues,
  onCancel,
  onSave,
}: {
  initialValues: TripFormValues;
  onCancel: () => void;
  onSave: (values: TripFormValues) => void;
}) {
  const [values, setValues] = useState<TripFormValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);

  // Find selected vehicle to validate cargo capacity
  const selectedVehicle = useMemo(
    () => availableVehicles.find((v) => v.id === values.vehicleId) ?? null,
    [values.vehicleId],
  );

  const errors = useMemo(
    () => validateTripForm(values, selectedVehicle?.maximumLoadCapacity ?? null),
    [values, selectedVehicle],
  );

  const isValid = Object.keys(errors).length === 0;

  function update<K extends keyof TripFormValues>(key: K, value: TripFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    onSave(values);
  }

  const vehicleOptions = availableVehicles.map((v) => ({
    label: `${v.vehicleName} (${v.type} — ${v.maximumLoadCapacity} kg capacity)`,
    value: v.id,
  }));

  const driverOptions = availableDrivers.map((d) => ({
    label: `${d.fullName} (${d.licenseCategory})`,
    value: d.id,
  }));

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
      <Input
        label="Source"
        placeholder="e.g. Raipur"
        value={values.source}
        onChange={(e) => update("source", e.target.value)}
        error={submitted ? errors.source : undefined}
        required
      />
      <Input
        label="Destination"
        placeholder="e.g. Nagpur"
        value={values.destination}
        onChange={(e) => update("destination", e.target.value)}
        error={submitted ? errors.destination : undefined}
        required
      />

      <Select
        label="Vehicle"
        value={values.vehicleId}
        options={vehicleOptions}
        placeholder="Select vehicle"
        onChange={(e) => update("vehicleId", e.target.value)}
        error={submitted ? errors.vehicleId : undefined}
      />
      <Select
        label="Driver"
        value={values.driverId}
        options={driverOptions}
        placeholder="Select driver"
        onChange={(e) => update("driverId", e.target.value)}
        error={submitted ? errors.driverId : undefined}
      />

      <div>
        <Input
          label="Cargo Weight (kg)"
          type="number"
          min={1}
          placeholder="e.g. 450"
          value={values.cargoWeight}
          onChange={(e) => update("cargoWeight", e.target.value)}
          error={submitted ? errors.cargoWeight : undefined}
          inputMode="numeric"
          required
        />
        {selectedVehicle ? (
          <p className="mt-1 text-xs text-slate-500">
            Max capacity: {selectedVehicle.maximumLoadCapacity} kg
          </p>
        ) : null}
      </div>

      <Input
        label="Planned Distance (km)"
        type="number"
        min={1}
        placeholder="e.g. 285"
        value={values.plannedDistance}
        onChange={(e) => update("plannedDistance", e.target.value)}
        error={submitted ? errors.plannedDistance : undefined}
        inputMode="numeric"
        required
      />

      <Input
        label="Expected Start Date"
        type="date"
        value={values.expectedStartDate}
        onChange={(e) => update("expectedStartDate", e.target.value)}
        error={submitted ? errors.expectedStartDate : undefined}
        required
      />
      <Input
        label="Expected Delivery Date"
        type="date"
        value={values.expectedDeliveryDate}
        onChange={(e) => update("expectedDeliveryDate", e.target.value)}
        error={submitted ? errors.expectedDeliveryDate : undefined}
        required
      />

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Notes
        </label>
        <textarea
          rows={3}
          placeholder="Optional notes about cargo, route, or delivery requirements…"
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitted && !isValid}>
          {initialValues.source ? "Save Changes" : "Create Trip"}
        </Button>
      </div>
    </form>
  );
}

// ─── Validation ────────────────────────────────────────────────────────────────

function validateTripForm(
  values: TripFormValues,
  maxCapacity: number | null,
): TripFormErrors {
  const errors: TripFormErrors = {};
  const cargoWeight = Number(values.cargoWeight);
  const plannedDistance = Number(values.plannedDistance);

  if (!values.source.trim()) {
    errors.source = "Source is required.";
  }
  if (!values.destination.trim()) {
    errors.destination = "Destination is required.";
  }
  if (
    values.source.trim() &&
    values.destination.trim() &&
    values.source.trim().toLowerCase() === values.destination.trim().toLowerCase()
  ) {
    errors.destination = "Destination must be different from source.";
  }
  if (!values.vehicleId) {
    errors.vehicleId = "Vehicle is required.";
  }
  if (!values.driverId) {
    errors.driverId = "Driver is required.";
  }
  if (!values.cargoWeight || isNaN(cargoWeight) || cargoWeight <= 0) {
    errors.cargoWeight = "Cargo weight must be greater than 0.";
  } else if (maxCapacity !== null && cargoWeight > maxCapacity) {
    errors.cargoWeight = `Cargo exceeds maximum vehicle capacity (${maxCapacity} kg).`;
  }
  if (!values.plannedDistance || isNaN(plannedDistance) || plannedDistance <= 0) {
    errors.plannedDistance = "Distance must be greater than 0.";
  }
  if (!values.expectedStartDate) {
    errors.expectedStartDate = "Expected start date is required.";
  }
  if (!values.expectedDeliveryDate) {
    errors.expectedDeliveryDate = "Expected delivery date is required.";
  }
  if (
    values.expectedStartDate &&
    values.expectedDeliveryDate &&
    values.expectedDeliveryDate < values.expectedStartDate
  ) {
    errors.expectedDeliveryDate = "Delivery date cannot be before start date.";
  }

  return errors;
}
