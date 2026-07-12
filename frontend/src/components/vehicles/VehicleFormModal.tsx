"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button, Input, Modal, Select } from "@/components/ui";
import {
  vehicleFormStatusOptions,
  vehicleFormTypeOptions,
} from "@/constants/vehicles";
import type { Vehicle, VehicleFormValues } from "@/types/vehicle";

type VehicleFormModalProps = {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onSave: (values: VehicleFormValues) => void;
};

type VehicleFormErrors = Partial<Record<keyof VehicleFormValues, string>>;

const emptyValues: VehicleFormValues = {
  registrationNumber: "",
  vehicleName: "",
  type: "",
  maximumLoadCapacity: "",
  currentOdometer: "",
  acquisitionCost: "",
  status: "",
};

export default function VehicleFormModal({
  isOpen,
  onClose,
  onSave,
  vehicle,
}: VehicleFormModalProps) {
  const initialValues = vehicle
    ? {
        registrationNumber: vehicle.registrationNumber,
        vehicleName: vehicle.vehicleName,
        type: vehicle.type,
        maximumLoadCapacity: String(vehicle.maximumLoadCapacity),
        currentOdometer: String(vehicle.currentOdometer),
        acquisitionCost: String(vehicle.acquisitionCost),
        status: vehicle.status,
      }
    : emptyValues;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle ? "Edit Vehicle" : "Add Vehicle"}
      className="max-w-2xl"
    >
      <VehicleForm
        key={vehicle?.id ?? "new-vehicle"}
        initialValues={initialValues}
        onCancel={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}

function VehicleForm({
  initialValues,
  onCancel,
  onSave,
}: {
  initialValues: VehicleFormValues;
  onCancel: () => void;
  onSave: (values: VehicleFormValues) => void;
}) {
  const [values, setValues] = useState<VehicleFormValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validateVehicleForm(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  function updateValue<TKey extends keyof VehicleFormValues>(
    key: TKey,
    value: VehicleFormValues[TKey],
  ) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      return;
    }

    onSave(values);
  }

  return (
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
        <Input
          label="Registration Number"
          value={values.registrationNumber}
          onChange={(event) =>
            updateValue("registrationNumber", event.target.value)
          }
          error={submitted ? errors.registrationNumber : undefined}
          autoComplete="off"
          required
        />
        <Input
          label="Vehicle Name"
          value={values.vehicleName}
          onChange={(event) => updateValue("vehicleName", event.target.value)}
          error={submitted ? errors.vehicleName : undefined}
          autoComplete="off"
          required
        />
        <Select
          label="Vehicle Type"
          value={values.type}
          options={vehicleFormTypeOptions}
          onChange={(event) =>
            updateValue("type", event.target.value as VehicleFormValues["type"])
          }
          error={submitted ? errors.type : undefined}
        />
        <Input
          label="Maximum Load Capacity"
          type="number"
          min={1}
          value={values.maximumLoadCapacity}
          onChange={(event) =>
            updateValue("maximumLoadCapacity", event.target.value)
          }
          error={submitted ? errors.maximumLoadCapacity : undefined}
          inputMode="numeric"
          required
        />
        <Input
          label="Current Odometer"
          type="number"
          min={0}
          value={values.currentOdometer}
          onChange={(event) => updateValue("currentOdometer", event.target.value)}
          error={submitted ? errors.currentOdometer : undefined}
          inputMode="numeric"
        />
        <Input
          label="Acquisition Cost"
          type="number"
          min={1}
          value={values.acquisitionCost}
          onChange={(event) => updateValue("acquisitionCost", event.target.value)}
          error={submitted ? errors.acquisitionCost : undefined}
          inputMode="numeric"
          required
        />
        <div className="sm:col-span-2">
          <Select
            label="Status"
            value={values.status}
            options={vehicleFormStatusOptions}
            onChange={(event) =>
              updateValue(
                "status",
                event.target.value as VehicleFormValues["status"],
              )
            }
            error={submitted ? errors.status : undefined}
          />
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid}>
            Save Vehicle
          </Button>
        </div>
      </form>
  );
}

function validateVehicleForm(values: VehicleFormValues): VehicleFormErrors {
  const errors: VehicleFormErrors = {};
  const capacity = Number(values.maximumLoadCapacity);
  const cost = Number(values.acquisitionCost);
  const odometer = Number(values.currentOdometer);

  if (!values.registrationNumber.trim()) {
    errors.registrationNumber = "Registration Number is required.";
  }

  if (!values.vehicleName.trim()) {
    errors.vehicleName = "Vehicle Name is required.";
  }

  if (!values.type) {
    errors.type = "Vehicle Type is required.";
  }

  if (!values.maximumLoadCapacity || Number.isNaN(capacity) || capacity <= 0) {
    errors.maximumLoadCapacity = "Capacity must be a positive number.";
  }

  if (values.currentOdometer && (Number.isNaN(odometer) || odometer < 0)) {
    errors.currentOdometer = "Odometer must be zero or greater.";
  }

  if (!values.acquisitionCost || Number.isNaN(cost) || cost <= 0) {
    errors.acquisitionCost = "Cost must be a positive number.";
  }

  if (!values.status) {
    errors.status = "Status is required.";
  }

  return errors;
}
