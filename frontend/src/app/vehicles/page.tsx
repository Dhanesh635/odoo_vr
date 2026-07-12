"use client";

import { useMemo, useState, useEffect } from "react";
import { Button, Card, PageTransition, PageSection } from "@/components/ui";
import DeleteVehicleDialog from "@/components/vehicles/DeleteVehicleDialog";
import VehicleDetailsDrawer from "@/components/vehicles/VehicleDetailsDrawer";
import VehicleFilters, {
  type VehicleFiltersState,
} from "@/components/vehicles/VehicleFilters";
import VehicleFormModal from "@/components/vehicles/VehicleFormModal";
import VehicleTable from "@/components/vehicles/VehicleTable";
import { vehicles } from "@/constants/vehicles";
import type { Vehicle } from "@/types/vehicle";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  listVehiclesThunk, 
  createVehicleThunk,
  updateVehicleThunk,
  deleteVehicleThunk 
} from "@/store/slices/vehicleSlice";
import { 
  selectVehicleList, 
  selectVehicleLoading 
} from "@/store/selectors/vehicleSelectors";

const initialFilters: VehicleFiltersState = {
  search: "",
  type: "All",
  status: "All",
  sortBy: "Newest",
};

export default function FleetPage() {
  const [filters, setFilters] = useState<VehicleFiltersState>(initialFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehiclePendingDelete, setVehiclePendingDelete] =
    useState<Vehicle | null>(null);

  const dispatch = useAppDispatch();
  const reduxVehicles = useAppSelector(selectVehicleList);
  const isLoading = useAppSelector(selectVehicleLoading);

  // Fetch vehicles on mount
  useEffect(() => {
    dispatch(listVehiclesThunk());
  }, [dispatch]);

  // Use Redux vehicles if available, otherwise fall back to constants
  const vehicleSource = reduxVehicles.length > 0 ? reduxVehicles : vehicles;

  const visibleVehicles = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return vehicleSource
      .filter((vehicle) => {
        const matchesSearch =
          !query ||
          vehicle.registrationNumber.toLowerCase().includes(query) ||
          vehicle.vehicleName.toLowerCase().includes(query);
        const matchesType = filters.type === "All" || vehicle.type === filters.type;
        const matchesStatus =
          filters.status === "All" || vehicle.status === filters.status;

        return matchesSearch && matchesType && matchesStatus;
      })
      .toSorted((firstVehicle, secondVehicle) => {
        switch (filters.sortBy) {
          case "Oldest":
            return firstVehicle.createdAt.localeCompare(secondVehicle.createdAt);
          case "Registration Number":
            return firstVehicle.registrationNumber.localeCompare(
              secondVehicle.registrationNumber,
            );
          case "Vehicle Name":
            return firstVehicle.vehicleName.localeCompare(secondVehicle.vehicleName);
          case "Capacity":
            return (
              secondVehicle.maximumLoadCapacity -
              firstVehicle.maximumLoadCapacity
            );
          case "Newest":
          default:
            return secondVehicle.createdAt.localeCompare(firstVehicle.createdAt);
        }
      });
  }, [filters, vehicleSource]);

  function updateFilter<TKey extends keyof VehicleFiltersState>(
    key: TKey,
    value: VehicleFiltersState[TKey],
  ) {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  }

  function openAddVehicleModal() {
    setEditingVehicle(null);
    setIsFormOpen(true);
  }

  function openEditVehicleModal(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  }

  function handleVehicleSave() {
    setIsFormOpen(false);
    setEditingVehicle(null);
    // Refresh vehicle list
    dispatch(listVehiclesThunk());
  }

  async function handleDeleteConfirm() {
    if (vehiclePendingDelete) {
      try {
        await dispatch(deleteVehicleThunk(vehiclePendingDelete._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
      }
    }
    setVehiclePendingDelete(null);
  }

  return (
    <PageTransition className="space-y-6">
      <PageSection>
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Fleet Management</h1>
            <p className="mt-2 text-base text-slate-400">
              Manage all vehicles in your fleet.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={openAddVehicleModal}
              leftIcon={<PlusIcon />}
            >
              Add Vehicle
            </Button>
            <Button type="button" variant="secondary" leftIcon={<ExportIcon />}>
              Export CSV
            </Button>
          </div>
        </header>
      </PageSection>

      <PageSection>
        <Card bodyClassName="p-4">
          <VehicleFilters filters={filters} onChange={updateFilter} />
        </Card>
      </PageSection>

      <PageSection>
        <Card title="Vehicle Registry" bodyClassName="p-0 md:p-5">
          <div className="p-4 md:p-0">
            <VehicleTable
              vehicles={visibleVehicles}
              onAddVehicle={openAddVehicleModal}
              onView={setSelectedVehicle}
              onEdit={openEditVehicleModal}
              onDelete={setVehiclePendingDelete}
            />
          </div>
        </Card>
      </PageSection>

      <VehicleFormModal
        isOpen={isFormOpen}
        vehicle={editingVehicle}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVehicle(null);
        }}
        onSave={handleVehicleSave}
      />

      <VehicleDetailsDrawer
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />

      <DeleteVehicleDialog
        vehicle={vehiclePendingDelete}
        onCancel={() => setVehiclePendingDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </PageTransition>
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
