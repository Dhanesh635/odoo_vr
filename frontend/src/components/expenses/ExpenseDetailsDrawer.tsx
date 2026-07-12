"use client";

import { useEffect } from "react";
import type { Expense, ExpenseType, FuelLog } from "@/types/expense";

// ─── Union type for both drawer item types ─────────────────────────────────────

export type DrawerItem =
  | { kind: "expense"; data: Expense }
  | { kind: "fuel"; data: FuelLog };

type ExpenseDetailsDrawerProps = {
  item: DrawerItem | null;
  onClose: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const typeColors: Record<ExpenseType, string> = {
  Fuel: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Maintenance: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Toll: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  Parking: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  Insurance: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  Repairs: "border-red-500/30 bg-red-500/10 text-red-300",
  Other: "border-slate-600/30 bg-slate-600/10 text-slate-400",
};

export default function ExpenseDetailsDrawer({
  item,
  onClose,
}: ExpenseDetailsDrawerProps) {
  useEffect(() => {
    if (!item) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  const title =
    item.kind === "fuel"
      ? `${item.data.fuelLogId} — ${item.data.vehicleName}`
      : `${item.data.expenseId} — ${item.data.vehicleName}`;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expense-drawer-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close details"
      />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
              {item.kind === "fuel" ? "Fuel Log Details" : "Expense Details"}
            </p>
            <h2
              id="expense-drawer-title"
              className="mt-1 text-lg font-semibold text-slate-50"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {item.kind === "fuel" ? (
            <FuelLogDetails log={item.data} />
          ) : (
            <ExpenseDetails expense={item.data} />
          )}
        </div>
      </aside>
    </div>
  );
}

// ─── Fuel Log detail body ──────────────────────────────────────────────────────

function FuelLogDetails({ log }: { log: FuelLog }) {
  const efficiencyColor =
    log.fuelEfficiency >= 13
      ? "text-emerald-400"
      : log.fuelEfficiency >= 10
        ? "text-amber-400"
        : "text-red-400";

  return (
    <>
      <SectionTitle>Fuel Information</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <DetailItem label="Fuel Log ID" value={log.fuelLogId} />
        <DetailItem label="Vehicle" value={log.vehicleName} />
        <DetailItem label="Vehicle Type" value={log.vehicleType} />
        <DetailItem
          label="Date"
          value={dateFormatter.format(new Date(log.date))}
        />
        <DetailItem label="Fuel Quantity" value={`${log.fuelQuantity} L`} />
        <DetailItem label="Fuel Cost" value={fmt.format(log.fuelCost)} />
        <DetailItem
          label="Distance Covered"
          value={`${log.distanceCovered} km`}
        />
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-xs text-slate-500">Fuel Efficiency</dt>
          <dd className={["mt-1 text-sm font-bold", efficiencyColor].join(" ")}>
            {log.fuelEfficiency.toFixed(1)} km/L
          </dd>
        </div>
      </div>
      {log.fuelStation && (
        <DetailItemFull label="Fuel Station" value={log.fuelStation} />
      )}
      {log.remarks && (
        <DetailItemFull label="Remarks" value={log.remarks} />
      )}
      <ReceiptPlaceholder />
    </>
  );
}

// ─── Expense detail body ───────────────────────────────────────────────────────

function ExpenseDetails({ expense }: { expense: Expense }) {
  return (
    <>
      <SectionTitle>Expense Information</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <DetailItem label="Expense ID" value={expense.expenseId} />
        <DetailItem label="Vehicle" value={expense.vehicleName} />
        <DetailItem label="Vehicle Type" value={expense.vehicleType} />
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-xs text-slate-500">Expense Type</dt>
          <dd className="mt-1">
            <span
              className={[
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                typeColors[expense.expenseType],
              ].join(" ")}
            >
              {expense.expenseType}
            </span>
          </dd>
        </div>
        <DetailItem label="Amount" value={fmt.format(expense.amount)} />
        <div className="col-span-2">
          <DetailItem
            label="Date"
            value={dateFormatter.format(new Date(expense.date))}
          />
        </div>
      </div>
      {expense.description && (
        <DetailItemFull label="Description" value={expense.description} />
      )}
      <ReceiptPlaceholder />
    </>
  );
}

// ─── Shared sub-components ─────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </h3>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-100">{value}</dd>
    </div>
  );
}

function DetailItemFull({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-300">{value}</p>
    </div>
  );
}

function ReceiptPlaceholder() {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Receipt
      </p>
      <div className="flex cursor-not-allowed items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center">
        <div>
          <svg
            className="mx-auto h-8 w-8 text-slate-600"
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
          <p className="mt-2 text-xs text-slate-500">No receipt attached</p>
        </div>
      </div>
    </div>
  );
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
