import type { TripStatus } from "@/types/trip";

type TripStatusStepperProps = {
  status: TripStatus;
};

type Step = {
  label: string;
  status: TripStatus;
};

const STEPS: Step[] = [
  { label: "Draft", status: "Draft" },
  { label: "Dispatched", status: "Dispatched" },
  { label: "Completed", status: "Completed" },
];

const stepIndex: Record<TripStatus, number> = {
  Draft: 0,
  Dispatched: 1,
  Completed: 2,
  Cancelled: -1, // handled separately
  Pending: 0, // fallback
};

export default function TripStatusStepper({ status }: TripStatusStepperProps) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20">
          <svg
            className="h-3.5 w-3.5 text-red-300"
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="m4 4 8 8M12 4 4 12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        </span>
        <span className="text-sm font-semibold text-red-300">Cancelled</span>
      </div>
    );
  }

  const currentIndex = stepIndex[status] ?? 0;

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div key={step.status} className="flex items-center">
            {/* Step dot + label */}
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2",
                  isDone
                    ? "bg-emerald-500 text-white ring-emerald-500/30"
                    : isCurrent
                      ? "bg-amber-500 text-slate-950 ring-amber-500/30"
                      : "bg-slate-800 text-slate-500 ring-slate-700",
                ].join(" ")}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isDone ? (
                  <svg className="h-3.5 w-3.5" aria-hidden="true" viewBox="0 0 16 16" fill="none">
                    <path
                      d="m3 8 3.5 3.5L13 5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={[
                  "whitespace-nowrap text-xs font-medium",
                  isDone
                    ? "text-emerald-400"
                    : isCurrent
                      ? "text-amber-300"
                      : isUpcoming
                        ? "text-slate-500"
                        : "text-slate-500",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line between steps */}
            {index < STEPS.length - 1 ? (
              <div
                className={[
                  "mx-2 mb-5 h-0.5 w-10 rounded-full",
                  index < currentIndex ? "bg-emerald-500" : "bg-slate-700",
                ].join(" ")}
                aria-hidden="true"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
