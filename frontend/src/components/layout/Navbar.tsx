"use client";

type NavbarProps = {
  onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 text-slate-300 transition-colors hover:border-cyan-400/40 hover:bg-slate-900 hover:text-cyan-200 lg:hidden"
          aria-label="Open navigation menu"
        >
          <span className="sr-only">Open navigation menu</span>
          <span className="block h-0.5 w-5 bg-current before:block before:h-0.5 before:w-5 before:-translate-y-1.5 before:bg-current before:content-[''] after:block after:h-0.5 after:w-5 after:translate-y-1 after:bg-current after:content-['']" />
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-cyan-400 text-sm font-black text-slate-950">
            TO
          </div>
          <span className="truncate text-lg font-semibold text-slate-50">
            TransitOps
          </span>
        </div>

        <div className="ml-auto hidden w-full max-w-xl sm:block">
          <label htmlFor="global-search" className="sr-only">
            Search
          </label>
          <input
            id="global-search"
            type="search"
            placeholder="Search fleet, trips, drivers..."
            className="h-10 w-full rounded-md border border-slate-800 bg-slate-900/80 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200 sm:inline-flex">
            Operations Admin
          </span>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-100"
            aria-label="Logged in user"
            title="Logged in user"
          >
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
