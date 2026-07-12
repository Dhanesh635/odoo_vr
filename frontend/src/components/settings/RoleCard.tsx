"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { roles, allModules, type RoleName } from "@/constants/settings";

export default function RoleCard() {
  const [activeRole, setActiveRole] = useState<RoleName>("Fleet Manager");
  const active = roles.find((r) => r.name === activeRole)!;

  const roleColorMap: Record<string, { bg: string; text: string; ring: string; activeBg: string }> = {
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-300",
      ring: "ring-cyan-400/25",
      activeBg: "bg-cyan-500/15",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      ring: "ring-amber-400/25",
      activeBg: "bg-amber-500/15",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      ring: "ring-emerald-400/25",
      activeBg: "bg-emerald-500/15",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-300",
      ring: "ring-purple-400/25",
      activeBg: "bg-purple-500/15",
    },
  };

  return (
    <Card
      title="User Roles"
      subtitle="Permission matrix for each role (read-only)"
    >
      {/* Role selector pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {roles.map((role) => {
          const c = roleColorMap[role.color];
          const isActive = role.name === activeRole;
          return (
            <button
              key={role.name}
              type="button"
              onClick={() => setActiveRole(role.name)}
              className={[
                "rounded-lg px-3.5 py-2 text-sm font-medium transition-all ring-1 ring-inset",
                isActive
                  ? `${c.activeBg} ${c.text} ${c.ring}`
                  : "bg-slate-800/60 text-slate-400 ring-slate-700/50 hover:bg-slate-800 hover:text-slate-200",
              ].join(" ")}
            >
              {role.name}
            </button>
          );
        })}
      </div>

      {/* Description */}
      <p className="mb-4 text-sm text-slate-400">{active.description}</p>

      {/* Permission matrix */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60">
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Module
              </th>
              <th className="px-4 py-3 text-center font-medium text-slate-400">
                Permission
              </th>
            </tr>
          </thead>
          <tbody>
            {allModules.map((mod) => {
              const level = active.permissions[mod];
              return (
                <tr
                  key={mod}
                  className="border-b border-slate-800/60 last:border-0 transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3 font-medium text-slate-200">
                    {mod}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PermissionBadge level={level} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PermissionBadge({ level }: { level: "full" | "read" | "none" }) {
  const styles = {
    full: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    read: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    none: "border-slate-600/30 bg-slate-700/20 text-slate-500",
  };

  const labels = { full: "Full Access", read: "Read Only", none: "No Access" };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[level],
      ].join(" ")}
    >
      {labels[level]}
    </span>
  );
}
