"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button, Input, Modal, Select } from "@/components/ui";
import { vehicles } from "@/constants/vehicles";
import type { FuelLogFormValues } from "@/types/expense";

type FuelLogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: FuelLogFormValues) => void;
};

const vehicleOptions = vehicles.map((v) => ({
  label: `${v.vehicleName} (${v.type})`,
  value: v.id,
}));

const empty: FuelLogFormValues = {
  vehicleId: "",
  date: "",
  fuelQuantity: "",
  fuelCost: "",
  distanceCovered: "",
  fuelStation: "",
  remarks: "",
};

type Errors = Partial<Record<keyof FuelLogFormValues, string>>;

export default function FuelLogModal({
  isOpen,
  onClose,
  onSave,
}: FuelLogModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Fuel Log" className="max-w-2xl">
      <FuelLogForm key={isOpen ? "open" : "closed"} onCancel={onClose} onSave={onSave} />
    </Modal>
  );
}

function FuelLogForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (values: FuelLogFormValues) => void;
}) {
  const [values, setValues] = useState<FuelLogFormValues>(empty);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  // Live efficiency preview
  const efficiency =
    values.fuelQuantity && values.distanceCovered
      ? (Number(values.distanceCovered) / Number(values.fuelQuantity)).toFixed(1)
      : null;

  function update<K extends keyof FuelLogFormValues>(k: K, v: FuelLogFormValues[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    onSave(values);
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
      <div className="sm:col-span-2">
        <Select
          label="Vehicle"
          value={values.vehicleId}
          options={vehicleOptions}
          placeholder="Select vehicle"
          onChange={(e) => update("vehicleId", e.target.value)}
          error={submitted ? errors.vehicleId : undefined}
        />
      </div>

      <Input
        label="Date"
        type="date"
        value={values.date}
        onChange={(e) => update("date", e.target.value)}
        error={submitted ? errors.date : undefined}
        required
      />

      <Input
        label="Fuel Quantity (L)"
        type="number"
        min={1}
        placeholder="e.g. 45"
        value={values.fuelQuantity}
        onChange={(e) => update("fuelQuantity", e.target.value)}
        error={submitted ? errors.fuelQuantity : undefined}
        inputMode="numeric"
        required
      />

      <div>
        <Input
          label="Fuel Cost (₹)"
          type="number"
          min={1}
          placeholder="e.g. 4800"
          value={values.fuelCost}
          onChange={(e) => update("fuelCost", e.target.value)}
          error={submitted ? errors.fuelCost : undefined}
          inputMode="numeric"
          required
        />
      </div>

      <div>
        <Input
          label="Distance Covered (km)"
          type="number"
          min={1}
          placeholder="e.g. 620"
          value={values.distanceCovered}
          onChange={(e) => update("distanceCovered", e.target.value)}
          error={submitted ? errors.distanceCovered : undefined}
          inputMode="numeric"
          required
        />
        {efficiency ? (
          <p className="mt-1 text-xs text-emerald-400">
            Fuel efficiency: <strong>{efficiency} km/L</strong>
          </p>
        ) : null}
      </div>

      <Input
        label="Fuel Station"
        placeholder="e.g. HP Petrol Pump, Raipur"
        value={values.fuelStation}
        onChange={(e) => update("fuelStation", e.target.value)}
      />

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Remarks{" "}
          <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          rows={2}
          placeholder="Any notes about this fill-up…"
          value={values.remarks}
          onChange={(e) => update("remarks", e.target.value)}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitted && !isValid}>Save Fuel Log</Button>
      </div>
    </form>
  );
}

function validate(v: FuelLogFormValues): Errors {
  const errors: Errors = {};
  if (!v.vehicleId) errors.vehicleId = "Vehicle is required.";
  if (!v.date) errors.date = "Date is required.";
  if (!v.fuelQuantity || Number(v.fuelQuantity) <= 0)
    errors.fuelQuantity = "Enter a valid quantity.";
  if (!v.fuelCost || Number(v.fuelCost) <= 0)
    errors.fuelCost = "Enter a valid cost.";
  if (!v.distanceCovered || Number(v.distanceCovered) <= 0)
    errors.distanceCovered = "Enter a valid distance.";
  return errors;
}
