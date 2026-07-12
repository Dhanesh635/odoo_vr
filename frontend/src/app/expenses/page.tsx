"use client";

import { useMemo, useState } from "react";
import { Button, Card, PageTransition, PageSection } from "@/components/ui";
import CostBreakdownChart from "@/components/expenses/CostBreakdownChart";
import {
  DeleteExpenseDialog,
  DeleteFuelLogDialog,
} from "@/components/expenses/DeleteExpenseDialog";
import ExpenseDetailsDrawer, {
  type DrawerItem,
} from "@/components/expenses/ExpenseDetailsDrawer";
import ExpenseFilters from "@/components/expenses/ExpenseFilters";
import ExpenseModal from "@/components/expenses/ExpenseModal";
import ExpenseSummaryCards from "@/components/expenses/ExpenseSummaryCards";
import ExpenseTable from "@/components/expenses/ExpenseTable";
import FuelLogModal from "@/components/expenses/FuelLogModal";
import FuelLogTable from "@/components/expenses/FuelLogTable";
import VehicleExpenseCard from "@/components/expenses/VehicleExpenseCard";
import {
  initialExpenseFilters,
  mockExpenses,
  mockFuelLogs,
} from "@/constants/expenses";
import { vehicles } from "@/constants/vehicles";
import type {
  Expense,
  ExpenseFiltersState,
  ExpenseFormValues,
  ExpenseSortKey,
  ExpenseType,
  FuelLog,
  FuelLogFormValues,
  PieChartEntry,
  VehicleExpenseSummary,
} from "@/types/expense";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function nextId(prefix: string, items: { id: string }[]): string {
  const max = items.reduce((n, item) => {
    const num = parseInt(item.id.replace(`${prefix.toLowerCase()}-`, ""), 10);
    return isNaN(num) ? n : Math.max(n, num);
  }, 0);
  return `${prefix.toLowerCase()}-${max + 1}`;
}

