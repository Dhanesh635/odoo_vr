"use client";

import { useState } from "react";
import { Card, PageTransition, PageSection } from "@/components/ui";
import AnalyticsFilters from "@/components/reports/AnalyticsFilters";
import AnalyticsSummaryCards from "@/components/reports/AnalyticsSummaryCards";
import DriverPerformanceTable from "@/components/reports/DriverPerformanceTable";
import ExportButtons from "@/components/reports/ExportButtons";
import ExpenseBreakdownChart from "@/components/reports/ExpenseBreakdownChart";
import FleetUtilizationChart from "@/components/reports/FleetUtilizationChart";
import FuelEfficiencyChart from "@/components/reports/FuelEfficiencyChart";
import InsightCard from "@/components/reports/InsightCard";
import MaintenanceTrendChart from "@/components/reports/MaintenanceTrendChart";
import MonthlyOperationalCostChart from "@/components/reports/MonthlyOperationalCostChart";
import QuickStatsGrid from "@/components/reports/QuickStatsGrid";
import TripStatisticsChart from "@/components/reports/TripStatisticsChart";
import {
  MostExpensiveVehicles,
  TopPerformingVehicles,
} from "@/components/reports/VehicleRankingTables";
import VehicleROIChart from "@/components/reports/VehicleROIChart";
import {
  analyticsSummary,
  initialReportFilters,
  insightCards,
} from "@/constants/reports";
import type { ReportFiltersState } from "@/types/report";

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFiltersState>(
    initialReportFilters,
  );

  function updateFilter<K extends keyof ReportFiltersState>(
    key: K,
    value: ReportFiltersState[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleExportCsv() {
    const rows = [
      ["Metric", "Value"],
      ["Fleet Utilization", `${analyticsSummary.fleetUtilization}%`],
      ["Total Operational Cost", `₹${analyticsSummary.totalOperationalCost}`],
      ["Avg Fuel Efficiency", `${analyticsSummary.avgFuelEfficiency} km/L`],
      ["Completed Trips", analyticsSummary.completedTrips],
      ["Avg Trip Distance", `${analyticsSummary.avgTripDistance} km`],
      ["Vehicle ROI", `${analyticsSummary.vehicleROI}%`],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transitops-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageTransition className="space-y-8">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <PageSection>
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">
              Reports &amp; Analytics
            </h1>
            <p className="mt-2 text-base text-slate-400">
              Monitor fleet performance and operational insights.
            </p>
          </div>
          <ExportButtons onExportCsv={handleExportCsv} />
        </header>
      </PageSection>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <PageSection>
        <Card bodyClassName="p-4">
          <AnalyticsFilters filters={filters} onChange={updateFilter} />
        </Card>
      </PageSection>

      {/* ── Summary KPIs ────────────────────────────────────────────────── */}
      <PageSection>
        <AnalyticsSummaryCards summary={analyticsSummary} />
      </PageSection>

      {/* ── Charts Row 1: Utilization + Fuel Efficiency ─────────────────── */}
      <PageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <FleetUtilizationChart />
          <FuelEfficiencyChart />
        </div>
      </PageSection>

      {/* ── Charts Row 2: Expense Breakdown + Monthly Cost ──────────────── */}
      <PageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <ExpenseBreakdownChart />
          <MonthlyOperationalCostChart />
        </div>
      </PageSection>

      {/* ── Charts Row 3: Vehicle ROI + Trip Statistics ──────────────────── */}
      <PageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <VehicleROIChart />
          <TripStatisticsChart />
        </div>
      </PageSection>

      {/* ── Driver Performance ───────────────────────────────────────────── */}
      <PageSection>
        <DriverPerformanceTable />
      </PageSection>

      {/* ── Maintenance Trends ───────────────────────────────────────────── */}
      <PageSection>
        <MaintenanceTrendChart />
      </PageSection>

      {/* ── AI Operational Insights ──────────────────────────────────────── */}
      <PageSection>
        <section>
          <SectionHeader
            title="AI Operational Insights"
            subtitle="Automated analysis of your fleet's recent performance patterns"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {insightCards.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      </PageSection>

      {/* ── Vehicle Rankings ─────────────────────────────────────────────── */}
      <PageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <TopPerformingVehicles />
          <MostExpensiveVehicles />
        </div>
      </PageSection>

      {/* ── Quick Statistics ─────────────────────────────────────────────── */}
      <PageSection>
        <QuickStatsGrid />
      </PageSection>
    </PageTransition>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({
  subtitle,
  title,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      ) : null}
    </div>
  );
}
