"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarItem = {
  label: string;
  href: string;
};

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Fleet", href: "/vehicles" },
  { label: "Drivers", href: "/drivers" },
  { label: "Trips", href: "/trips" },
  { label: "Maintenance", href: "/maintenance" },
  { label: "Fuel & Expenses", href: "/expenses" },
  { label: "Analytics", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

type SidebarProps = {
  activeHref?: string;
  items?: SidebarItem[];
  onNavigate?: () => void;
};

export default function Sidebar({
  activeHref,
  items = sidebarItems,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const currentPath = activeHref ?? pathname;

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800/80 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Operations
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Primary">
        {items.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/dashboard" && currentPath.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={[
                "group flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-inset ring-cyan-400/25"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100",
              ].join(" ")}
            >
              <span>{item.label}</span>
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  isActive ? "bg-cyan-300" : "bg-transparent group-hover:bg-slate-600",
                ].join(" ")}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
