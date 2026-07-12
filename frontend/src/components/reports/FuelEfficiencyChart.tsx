"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui";
import { fuelEfficiencyData } from "@/constants/reports";

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  color: "#f8fafc",
  fontSize: "13px",
};

const BAR_COLORS = ["#f59e0b", "#f97316", "#38bdf8"];

export default function FuelEfficiencyChart() {
  return (
    <Card
      title="Fuel Efficiency"
      subtitle="Vehicle-wise km/L vs fleet benchmark"
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={fuelEfficiencyData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="35%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="vehicle" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, 18]}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}`}
            width={32}
          />
          <Tooltip
            formatter={(v: number, name: string) => [`${v} km/L`, name]}
            contentStyle={tooltipStyle}
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
          <ReferenceLine y={11} stroke="#334155" strokeDasharray="4 2" label={{ value: "Fleet avg", fill: "#475569", fontSize: 11 }} />
          <Bar dataKey="efficiency" name="Efficiency (km/L)" radius={[4, 4, 0, 0]}>
            {fuelEfficiencyData.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
