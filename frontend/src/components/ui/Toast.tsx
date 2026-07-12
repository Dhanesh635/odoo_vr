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
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

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
    border: "border-success/30",
    icon: "text-success",
    iconBg: "bg-success/10",
  },
  warning: {
    border: "border-warning/30",
    icon: "text-warning",
    iconBg: "bg-warning/10",
  },
  error: {
    border: "border-danger/30",
    icon: "text-danger",
    iconBg: "bg-danger/10",
  },
  info: {
    border: "border-primary/30",
    icon: "text-primary",
    iconBg: "bg-primary/10",
  },
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case "success": return <CheckCircle2 size={16} />;
    case "warning": return <AlertTriangle size={16} />;
    case "error": return <XCircle size={16} />;
    case "info": return <Info size={16} />;
  }
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
        "pointer-events-auto flex w-80 items-start gap-3 rounded-2xl border bg-surface/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl ring-1 ring-white/5",
        style.border,
      ].join(" ")}
      role="alert"
    >
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm",
          style.iconBg,
          style.icon,
        ].join(" ")}
      >
        <ToastIcon type={toast.type} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-xs text-foreground/60">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-foreground/40 transition-colors hover:bg-background hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export type { Toast, ToastType };