function nextHumanId(prefix: string, items: Array<{ fuelLogId?: string; expenseId?: string }>): string {
  const max = items.reduce((n, item) => {
    const raw = item.fuelLogId ?? item.expenseId ?? "";
    const num = parseInt(raw.replace(prefix, ""), 10);
    return isNaN(num) ? n : Math.max(n, num);
  }, 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

function isInDateRange(dateStr: string, range: ExpenseFiltersState["dateRange"]): boolean {
  if (range === "All") return true;
  const date = new Date(dateStr);
  const now = new Date();

  if (range === "This Week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return date >= weekAgo;
  }
  if (range === "This Month") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }
  if (range === "Last 3 Months") {
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    return date >= threeMonthsAgo;
  }
  return true;
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────

type ActiveTab = "fuel" | "expenses";

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ExpensesPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(mockFuelLogs);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [activeTab, setActiveTab] = useState<ActiveTab>("fuel");
  const [filters, setFilters] =
    useState<ExpenseFiltersState>(initialExpenseFilters);

  // Modal / drawer state
  const [isFuelLogModalOpen, setIsFuelLogModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<DrawerItem | null>(null);
  const [fuelLogPendingDelete, setFuelLogPendingDelete] =
    useState<FuelLog | null>(null);
  const [expensePendingDelete, setExpensePendingDelete] =
    useState<Expense | null>(null);

  // ─── Filtering helpers ──────────────────────────────────────────────────────

  function updateFilter<K extends keyof ExpenseFiltersState>(
    key: K,
    value: ExpenseFiltersState[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  // ─── Filtered + sorted fuel logs ───────────────────────────────────────────

  const visibleFuelLogs = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return fuelLogs
      .filter((l) => {
        const matchSearch =
          !query ||
          l.vehicleName.toLowerCase().includes(query) ||
          l.fuelLogId.toLowerCase().includes(query);
        const matchVehicle =
          filters.vehicleId === "All" || l.vehicleId === filters.vehicleId;
        const matchDate = isInDateRange(l.date, filters.dateRange);
        return matchSearch && matchVehicle && matchDate;
      })
      .toSorted((a, b) => {
        const sortBy: ExpenseSortKey = filters.sortBy;
        if (sortBy === "Oldest") return a.createdAt.localeCompare(b.createdAt);
        if (sortBy === "Highest Cost") return b.fuelCost - a.fuelCost;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [fuelLogs, filters]);

  // ─── Filtered + sorted expenses ────────────────────────────────────────────

  const visibleExpenses = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return expenses
      .filter((e) => {
        const matchSearch =
          !query ||
          e.vehicleName.toLowerCase().includes(query) ||
          e.expenseId.toLowerCase().includes(query);
        const matchVehicle =
          filters.vehicleId === "All" || e.vehicleId === filters.vehicleId;
        const matchType =
          filters.expenseType === "All" ||
          (e.expenseType as ExpenseType) === filters.expenseType;
        const matchDate = isInDateRange(e.date, filters.dateRange);
        return matchSearch && matchVehicle && matchType && matchDate;
      })
      .toSorted((a, b) => {
        const sortBy: ExpenseSortKey = filters.sortBy;
        if (sortBy === "Oldest") return a.createdAt.localeCompare(b.createdAt);
        if (sortBy === "Highest Cost") return b.amount - a.amount;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [expenses, filters]);

  // ─── Vehicle expense summaries ─────────────────────────────────────────────

  const vehicleSummaries = useMemo<VehicleExpenseSummary[]>(() => {
    return vehicles.map((v) => {
      const vFuel = fuelLogs.filter((l) => l.vehicleId === v.id);
      const vExp = expenses.filter((e) => e.vehicleId === v.id);

      const fuelCost = vFuel.reduce((s, l) => s + l.fuelCost, 0);
      const maintenanceCost = vExp
        .filter((e) => e.expenseType === "Maintenance" || e.expenseType === "Repairs")
        .reduce((s, e) => s + e.amount, 0);
      const otherCost = vExp
        .filter((e) => e.expenseType !== "Maintenance" && e.expenseType !== "Repairs")
        .reduce((s, e) => s + e.amount, 0);

      const avgFuelEfficiency =
        vFuel.length > 0
          ? vFuel.reduce((s, l) => s + l.fuelEfficiency, 0) / vFuel.length
          : null;

      return {
        vehicleId: v.id,
        vehicleName: v.vehicleName,
        vehicleType: v.type,
        fuelCost,
        maintenanceCost,
        otherCost,
        totalCost: fuelCost + maintenanceCost + otherCost,
        avgFuelEfficiency,
      };
    });
  }, [fuelLogs, expenses]);

  // ─── Pie chart data ────────────────────────────────────────────────────────

  const pieData = useMemo<PieChartEntry[]>(() => {
    const totalFuel = fuelLogs.reduce((s, l) => s + l.fuelCost, 0);
    const totalMaint = expenses
      .filter((e) => e.expenseType === "Maintenance" || e.expenseType === "Repairs")
      .reduce((s, e) => s + e.amount, 0);
    const totalOther = expenses
      .filter((e) => e.expenseType !== "Maintenance" && e.expenseType !== "Repairs")
      .reduce((s, e) => s + e.amount, 0);
    return [
      { name: "Fuel", value: totalFuel, color: "#f59e0b" },
      { name: "Maintenance", value: totalMaint, color: "#f97316" },
      { name: "Other", value: totalOther, color: "#64748b" },
    ];
  }, [fuelLogs, expenses]);

  // ─── Save fuel log ─────────────────────────────────────────────────────────

  function handleSaveFuelLog(values: FuelLogFormValues) {
    const vehicle = vehicles.find((v) => v.id === values.vehicleId);
    if (!vehicle) return;
    const qty = Number(values.fuelQuantity);
    const dist = Number(values.distanceCovered);
    const efficiency = qty > 0 ? Math.round((dist / qty) * 10) / 10 : 0;
    const ts = new Date().toISOString();

    const newLog: FuelLog = {
      id: nextId("fuel", fuelLogs),
      fuelLogId: nextHumanId("FL", fuelLogs),
      vehicleId: values.vehicleId,
      vehicleName: vehicle.vehicleName,
      vehicleType: vehicle.type,
      date: values.date,
      fuelQuantity: qty,
      fuelCost: Number(values.fuelCost),
      distanceCovered: dist,
      fuelEfficiency: efficiency,
      fuelStation: values.fuelStation,
      remarks: values.remarks,
      createdAt: ts,
    };
    setFuelLogs((prev) => [newLog, ...prev]);
    setIsFuelLogModalOpen(false);
  }

  // ─── Save expense ──────────────────────────────────────────────────────────

  function handleSaveExpense(values: ExpenseFormValues) {
    const vehicle = vehicles.find((v) => v.id === values.vehicleId);
    if (!vehicle) return;
    const ts = new Date().toISOString();

    const newExpense: Expense = {
      id: nextId("exp", expenses),
      expenseId: nextHumanId("EX", expenses),
      vehicleId: values.vehicleId,
      vehicleName: vehicle.vehicleName,
      vehicleType: vehicle.type,
      expenseType: values.expenseType as ExpenseType,
      amount: Number(values.amount),
      date: values.date,
      description: values.description,
      createdAt: ts,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setIsExpenseModalOpen(false);
  }

  // ─── Delete ────────────────────────────────────────────────────────────────

  function handleDeleteFuelLogConfirm() {
    if (!fuelLogPendingDelete) return;
    setFuelLogs((prev) => prev.filter((l) => l.id !== fuelLogPendingDelete.id));
    setFuelLogPendingDelete(null);
  }

  function handleDeleteExpenseConfirm() {
    if (!expensePendingDelete) return;
    setExpenses((prev) => prev.filter((e) => e.id !== expensePendingDelete.id));
    setExpensePendingDelete(null);
  }

  // ─── CSV Export ────────────────────────────────────────────────────────────

  function handleExportCsv() {
    if (activeTab === "fuel") {
      const headers = ["Fuel Log ID", "Vehicle", "Date", "Qty (L)", "Cost (₹)", "Distance (km)", "Efficiency (km/L)", "Station"];
      const rows = visibleFuelLogs.map((l) =>
        [l.fuelLogId, l.vehicleName, l.date, l.fuelQuantity, l.fuelCost, l.distanceCovered, l.fuelEfficiency, l.fuelStation].join(","),
      );
      downloadCsv([headers.join(","), ...rows].join("\n"), "fuel-logs.csv");
    } else {
      const headers = ["Expense ID", "Vehicle", "Type", "Amount (₹)", "Date", "Description"];
      const rows = visibleExpenses.map((e) =>
        [e.expenseId, e.vehicleName, e.expenseType, e.amount, e.date, `"${e.description}"`].join(","),
      );
      downloadCsv([headers.join(","), ...rows].join("\n"), "expenses.csv");
    }
  }

  function downloadCsv(csv: string, filename: string) {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <PageTransition className="space-y-6">
      {/* Page Header */}
      <PageSection>
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">
              Fuel &amp; Expense Management
            </h1>
            <p className="mt-2 text-base text-slate-400">
              Track fuel usage and operational expenses across your fleet.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => setIsFuelLogModalOpen(true)}
              leftIcon={<FuelIcon />}
            >
              Add Fuel Log
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsExpenseModalOpen(true)}
              leftIcon={<PlusIcon />}
            >
              Add Expense
            </Button>
            <Button
              variant="secondary"
              onClick={handleExportCsv}
              leftIcon={<ExportIcon />}
            >
              Export CSV
            </Button>
          </div>
        </header>
      </PageSection>

      {/* Summary Cards */}
      <PageSection>
        <ExpenseSummaryCards fuelLogs={fuelLogs} expenses={expenses} />
      </PageSection>

      {/* Charts */}
      <PageSection>
        <CostBreakdownChart pieData={pieData} />
      </PageSection>

      {/* Vehicle Cost Cards */}
      <PageSection>
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">
            Vehicle Cost Overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicleSummaries.map((summary) => (
              <VehicleExpenseCard key={summary.vehicleId} summary={summary} />
            ))}
          </div>
        </section>
      </PageSection>

      {/* Filters */}
      <PageSection>
        <Card bodyClassName="p-4">
          <ExpenseFilters filters={filters} onChange={updateFilter} />
        </Card>
      </PageSection>

      {/* Tabs + tables */}
      <PageSection>
        <Card bodyClassName="p-0">
          {/* Tab bar */}
          <div className="flex border-b border-slate-800">
            <TabButton
              active={activeTab === "fuel"}
              onClick={() => setActiveTab("fuel")}
              count={visibleFuelLogs.length}
            >
              Fuel Logs
            </TabButton>
            <TabButton
              active={activeTab === "expenses"}
              onClick={() => setActiveTab("expenses")}
              count={visibleExpenses.length}
            >
              Expenses
            </TabButton>
          </div>

          <div className="p-4 md:p-5">
            {activeTab === "fuel" ? (
              <FuelLogTable
                logs={visibleFuelLogs}
                onAdd={() => setIsFuelLogModalOpen(true)}
                onView={(l) => setDrawerItem({ kind: "fuel", data: l })}
                onDelete={setFuelLogPendingDelete}
              />
            ) : (
              <ExpenseTable
                expenses={visibleExpenses}
                onAdd={() => setIsExpenseModalOpen(true)}
                onView={(e) => setDrawerItem({ kind: "expense", data: e })}
                onDelete={setExpensePendingDelete}
              />
            )}
          </div>
        </Card>
      </PageSection>

      {/* Modals */}
      <FuelLogModal
        isOpen={isFuelLogModalOpen}
        onClose={() => setIsFuelLogModalOpen(false)}
        onSave={handleSaveFuelLog}
      />
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
      />

      {/* Details Drawer */}
      <ExpenseDetailsDrawer
        item={drawerItem}
        onClose={() => setDrawerItem(null)}
      />

      {/* Delete dialogs */}
      <DeleteFuelLogDialog
        log={fuelLogPendingDelete}
        onCancel={() => setFuelLogPendingDelete(null)}
        onConfirm={handleDeleteFuelLogConfirm}
      />
      <DeleteExpenseDialog
        expense={expensePendingDelete}
        onCancel={() => setExpensePendingDelete(null)}
        onConfirm={handleDeleteExpenseConfirm}
      />
    </PageTransition>
  );
}

// ─── Tab Button ────────────────────────────────────────────────────────────────

function TabButton({
  active,
  children,
  count,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-semibold transition-colors focus-visible:outline-none",
        active
          ? "border-amber-400 text-amber-300"
          : "border-transparent text-slate-400 hover:text-slate-200",
      ].join(" ")}
    >
      {children}
      <span
        className={[
          "rounded-full px-2 py-0.5 text-xs font-bold",
          active
            ? "bg-amber-500/20 text-amber-300"
            : "bg-slate-800 text-slate-500",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function FuelIcon() {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 22h12M15 8h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h0v5a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M7 6h4v4H7z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
function PlusIcon() {
  return <Icon path="M12 5v14M5 12h14" />;
}
function ExportIcon() {
  return <Icon path="M12 3v10m0 0 4-4m-4 4-4-4M5 15v4h14v-4" />;
}
function Icon({ path }: { path: string }) {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
