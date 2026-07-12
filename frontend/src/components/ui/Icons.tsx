/**
 * Shared SVG icon helpers used across multiple pages.
 * Eliminates duplication of PlusIcon, ExportIcon, Icon, etc.
 */

import { type ReactNode } from "react";

/** Generic stroke icon — pass any SVG path data */
export function Icon({ path, className = "h-4 w-4" }: { path: string; className?: string }): ReactNode {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d={path}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function PlusIcon() {
  return <Icon path="M12 5v14M5 12h14" />;
}

export function ExportIcon() {
  return <Icon path="M12 3v10m0 0 4-4m-4 4-4-4M5 15v4h14v-4" />;
}

export function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="m5 5 10 10M15 5 5 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="m14 14 3 3m-1.5-8.5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
