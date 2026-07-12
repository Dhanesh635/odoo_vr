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
        "relative rounded-[20px] bg-surface/80 backdrop-blur-xl border border-border shadow-xl shadow-black/40 ring-1 ring-white/5 transition-[border-color,box-shadow,transform] duration-300",
        "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
        className,
      ].join(" ")}
    >
      {hasHeader ? (
        <div className="flex flex-col gap-3 border-b border-border/50 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm text-foreground/60">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}

      <div className={["p-6", bodyClassName].join(" ")}>{children}</div>

      {footer ? (
        <div className="border-t border-border/50 px-6 py-5">{footer}</div>
      ) : null}
    </motion.section>
  );
}

export type { CardProps };
