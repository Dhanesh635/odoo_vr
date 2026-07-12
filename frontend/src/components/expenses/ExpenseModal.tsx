"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button, Input, Modal, Select } from "@/components/ui";
import { expenseTypeFormOptions } from "@/constants/expenses";
import { vehicles } from "@/constants/vehicles";
import type { ExpenseFormValues, ExpenseType } from "@/types/expense";

type ExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ExpenseFormValues) => void;
};

const vehicleOptions = vehicles.map((v) => ({
  label: `${v.vehicleName} (${v.type})`,
  value: v.id,
}));

const empty: ExpenseFormValues = {
  vehicleId: "",
  expenseType: "",
  amount: "",
  date: "",
  description: "",
};

type Errors = Partial<Record<keyof ExpenseFormValues, string>>;

export default function ExpenseModal({
  isOpen,
  onClose,
  onSave,
}: ExpenseModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense" className="max-w-xl">
      <ExpenseForm key={isOpen ? "open" : "closed"} onCancel={onClose} onSave={onSave} />
    </Modal>
  );
}

function ExpenseForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (values: ExpenseFormValues) => void;
}) {
  const [values, setValues] = useState<ExpenseFormValues>(empty);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  function update<K extends keyof ExpenseFormValues>(k: K, v: ExpenseFormValues[K]) {
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

      <Select
        label="Expense Type"
        value={values.expenseType}
        options={expenseTypeFormOptions}
        placeholder="Select type"
        onChange={(e) =>
          update("expenseType", e.target.value as ExpenseType)
        }
        error={submitted ? errors.expenseType : undefined}
      />

      <Input
        label="Amount (₹)"
        type="number"
        min={1}
        placeholder="e.g. 1200"
        value={values.amount}
        onChange={(e) => update("amount", e.target.value)}
        error={submitted ? errors.amount : undefined}
        inputMode="numeric"
        required
      />

      <div className="sm:col-span-2">
        <Input
          label="Expense Date"
          type="date"
          value={values.date}
          onChange={(e) => update("date", e.target.value)}
          error={submitted ? errors.date : undefined}
          required
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Describe this expense…"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
        />
        {submitted && errors.description ? (
          <p className="mt-1.5 text-sm text-red-400">{errors.description}</p>
        ) : null}
      </div>

      {/* Receipt upload placeholder */}
      <div className="sm:col-span-2">
        <p className="mb-2 text-sm font-medium text-slate-200">
          Receipt{" "}
          <span className="font-normal text-slate-500">(optional)</span>
        </p>
        <div className="flex cursor-not-allowed items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
          <div>
            <UploadIcon />
            <p className="mt-2 text-sm text-slate-500">
              Receipt upload not available in this demo
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitted && !isValid}>Save Expense</Button>
      </div>
    </form>
  );
}

function validate(v: ExpenseFormValues): Errors {
  const errors: Errors = {};
  if (!v.vehicleId) errors.vehicleId = "Vehicle is required.";
  if (!v.expenseType) errors.expenseType = "Expense type is required.";
  if (!v.amount || Number(v.amount) <= 0) errors.amount = "Enter a valid amount.";
  if (!v.date) errors.date = "Date is required.";
  if (!v.description.trim()) errors.description = "Description is required.";
  return errors;
}

function UploadIcon() {
  return (
    <svg className="mx-auto h-8 w-8 text-slate-600" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
