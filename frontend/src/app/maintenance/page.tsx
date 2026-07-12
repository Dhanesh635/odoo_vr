"use client";

import { useMemo, useState } from "react";
import { Button, Card, ConfirmDialog, PageTransition, PageSection } from "@/components/ui";
import MaintenanceCompleteModal from "@/components/maintenance/MaintenanceCompleteModal";
import MaintenanceDetailsDrawer from "@/components/maintenance/MaintenanceDetailsDrawer";
import MaintenanceFilters from "@/components/maintenance/MaintenanceFilters";
import MaintenanceFormModal from "@/components/maintenance/MaintenanceFormModal";
import MaintenanceSummaryCards from "@/components/maintenance/MaintenanceSummaryCards";
import MaintenanceTable from "@/components/maintenance/MaintenanceTable";
import {
  initialMaintenanceFilters,
  mockMaintenanceRecords,
} from "@/constants/maintenance";
import { vehicles } from "@/constants/vehicles";
import type {
  MaintenanceCompleteFormValues,
  MaintenanceFiltersState,
  MaintenanceFormValues,
  MaintenanceRecord,
  MaintenanceSortKey,
  MaintenanceStatus,
  ServiceType,
} from "@/types/maintenance";
import type { VehicleType } from "@/types/vehicle";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateMaintenanceId(existing: MaintenanceRecord[]): string {
  const max = existing.reduce((n, r) => {
    const num = parseInt(r.maintenanceId.replace("MT", ""), 10);
    return isNaN(num) ? n : Math.max(n, num);
  }, 0);
  return `MT${String(max + 1).padStart(3, "0")}`;
}

