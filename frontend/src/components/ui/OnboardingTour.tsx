"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("transitops-onboarding-v1");
    if (!hasSeenOnboarding) {
      // Small delay to let the initial animation finish
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("transitops-onboarding-v1", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[24px] border border-border/50 bg-surface shadow-2xl ring-1 ring-white/5"
          >
            {/* Top decorative gradient */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
            
            <button
              onClick={handleComplete}
              className="absolute right-4 top-4 rounded-full p-2 text-foreground/40 hover:bg-background hover:text-foreground"
            >
              <X size={16} />
            </button>

            <div className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <Sparkles size={32} />
              </div>
              
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
                Welcome to TransitOps
              </h2>
              <p className="mb-8 text-sm text-foreground/60 leading-relaxed">
                Experience the next generation of fleet operations. We've redesigned everything to make managing your vehicles, trips, and drivers smoother than ever.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-xl border border-border/50 bg-background/50 p-4 text-left">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface font-mono text-xs font-bold shadow-sm border border-border">
                    ⌘K
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Command Palette</h3>
                    <p className="mt-1 text-xs text-foreground/60">Press Ctrl+K (or Cmd+K) anywhere to quickly navigate and search.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
