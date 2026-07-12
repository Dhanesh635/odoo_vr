"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import type { Trip, TripCompleteFormValues } from "@/types/trip";

type TripCompleteModalProps = {
  trip: Trip | null;
  onClose: () => void;
  onConfirm: (tripId: string, values: TripCompleteFormValues) => void;
};

type CompleteFormErrors = Partial<Record<keyof TripCompleteFormValues, string>>;

const emptyValues: TripCompleteFormValues = {
  finalOdometer: "",
  fuelUsed: "",
  deliveryNotes: "",
};

export default function TripCompleteModal({
  onClose,
  onConfirm,
  trip,
}: TripCompleteModalProps) {
  return (
    <Modal
      isOpen={Boolean(trip)}
      onClose={onClose}
      title="Complete Trip"
      className="max-w-lg"
    >
      {trip ? (
        <CompleteForm
          key={trip.id}
          trip={trip}
          onCancel={onClose}
          onConfirm={(values) => onConfirm(trip.id, values)}
        />
      ) : null}
    </Modal>
  );
}

function CompleteForm({
  onCancel,
  onConfirm,
  trip,
}: {
  trip: Trip;
  onCancel: () => void;
  onConfirm: (values: TripCompleteFormValues) => void;
}) {
  const [values, setValues] = useState<TripCompleteFormValues>(emptyValues);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validateCompleteForm(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  function update<K extends keyof TripCompleteFormValues>(
    key: K,
    value: TripCompleteFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    onConfirm(values);
  }

  return (
    <div>
      <div className="mb-4 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300">
        <span className="text-slate-400">Trip: </span>
        <span className="font-semibold text-slate-100">{trip.tripId}</span>
        {" · "}
        {trip.source} → {trip.destination}
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Final Odometer (km)"
          type="number"
          min={1}
          placeholder="e.g. 42785"
          value={values.finalOdometer}
          onChange={(e) => update("finalOdometer", e.target.value)}
          error={submitted ? errors.finalOdometer : undefined}
          inputMode="numeric"
          required
        />
        <Input
          label="Fuel Used (litres)"
          type="number"
          min={1}
          placeholder="e.g. 32"
          value={values.fuelUsed}
          onChange={(e) => update("fuelUsed", e.target.value)}
          error={submitted ? errors.fuelUsed : undefined}
          inputMode="numeric"
          required
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Delivery Notes
          </label>
          <textarea
            rows={3}
            placeholder="Optional notes about the delivery…"
            value={values.deliveryNotes}
            onChange={(e) => update("deliveryNotes", e.target.value)}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:justify-end">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={submitted && !isValid}>
            Mark as Completed
          </Button>
        </div>
      </form>
    </div>
  );
}

function validateCompleteForm(values: TripCompleteFormValues): CompleteFormErrors {
  const errors: CompleteFormErrors = {};
  const odometer = Number(values.finalOdometer);
  const fuel = Number(values.fuelUsed);

  if (!values.finalOdometer || isNaN(odometer) || odometer <= 0) {
    errors.finalOdometer = "Final odometer reading is required.";
  }
  if (!values.fuelUsed || isNaN(fuel) || fuel <= 0) {
    errors.fuelUsed = "Fuel used is required.";
  }

  return errors;
}
