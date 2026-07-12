import { quickStatsData } from "@/constants/reports";
import type { QuickStat } from "@/types/report";

const colorClasses: Record<QuickStat["color"], string> = {
  blue: "bg-sky-500/10 text-sky-300 ring-sky-500/20 border-sky-500/20",
  green: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20 border-emerald-500/20",
  orange: "bg-orange-500/10 text-orange-300 ring-orange-500/20 border-orange-500/20",
  amber: "bg-amber-500/10 text-amber-300 ring-amber-500/20 border-amber-500/20",
  purple: "bg-purple-500/10 text-purple-300 ring-purple-500/20 border-purple-500/20",
  red: "bg-red-500/10 text-red-300 ring-red-500/20 border-red-500/20",
};

function QuickStatIcon({ icon }: { icon: QuickStat["icon"] }) {
  const icons: Record<QuickStat["icon"], React.ReactNode> = {
    drivers: (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    vehicles: (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    shop: (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
    active: (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
    fuel: (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 22h12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="M7 6h4v4H7z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
    expense: (
      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  };
  return <>{icons[icon]}</>;
}

export default function QuickStatsGrid() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-50">Quick Statistics</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {quickStatsData.map((stat) => (
          <div
            key={stat.label}
            className={[
              "flex flex-col items-center rounded-xl border p-4 text-center ring-1",
              colorClasses[stat.color],
            ].join(" ")}
          >
            <div className="mb-2">
              <QuickStatIcon icon={stat.icon} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
