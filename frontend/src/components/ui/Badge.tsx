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
  Available: "border-success/30 bg-success/10 text-success backdrop-blur-sm",
  "On Trip": "border-primary/30 bg-primary/10 text-primary backdrop-blur-sm",
  "Off Duty": "border-foreground/20 bg-foreground/10 text-foreground/80 backdrop-blur-sm",
  "In Shop": "border-warning/30 bg-warning/10 text-warning backdrop-blur-sm",
  Retired: "border-danger/30 bg-danger/10 text-danger backdrop-blur-sm",
  Completed: "border-success/30 bg-success/10 text-success backdrop-blur-sm",
  Pending: "border-warning/30 bg-warning/10 text-warning backdrop-blur-sm",
  Cancelled: "border-danger/30 bg-danger/10 text-danger backdrop-blur-sm",
  Suspended: "border-danger/30 bg-danger/10 text-danger backdrop-blur-sm",
  Draft: "border-foreground/20 bg-foreground/10 text-foreground/80 backdrop-blur-sm",
};

/** Statuses that show a pulse dot to indicate active/pending state */
const pulseStatuses = new Set<BadgeStatus>(["On Trip", "Pending", "In Shop"]);

export default function Badge({ className = "", status }: BadgeProps) {
  const hasPulse = pulseStatuses.has(status);

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusClasses[status],
        className,
      ].join(" ")}
    >
      {hasPulse ? (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current animate-[pulse-dot_2s_ease-in-out_infinite]"
          aria-hidden="true"
        />
      ) : null}
      {status}
    </span>
  );
}

export type { BadgeProps, BadgeStatus };
