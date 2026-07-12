"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-amber-500 text-slate-950 hover:bg-amber-400 focus-visible:ring-amber-400",
  secondary:
    "bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-500",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500",
  ghost:
    "bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-50 focus-visible:ring-slate-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export default function Button({
  children,
  className = "",
  disabled,
  isLoading = false,
  leftIcon,
  rightIcon,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        "disabled:cursor-not-allowed disabled:opacity-55",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {isLoading ? <LoadingSpinner size="sm" /> : leftIcon}
      <span>{children}</span>
      {!isLoading ? rightIcon : null}
    </motion.button>
  );
}

export type { ButtonProps, ButtonSize, ButtonVariant };
