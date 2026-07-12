type LoadingSpinnerSize = "sm" | "md" | "lg";

type LoadingSpinnerProps = {
  size?: LoadingSpinnerSize;
  label?: string;
  className?: string;
};

const sizeClasses: Record<LoadingSpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

export default function LoadingSpinner({
  className = "",
  label = "Loading",
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <span
      className={[
        "inline-block animate-spin rounded-full border-slate-500 border-t-amber-400",
        sizeClasses[size],
        className,
      ].join(" ")}
      role="status"
      aria-label={label}
    />
  );
}

export type { LoadingSpinnerProps, LoadingSpinnerSize };
