"use client";

import { userProfile } from "@/constants/settings";

export default function ProfileCard() {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-sm shadow-black/20 overflow-hidden">
      {/* Gradient banner */}
      <div className="relative h-28 bg-gradient-to-br from-cyan-600/40 via-cyan-500/20 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.15),transparent_60%)]" />
      </div>

      <div className="relative px-5 pb-5 sm:px-6">
        {/* Avatar – overlaps the banner */}
        <div className="-mt-12 mb-4 flex items-end gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-slate-900 bg-gradient-to-br from-cyan-500 to-cyan-400 text-2xl font-bold text-slate-950 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            {userProfile.avatar}
          </div>
          <div className="mb-1 min-w-0">
            <h2 className="truncate text-xl font-semibold text-slate-50">
              {userProfile.name}
            </h2>
            <p className="truncate text-sm text-slate-400">
              {userProfile.designation}
            </p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow icon={emailPath} label="Email" value={userProfile.email} />
          <InfoRow icon={phonePath} label="Phone" value={userProfile.phone} />
          <InfoRow icon={briefcasePath} label="Role" value={userProfile.role} />
          <InfoRow icon={buildingPath} label="Company" value={userProfile.company} />
        </div>
      </div>
    </section>
  );
}

// ── tiny icon helpers ────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 ring-1 ring-slate-700/50">
        <svg
          className="h-4 w-4"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d={icon}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="truncate text-sm text-slate-200">{value}</p>
      </div>
    </div>
  );
}

const emailPath =
  "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z";
const phonePath =
  "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.04 11.04 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z";
const briefcasePath =
  "M20 7H4a1 1 0 00-1 1v10a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2";
const buildingPath =
  "M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h2M9 11h2M13 7h2M13 11h2M9 15h6";
