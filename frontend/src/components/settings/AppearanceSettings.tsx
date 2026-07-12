"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { appearanceOptions } from "@/constants/settings";

export default function AppearanceSettings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(
      appearanceOptions.map((o) => [o.id, o.defaultEnabled]),
    ),
  );

  function toggle(id: string) {
    // For dark/light mode, make them mutually exclusive
    if (id === "dark-mode" || id === "light-mode") {
      setEnabled((prev) => ({
        ...prev,
        "dark-mode": id === "dark-mode" ? !prev["dark-mode"] : false,
        "light-mode": id === "light-mode" ? !prev["light-mode"] : false,
      }));
    } else {
      setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  }

  return (
    <Card
      title="Appearance"
      subtitle="Customise the look and feel of your workspace"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {appearanceOptions.map((opt) => {
          const isActive = enabled[opt.id];
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={[
                "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                isActive
                  ? "border-cyan-500/40 bg-cyan-500/5 ring-1 ring-inset ring-cyan-400/20"
                  : "border-slate-800 bg-slate-800/30 hover:border-slate-700 hover:bg-slate-800/50",
              ].join(" ")}
            >
              <div
                className={[
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300"
                    : "bg-slate-700/50 text-slate-500 group-hover:text-slate-400",
                ].join(" ")}
              >
                <AppearanceIcon id={opt.id} />
              </div>
              <div className="min-w-0">
                <p
                  className={[
                    "text-sm font-medium transition-colors",
                    isActive ? "text-cyan-200" : "text-slate-200",
                  ].join(" ")}
                >
                  {opt.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {opt.description}
                </p>
              </div>
              {/* Indicator dot */}
              <span
                className={[
                  "ml-auto mt-1 h-2 w-2 shrink-0 rounded-full transition-colors",
                  isActive ? "bg-cyan-400" : "bg-slate-700",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function AppearanceIcon({ id }: { id: string }) {
  const paths: Record<string, string> = {
    "dark-mode": "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    "light-mode":
      "M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.64-6.36l-.7.7M6.34 17.66l-.7.7m12.72 0l-.7-.7M6.34 6.34l-.7-.7M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    "compact-layout":
      "M4 5h16M4 9h16M4 13h10M4 17h6",
    "sidebar-collapse":
      "M11 19H4a1 1 0 01-1-1V6a1 1 0 011-1h16a1 1 0 011 1v5M9 5v14m6 0l3-3m0 0l3 3m-3-3v8",
  };

  return (
    <svg
      className="h-4 w-4"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d={paths[id] ?? ""}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
