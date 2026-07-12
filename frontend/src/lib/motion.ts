/**
 * Shared Framer Motion animation variants and spring configs.
 * Import from "@/lib/motion" across the app.
 */
import type { Variants, Transition } from "framer-motion";

// ── Spring presets ──────────────────────────────────────────────────────────

/** Snappy spring for UI elements */
export const snappy: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 26,
  mass: 0.8,
};

/** Gentle spring for page-level content */
export const gentle: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 24,
  mass: 1,
};

// ── Fade variants ───────────────────────────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
};

// ── Scale variants ──────────────────────────────────────────────────────────

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: snappy,
  },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

// ── Slide variants ──────────────────────────────────────────────────────────

export const slideInRight: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: snappy },
  exit: { x: "100%", transition: { duration: 0.2, ease: "easeIn" } },
};

export const slideInLeft: Variants = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: snappy },
  exit: { x: "-100%", transition: { duration: 0.2, ease: "easeIn" } },
};

// ── Stagger containers ─────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Page transition ─────────────────────────────────────────────────────────

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};
