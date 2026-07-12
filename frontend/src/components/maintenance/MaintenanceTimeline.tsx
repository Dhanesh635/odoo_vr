import type {
  MaintenanceTimelineEvent,
  MaintenanceTimelineEventType,
} from "@/types/maintenance";

type MaintenanceTimelineProps = {
  events: MaintenanceTimelineEvent[];
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const eventColors: Record<MaintenanceTimelineEventType, string> = {
  scheduled: "bg-slate-500/10 text-slate-300 ring-slate-500/20",
  vehicle_received: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  inspection_started: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  repair_started: "bg-orange-500/10 text-orange-300 ring-orange-500/20",
  quality_check: "bg-purple-500/10 text-purple-300 ring-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-300 ring-red-500/20",
};

const pendingColor = "bg-slate-800 text-slate-600 ring-slate-700/30";

function EventIcon({ type }: { type: MaintenanceTimelineEventType }) {
  const icons: Record<MaintenanceTimelineEventType, React.ReactNode> = {
    scheduled: (
      <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    vehicle_received: (
      <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    inspection_started: (
      <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="m14 14 3 3m-1.5-8.5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
    repair_started: (
      <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
    quality_check: (
      <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    completed: (
      <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="m5 12 5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    cancelled: (
      <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    ),
  };
  return <>{icons[type]}</>;
}

export default function MaintenanceTimeline({ events }: MaintenanceTimelineProps) {
  return (
    <ol className="relative space-y-4 border-l border-slate-800 pl-5">
      {events.map((event, index) => {
        const occurred = Boolean(event.timestamp);
        const colorClass = occurred ? eventColors[event.type] : pendingColor;

        return (
          <li key={index} className="relative">
            <span
              className={[
                "absolute -left-[1.625rem] flex h-7 w-7 items-center justify-center rounded-full ring-1",
                colorClass,
              ].join(" ")}
              aria-hidden="true"
            >
              <EventIcon type={event.type} />
            </span>

            <div className="ml-2 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <p
                className={[
                  "text-sm font-semibold",
                  occurred ? "text-slate-100" : "text-slate-500",
                ].join(" ")}
              >
                {event.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {event.timestamp
                  ? dateTimeFormatter.format(new Date(event.timestamp))
                  : "Pending"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
