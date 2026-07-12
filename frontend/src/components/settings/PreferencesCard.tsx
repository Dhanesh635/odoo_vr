"use client";

import { Card } from "@/components/ui";
import { aboutInfo } from "@/constants/settings";

export default function PreferencesCard() {
  return (
    <Card
      title="About TransitOps"
      subtitle="Platform information and hackathon details"
    >
      <div className="space-y-6">
        {/* Version & hackathon */}
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoTile
            icon={tagPath}
            label="Version"
            value={`v${aboutInfo.version}`}
          />
          <InfoTile
            icon={trophyPath}
            label="Hackathon"
            value={aboutInfo.hackathon}
          />
        </div>

        {/* Team members */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {aboutInfo.teamName}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {aboutInfo.teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-3 transition-colors hover:border-slate-700"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 text-sm font-semibold text-cyan-300 ring-1 ring-cyan-500/20">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {member.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {aboutInfo.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-full border border-slate-700/50 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-800/40 px-4 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700/60 text-slate-400">
        <svg
          className="h-4 w-4"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d={icon}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-200">{value}</p>
      </div>
    </div>
  );
}

const tagPath = "M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z";
const trophyPath = "M6 9H4.5a2.5 2.5 0 010-5H6m12 5h1.5a2.5 2.5 0 000-5H18M6 9v5a6 6 0 0012 0V9M6 9h12M9 21h6m-3-7v7";
