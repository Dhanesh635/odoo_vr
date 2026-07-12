"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import type { MaintenanceCompleteFormValues, MaintenanceRecord } from "@/types/maintenance";

type MaintenanceCompleteModalProps = {
  record: MaintenanceRecord | null;
  onClose: () => void;
  onConfirm: (recordId: string, values: MaintenanceCompleteFormValues) => void;
};

type CompleteErrors = Partial<Record<keyof MaintenanceCompleteFormValues, string>>;

const emptyValues: MaintenanceCompleteFormValues = {
  actualCost: "",
  serviceNotes: "",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function MaintenanceCompleteModal({
  onClose,
  onConfirm,
  record,
}: MaintenanceCompleteModalProps) {
  return (
    <Modal
      isOpen={Boolean(record)}
      onClose={onClose}
      title="Complete Maintenance"
      className="max-w-lg"
    >
      {record ? (
        <CompleteForm
          key={record.id}
          record={record}
          onCancel={onClose}
          onConfirm={(values) => onConfirm(record.id, values)}
        />
      ) : null}
    </Modal>
  );
}

function CompleteForm({
  onCancel,
  onConfirm,
  record,
}: {
  record: MaintenanceRecord;
  onCancel: () => void;
  onConfirm: (values: MaintenanceCompleteFormValues) => void;
}) {
  const [values, setValues] = useState<MaintenanceCompleteFormValues>({
    ...emptyValues,
    actualCost: String(record.estimatedCost),
  });
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validateComplete(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  function update<K extends keyof MaintenanceCompleteFormValues>(
    key: K,
    value: MaintenanceCompleteFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    onConfirm(values);
  }

  return (
    <div>
      {/* Summary row */}
      <div className="mb-4 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm">
        <p className="text-slate-400">
          <span className="font-semibold text-slate-100">{record.maintenanceId}</span>
          {" · "}
          {record.vehicleName} — {record.serviceType}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Estimated cost:{" "}
          <span className="text-slate-300">
            {currencyFormatter.format(record.estimatedCost)}
          </span>
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Actual Cost (₹)"
          type="number"
          min={0}
          placeholder="e.g. 3200"
          value={values.actualCost}
          onChange={(e) => update("actualCost", e.target.value)}
          error={submitted ? errors.actualCost : undefined}
          inputMode="numeric"
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Service Notes{" "}
            <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Describe work carried out, parts replaced, observations…"
            value={values.serviceNotes}
            onChange={(e) => update("serviceNotes", e.target.value)}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:justify-end">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            disabled={submitted && !isValid}
          >
            Mark as Completed
          </Button>
        </div>
      </form>
    </div>
  );
}

function validateComplete(
  values: MaintenanceCompleteFormValues,
): CompleteErrors {
  const errors: CompleteErrors = {};
  const cost = Number(values.actualCost);
  if (!values.actualCost || isNaN(cost) || cost < 0) {
    errors.actualCost = "Enter a valid actual cost.";
  }
  return errors;
}
