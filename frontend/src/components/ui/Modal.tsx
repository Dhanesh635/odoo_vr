"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
};

function CloseIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="m5 5 10 10M15 5 5 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function Modal({
  children,
  className = "",
  closeOnOverlayClick = true,
  footer,
  isOpen,
  onClose,
  title,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Animated backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-label="Close modal"
          />

          {/* Animated panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 5 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={[
              "relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50",
              className,
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-4">
              <h2 id="modal-title" className="text-base font-semibold text-slate-50">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 focus-ring"
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4 text-sm text-slate-300">
              {children}
            </div>

            {footer ? (
              <div className="flex flex-col-reverse gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:justify-end">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export type { ModalProps };
