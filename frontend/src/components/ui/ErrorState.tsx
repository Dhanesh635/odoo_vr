/**
 * ErrorState — Reusable error UI with illustration, message, and CTA.
 * Variants: network, noData, permissionDenied, notFound.
 */

import { ReactNode } from "react";
import Button from "./Button";

type ErrorVariant = "network" | "noData" | "permissionDenied" | "notFound";

type ErrorStateProps = {
  variant?: ErrorVariant;
  title?: string;
  description?: string;
  action?: ReactNode;
  onRetry?: () => void;
  className?: string;
};

type ErrorConfig = {
  title: string;
  description: string;
  icon: string;
  actionLabel: string;
};

const errorConfigs: Record<ErrorVariant, ErrorConfig> = {
  network: {
    title: "Connection Error",
    description:
      "Unable to reach the server. Please check your internet connection and try again.",
    icon: "M8.111 16.404a5.5 5.5 0 0 1 7.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0",
    actionLabel: "Retry",
  },
  noData: {
    title: "No Data Found",
    description:
      "There are no records to display. Try adjusting your filters or adding new data.",
    icon: "M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9ZM8 10h8M8 14h5",
    actionLabel: "Refresh",
  },
  permissionDenied: {
    title: "Access Denied",
    description:
      "You don't have permission to view this resource. Contact your administrator for access.",
    icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z",
    actionLabel: "Go Back",
  },
  notFound: {
    title: "Page Not Found",
    description:
      "The page you're looking for doesn't exist or has been moved.",
    icon: "M9.172 9.172a4 4 0 0 1 5.656 0m-7.07-2.828a8 8 0 0 1 11.314 0M12 12v.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    actionLabel: "Go Home",
  },
};

export default function ErrorState({
  variant = "noData",
  title,
  description,
  action,
  onRetry,
  className = "",
}: ErrorStateProps) {
  const config = errorConfigs[variant];
  const displayTitle = title ?? config.title;
  const displayDescription = description ?? config.description;

  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center",
        className,
      ].join(" ")}
    >
      {/* Illustration */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
        <svg
          className="h-10 w-10"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d={config.icon}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-50">
        {displayTitle}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        {displayDescription}
      </p>

      {action ? (
        <div className="mt-6">{action}</div>
      ) : onRetry ? (
        <div className="mt-6">
          <Button variant="secondary" onClick={onRetry}>
            {config.actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export type { ErrorStateProps, ErrorVariant };
