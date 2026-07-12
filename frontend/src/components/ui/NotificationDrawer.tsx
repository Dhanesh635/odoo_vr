"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, Settings } from "lucide-react";

type NotificationDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const mockNotifications = [
  { id: 1, type: "warning", title: "Maintenance Due", desc: "Vehicle TR003 requires oil change", time: "10 min ago" },
  { id: 2, type: "success", title: "Trip Completed", desc: "Trip #8402 completed safely", time: "1 hour ago" },
  { id: 3, type: "info", title: "System Update", desc: "TransitOps v2.4 deployed successfully", time: "2 hours ago" },
  { id: 4, type: "warning", title: "Driver Idle", desc: "Driver Alex idle for >30 mins", time: "3 hours ago" },
];

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-border/50 bg-surface/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-border/50 px-6">
              <h2 className="text-lg font-bold tracking-tight text-foreground">Notifications</h2>
              <div className="flex items-center gap-2">
                <button className="rounded-full p-2 text-foreground/50 hover:bg-background hover:text-foreground">
                  <Settings size={18} />
                </button>
                <button onClick={onClose} className="rounded-full p-2 text-foreground/50 hover:bg-background hover:text-foreground">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between px-2 pb-4">
                <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider">Today</span>
                <button className="text-xs font-medium text-primary hover:underline">Mark all as read</button>
              </div>

              <div className="space-y-3">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="relative overflow-hidden rounded-xl border border-border/50 bg-background/50 p-4 transition-colors hover:bg-surface hover:shadow-md">
                    <div className="flex gap-3">
                      <div className="mt-0.5 shrink-0">
                        {notif.type === "warning" && <AlertCircle size={18} className="text-warning" />}
                        {notif.type === "success" && <CheckCircle size={18} className="text-success" />}
                        {notif.type === "info" && <Info size={18} className="text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                        <p className="mt-1 text-xs text-foreground/60">{notif.desc}</p>
                        <p className="mt-2 text-[10px] font-medium text-foreground/40">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
