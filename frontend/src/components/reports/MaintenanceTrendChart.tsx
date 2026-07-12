"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui";
import { maintenanceTrendData } from "@/constants/reports";

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  color: "#f8fafc",
  fontSize: "13px",
};

export default function MaintenanceTrendChart() {
  return (
    <Card
      title="Maintenance Trends"
      subtitle="Monthly jobs count and average repair duration"
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={maintenanceTrendData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          {/* Left axis: jobs */}
          <YAxis
            yAxisId="left"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={24}
            allowDecimals={false}
          />
          {/* Right axis: days */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 5]}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}d`}
            width={32}
          />
          <Tooltip
            formatter={(value: number, name: string) =>
              name === "Jobs" ? [value, "Jobs"] : [`${value} days`, "Avg Repair"]
            }
            contentStyle={tooltipStyle}
            itemStyle={{ color: "#cbd5e1" }}
            cursor={{ stroke: "#334155", strokeWidth: 1 }}
          />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>
            )}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="jobs"
            name="Jobs"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={{ fill: "#f97316", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgRepairDays"
            name="Avg Repair Days"
            stroke="#38bdf8"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ fill: "#38bdf8", r: 3, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
