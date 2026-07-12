"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  illustration?: ReactNode;
  className?: string;
};

function DefaultIllustration() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300"
    >
      <svg className="h-10 w-10" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 10h8M8 14h5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <circle cx="17" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M17 16v2M17 18h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}

export default function EmptyState({
  action,
  className = "",
  description,
  illustration,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-14 text-center",
        className,
      ].join(" ")}
    >
      {illustration ?? <DefaultIllustration />}
      <h3 className="mt-5 text-base font-semibold text-slate-50">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export type { EmptyStateProps };
