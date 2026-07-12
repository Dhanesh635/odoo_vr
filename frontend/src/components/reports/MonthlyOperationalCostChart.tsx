"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui";
import { monthlyOperationalCostData } from "@/constants/reports";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  color: "#f8fafc",
  fontSize: "13px",
};

export default function MonthlyOperationalCostChart() {
  return (
    <Card
      title="Monthly Operational Cost"
      subtitle="Total spending trend across all vehicles"
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={monthlyOperationalCostData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => fmt.format(v)}
            width={52}
          />
          <Tooltip
            formatter={(v: number) => [fmt.format(v), "Operational Cost"]}
            contentStyle={tooltipStyle}
            itemStyle={{ color: "#fbbf24" }}
            cursor={{ stroke: "#334155", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#f59e0b"
            strokeWidth={2.5}
            fill="url(#costGradient)"
            dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#fbbf24" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
