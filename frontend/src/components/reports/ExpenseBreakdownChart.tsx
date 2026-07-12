"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui";
import { expenseBreakdownData } from "@/constants/reports";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  color: "#f8fafc",
  fontSize: "13px",
};

export default function ExpenseBreakdownChart() {
  return (
    <Card
      title="Expense Breakdown"
      subtitle="Cost distribution by category"
    >
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={expenseBreakdownData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }: { name?: string; percent?: number }) =>
              (percent ?? 0) > 0.05
                ? `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                : ""
            }
            labelLine={false}
          >
            {expenseBreakdownData.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [fmt.format(value), ""]}
            contentStyle={tooltipStyle}
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
    </Card>
  );
}
