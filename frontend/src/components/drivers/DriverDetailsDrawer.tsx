"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui";
import { LicenseStatusBadge, SafetyScore } from "./DriverTable";
import { motion, AnimatePresence } from "framer-motion";
import { slideInRight } from "@/lib/motion";
import type { Driver } from "@/types/driver";

type DriverDetailsDrawerProps = {
  driver: Driver | null;
  onClose: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function DriverDetailsDrawer({
  driver,
  onClose,
}: DriverDetailsDrawerProps) {
  useEffect(() => {
    if (!driver) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [driver, onClose]);

  return (
    <AnimatePresence>
      {driver ? (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            type="button"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close driver details"
          />
          <motion.aside
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
              Driver Details
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              {driver.fullName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 focus-ring"
            aria-label="Close driver details"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <div className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-950/50 p-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-2xl font-bold text-amber-300 ring-1 ring-amber-500/20">
              {driver.fullName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-50">
              {driver.fullName}
            </h3>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Badge status={driver.status} />
              <LicenseStatusBadge status={driver.licenseStatus} />
            </div>
          </div>

          <div className="grid gap-4">
            <DetailItem label="Phone" value={driver.phoneNumber} />
            <DetailItem label="Email" value={driver.email} />
            <DetailItem label="License Number" value={driver.licenseNumber} />
            <DetailItem label="Category" value={driver.licenseCategory} />
            <DetailItem
              label="Expiry Date"
              value={dateFormatter.format(new Date(driver.licenseExpiryDate))}
            />
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <dt className="text-sm text-slate-400">Safety Score</dt>
              <dd className="mt-3">
                <SafetyScore value={driver.safetyScore} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="text-sm text-slate-400">Current Status</span>
              <Badge status={driver.status} />
            </div>
          </div>

          <PlaceholderSection title="Assigned Trips" />
          <PlaceholderSection title="Recent Activity" />
        </div>
      </motion.aside>
    </div>
      ) : null}
    </AnimatePresence>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-100">{value}</dd>
    </div>
  );
}

function PlaceholderSection({ title }: { title: string }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{title} placeholder</p>
    </section>
  );
}

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
