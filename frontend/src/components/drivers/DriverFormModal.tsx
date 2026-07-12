"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button, Input, Modal, Select } from "@/components/ui";
import {
  driverFormStatusOptions,
  licenseCategoryOptions,
} from "@/constants/drivers";
import type { Driver, DriverFormValues } from "@/types/driver";

type DriverFormModalProps = {
  isOpen: boolean;
  driver: Driver | null;
  onClose: () => void;
  onSave: (values: DriverFormValues) => void;
};

type DriverFormErrors = Partial<Record<keyof DriverFormValues, string>>;

const emptyValues: DriverFormValues = {
  fullName: "",
  phoneNumber: "",
  email: "",
  licenseNumber: "",
  licenseCategory: "",
  licenseExpiryDate: "",
  safetyScore: "",
  status: "",
};

export default function DriverFormModal({
  driver,
  isOpen,
  onClose,
  onSave,
}: DriverFormModalProps) {
  const initialValues = driver
    ? {
        fullName: driver.fullName,
        phoneNumber: driver.phoneNumber,
        email: driver.email,
        licenseNumber: driver.licenseNumber,
        licenseCategory: driver.licenseCategory,
        licenseExpiryDate: driver.licenseExpiryDate,
        safetyScore: String(driver.safetyScore),
        status: driver.status,
      }
    : emptyValues;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={driver ? "Edit Driver" : "Add Driver"}
      className="max-w-2xl"
    >
      <DriverForm
        key={driver?.id ?? "new-driver"}
        initialValues={initialValues}
        onCancel={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}

function DriverForm({
  initialValues,
  onCancel,
  onSave,
}: {
  initialValues: DriverFormValues;
  onCancel: () => void;
  onSave: (values: DriverFormValues) => void;
}) {
  const [values, setValues] = useState<DriverFormValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validateDriverForm(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  function updateValue<TKey extends keyof DriverFormValues>(
    key: TKey,
    value: DriverFormValues[TKey],
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
        label="Full Name"
        value={values.fullName}
        onChange={(event) => updateValue("fullName", event.target.value)}
        error={submitted ? errors.fullName : undefined}
        autoComplete="name"
        required
      />
      <Input
        label="Phone Number"
        value={values.phoneNumber}
        onChange={(event) => updateValue("phoneNumber", event.target.value)}
        error={submitted ? errors.phoneNumber : undefined}
        autoComplete="tel"
        inputMode="numeric"
        required
      />
      <Input
        label="Email"
        type="email"
        value={values.email}
        onChange={(event) => updateValue("email", event.target.value)}
        error={submitted ? errors.email : undefined}
        autoComplete="email"
        required
      />
      <Input
        label="License Number"
        value={values.licenseNumber}
        onChange={(event) => updateValue("licenseNumber", event.target.value)}
        error={submitted ? errors.licenseNumber : undefined}
        autoComplete="off"
        required
      />
      <Select
        label="License Category"
        value={values.licenseCategory}
        options={licenseCategoryOptions}
        onChange={(event) =>
          updateValue(
            "licenseCategory",
            event.target.value as DriverFormValues["licenseCategory"],
          )
        }
        error={submitted ? errors.licenseCategory : undefined}
      />
      <Input
        label="License Expiry Date"
        type="date"
        value={values.licenseExpiryDate}
        onChange={(event) => updateValue("licenseExpiryDate", event.target.value)}
        error={submitted ? errors.licenseExpiryDate : undefined}
        required
      />
      <Input
        label="Safety Score"
        type="number"
        min={0}
        max={100}
        value={values.safetyScore}
        onChange={(event) => updateValue("safetyScore", event.target.value)}
        error={submitted ? errors.safetyScore : undefined}
        inputMode="numeric"
        required
      />
      <Select
        label="Status"
        value={values.status}
        options={driverFormStatusOptions}
        onChange={(event) =>
          updateValue("status", event.target.value as DriverFormValues["status"])
        }
        error={submitted ? errors.status : undefined}
      />

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid}>
          Save Driver
        </Button>
      </div>
    </form>
  );
}

function validateDriverForm(values: DriverFormValues): DriverFormErrors {
  const errors: DriverFormErrors = {};
  const safetyScore = Number(values.safetyScore);

  if (!values.fullName.trim()) {
    errors.fullName = "Full Name is required.";
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = "Phone Number is required.";
  } else if (!/^\d+$/.test(values.phoneNumber)) {
    errors.phoneNumber = "Phone number must contain digits only.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.licenseNumber.trim()) {
    errors.licenseNumber = "License Number is required.";
  }

  if (!values.licenseCategory) {
    errors.licenseCategory = "License Category is required.";
  }

  if (!values.licenseExpiryDate) {
    errors.licenseExpiryDate = "Expiry Date is required.";
  }

  if (
    values.safetyScore === "" ||
    Number.isNaN(safetyScore) ||
    safetyScore < 0 ||
    safetyScore > 100
  ) {
    errors.safetyScore = "Safety Score must be between 0 and 100.";
  }

  if (!values.status) {
    errors.status = "Status is required.";
  }

  return errors;
}
