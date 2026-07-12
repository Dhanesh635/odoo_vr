"use client";

import { Button, EmptyState, Table, type TableColumn } from "@/components/ui";
import type { Expense, ExpenseType } from "@/types/expense";

type ExpenseTableProps = {
  expenses: Expense[];
  onAdd: () => void;
  onView: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
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

function TypeBadge({ type }: { type: ExpenseType }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        typeColors[type],
      ].join(" ")}
    >
      {type}
    </span>
  );
}

export default function ExpenseTable({
  expenses,
  onAdd,
  onDelete,
  onView,
}: ExpenseTableProps) {
  const columns: TableColumn<Expense>[] = [
    { key: "expenseId", header: "Expense ID", accessor: "expenseId" },
    { key: "vehicleName", header: "Vehicle", accessor: "vehicleName" },
    {
      key: "expenseType",
      header: "Type",
      render: (e) => <TypeBadge type={e.expenseType} />,
    },
    {
      key: "amount",
      header: "Amount",
      render: (e) => (
        <span className="font-semibold text-slate-100">
          {fmt.format(e.amount)}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (e) => dateFormatter.format(new Date(e.date)),
    },
    {
      key: "description",
      header: "Description",
      render: (e) => (
        <span className="max-w-xs truncate text-slate-300">
          {e.description || "—"}
        </span>
      ),
    },
  ];

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No Expenses Found"
        description="Start tracking fuel and operational expenses."
        action={
          <Button onClick={onAdd} leftIcon={<PlusIcon />}>
            Add Expense
          </Button>
        }
      />
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          data={expenses}
          getRowKey={(e) => e.id}
          actions={(e) => (
            <div className="flex items-center justify-end gap-1.5">
              <IconButton label="View" onClick={() => onView(e)}>
                <ViewIcon />
              </IconButton>
              <IconButton label="Delete" tone="danger" onClick={() => onDelete(e)}>
                <TrashIcon />
              </IconButton>
            </div>
          )}
        />
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {expenses.map((expense) => (
          <article
            key={expense.id}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-black/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {expense.expenseId}
                </p>
                <h2 className="mt-1 text-base font-semibold text-slate-50">
                  {expense.vehicleName}
                </h2>
              </div>
              <TypeBadge type={expense.expenseType} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Meta label="Amount" value={fmt.format(expense.amount)} />
              <Meta label="Date" value={dateFormatter.format(new Date(expense.date))} />
              {expense.description && (
                <div className="col-span-2">
                  <Meta label="Description" value={expense.description} />
                </div>
              )}
            </dl>
            <div className="mt-4 flex justify-end gap-2">
              <IconButton label="View" onClick={() => onView(expense)}>
                <ViewIcon />
              </IconButton>
              <IconButton label="Delete" tone="danger" onClick={() => onDelete(expense)}>
                <TrashIcon />
              </IconButton>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-200">{value}</dd>
    </div>
  );
}

type Tone = "default" | "danger";
function IconButton({
  children,
  label,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: Tone;
}) {
  const toneClasses: Record<Tone, string> = {
    default: "border-slate-700 text-slate-300 hover:border-amber-500/40 hover:bg-slate-800 hover:text-amber-200",
    danger: "border-red-500/20 text-red-300 hover:bg-red-500/10",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        toneClasses[tone],
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function SvgIcon({ paths }: { paths: string[] }) {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {paths.map((p, i) => (
        <path key={i} d={p} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      ))}
    </svg>
  );
}
function ViewIcon() {
  return <SvgIcon paths={["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />;
}
function TrashIcon() {
  return <SvgIcon paths={["M4 7h16", "M9 7V5h6v2", "m8 10 .8 9h8.4L18 10"]} />;
}
function PlusIcon() {
  return <SvgIcon paths={["M12 5v14M5 12h14"]} />;
}
