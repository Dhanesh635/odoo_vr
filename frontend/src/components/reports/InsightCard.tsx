import type { InsightCard as InsightCardType } from "@/types/report";

type InsightCardProps = {
  insight: InsightCardType;
};

const cardStyles = {
  positive: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    iconBg: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    title: "text-emerald-300",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    badgeLabel: "Positive",
  },
  warning: {
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
    iconBg: "bg-orange-500/10 text-orange-300 ring-orange-500/20",
    title: "text-orange-300",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    badgeLabel: "Warning",
  },
  info: {
    border: "border-sky-500/20",
    bg: "bg-sky-500/5",
    iconBg: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
    title: "text-sky-300",
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    badgeLabel: "Info",
  },
  negative: {
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    iconBg: "bg-red-500/10 text-red-300 ring-red-500/20",
    title: "text-red-300",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    badgeLabel: "Alert",
  },
};

function InsightIcon({ icon }: { icon: InsightCardType["icon"] }) {
  const icons: Record<InsightCardType["icon"], React.ReactNode> = {
    "trend-up": (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <polyline points="16 7 22 7 22 13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    "trend-down": (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <polyline points="16 17 22 17 22 11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="m10.29 3.86-8.57 14.87A2 2 0 0 0 3.43 22h17.14a2 2 0 0 0 1.71-3.27L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    ),
    star: (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
    wrench: (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
    license: (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="9" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M13 10h5M13 14h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
  };
  return <>{icons[icon]}</>;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const styles = cardStyles[insight.type];

  return (
    <article
      className={[
        "rounded-xl border p-4 transition-shadow hover:shadow-md hover:shadow-black/20",
        styles.border,
        styles.bg,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1",
            styles.iconBg,
          ].join(" ")}
        >
          <InsightIcon icon={insight.icon} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={["text-sm font-semibold", styles.title].join(" ")}>
              {insight.title}
            </h3>
            <span
              className={[
                "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                styles.badge,
              ].join(" ")}
            >
              {styles.badgeLabel}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-slate-400">
            {insight.description}
          </p>
        </div>
      </div>
    </article>
  );
}
