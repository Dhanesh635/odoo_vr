"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar onMenuClick={() => setIsSidebarOpen((isOpen) => !isOpen)} />

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {isSidebarOpen ? (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <button
              type="button"
              aria-label="Close navigation menu"
              className="absolute inset-0 bg-slate-950/70"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="relative z-10 h-full shadow-2xl shadow-black/50">
              <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 overflow-y-auto bg-slate-950">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
