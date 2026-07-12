"use client";

import { useState } from "react";
import ProfileCard from "@/components/settings/ProfileCard";
import ProfileForm from "@/components/settings/ProfileForm";
import RoleCard from "@/components/settings/RoleCard";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import PreferencesCard from "@/components/settings/PreferencesCard";
import { PageTransition, PageSection } from "@/components/ui";

// ── Tab definitions ────────────────────────────────────────────────────────

type SettingsTab =
  | "profile"
  | "roles"
  | "notifications"
  | "appearance"
  | "security"
  | "about";

type TabDefinition = {
  id: SettingsTab;
  label: string;
  icon: string;
};

const tabs: TabDefinition[] = [
  {
    id: "profile",
    label: "Profile",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    id: "roles",
    label: "Roles",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
  {
    id: "security",
    label: "Security",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    id: "about",
    label: "About",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <PageTransition className="space-y-6">
      {/* Page header */}
      <PageSection>
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Settings</h1>
            <p className="mt-2 text-base text-slate-400">
              Manage your profile, preferences and security
            </p>
          </div>
          {activeTab === "profile" ? <ProfileForm /> : null}
        </header>
      </PageSection>

      {/* Tab navigation */}
      <PageSection>
        <nav className="flex gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 p-1.5">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-cyan-500/15 text-cyan-200 shadow-sm shadow-black/20 ring-1 ring-inset ring-cyan-400/25"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
                ].join(" ")}
              >
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d={tab.icon}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </PageSection>

      {/* Active section content */}
      <PageSection>
        <div
          className="animate-[transitops-fade-in_0.3s_ease-out]"
          key={activeTab}
        >
          {activeTab === "profile" ? <ProfileCard /> : null}
          {activeTab === "roles" ? <RoleCard /> : null}
          {activeTab === "notifications" ? <NotificationSettings /> : null}
          {activeTab === "appearance" ? <AppearanceSettings /> : null}
          {activeTab === "security" ? <SecuritySettings /> : null}
          {activeTab === "about" ? <PreferencesCard /> : null}
        </div>
      </PageSection>
    </PageTransition>
  );
}
