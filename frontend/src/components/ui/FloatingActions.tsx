"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, HelpCircle, X, Send, Book, MessageCircle, FileText, Truck, Users, Route } from "lucide-react";

export default function FloatingActions() {
  const [activeFab, setActiveFab] = useState<"ai" | "help" | "quick" | null>(null);

  const toggleFab = (fab: "ai" | "help" | "quick") => {
    setActiveFab((prev) => (prev === fab ? null : fab));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-4">
      {/* AI Assistant FAB */}
      <div className="relative">
        <button
          onClick={() => toggleFab("ai")}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-transform hover:scale-110 active:scale-95"
          aria-label="AI Assistant"
        >
          {activeFab === "ai" ? <X size={24} /> : <MessageSquare size={24} />}
        </button>

        <AnimatePresence>
          {activeFab === "ai" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-16 right-0 mb-4 w-80 overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-2xl ring-1 ring-white/5"
            >
              <div className="bg-gradient-to-r from-primary to-secondary px-4 py-3">
                <h3 className="text-sm font-bold text-white">TransitOps AI</h3>
                <p className="text-xs text-white/80">Ask me anything about your fleet</p>
              </div>
              <div className="h-64 overflow-y-auto p-4 bg-background/50">
                <div className="mb-4 flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <MessageSquare size={14} />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-surface p-3 text-sm text-foreground shadow-sm border border-border/50">
                    Hi! I noticed Vehicle TR003 is due for maintenance. Would you like me to schedule it?
                  </div>
                </div>
              </div>
              <div className="border-t border-border/50 bg-surface p-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    className="w-full rounded-full border border-border/50 bg-background py-2 pl-4 pr-10 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                  <button className="absolute inset-y-0 right-2 my-auto flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-primary/10">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions FAB */}
      <div className="relative">
        <button
          onClick={() => toggleFab("quick")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border/50 bg-surface text-foreground shadow-lg backdrop-blur-sm transition-transform hover:scale-110 hover:border-primary/50 hover:text-primary active:scale-95"
          aria-label="Quick Actions"
        >
          {activeFab === "quick" ? <X size={20} /> : <Plus size={20} />}
        </button>

        <AnimatePresence>
          {activeFab === "quick" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="absolute bottom-2 right-14 mr-2 flex w-48 flex-col gap-1 rounded-xl border border-border/50 bg-surface p-1 shadow-2xl backdrop-blur-xl"
            >
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Truck size={16} /> New Vehicle
              </button>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Users size={16} /> New Driver
              </button>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Route size={16} /> New Trip
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Center FAB */}
      <div className="relative">
        <button
          onClick={() => toggleFab("help")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-surface/50 text-foreground/70 shadow-md backdrop-blur-sm transition-transform hover:scale-110 hover:border-primary/50 hover:text-primary active:scale-95"
          aria-label="Help Center"
        >
          {activeFab === "help" ? <X size={18} /> : <HelpCircle size={18} />}
        </button>

        <AnimatePresence>
          {activeFab === "help" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="absolute bottom-1 right-12 mr-2 flex w-48 flex-col gap-1 rounded-xl border border-border/50 bg-surface p-1 shadow-2xl backdrop-blur-xl"
            >
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Book size={16} /> Documentation
              </button>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <FileText size={16} /> FAQ
              </button>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <MessageCircle size={16} /> Support
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
