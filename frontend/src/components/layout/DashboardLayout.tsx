"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (pathname === "/login") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar onMenuClick={() => setIsSidebarOpen((isOpen) => !isOpen)} />

        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Animated mobile sidebar */}
          <AnimatePresence>
            {isSidebarOpen ? (
              <div className="fixed inset-0 z-40 flex lg:hidden">
                {/* Backdrop */}
                <motion.button
                  type="button"
                  aria-label="Close navigation menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                  onClick={() => setIsSidebarOpen(false)}
                />
                {/* Sidebar panel */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="relative z-10 h-full shadow-2xl shadow-black/50"
                >
                  <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>

          <main className="min-w-0 flex-1 overflow-y-auto bg-slate-950">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
