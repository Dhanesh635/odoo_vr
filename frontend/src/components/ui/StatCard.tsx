"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type StatCardColor =
  | "amber"
  | "blue"
  | "emerald"
  | "gray"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "yellow";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: ReactNode;
  color?: StatCardColor;
  className?: string;
};

const colorClasses: Record<StatCardColor, string> = {
  amber: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  blue: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  emerald: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  gray: "bg-slate-500/10 text-slate-300 ring-slate-500/20",
  green: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  orange: "bg-orange-500/10 text-orange-300 ring-orange-500/20",
  purple: "bg-purple-500/10 text-purple-300 ring-purple-500/20",
  red: "bg-red-500/10 text-red-300 ring-red-500/20",
  yellow: "bg-yellow-500/10 text-yellow-300 ring-yellow-500/20",
};

export default function StatCard({
  className = "",
  color = "amber",
  icon,
  title,
  trend,
  value,
}: StatCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className={[
        "rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm shadow-black/20",
        "transition-[border-color,box-shadow] duration-200 hover:border-slate-700/80 hover:shadow-lg hover:shadow-black/30",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-50">{value}</p>
        </div>
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1",
            colorClasses[color],
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
      {trend ? <div className="mt-4 text-sm text-slate-300">{trend}</div> : null}
    </motion.article>
  );
}

export type { StatCardColor, StatCardProps };
