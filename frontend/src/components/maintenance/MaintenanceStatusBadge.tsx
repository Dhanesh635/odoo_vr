import type { MaintenanceStatus } from "@/types/maintenance";

type MaintenanceStatusBadgeProps = {
  status: MaintenanceStatus;
  className?: string;
};

const statusClasses: Record<MaintenanceStatus, string> = {
  Scheduled: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  "In Progress": "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Cancelled: "border-red-500/30 bg-red-500/10 text-red-300",
};

export default function MaintenanceStatusBadge({
  className = "",
  status,
}: MaintenanceStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusClasses[status],
        className,
      ].join(" ")}
    >
      {status}
    </span>
  );
}
