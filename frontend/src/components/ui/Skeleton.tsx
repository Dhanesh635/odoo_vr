/**
 * Skeleton — Shimmer placeholder for loading states.
 * Uses CSS animation defined in globals.css.
 */

type SkeletonVariant = "text" | "circular" | "rectangular" | "card" | "tableRow" | "chart";

type SkeletonProps = {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  /** Number of skeleton items to render (for lists) */
  count?: number;
};

const variantClasses: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  circular: "h-10 w-10 rounded-full",
  rectangular: "h-24 w-full rounded-xl",
  card: "h-32 w-full rounded-xl",
  tableRow: "h-12 w-full rounded-lg",
  chart: "h-64 w-full rounded-xl",
};

export default function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  count = 1,
}: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={["skeleton", variantClasses[variant], className].join(" ")}
          style={{
            width: width ?? undefined,
            height: height ?? undefined,
          }}
          role="status"
          aria-label="Loading"
        />
      ))}
    </>
  );
}

/** Pre-composed skeleton for table loading state */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2 p-4">
      {/* Header skeleton */}
      <div className="flex gap-4 pb-2">
        {Array.from({ length: cols }, (_, i) => (
          <div key={i} className="skeleton h-4 flex-1 rounded" />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-4 py-3">
          {Array.from({ length: cols }, (_, j) => (
            <div
              key={j}
              className="skeleton h-4 flex-1 rounded"
              style={{ animationDelay: `${(i * cols + j) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Pre-composed skeleton for card grids */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-8 w-16 rounded" />
            </div>
            <div className="skeleton h-11 w-11 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Pre-composed skeleton for charts */
export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-4 space-y-2">
        <div className="skeleton h-5 w-40 rounded" />
        <div className="skeleton h-3 w-64 rounded" />
      </div>
      <div className="skeleton h-64 w-full rounded-xl" />
    </div>
  );
}

export type { SkeletonProps, SkeletonVariant };
