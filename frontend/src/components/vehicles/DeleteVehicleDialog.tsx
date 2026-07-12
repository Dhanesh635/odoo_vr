"use client";

import { ConfirmDialog } from "@/components/ui";
import type { Vehicle } from "@/types/vehicle";

type DeleteVehicleDialogProps = {
  vehicle: Vehicle | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteVehicleDialog({
  onCancel,
  onConfirm,
  vehicle,
}: DeleteVehicleDialogProps) {
  return (
    <ConfirmDialog
      isOpen={Boolean(vehicle)}
      title="Delete Vehicle?"
      description="This action cannot be undone."
      cancelLabel="Cancel"
      confirmLabel="Delete"
      confirmVariant="danger"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
