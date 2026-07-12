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
      <div className="relative group">
        {leadingIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-foreground/40 peer-focus:text-primary z-20">
            {leadingIcon}
          </span>
        ) : null}

        <input
          id={inputId}
          type={isSearch ? "search" : type}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          placeholder={label ? " " : props.placeholder}
          className={[
            "peer h-14 w-full rounded-lg border bg-surface/50 px-4 text-sm text-foreground outline-none transition-all duration-300",
            "focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-1 focus-visible:ring-primary focus-visible:shadow-[0_0_15px_rgba(99,102,241,0.15)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leadingIcon ? "pl-11" : "",
            rightIcon ? "pr-11" : "",
            label ? "pt-4 pb-1" : "py-3",
            hasError ? "border-danger text-danger focus-visible:border-danger focus-visible:ring-danger" : "border-border/50",
            className,
          ].join(" ")}
          {...props}
        />

        {label ? (
          <label
            htmlFor={inputId}
            className={[
              "absolute top-2 z-10 origin-[0] -translate-y-0.5 scale-75 transform text-xs text-foreground/50 transition-all duration-300",
              "peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm",
              "peer-focus:-translate-y-0.5 peer-focus:scale-75 peer-focus:text-primary pointer-events-none",
              leadingIcon ? "left-11" : "left-4",
              hasError ? "text-danger peer-focus:text-danger" : ""
            ].join(" ")}
          >
            {label}
          </label>
        ) : null}

        {rightIcon ? (
          <span className="absolute inset-y-0 right-3 flex items-center text-foreground/40 z-20">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export type { InputProps };
