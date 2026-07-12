// ---------------------------------------------------------------------------
// Settings – static data
// ---------------------------------------------------------------------------

// ── Profile ────────────────────────────────────────────────────────────────

export type UserProfile = {
  avatar: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  role: string;
  company: string;
};

export const userProfile: UserProfile = {
  avatar: "AD",
  name: "Arjun Deshmukh",
  email: "arjun.deshmukh@transitops.io",
  phone: "+91 98765 43210",
  designation: "Operations Admin",
  role: "Fleet Manager",
  company: "TransitOps Logistics Pvt. Ltd.",
};

// ── Roles & permissions ────────────────────────────────────────────────────

export type RoleName =
  | "Fleet Manager"
  | "Dispatcher"
  | "Safety Officer"
  | "Financial Analyst";

export type PermissionLevel = "full" | "read" | "none";

export type PermissionModule =
  | "Dashboard"
  | "Fleet"
  | "Drivers"
  | "Trips"
  | "Maintenance"
  | "Fuel & Expenses"
  | "Analytics"
  | "Settings";

export type RolePermissions = Record<PermissionModule, PermissionLevel>;

export type RoleDefinition = {
  name: RoleName;
  description: string;
  color: string;
  permissions: RolePermissions;
};

const allModules: PermissionModule[] = [
  "Dashboard",
  "Fleet",
  "Drivers",
  "Trips",
  "Maintenance",
  "Fuel & Expenses",
  "Analytics",
  "Settings",
];

export { allModules };

export const roles: RoleDefinition[] = [
  {
    name: "Fleet Manager",
    description: "Full access to fleet operations, vehicles and driver management",
    color: "cyan",
    permissions: {
      Dashboard: "full",
      Fleet: "full",
      Drivers: "full",
      Trips: "full",
      Maintenance: "full",
      "Fuel & Expenses": "read",
      Analytics: "full",
      Settings: "full",
    },
  },
  {
    name: "Dispatcher",
    description: "Manages trip assignments, scheduling and route planning",
    color: "amber",
    permissions: {
      Dashboard: "read",
      Fleet: "read",
      Drivers: "read",
      Trips: "full",
      Maintenance: "none",
      "Fuel & Expenses": "none",
      Analytics: "read",
      Settings: "none",
    },
  },
  {
    name: "Safety Officer",
    description: "Monitors compliance, maintenance schedules and safety audits",
    color: "emerald",
    permissions: {
      Dashboard: "read",
      Fleet: "read",
      Drivers: "read",
      Trips: "read",
      Maintenance: "full",
      "Fuel & Expenses": "none",
      Analytics: "read",
      Settings: "none",
    },
  },
  {
    name: "Financial Analyst",
    description: "Manages fuel budgets, expense reports and cost analytics",
    color: "purple",
    permissions: {
      Dashboard: "read",
      Fleet: "none",
      Drivers: "none",
      Trips: "read",
      Maintenance: "read",
      "Fuel & Expenses": "full",
      Analytics: "full",
      Settings: "none",
    },
  },
];

// ── Notification preferences ───────────────────────────────────────────────

export type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
  category: "alerts" | "channels";
};

export const notificationSettings: NotificationSetting[] = [
  {
    id: "license-expiry",
    label: "License Expiry Alerts",
    description: "Notify when driver licenses are nearing expiry",
    defaultEnabled: true,
    category: "alerts",
  },
  {
    id: "maintenance-reminders",
    label: "Maintenance Reminders",
    description: "Scheduled maintenance notifications for vehicles",
    defaultEnabled: true,
    category: "alerts",
  },
  {
    id: "trip-notifications",
    label: "Trip Notifications",
    description: "Updates on trip assignments and status changes",
    defaultEnabled: true,
    category: "alerts",
  },
  {
    id: "fuel-alerts",
    label: "Fuel Alerts",
    description: "Low fuel warnings and refuel reminders",
    defaultEnabled: false,
    category: "alerts",
  },
  {
    id: "email-notifications",
    label: "Email Notifications",
    description: "Receive notifications via email",
    defaultEnabled: true,
    category: "channels",
  },
  {
    id: "push-notifications",
    label: "Push Notifications",
    description: "Receive browser push notifications",
    defaultEnabled: false,
    category: "channels",
  },
];

// ── Appearance ─────────────────────────────────────────────────────────────

export type AppearanceOption = {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
};

export const appearanceOptions: AppearanceOption[] = [
  {
    id: "dark-mode",
    label: "Dark Mode",
    description: "Use dark colour scheme across the platform",
    defaultEnabled: true,
  },
  {
    id: "light-mode",
    label: "Light Mode",
    description: "Use light colour scheme across the platform",
    defaultEnabled: false,
  },
  {
    id: "compact-layout",
    label: "Compact Layout",
    description: "Reduce padding and spacing for denser information display",
    defaultEnabled: false,
  },
  {
    id: "sidebar-collapse",
    label: "Sidebar Collapse",
    description: "Collapse the sidebar to icon-only mode by default",
    defaultEnabled: false,
  },
];

// ── Security ───────────────────────────────────────────────────────────────

export type SessionEntry = {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
};

export const lastLogin = "12 Jul 2026, 11:45 AM IST";

export const twoFactorEnabled = false;

export const sessionHistory: SessionEntry[] = [
  {
    id: "sess-1",
    device: "Windows PC",
    browser: "Chrome 130",
    ip: "192.168.1.42",
    location: "Pune, India",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "sess-2",
    device: "MacBook Pro",
    browser: "Safari 19",
    ip: "10.0.0.12",
    location: "Mumbai, India",
    lastActive: "11 Jul 2026, 9:15 PM",
    isCurrent: false,
  },
  {
    id: "sess-3",
    device: "iPhone 16",
    browser: "Mobile Safari",
    ip: "172.20.5.8",
    location: "Pune, India",
    lastActive: "10 Jul 2026, 3:30 PM",
    isCurrent: false,
  },
];

// ── About ──────────────────────────────────────────────────────────────────

export type TeamMember = {
  name: string;
  role: string;
};

export const aboutInfo = {
  version: "1.0.0",
  hackathon: "Odoo Hackathon 2026",
  teamName: "Team TransitOps",
  teamMembers: [
    { name: "Dhanesh", role: "Full-Stack Developer" },
    { name: "Arjun", role: "Frontend Developer" },
    { name: "Priya", role: "UI / UX Designer" },
    { name: "Kiran", role: "Backend Developer" },
  ] as TeamMember[],
  techStack: [
    "Next.js 15",
    "TypeScript",
    "Tailwind CSS",
    "Recharts",
    "React 19",
  ],
};
