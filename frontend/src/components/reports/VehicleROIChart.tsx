"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui";
import { vehicleROIData } from "@/constants/reports";

const fmtInr = new Intl.NumberFormat("en-IN", {
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

const COLORS = ["#f59e0b", "#f97316", "#38bdf8"];

export default function VehicleROIChart() {
  return (
    <Card
      title="Vehicle ROI"
      subtitle="Return on investment by vehicle (%)"
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={vehicleROIData}
          margin={{ top: 24, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="40%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="vehicle" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, 35]}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
            width={36}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "ROI") return [`${value}%`, "ROI"];
              return [fmtInr.format(value), name];
            }}
            contentStyle={tooltipStyle}
            itemStyle={{ color: "#cbd5e1" }}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="roi" name="ROI" radius={[6, 6, 0, 0]}>
            <LabelList
              dataKey="roi"
              position="top"
              formatter={(v: React.ReactNode) => `${v}%`}
              style={{ fill: "#94a3b8", fontSize: "11px" }}
            />
            {vehicleROIData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
