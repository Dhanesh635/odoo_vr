"use client";

import { useMemo, useState } from "react";
import { Button, Card, ConfirmDialog } from "@/components/ui";
import TripCompleteModal from "@/components/trips/TripCompleteModal";
import TripDetailsDrawer from "@/components/trips/TripDetailsDrawer";
import TripFilters from "@/components/trips/TripFilters";
import TripFormModal from "@/components/trips/TripFormModal";
import TripSummaryCards from "@/components/trips/TripSummaryCard";
import TripTable from "@/components/trips/TripTable";
import { mockTrips } from "@/constants/trips";
import { vehicles } from "@/constants/vehicles";
import { drivers } from "@/constants/drivers";
import type {
  Trip,
  TripCompleteFormValues,
  TripFiltersState,
  TripFormValues,
  TripSortKey,
  TripStatus,
} from "@/types/trip";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateTripId(existingTrips: Trip[]): string {
  const maxNum = existingTrips.reduce((max, t) => {
    const num = parseInt(t.tripId.replace("TR", ""), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return `TR${String(maxNum + 1).padStart(3, "0")}`;
}

function now() {
  return new Date().toISOString();
}

// ─── Initial state ─────────────────────────────────────────────────────────────

const initialFilters: TripFiltersState = {
  search: "",
  status: "All",
  vehicleType: "All",
  sortBy: "Latest",
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [filters, setFilters] = useState<TripFiltersState>(initialFilters);

  // Modal/drawer open state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripPendingDispatch, setTripPendingDispatch] = useState<Trip | null>(null);
  const [tripPendingComplete, setTripPendingComplete] = useState<Trip | null>(null);
  const [tripPendingCancel, setTripPendingCancel] = useState<Trip | null>(null);
  const [tripPendingDelete, setTripPendingDelete] = useState<Trip | null>(null);

  // ─── Filtering & sorting ────────────────────────────────────────────────────

  const visibleTrips = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return trips
      .filter((trip) => {
        const matchesSearch =
          !query ||
          trip.tripId.toLowerCase().includes(query) ||
          trip.vehicleName.toLowerCase().includes(query) ||
          trip.driverName.toLowerCase().includes(query) ||
          trip.source.toLowerCase().includes(query) ||
          trip.destination.toLowerCase().includes(query);

        const matchesStatus =
          filters.status === "All" || trip.status === filters.status;

        const matchesVehicleType =
          filters.vehicleType === "All" || trip.vehicleType === filters.vehicleType;

        return matchesSearch && matchesStatus && matchesVehicleType;
      })
      .toSorted((a, b) => {
        const sortBy: TripSortKey = filters.sortBy;
        switch (sortBy) {
          case "Oldest":
            return a.createdAt.localeCompare(b.createdAt);
          case "Longest Distance":
            return b.plannedDistance - a.plannedDistance;
          case "Latest":
          default:
            return b.createdAt.localeCompare(a.createdAt);
        }
      });
  }, [trips, filters]);

  // ─── Filter helpers ──────────────────────────────────────────────────────────

  function updateFilter<K extends keyof TripFiltersState>(
    key: K,
    value: TripFiltersState[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  // ─── CRUD actions ────────────────────────────────────────────────────────────

  function openCreateModal() {
    setEditingTrip(null);
    setIsFormOpen(true);
  }

  function openEditModal(trip: Trip) {
    setEditingTrip(trip);
    setIsFormOpen(true);
  }

  function handleFormSave(values: TripFormValues, tripId?: string) {
    const vehicle = vehicles.find((v) => v.id === values.vehicleId);
    const driver = drivers.find((d) => d.id === values.driverId);

    if (!vehicle || !driver) return;

    if (tripId) {
      // Edit existing
      setTrips((prev) =>
        prev.map((t) =>
          t.id === tripId
            ? {
                ...t,
                source: values.source,
                destination: values.destination,
                vehicleId: values.vehicleId,
                vehicleName: vehicle.vehicleName,
                vehicleType: vehicle.type,
                driverId: values.driverId,
                driverName: driver.fullName,
                cargoWeight: Number(values.cargoWeight),
                plannedDistance: Number(values.plannedDistance),
                expectedStartDate: values.expectedStartDate,
                expectedDeliveryDate: values.expectedDeliveryDate,
                notes: values.notes,
              }
            : t,
        ),
      );
    } else {
      // Create new
      const timestamp = now();
      const newTrip: Trip = {
        id: `trip-${Date.now()}`,
        tripId: generateTripId(trips),
        source: values.source,
        destination: values.destination,
        vehicleId: values.vehicleId,
        vehicleName: vehicle.vehicleName,
        vehicleType: vehicle.type,
        driverId: values.driverId,
        driverName: driver.fullName,
        cargoWeight: Number(values.cargoWeight),
        plannedDistance: Number(values.plannedDistance),
        status: "Draft",
        expectedStartDate: values.expectedStartDate,
        expectedDeliveryDate: values.expectedDeliveryDate,
        notes: values.notes,
        createdAt: timestamp,
        dispatchedAt: null,
        completedAt: null,
        cancelledAt: null,
        finalOdometer: null,
        fuelUsed: null,
        deliveryNotes: "",
        timeline: [
          { type: "created", label: "Trip Created", timestamp },
          { type: "vehicle_assigned", label: "Vehicle Assigned", timestamp },
          { type: "driver_assigned", label: "Driver Assigned", timestamp },
          { type: "dispatched", label: "Dispatched", timestamp: null },
          { type: "reached", label: "Reached Destination", timestamp: null },
          { type: "completed", label: "Completed", timestamp: null },
        ],
      };
      setTrips((prev) => [newTrip, ...prev]);
    }

    setIsFormOpen(false);
    setEditingTrip(null);
  }

  // ─── Dispatch ────────────────────────────────────────────────────────────────

  function handleDispatchConfirm() {
    if (!tripPendingDispatch) return;
    const dispatchTime = now();

    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripPendingDispatch.id
          ? {
              ...t,
              status: "Dispatched" as TripStatus,
              dispatchedAt: dispatchTime,
              timeline: t.timeline.map((event) =>
                event.type === "dispatched"
                  ? { ...event, timestamp: dispatchTime }
                  : event,
              ),
            }
          : t,
      ),
    );

    setTripPendingDispatch(null);
  }

  // ─── Complete ────────────────────────────────────────────────────────────────

  function handleCompleteConfirm(tripId: string, values: TripCompleteFormValues) {
    const completeTime = now();

    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              status: "Completed" as TripStatus,
              completedAt: completeTime,
              finalOdometer: Number(values.finalOdometer),
              fuelUsed: Number(values.fuelUsed),
              deliveryNotes: values.deliveryNotes,
              timeline: t.timeline.map((event) =>
                event.type === "reached"
                  ? { ...event, timestamp: completeTime }
                  : event.type === "completed"
                    ? { ...event, timestamp: completeTime }
                    : event,
              ),
            }
          : t,
      ),
    );

    setTripPendingComplete(null);
  }

  // ─── Cancel ──────────────────────────────────────────────────────────────────

  function handleCancelConfirm() {
    if (!tripPendingCancel) return;
    const cancelTime = now();

    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripPendingCancel.id
          ? {
              ...t,
              status: "Cancelled" as TripStatus,
              cancelledAt: cancelTime,
            }
          : t,
      ),
    );

    setTripPendingCancel(null);
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────

  function handleDeleteConfirm() {
    if (!tripPendingDelete) return;
    setTrips((prev) => prev.filter((t) => t.id !== tripPendingDelete.id));
    setTripPendingDelete(null);
  }

  // ─── CSV Export ──────────────────────────────────────────────────────────────

  function handleExportCsv() {
    const headers = [
      "Trip ID",
      "Source",
      "Destination",
      "Vehicle",
      "Driver",
      "Cargo Weight (kg)",
      "Distance (km)",
      "Status",
      "Expected Start",
      "Expected Delivery",
    ];

    const rows = visibleTrips.map((t) =>
      [
        t.tripId,
        t.source,
        t.destination,
        t.vehicleName,
        t.driverName,
        t.cargoWeight,
        t.plannedDistance,
        t.status,
        t.expectedStartDate,
        t.expectedDeliveryDate,
      ].join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "trips.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Trip Management</h1>
          <p className="mt-2 text-base text-slate-400">
            Create, dispatch and monitor transport operations.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={openCreateModal} leftIcon={<PlusIcon />}>
            Create Trip
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

      {/* Summary Cards */}
      <TripSummaryCards trips={trips} />

      {/* Filters */}
      <Card bodyClassName="p-4">
        <TripFilters filters={filters} onChange={updateFilter} />
      </Card>

      {/* Table */}
      <Card title="Trip Registry" bodyClassName="p-0 md:p-5">
        <div className="p-4 md:p-0">
          <TripTable
            trips={visibleTrips}
            onCreateTrip={openCreateModal}
            onView={setSelectedTrip}
            onEdit={openEditModal}
            onDispatch={setTripPendingDispatch}
            onComplete={setTripPendingComplete}
            onCancel={setTripPendingCancel}
            onDelete={setTripPendingDelete}
          />
        </div>
      </Card>

      {/* Create / Edit Modal */}
      <TripFormModal
        isOpen={isFormOpen}
        trip={editingTrip}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTrip(null);
        }}
        onSave={handleFormSave}
      />

      {/* Detail Drawer */}
      <TripDetailsDrawer
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />

      {/* Dispatch Confirm */}
      <ConfirmDialog
        isOpen={Boolean(tripPendingDispatch)}
        title="Dispatch Trip?"
        description={
          tripPendingDispatch
            ? `Dispatch ${tripPendingDispatch.tripId} (${tripPendingDispatch.source} → ${tripPendingDispatch.destination})? The vehicle and driver will be marked as On Trip.`
            : ""
        }
        confirmLabel="Dispatch"
        confirmVariant="primary"
        onConfirm={handleDispatchConfirm}
        onCancel={() => setTripPendingDispatch(null)}
      />

      {/* Complete Modal */}
      <TripCompleteModal
        trip={tripPendingComplete}
        onClose={() => setTripPendingComplete(null)}
        onConfirm={handleCompleteConfirm}
      />

      {/* Cancel Confirm */}
      <ConfirmDialog
        isOpen={Boolean(tripPendingCancel)}
        title="Cancel Trip?"
        description={
          tripPendingCancel
            ? `Cancel ${tripPendingCancel.tripId} (${tripPendingCancel.source} → ${tripPendingCancel.destination})? This will free up the vehicle and driver.`
            : ""
        }
        confirmLabel="Cancel Trip"
        confirmVariant="danger"
        onConfirm={handleCancelConfirm}
        onCancel={() => setTripPendingCancel(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={Boolean(tripPendingDelete)}
        title="Delete Trip?"
        description={
          tripPendingDelete
            ? `Permanently delete ${tripPendingDelete.tripId}? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTripPendingDelete(null)}
      />
    </div>
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
