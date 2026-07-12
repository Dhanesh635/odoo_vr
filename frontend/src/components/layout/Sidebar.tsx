"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export type SidebarItem = {
  label: string;
  href: string;
  icon: string;
};

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { label: "Fleet", href: "/vehicles", icon: "M4 16V8.5A2.5 2.5 0 016.5 6h7l3.5 4v6M6 17.5h.01M16 17.5h.01M4 13h16" },
  { label: "Drivers", href: "/drivers", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: "Trips", href: "/trips", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
  { label: "Maintenance", href: "/maintenance", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Fuel & Expenses", href: "/expenses", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Analytics", href: "/reports", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Settings", href: "/settings", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
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
        {items.map((item, index) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/dashboard" && currentPath.startsWith(item.href));

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
            >
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-inset ring-cyan-400/25"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100",
                ].join(" ")}
              >
                <svg
                  className="h-[18px] w-[18px] shrink-0"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d={item.icon}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                  />
                </svg>
                <span>{item.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute right-3 h-1.5 w-1.5 rounded-full bg-cyan-300"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                ) : (
                  <span
                    className="absolute right-3 h-1.5 w-1.5 rounded-full bg-transparent transition-colors group-hover:bg-slate-600"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}
