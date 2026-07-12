"use client";

/**
 * PageTransition — Wraps page content with a fade-in-up entrance animation.
 * Usage: <PageTransition>...page content...</PageTransition>
 */

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { pageTransition, staggerItem } from "@/lib/motion";

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
};

export default function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Wrap individual page sections for staggered entrance */
export function PageSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

export type { PageTransitionProps };
