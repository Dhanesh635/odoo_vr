"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import { Button, Card, Input } from "@/components/ui";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type FieldErrors = Partial<Record<keyof Pick<LoginFormValues, "email" | "password">, string>>;

const roles = [
  { label: "Fleet Manager", icon: <FleetIcon /> },
  { label: "Dispatcher", icon: <RouteIcon /> },
  { label: "Safety Officer", icon: <ShieldIcon /> },
  { label: "Financial Analyst", icon: <ChartIcon /> },
];

function validateForm(values: LoginFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export default function LoginPage() {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [touched, setTouched] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validateForm(values), [values]);
  const isValid = Object.keys(errors).length === 0;
  const shouldShowError = (field: keyof FieldErrors) =>
    Boolean(touched[field] || submitted);

  function updateValue<K extends keyof LoginFormValues>(
    key: K,
    value: LoginFormValues[K],
  ) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl animate-[transitops-fade-in_500ms_ease-out] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <BrandingPanel />

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <Card
            title="Welcome back"
            subtitle="Sign in to continue to TransitOps."
            className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl shadow-black/30"
            bodyClassName="space-y-6"
          >
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={values.email}
                onChange={(event) => updateValue("email", event.target.value)}
                onBlur={() => setTouched((current) => ({ ...current, email: "true" }))}
                error={shouldShowError("email") ? errors.email : undefined}
                autoComplete="email"
                required
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={values.password}
                onChange={(event) => updateValue("password", event.target.value)}
                onBlur={() =>
                  setTouched((current) => ({ ...current, password: "true" }))
                }
                error={shouldShowError("password") ? errors.password : undefined}
                autoComplete="current-password"
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((isVisible) => !isVisible)}
                    className="rounded-md px-2 py-1 text-xs font-semibold text-amber-300 transition-colors hover:bg-slate-800 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                }
              />

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={values.rememberMe}
                    onChange={(event) =>
                      updateValue("rememberMe", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                  Remember me
                </label>

                <a
                  href="#"
                  className="font-medium text-amber-300 transition-colors hover:text-amber-200 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!isValid}
                className="w-full transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Login
              </Button>
            </form>
          </Card>
        </section>
      </div>

      <footer className="pointer-events-none fixed bottom-0 left-0 right-0 px-4 py-4 text-center text-xs text-slate-500 sm:text-sm">
        Version 1.0 <span className="mx-2 text-slate-700">|</span> Made for
        Odoo Hackathon
      </footer>
    </main>
  );
}

function BrandingPanel() {
  return (
    <section className="relative flex items-center px-4 pb-4 pt-10 sm:px-6 lg:min-h-screen lg:px-10 lg:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.16),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,1))]" />
      <div className="relative w-full rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8 lg:p-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-base font-black text-slate-950 shadow-lg shadow-amber-500/20">
            TO
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-50 sm:text-4xl">
              TransitOps
            </h1>
            <p className="mt-1 text-sm font-medium text-amber-300 sm:text-base">
              Smart Transport Operations Platform
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Manage your transport operations efficiently with a centralized
          dashboard.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {roles.map((role) => (
            <RoleItem key={role.label} icon={role.icon} label={role.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoleItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-slate-200 transition-colors hover:border-amber-500/40 hover:bg-slate-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function FleetIcon() {
  return <IconPath path="M4 16V8.5A2.5 2.5 0 0 1 6.5 6h7l3.5 4v6M6 17.5h.01M16 17.5h.01M4 13h16" />;
}

function RouteIcon() {
  return <IconPath path="M6 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.5 13.5l7-7" />;
}

function ShieldIcon() {
  return <IconPath path="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Zm-3 8 2 2 4-4" />;
}

function ChartIcon() {
  return <IconPath path="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-7" />;
}

function IconPath({ path }: { path: string }) {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
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
