"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { notificationSettings, type NotificationSetting } from "@/constants/settings";

export default function NotificationSettings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(
      notificationSettings.map((ns) => [ns.id, ns.defaultEnabled]),
    ),
  );

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const alerts = notificationSettings.filter((n) => n.category === "alerts");
  const channels = notificationSettings.filter((n) => n.category === "channels");

  return (
    <Card
      title="Notification Preferences"
      subtitle="Choose which notifications you receive"
    >
      <div className="space-y-6">
        <NotificationGroup label="Alert Types" items={alerts} enabled={enabled} onToggle={toggle} />
        <div className="border-t border-slate-800" />
        <NotificationGroup label="Channels" items={channels} enabled={enabled} onToggle={toggle} />
      </div>
    </Card>
  );
}

function NotificationGroup({
  label,
  items,
  enabled,
  onToggle,
}: {
  label: string;
  items: NotificationSetting[];
  enabled: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-slate-800/40"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200">{item.label}</p>
              <p className="text-xs text-slate-500">{item.description}</p>
            </div>
            <ToggleSwitch
              checked={enabled[item.id]}
              onChange={() => onToggle(item.id)}
              label={item.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={[
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        checked ? "bg-cyan-500" : "bg-slate-700",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}
