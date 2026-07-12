type BadgeStatus =
  | "Available"
  | "On Trip"
  | "Off Duty"
  | "In Shop"
  | "Retired"
  | "Completed"
  | "Pending"
  | "Cancelled"
  | "Suspended"
  | "Draft";

type BadgeProps = {
  status: BadgeStatus;
  className?: string;
};

const statusClasses: Record<BadgeStatus, string> = {
  Available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "On Trip": "border-sky-500/30 bg-sky-500/10 text-sky-300",
  "Off Duty": "border-slate-500/30 bg-slate-500/10 text-slate-300",
  "In Shop": "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Retired: "border-red-500/30 bg-red-500/10 text-red-300",
  Completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Cancelled: "border-red-500/30 bg-red-500/10 text-red-300",
  Suspended: "border-red-500/30 bg-red-500/10 text-red-300",
  Draft: "border-slate-500/30 bg-slate-500/10 text-slate-300",
};

export default function Badge({ className = "", status }: BadgeProps) {
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

export type { BadgeProps, BadgeStatus };
