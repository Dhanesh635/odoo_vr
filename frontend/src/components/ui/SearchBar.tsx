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
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-foreground/40 z-20 group-focus-within:text-primary">
        <SearchIcon />
      </span>
      <input
        type="search"
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        className={[
          "peer h-14 w-full rounded-lg border border-border/50 bg-surface/50 px-10 text-sm text-foreground outline-none transition-all duration-300",
          "placeholder:text-foreground/40 focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-1 focus-visible:ring-primary focus-visible:shadow-[0_0_15px_rgba(99,102,241,0.15)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        ].join(" ")}
        {...props}
      />
      {hasValue && onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md text-foreground/40 transition-colors hover:bg-surface hover:text-foreground focus-ring z-20"
          aria-label="Clear search"
        >
          <ClearIcon />
        </button>
      ) : null}
    </div>
  );
}

export type { SearchBarProps };
