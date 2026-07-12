"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type CardProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export default function Card({
  actions,
  bodyClassName = "",
  children,
  className = "",
  footer,
  subtitle,
  title,
}: CardProps) {
  const hasHeader = Boolean(title || subtitle || actions);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={[
        "rounded-xl border border-slate-800 bg-slate-900/70 shadow-sm shadow-black/20 transition-[border-color,box-shadow] duration-200",
        "hover:border-slate-700/80 hover:shadow-md hover:shadow-black/30",
        className,
      ].join(" ")}
    >
      {hasHeader ? (
        <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-slate-50">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}

      <div className={["p-5", bodyClassName].join(" ")}>{children}</div>

      {footer ? (
        <div className="border-t border-slate-800 px-5 py-4">{footer}</div>
      ) : null}
    </motion.section>
  );
}

export type { CardProps };
