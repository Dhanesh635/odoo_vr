"use client";

/**
 * LoadingOverlay — Covers a parent container with a semi-transparent loading state.
 * Use position: relative on the parent.
 */

import LoadingSpinner from "./LoadingSpinner";

type LoadingOverlayProps = {
  /** Whether the overlay is visible */
  isLoading: boolean;
  /** "fullscreen" covers the viewport; "inline" covers the nearest relative parent */
  mode?: "fullscreen" | "inline";
  label?: string;
};

export default function LoadingOverlay({
  isLoading,
  mode = "inline",
  label = "Loading...",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  const positionClass = mode === "fullscreen" ? "fixed inset-0 z-[70]" : "absolute inset-0 z-20";

  return (
    <div
      className={[
        positionClass,
        "flex items-center justify-center rounded-xl bg-slate-950/70 backdrop-blur-sm",
      ].join(" ")}
      role="status"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" label={label} />
        <p className="text-sm font-medium text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export type { LoadingOverlayProps };
