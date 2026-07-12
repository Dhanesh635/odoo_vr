import { SelectHTMLAttributes, useId } from "react";

type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  placeholder?: string;
  error?: string;
  options: SelectOption[];
};

export default function Select({
  className = "",
  disabled,
  error,
  id,
  label,
  options,
  placeholder = "Select an option",
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <div className="relative group">
        <select
          id={selectId}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${selectId}-error` : undefined}
          className={[
            "peer h-14 w-full appearance-none rounded-lg border bg-surface/50 px-4 text-sm text-foreground outline-none transition-all duration-300",
            "focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-1 focus-visible:ring-primary focus-visible:shadow-[0_0_15px_rgba(99,102,241,0.15)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            label ? "pt-4 pb-1" : "py-3",
            hasError ? "border-danger text-danger focus-visible:border-danger focus-visible:ring-danger" : "border-border/50",
            className,
          ].join(" ")}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Chevron for select */}
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-foreground/40 peer-focus:text-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {label ? (
          <label
            htmlFor={selectId}
            className={[
              "absolute top-2 left-4 z-10 origin-[0] -translate-y-0.5 scale-75 transform text-xs text-foreground/50 transition-all duration-300 pointer-events-none",
              "peer-focus:text-primary",
              hasError ? "text-danger peer-focus:text-danger" : ""
            ].join(" ")}
          >
            {label}
          </label>
        ) : null}
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export type { SelectOption, SelectProps };
