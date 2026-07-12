"use client";

import { ConfirmDialog } from "@/components/ui";
import type { Driver } from "@/types/driver";

type DeleteDriverDialogProps = {
  driver: Driver | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteDriverDialog({
  driver,
  onCancel,
  onConfirm,
}: DeleteDriverDialogProps) {
  return (
    <ConfirmDialog
      isOpen={Boolean(driver)}
      title="Delete Driver?"
      description="This action cannot be undone."
      cancelLabel="Cancel"
      confirmLabel="Delete"
      confirmVariant="danger"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
