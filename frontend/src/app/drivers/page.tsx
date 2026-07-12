"use client";

import { useMemo, useState, useEffect } from "react";
import { Button, Card, PageTransition, PageSection } from "@/components/ui";
import DeleteDriverDialog from "@/components/drivers/DeleteDriverDialog";
import DriverDetailsDrawer from "@/components/drivers/DriverDetailsDrawer";
import DriverFilters, {
  type DriverFiltersState,
} from "@/components/drivers/DriverFilters";
import DriverFormModal from "@/components/drivers/DriverFormModal";
import DriverTable from "@/components/drivers/DriverTable";
import { drivers } from "@/constants/drivers";
import type { Driver } from "@/types/driver";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  shouldFetchDrivers
} from "@/store/slices/driverSlice";
import {
  selectDriverList,
  selectDriverLoading,
  selectDriverLastFetched
} from "@/store/selectors/driverSelectors";

const initialFilters: DriverFiltersState = {
  search: "",
  status: "All",
  licenseStatus: "All",
  sortBy: "Newest",
};

export default function DriversPage() {
  const [filters, setFilters] = useState<DriverFiltersState>(initialFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [driverPendingDelete, setDriverPendingDelete] = useState<Driver | null>(
    null,
  );

  const dispatch = useAppDispatch();
  const reduxDrivers = useAppSelector(selectDriverList);
  const isLoading = useAppSelector(selectDriverLoading);
  const lastFetched = useAppSelector(selectDriverLastFetched);

  // Fetch drivers on mount or when cache is stale
  useEffect(() => {
    if (shouldFetchDrivers(lastFetched)) {
      dispatch(fetchDrivers({}));
    }
  }, [dispatch, lastFetched]);

  // Use Redux drivers if available, otherwise fall back to constants
  const driverSource = reduxDrivers.length > 0 ? reduxDrivers : drivers;

  const visibleDrivers = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return driverSource
      .filter((driver) => {
        const driverName = ('fullName' in driver ? driver.fullName : (driver as any).name) || '';
        const matchesSearch =
          !query ||
          driverName.toLowerCase().includes(query) ||
          driver.licenseNumber.toLowerCase().includes(query);
        const matchesStatus =
          filters.status === "All" || driver.status === filters.status;
        const matchesLicenseStatus =
          filters.licenseStatus === "All" ||
          (driver as any).licenseStatus === filters.licenseStatus;

        return matchesSearch && matchesStatus && matchesLicenseStatus;
      })
      .toSorted((firstDriver, secondDriver) => {
        switch (filters.sortBy) {
          case "Oldest":
            return (firstDriver as any).createdAt?.localeCompare((secondDriver as any).createdAt) || 0;
          case "Driver Name":
            const firstName = ('fullName' in firstDriver ? firstDriver.fullName : (firstDriver as any).name) || '';
            const secondName = ('fullName' in secondDriver ? secondDriver.fullName : (secondDriver as any).name) || '';
            return firstName.localeCompare(secondName);
          case "Safety Score":
            return secondDriver.safetyScore - firstDriver.safetyScore;
          case "Newest":
          default:
            return (secondDriver as any).createdAt?.localeCompare((firstDriver as any).createdAt) || 0;
        }
      });
  }, [filters, driverSource]);

  function updateFilter<TKey extends keyof DriverFiltersState>(
    key: TKey,
    value: DriverFiltersState[TKey],
  ) {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  }

  function openAddDriverModal() {
    setEditingDriver(null);
    setIsFormOpen(true);
  }

  function openEditDriverModal(driver: Driver) {
    setEditingDriver(driver);
    setIsFormOpen(true);
  }

  function handleDriverSave() {
    setIsFormOpen(false);
    setEditingDriver(null);
    // Refresh driver list
    dispatch(fetchDrivers({}));
  }

  async function handleDeleteConfirm() {
    if (driverPendingDelete) {
      try {
        const driverId = (driverPendingDelete as any)._id || driverPendingDelete.id;
        await dispatch(deleteDriver(driverId)).unwrap();
      } catch (error) {
        console.error('Failed to delete driver:', error);
      }
    }
    setDriverPendingDelete(null);
  }

  return (
    <PageTransition className="space-y-6">
      <PageSection>
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">
              Driver Management
            </h1>
            <p className="mt-2 text-base text-slate-400">
              Manage driver profiles, license validity, and availability.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={openAddDriverModal}
              leftIcon={<PlusIcon />}
            >
              Add Driver
            </Button>
            <Button type="button" variant="secondary" leftIcon={<ExportIcon />}>
              Export CSV
            </Button>
          </div>
        </header>
      </PageSection>

      <PageSection>
        <Card bodyClassName="p-4">
          <DriverFilters filters={filters} onChange={updateFilter} />
        </Card>
      </PageSection>

      <PageSection>
        <Card title="Driver Registry" bodyClassName="p-0 md:p-5">
          <div className="p-4 md:p-0">
            <DriverTable
              drivers={visibleDrivers as any}
              onAddDriver={openAddDriverModal}
              onView={setSelectedDriver}
              onEdit={openEditDriverModal}
              onDelete={setDriverPendingDelete}
            />
          </div>
        </Card>
      </PageSection>

      <DriverFormModal
        isOpen={isFormOpen}
        driver={editingDriver}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDriver(null);
        }}
        onSave={handleDriverSave}
      />

      <DriverDetailsDrawer
        driver={selectedDriver}
        onClose={() => setSelectedDriver(null)}
      />

      <DeleteDriverDialog
        driver={driverPendingDelete}
        onCancel={() => setDriverPendingDelete(null)}
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
