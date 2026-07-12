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
      {label ? (
        <label
          htmlFor={selectId}
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${selectId}-error` : undefined}
        className={[
          "h-11 w-full rounded-lg border bg-slate-900 px-3 text-sm text-slate-100 outline-none transition-colors",
          "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20",
          "disabled:cursor-not-allowed disabled:bg-slate-900/50 disabled:text-slate-500",
          hasError ? "border-red-500" : "border-slate-700",
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

      {error ? (
        <p id={`${selectId}-error`} className="mt-2 text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export type { SelectOption, SelectProps };
