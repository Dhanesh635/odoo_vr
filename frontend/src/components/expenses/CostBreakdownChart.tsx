"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui";
import { monthlyExpenseData } from "@/constants/expenses";
import type { BarChartEntry, PieChartEntry } from "@/types/expense";

type CostBreakdownChartProps = {
  pieData: PieChartEntry[];
};

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// ─── Pie chart ─────────────────────────────────────────────────────────────────

function PieBreakdown({ data }: { data: PieChartEntry[] }) {
  if (data.every((d) => d.value === 0)) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }: { name?: string; percent?: number }) =>
            (percent ?? 0) > 0.04
              ? `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
              : ""
          }
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [fmt.format(value), ""]}
          contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            color: "#f8fafc",
            fontSize: "13px",
          }}
          itemStyle={{ color: "#cbd5e1" }}
          cursor={false}
        />
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={(value) => (
            <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Bar chart ─────────────────────────────────────────────────────────────────

const BAR_COLORS = {
  Fuel: "#f59e0b",
  Maintenance: "#f97316",
  Other: "#64748b",
};

function MonthlyBar({ data }: { data: BarChartEntry[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
          }
          width={48}
        />
        <Tooltip
          formatter={(value: number, name: string) => [fmt.format(value), name]}
          contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            color: "#f8fafc",
            fontSize: "13px",
          }}
          itemStyle={{ color: "#cbd5e1" }}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={(value) => (
            <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>
          )}
        />
        <Bar dataKey="Fuel" stackId="a" fill={BAR_COLORS.Fuel} radius={[0, 0, 0, 0]} />
        <Bar dataKey="Maintenance" stackId="a" fill={BAR_COLORS.Maintenance} />
        <Bar dataKey="Other" stackId="a" fill={BAR_COLORS.Other} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Exported component ────────────────────────────────────────────────────────

export default function CostBreakdownChart({ pieData }: CostBreakdownChartProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Cost Distribution" subtitle="Breakdown by expense category">
        <PieBreakdown data={pieData} />
      </Card>

      <Card title="Monthly Expenses" subtitle="Last 6 months — stacked by type">
        <MonthlyBar data={monthlyExpenseData} />
      </Card>
    </div>
  );
}
