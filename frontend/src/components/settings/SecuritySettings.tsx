"use client";

import { useState } from "react";
import { Button, Card, Input, Modal } from "@/components/ui";
import {
  lastLogin,
  twoFactorEnabled,
  sessionHistory,
} from "@/constants/settings";

export default function SecuritySettings() {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [tfa, setTfa] = useState(twoFactorEnabled);
  const [pwSaved, setPwSaved] = useState(false);

  function handlePasswordSave() {
    setPwSaved(true);
    setTimeout(() => {
      setPwSaved(false);
      setIsPasswordOpen(false);
    }, 1200);
  }

  return (
    <>
      <Card title="Security" subtitle="Manage your account security settings">
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="grid gap-3 sm:grid-cols-2">
            <SecurityActionCard
              icon={lockPath}
              title="Change Password"
              description="Update your account password"
              onClick={() => setIsPasswordOpen(true)}
            />
            <SecurityActionCard
              icon={shieldPath}
              title="Two-Factor Authentication"
              description={tfa ? "Enabled — click to manage" : "Not enabled — click to set up"}
              statusColor={tfa ? "emerald" : "slate"}
              onClick={() => setIs2FAOpen(true)}
            />
          </div>

          {/* Last login */}
          <div className="flex items-center gap-3 rounded-lg bg-slate-800/40 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700/60 text-slate-400">
              <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 7v5l3 2m5-2a8 8 0 11-16 0 8 8 0 0116 0z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Last Login
              </p>
              <p className="text-sm text-slate-200">{lastLogin}</p>
            </div>
          </div>

          {/* Session history */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Session History
            </h3>
            <div className="space-y-2">
              {sessionHistory.map((session) => (
                <div
                  key={session.id}
                  className={[
                    "flex flex-col gap-2 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
                    session.isCurrent
                      ? "border-cyan-500/30 bg-cyan-500/5"
                      : "border-slate-800 bg-slate-800/30",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        session.isCurrent
                          ? "bg-cyan-500/15 text-cyan-300"
                          : "bg-slate-700/50 text-slate-500",
                      ].join(" ")}
                    >
                      <DeviceIcon device={session.device} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-200">
                        {session.device}
                        {session.isCurrent ? (
                          <span className="ml-2 text-xs text-cyan-400">
                            (Current)
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {session.browser} · {session.ip} · {session.location}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500 sm:text-right">
                    {session.lastActive}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        title="Change Password"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsPasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSave}>
              {pwSaved ? "✓ Updated" : "Update Password"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Current Password" type="password" placeholder="Enter current password" />
          <Input label="New Password" type="password" placeholder="Enter new password" />
          <Input label="Confirm New Password" type="password" placeholder="Re-enter new password" />
        </div>
      </Modal>

      {/* 2FA Modal */}
      <Modal
        isOpen={is2FAOpen}
        onClose={() => setIs2FAOpen(false)}
        title="Two-Factor Authentication"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIs2FAOpen(false)}>
              Close
            </Button>
            <Button
              variant={tfa ? "danger" : "primary"}
              onClick={() => {
                setTfa((p) => !p);
                setTimeout(() => setIs2FAOpen(false), 600);
              }}
            >
              {tfa ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-slate-300">
          <p>
            Two-factor authentication adds an extra layer of security by
            requiring a verification code in addition to your password.
          </p>
          <div className="flex items-center gap-3 rounded-lg bg-slate-800/60 px-4 py-3">
            <span
              className={[
                "h-2.5 w-2.5 rounded-full",
                tfa ? "bg-emerald-400" : "bg-slate-600",
              ].join(" ")}
            />
            <span className="text-sm font-medium">
              Status: {tfa ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
}

// ── helper components ──────────────────────────────────────────────────────

function SecurityActionCard({
  icon,
  title,
  description,
  statusColor = "slate",
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  statusColor?: "emerald" | "slate";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-800/30 p-4 text-left transition-all hover:border-cyan-500/30 hover:bg-slate-800/60"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 transition-colors group-hover:bg-cyan-500/15 group-hover:text-cyan-300">
        <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path
            d={icon}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-200 transition-colors">
          {title}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span
            className={[
              "h-1.5 w-1.5 rounded-full",
              statusColor === "emerald" ? "bg-emerald-400" : "bg-slate-600",
            ].join(" ")}
          />
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </button>
  );
}

function DeviceIcon({ device }: { device: string }) {
  const isPhone = device.toLowerCase().includes("phone") || device.toLowerCase().includes("iphone");
  const isMac = device.toLowerCase().includes("mac");
  const path = isPhone
    ? "M7 2h10a1 1 0 011 1v18a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1zm5 18h.01"
    : isMac
      ? "M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm4 15h8m-4-2v2"
      : "M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm0 10h16m-8 2v4m-4 0h8";

  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d={path}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

const lockPath =
  "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z";
const shieldPath =
  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z";
