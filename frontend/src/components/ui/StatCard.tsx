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
  amber: "bg-warning/10 text-warning ring-warning/20",
  blue: "bg-primary/10 text-primary ring-primary/20",
  emerald: "bg-success/10 text-success ring-success/20",
  gray: "bg-foreground/10 text-foreground ring-foreground/20",
  green: "bg-success/10 text-success ring-success/20",
  orange: "bg-warning/10 text-warning ring-warning/20",
  purple: "bg-secondary/10 text-secondary ring-secondary/20",
  red: "bg-danger/10 text-danger ring-danger/20",
  yellow: "bg-warning/10 text-warning ring-warning/20",
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
        "relative overflow-hidden rounded-[20px] bg-surface/80 backdrop-blur-xl border border-border shadow-xl shadow-black/40 ring-1 ring-white/5 p-6",
        "transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10",
        className,
      ].join(" ")}
    >
      {/* Decorative mini chart background */}
      <div className="absolute bottom-0 right-0 opacity-[0.03] pointer-events-none w-3/4 h-1/2">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,50 L0,30 C20,20 30,40 50,25 C70,10 80,30 100,10 L100,50 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground/60">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground tracking-tight">{value}</p>
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
      {trend ? <div className="relative mt-4 text-sm text-foreground/70">{trend}</div> : null}
    </motion.article>
  );
}

export type { StatCardColor, StatCardProps };
