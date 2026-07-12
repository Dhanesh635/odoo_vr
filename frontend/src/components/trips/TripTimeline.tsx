import type { TripTimelineEvent, TripTimelineEventType } from "@/types/trip";

type TripTimelineProps = {
  events: TripTimelineEvent[];
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const eventIcons: Record<TripTimelineEventType, React.ReactNode> = {
  created: (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  ),
  vehicle_assigned: (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="7" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  driver_assigned: (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  ),
  dispatched: (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M12 5l7 7-7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  ),
  reached: (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  completed: (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="m5 12 5 5L20 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  ),
  cancelled: (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  ),
};

const eventColors: Record<TripTimelineEventType, string> = {
  created: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  vehicle_assigned: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  driver_assigned: "bg-purple-500/10 text-purple-300 ring-purple-500/20",
  dispatched: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  reached: "bg-orange-500/10 text-orange-300 ring-orange-500/20",
  completed: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-300 ring-red-500/20",
};

export default function TripTimeline({ events }: TripTimelineProps) {
  return (
    <ol className="relative space-y-4 border-l border-slate-800 pl-5">
      {events.map((event, index) => {
        const occurred = Boolean(event.timestamp);
        const colorClass = occurred
          ? eventColors[event.type]
          : "bg-slate-800 text-slate-600 ring-slate-700/30";

        return (
          <li key={index} className="relative">
            {/* Dot on the line */}
            <span
              className={[
                "absolute -left-[1.625rem] flex h-7 w-7 items-center justify-center rounded-full ring-1",
                colorClass,
              ].join(" ")}
              aria-hidden="true"
            >
              {eventIcons[event.type]}
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
