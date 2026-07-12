"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button, Input, Modal, Select } from "@/components/ui";
import { priorityFormOptions, serviceTypeFormOptions } from "@/constants/maintenance";
import { vehicles } from "@/constants/vehicles";
import type { MaintenanceFormValues, MaintenanceRecord } from "@/types/maintenance";

// ─── Props ─────────────────────────────────────────────────────────────────────

type MaintenanceFormModalProps = {
  isOpen: boolean;
  record: MaintenanceRecord | null;
  onClose: () => void;
  onSave: (values: MaintenanceFormValues, recordId?: string) => void;
};

// ─── Constants ─────────────────────────────────────────────────────────────────

// All vehicles are selectable when scheduling maintenance (including On Trip — dispatcher's choice)
const vehicleOptions = vehicles.map((v) => ({
  label: `${v.vehicleName} (${v.type} — ${v.registrationNumber})`,
  value: v.id,
}));

const emptyValues: MaintenanceFormValues = {
  vehicleId: "",
  serviceType: "",
  technician: "",
  priority: "",
  description: "",
  startDate: "",
  expectedCompletion: "",
  estimatedCost: "",
  notes: "",
};

// ─── Modal ─────────────────────────────────────────────────────────────────────

export default function MaintenanceFormModal({
  isOpen,
  onClose,
  onSave,
  record,
}: MaintenanceFormModalProps) {
  const initialValues: MaintenanceFormValues = record
    ? {
        vehicleId: record.vehicleId,
        serviceType: record.serviceType,
        technician: record.technician,
        priority: record.priority,
        description: record.description,
        startDate: record.startDate,
        expectedCompletion: record.expectedCompletion,
        estimatedCost: String(record.estimatedCost),
        notes: record.serviceNotes,
      }
    : emptyValues;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={record ? "Edit Maintenance" : "Schedule Maintenance"}
      className="max-w-2xl"
    >
      <MaintenanceForm
        key={record?.id ?? "new-maintenance"}
        initialValues={initialValues}
        isEditing={Boolean(record)}
        onCancel={onClose}
        onSave={(values) => onSave(values, record?.id)}
      />
    </Modal>
  );
}

// ─── Form ──────────────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<keyof MaintenanceFormValues, string>>;

function MaintenanceForm({
  initialValues,
  isEditing,
  onCancel,
  onSave,
}: {
  initialValues: MaintenanceFormValues;
  isEditing: boolean;
  onCancel: () => void;
  onSave: (values: MaintenanceFormValues) => void;
}) {
  const [values, setValues] = useState<MaintenanceFormValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  function update<K extends keyof MaintenanceFormValues>(
    key: K,
    value: MaintenanceFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    onSave(values);
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
      {/* Vehicle */}
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

      {/* Service Type */}
      <Select
        label="Service Type"
        value={values.serviceType}
        options={serviceTypeFormOptions}
        placeholder="Select service type"
        onChange={(e) =>
          update(
            "serviceType",
            e.target.value as MaintenanceFormValues["serviceType"],
          )
        }
        error={submitted ? errors.serviceType : undefined}
      />

      {/* Priority */}
      <Select
        label="Priority"
        value={values.priority}
        options={priorityFormOptions}
        placeholder="Select priority"
        onChange={(e) =>
          update(
            "priority",
            e.target.value as MaintenanceFormValues["priority"],
          )
        }
        error={submitted ? errors.priority : undefined}
      />

      {/* Technician */}
      <Input
        label="Technician"
        placeholder="e.g. Rahul Sharma"
        value={values.technician}
        onChange={(e) => update("technician", e.target.value)}
        error={submitted ? errors.technician : undefined}
        required
      />

      {/* Estimated Cost */}
      <Input
        label="Estimated Cost (₹)"
        type="number"
        min={0}
        placeholder="e.g. 3200"
        value={values.estimatedCost}
        onChange={(e) => update("estimatedCost", e.target.value)}
        error={submitted ? errors.estimatedCost : undefined}
        inputMode="numeric"
        required
      />

      {/* Start Date */}
      <Input
        label="Start Date"
        type="date"
        value={values.startDate}
        onChange={(e) => update("startDate", e.target.value)}
        error={submitted ? errors.startDate : undefined}
        required
      />

      {/* Expected Completion */}
      <Input
        label="Expected Completion"
        type="date"
        value={values.expectedCompletion}
        onChange={(e) => update("expectedCompletion", e.target.value)}
        error={submitted ? errors.expectedCompletion : undefined}
        required
      />

      {/* Description */}
      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Describe the issue or service required…"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
        />
        {submitted && errors.description ? (
          <p className="mt-1.5 text-sm text-red-400">{errors.description}</p>
        ) : null}
      </div>

      {/* Notes */}
      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Notes{" "}
          <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          rows={2}
          placeholder="Any additional notes for the technician…"
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitted && !isValid}>
          {isEditing ? "Save Changes" : "Schedule"}
        </Button>
      </div>
    </form>
  );
}

// ─── Validation ────────────────────────────────────────────────────────────────

function validate(values: MaintenanceFormValues): FormErrors {
  const errors: FormErrors = {};
  const cost = Number(values.estimatedCost);

  if (!values.vehicleId) errors.vehicleId = "Vehicle is required.";
  if (!values.serviceType) errors.serviceType = "Service type is required.";
  if (!values.priority) errors.priority = "Priority is required.";
  if (!values.technician.trim()) errors.technician = "Technician is required.";
  if (!values.description.trim()) errors.description = "Description is required.";
  if (!values.startDate) errors.startDate = "Start date is required.";
  if (!values.expectedCompletion)
    errors.expectedCompletion = "Expected completion date is required.";
  if (
    values.startDate &&
    values.expectedCompletion &&
    values.expectedCompletion < values.startDate
  ) {
    errors.expectedCompletion =
      "Completion date cannot be before start date.";
  }
  if (!values.estimatedCost || isNaN(cost) || cost < 0) {
    errors.estimatedCost = "Enter a valid estimated cost.";
  }

  return errors;
}
