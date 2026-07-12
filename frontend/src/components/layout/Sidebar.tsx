"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Receipt,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Fleet", href: "/vehicles", icon: <Truck size={18} /> },
  { label: "Drivers", href: "/drivers", icon: <Users size={18} /> },
  { label: "Trips", href: "/trips", icon: <Route size={18} /> },
  { label: "Maintenance", href: "/maintenance", icon: <Wrench size={18} /> },
  { label: "Fuel & Expenses", href: "/expenses", icon: <Receipt size={18} /> },
  { label: "Analytics", href: "/reports", icon: <PieChart size={18} /> },
  { label: "Settings", href: "/settings", icon: <Settings size={18} /> },
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 288 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex h-full shrink-0 flex-col border-r border-border/50 bg-background/50 backdrop-blur-xl text-foreground"
    >
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-5">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-lg font-bold tracking-tight">TransitOps</span>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 transition-colors hover:bg-surface hover:text-foreground mx-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-6" aria-label="Primary">
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
                  "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_0px_1px_1px_rgba(255,255,255,0.05)]"
                    : "text-foreground/60 hover:bg-surface hover:text-foreground",
                  isCollapsed ? "justify-center" : "",
                ].join(" ")}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10 flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative z-10 truncate"
                  >
                    {item.label}
                  </motion.span>
                )}

                {!isCollapsed && isActive && (
                  <motion.span
                    layoutId="sidebar-active-indicator"
                    className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
}
