"use client";

import { InputHTMLAttributes } from "react";

type SearchBarProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  onClear?: () => void;
};

function SearchIcon() {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 20 20" fill="none">
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

function ClearIcon() {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="m5 5 10 10M15 5 5 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function SearchBar({
  className = "",
  disabled,
  onClear,
  placeholder = "Search...",
  value,
  ...props
}: SearchBarProps) {
  const hasValue = value !== undefined && String(value).length > 0;

  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
        <SearchIcon />
      </span>
      <input
        type="search"
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        className={[
          "h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-10 text-sm text-slate-100 outline-none transition-colors",
          "placeholder:text-slate-500 focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400/20",
          "disabled:cursor-not-allowed disabled:bg-slate-900/50 disabled:text-slate-500",
          className,
        ].join(" ")}
        {...props}
      />
      {hasValue && onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-2 my-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 focus-ring"
          aria-label="Clear search"
        >
          <ClearIcon />
        </button>
      ) : null}
    </div>
  );
}

export type { SearchBarProps };
