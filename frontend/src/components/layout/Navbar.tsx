"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Bell, ChevronDown, Menu, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcuts";
import NotificationDrawer from "@/components/ui/NotificationDrawer";

type NavbarProps = {
  onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut({ key: "/", preventDefault: true }, () => {
    searchInputRef.current?.focus();
  });

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4 lg:hidden">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground/70 transition-colors hover:border-primary/50 hover:bg-surface hover:text-primary"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-lg font-bold tracking-tight text-foreground">
              TransitOps
            </span>
          </div>
        </div>

        {/* Global Floating Search */}
        <div className="ml-auto hidden flex-1 max-w-md lg:block">
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-foreground/40 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search fleet, trips, drivers..."
              className="block w-full rounded-full border border-border/50 bg-surface/50 py-2 pl-10 pr-12 text-sm text-foreground transition-all duration-300 placeholder:text-foreground/40 focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <kbd className="hidden rounded bg-background px-2 py-0.5 text-xs font-semibold text-foreground/50 sm:block border border-border">
                /
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-4">
          
          {/* Theme Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="relative rounded-full p-2 text-foreground/60 transition-colors hover:bg-surface hover:text-foreground"
            >
              {theme === "light" ? <Sun size={20} /> : theme === "dark" ? <Moon size={20} /> : <Monitor size={20} />}
            </button>
            {isThemeMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsThemeMenuOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-border/50 bg-surface shadow-xl ring-1 ring-white/5">
                  <button onClick={() => { setTheme("light"); setIsThemeMenuOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground/80 hover:bg-background hover:text-foreground"><Sun size={14} /> Light</button>
                  <button onClick={() => { setTheme("dark"); setIsThemeMenuOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground/80 hover:bg-background hover:text-foreground"><Moon size={14} /> Dark</button>
                  <button onClick={() => { setTheme("system"); setIsThemeMenuOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground/80 hover:bg-background hover:text-foreground"><Monitor size={14} /> System</button>
                </div>
              </>
            )}
          </div>

          {/* Notification Bell */}
          <button onClick={() => setIsNotifOpen(true)} className="relative rounded-full p-2 text-foreground/60 transition-colors hover:bg-surface hover:text-foreground">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-background"></span>
          </button>

          {/* Profile Dropdown Toggle */}
          <div className="flex cursor-pointer items-center gap-3 rounded-full border border-border/50 bg-surface/50 p-1 pr-3 transition-colors hover:border-primary/30 hover:bg-surface">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white shadow-inner">
              AD
            </div>
            <div className="hidden flex-col items-start lg:flex">
              <span className="text-xs font-semibold leading-none text-foreground">Admin User</span>
              <span className="mt-1 text-[10px] leading-none text-foreground/50">Operations HQ</span>
            </div>
            <ChevronDown size={14} className="hidden text-foreground/50 lg:block" />
          </div>
        </div>
      </div>
    </header>
    <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
}
