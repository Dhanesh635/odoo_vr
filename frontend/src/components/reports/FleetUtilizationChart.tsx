"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui";
import { monthlyUtilizationData } from "@/constants/reports";

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  color: "#f8fafc",
  fontSize: "13px",
};

export default function FleetUtilizationChart() {
  return (
    <Card
      title="Fleet Utilization"
      subtitle="Monthly fleet utilization vs target (%)"
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={monthlyUtilizationData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[50, 100]}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
            width={40}
          />
          <Tooltip
            formatter={(v: number, name: string) => [`${v}%`, name]}
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
          <ReferenceLine y={80} stroke="#334155" strokeDasharray="4 2" />
          <Line
            type="monotone"
            dataKey="utilization"
            name="Utilization"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#fbbf24" }}
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="#334155"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
