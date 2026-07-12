"use client";

/**
 * Toast notification system — local state only, no external dependencies.
 * Wrap your layout with <ToastProvider> and use the useToast() hook to trigger.
 */

import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ───────────────────────────────────────────────────────────────────

type ToastType = "success" | "warning" | "error" | "info";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
};

type ToastContextValue = {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

// ── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

// ── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const duration = toast.duration ?? 4000;
      setToasts((prev) => [...prev, { ...toast, id, duration }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

// ── Toast container (positioned fixed) ──────────────────────────────────────

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col-reverse gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Individual toast ────────────────────────────────────────────────────────

const typeStyles: Record<ToastType, { border: string; icon: string; iconBg: string }> = {
  success: {
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
  warning: {
    border: "border-amber-500/30",
    icon: "text-amber-400",
    iconBg: "bg-amber-500/10",
  },
  error: {
    border: "border-red-500/30",
    icon: "text-red-400",
    iconBg: "bg-red-500/10",
  },
  info: {
    border: "border-cyan-500/30",
    icon: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
  },
};

const typeIcons: Record<ToastType, string> = {
  success: "m5 12 4 4L19 6",
  warning: "M12 9v4m0 4h.01M12 3 2 21h20L12 3Z",
  error: "m5 5 10 10M15 5 5 15",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const style = typeStyles[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={[
        "pointer-events-auto flex w-80 items-start gap-3 rounded-xl border bg-slate-900/95 p-4 shadow-xl shadow-black/30 backdrop-blur",
        style.border,
      ].join(" ")}
      role="alert"
    >
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          style.iconBg,
          style.icon,
        ].join(" ")}
      >
        <svg
          className="h-4 w-4"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d={typeIcons[toast.type]}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-100">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-xs text-slate-400">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
        aria-label="Dismiss notification"
      >
        <svg
          className="h-3.5 w-3.5"
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="m5 5 10 10M15 5 5 15"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>
    </motion.div>
  );
}

export type { Toast, ToastType };
