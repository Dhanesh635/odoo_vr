import { InputHTMLAttributes, ReactNode, useId } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isSearch?: boolean;
};

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
    >
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

export default function Input({
  className = "",
  disabled,
  error,
  id,
  isSearch = false,
  label,
  leftIcon,
  rightIcon,
  type = "text",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(error);
  const leadingIcon = isSearch || type === "search" ? <SearchIcon /> : leftIcon;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        {leadingIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
            {leadingIcon}
          </span>
        ) : null}

        <input
          id={inputId}
          type={isSearch ? "search" : type}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={[
            "h-11 w-full rounded-lg border bg-slate-900 px-3 text-sm text-slate-100 outline-none transition-colors",
            "placeholder:text-slate-500 focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400/20",
            "disabled:cursor-not-allowed disabled:bg-slate-900/50 disabled:text-slate-500",
            leadingIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            hasError ? "border-red-500" : "border-slate-700",
            className,
          ].join(" ")}
          {...props}
        />

        {rightIcon ? (
          <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export type { InputProps };
