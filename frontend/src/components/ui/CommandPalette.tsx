"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutDashboard, Truck, Users, Route, Receipt, PieChart, Settings, Wrench } from "lucide-react";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcuts";

type CommandItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  category: "Pages" | "Actions";
};

const commands: CommandItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard", category: "Pages" },
  { id: "vehicles", label: "Fleet & Vehicles", icon: <Truck size={18} />, href: "/vehicles", category: "Pages" },
  { id: "drivers", label: "Drivers", icon: <Users size={18} />, href: "/drivers", category: "Pages" },
  { id: "trips", label: "Trips", icon: <Route size={18} />, href: "/trips", category: "Pages" },
  { id: "maintenance", label: "Maintenance", icon: <Wrench size={18} />, href: "/maintenance", category: "Pages" },
  { id: "expenses", label: "Fuel & Expenses", icon: <Receipt size={18} />, href: "/expenses", category: "Pages" },
  { id: "reports", label: "Analytics", icon: <PieChart size={18} />, href: "/reports", category: "Pages" },
  { id: "settings", label: "Settings", icon: <Settings size={18} />, href: "/settings", category: "Pages" },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut([{ key: "k", ctrlKey: true }, { key: "k", metaKey: true }], () => {
    setIsOpen((prev) => !prev);
  });

  useKeyboardShortcut({ key: "Escape" }, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredCommands[selectedIndex].href);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border/50 bg-surface/90 shadow-2xl backdrop-blur-xl ring-1 ring-white/5"
          >
            <div className="flex items-center gap-3 border-b border-border/50 px-4 py-4">
              <Search className="h-5 w-5 text-foreground/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none"
                placeholder="Type a command or search..."
              />
              <kbd className="hidden rounded border border-border bg-background px-2 py-0.5 text-xs text-foreground/50 sm:block">
                ESC
              </kbd>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-6 text-center text-sm text-foreground/50">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                    Pages
                  </div>
                  {filteredCommands.map((cmd, index) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.href)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={[
                        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
                        selectedIndex === index
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-surface hover:text-foreground",
                      ].join(" ")}
                    >
                      <div className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        selectedIndex === index ? "bg-primary/20" : "bg-background"
                      ].join(" ")}>
                        {cmd.icon}
                      </div>
                      <span className="font-medium">{cmd.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