function now() {
  return new Date().toISOString();
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function MaintenancePage() {
  const [records, setRecords] = useState<MaintenanceRecord[]>(
    mockMaintenanceRecords,
  );
  const [filters, setFilters] = useState<MaintenanceFiltersState>(
    initialMaintenanceFilters,
  );

  // Drawer / modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(
    null,
  );
  const [selectedRecord, setSelectedRecord] =
    useState<MaintenanceRecord | null>(null);
  const [recordPendingComplete, setRecordPendingComplete] =
    useState<MaintenanceRecord | null>(null);
  const [recordPendingCancel, setRecordPendingCancel] =
    useState<MaintenanceRecord | null>(null);
  const [recordPendingDelete, setRecordPendingDelete] =
    useState<MaintenanceRecord | null>(null);

  // ─── Filtering + sorting ──────────────────────────────────────────────────

  const visibleRecords = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return records
      .filter((r) => {
        const matchesSearch =
          !query ||
          r.vehicleName.toLowerCase().includes(query) ||
          r.maintenanceId.toLowerCase().includes(query) ||
          r.technician.toLowerCase().includes(query) ||
          r.serviceType.toLowerCase().includes(query);

        const matchesStatus =
          filters.status === "All" ||
          (r.status as MaintenanceStatus) === filters.status;

        const matchesVehicleType =
          filters.vehicleType === "All" ||
          (r.vehicleType as VehicleType) === filters.vehicleType;

        const matchesServiceType =
          filters.serviceType === "All" ||
          (r.serviceType as ServiceType) === filters.serviceType;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesVehicleType &&
          matchesServiceType
        );
      })
      .toSorted((a, b) => {
        const sortBy: MaintenanceSortKey = filters.sortBy;
        switch (sortBy) {
          case "Oldest":
            return a.createdAt.localeCompare(b.createdAt);
          case "Highest Cost":
            return (
              (b.actualCost ?? b.estimatedCost) -
              (a.actualCost ?? a.estimatedCost)
            );
          case "Newest":
          default:
            return b.createdAt.localeCompare(a.createdAt);
        }
      });
  }, [records, filters]);

  // ─── Filter helper ────────────────────────────────────────────────────────

  function updateFilter<K extends keyof MaintenanceFiltersState>(
    key: K,
    value: MaintenanceFiltersState[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  // ─── Schedule / Edit ──────────────────────────────────────────────────────

  function openScheduleModal() {
    setEditingRecord(null);
    setIsFormOpen(true);
  }

  function openEditModal(record: MaintenanceRecord) {
    setEditingRecord(record);
    setIsFormOpen(true);
  }

  function handleFormSave(values: MaintenanceFormValues, recordId?: string) {
    const vehicle = vehicles.find((v) => v.id === values.vehicleId);
    if (!vehicle) return;

    const timestamp = now();

    if (recordId) {
      // Edit existing
      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? {
                ...r,
                vehicleId: values.vehicleId,
                vehicleName: vehicle.vehicleName,
                vehicleType: vehicle.type,
                registrationNumber: vehicle.registrationNumber,
                serviceType: values.serviceType as ServiceType,
                technician: values.technician,
                priority: values.priority as MaintenanceRecord["priority"],
                description: values.description,
                startDate: values.startDate,
                expectedCompletion: values.expectedCompletion,
                estimatedCost: Number(values.estimatedCost),
                serviceNotes: values.notes,
              }
            : r,
        ),
      );
    } else {
      // Create new — set vehicle to "In Shop"
      const newRecord: MaintenanceRecord = {
        id: `maint-${Date.now()}`,
        maintenanceId: generateMaintenanceId(records),
        vehicleId: values.vehicleId,
        vehicleName: vehicle.vehicleName,
        vehicleType: vehicle.type,
        registrationNumber: vehicle.registrationNumber,
        serviceType: values.serviceType as ServiceType,
        technician: values.technician,
        priority: values.priority as MaintenanceRecord["priority"],
        description: values.description,
        startDate: values.startDate,
        expectedCompletion: values.expectedCompletion,
        completedAt: null,
        cancelledAt: null,
        estimatedCost: Number(values.estimatedCost),
        actualCost: null,
        serviceNotes: values.notes,
        status: "Scheduled",
        createdAt: timestamp,
        timeline: [
          {
            type: "scheduled",
            label: "Maintenance Scheduled",
            timestamp,
          },
          {
            type: "vehicle_received",
            label: "Vehicle Received",
            timestamp: null,
          },
          {
            type: "inspection_started",
            label: "Inspection Started",
            timestamp: null,
          },
          {
            type: "repair_started",
            label: "Repair Started",
            timestamp: null,
          },
          {
            type: "quality_check",
            label: "Quality Check",
            timestamp: null,
          },
          {
            type: "completed",
            label: "Completed",
            timestamp: null,
          },
        ],
      };
      setRecords((prev) => [newRecord, ...prev]);
    }

    setIsFormOpen(false);
    setEditingRecord(null);
  }

  // ─── Complete ─────────────────────────────────────────────────────────────

  function handleCompleteConfirm(
    recordId: string,
    values: MaintenanceCompleteFormValues,
  ) {
    const completeTime = now();

    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: "Completed" as MaintenanceStatus,
              completedAt: completeTime,
              actualCost: Number(values.actualCost),
              serviceNotes: values.serviceNotes,
              timeline: r.timeline.map((event) =>
                event.type === "quality_check" && !event.timestamp
                  ? { ...event, timestamp: completeTime }
                  : event.type === "completed"
                    ? { ...event, timestamp: completeTime }
                    : event,
              ),
            }
          : r,
      ),
    );

    setRecordPendingComplete(null);
  }

  // ─── Cancel ───────────────────────────────────────────────────────────────

  function handleCancelConfirm() {
    if (!recordPendingCancel) return;
    const cancelTime = now();

    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordPendingCancel.id
          ? {
              ...r,
              status: "Cancelled" as MaintenanceStatus,
              cancelledAt: cancelTime,
            }
          : r,
      ),
    );

    setRecordPendingCancel(null);
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  function handleDeleteConfirm() {
    if (!recordPendingDelete) return;
    setRecords((prev) => prev.filter((r) => r.id !== recordPendingDelete.id));
    setRecordPendingDelete(null);
  }

  // ─── CSV Export ───────────────────────────────────────────────────────────

  function handleExportCsv() {
    const headers = [
      "Maintenance ID",
      "Vehicle",
      "Service Type",
      "Technician",
      "Priority",
      "Start Date",
      "Expected Completion",
      "Estimated Cost",
      "Actual Cost",
      "Status",
    ];

    const rows = visibleRecords.map((r) =>
      [
        r.maintenanceId,
        r.vehicleName,
        r.serviceType,
        r.technician,
        r.priority,
        r.startDate,
        r.expectedCompletion,
        r.estimatedCost,
        r.actualCost ?? "",
        r.status,
      ].join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "maintenance.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <PageTransition className="space-y-6">
      {/* Page Header */}
      <PageSection>
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">
              Maintenance Management
            </h1>
            <p className="mt-2 text-base text-slate-400">
              Track vehicle servicing, repairs and maintenance history.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={openScheduleModal} leftIcon={<PlusIcon />}>
              Schedule Maintenance
            </Button>
            <Button
              variant="secondary"
              leftIcon={<ExportIcon />}
              onClick={handleExportCsv}
            >
              Export CSV
            </Button>
          </div>
        </header>
      </PageSection>

      {/* Summary Cards */}
      <PageSection>
        <MaintenanceSummaryCards records={records} />
      </PageSection>

      {/* Filters */}
      <PageSection>
        <Card bodyClassName="p-4">
          <MaintenanceFilters filters={filters} onChange={updateFilter} />
        </Card>
      </PageSection>

      {/* Table */}
      <PageSection>
        <Card title="Maintenance Records" bodyClassName="p-0 md:p-5">
          <div className="p-4 md:p-0">
            <MaintenanceTable
              records={visibleRecords}
              onSchedule={openScheduleModal}
              onView={setSelectedRecord}
              onEdit={openEditModal}
              onComplete={setRecordPendingComplete}
              onCancel={setRecordPendingCancel}
              onDelete={setRecordPendingDelete}
            />
          </div>
        </Card>
      </PageSection>

      {/* Schedule / Edit Modal */}
      <MaintenanceFormModal
        isOpen={isFormOpen}
        record={editingRecord}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleFormSave}
      />

      {/* Details Drawer */}
      <MaintenanceDetailsDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Complete Modal */}
      <MaintenanceCompleteModal
        record={recordPendingComplete}
        onClose={() => setRecordPendingComplete(null)}
        onConfirm={handleCompleteConfirm}
      />

      {/* Cancel Confirm */}
      <ConfirmDialog
        isOpen={Boolean(recordPendingCancel)}
        title="Cancel Maintenance?"
        description={
          recordPendingCancel
            ? `Cancel ${recordPendingCancel.maintenanceId} (${recordPendingCancel.vehicleName} — ${recordPendingCancel.serviceType})? The vehicle will be made available again.`
            : ""
        }
        confirmLabel="Cancel Job"
        confirmVariant="danger"
        onConfirm={handleCancelConfirm}
        onCancel={() => setRecordPendingCancel(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={Boolean(recordPendingDelete)}
        title="Delete Record?"
        description={
          recordPendingDelete
            ? `Permanently delete ${recordPendingDelete.maintenanceId}? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setRecordPendingDelete(null)}
      />
    </PageTransition>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return <Icon path="M12 5v14M5 12h14" />;
}
function ExportIcon() {
  return <Icon path="M12 3v10m0 0 4-4m-4 4-4-4M5 15v4h14v-4" />;
}
function Icon({ path }: { path: string }) {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d={path}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
