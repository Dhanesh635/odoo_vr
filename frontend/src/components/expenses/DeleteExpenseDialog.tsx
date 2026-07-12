"use client";

import { ConfirmDialog } from "@/components/ui";
import type { Expense, FuelLog } from "@/types/expense";

// ─── Fuel Log delete dialog ────────────────────────────────────────────────────

type DeleteFuelLogDialogProps = {
  log: FuelLog | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteFuelLogDialog({
  log,
  onCancel,
  onConfirm,
}: DeleteFuelLogDialogProps) {
  return (
    <ConfirmDialog
      isOpen={Boolean(log)}
      title="Delete Fuel Log?"
      description={
        log
          ? `Permanently delete ${log.fuelLogId} (${log.vehicleName} — ${log.date})? This cannot be undone.`
          : ""
      }
      confirmLabel="Delete"
      confirmVariant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

// ─── Expense delete dialog ─────────────────────────────────────────────────────

type DeleteExpenseDialogProps = {
  expense: Expense | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteExpenseDialog({
  expense,
  onCancel,
  onConfirm,
}: DeleteExpenseDialogProps) {
  return (
    <ConfirmDialog
      isOpen={Boolean(expense)}
      title="Delete Expense?"
      description={
        expense
          ? `Permanently delete ${expense.expenseId} (${expense.vehicleName} — ${expense.expenseType})? This cannot be undone.`
          : ""
      }
      confirmLabel="Delete"
      confirmVariant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
