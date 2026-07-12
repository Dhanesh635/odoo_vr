"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

export default function SmartInsights() {
  const insights = [
    {
      id: 1,
      type: "alert",
      title: "Maintenance Recommended",
      desc: "Vehicle TR003 is approaching its 10,000 mile service interval.",
      icon: <AlertTriangle size={18} />,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
    },
    {
      id: 2,
      type: "success",
      title: "Top Safety Score",
      desc: "Driver Alex maintains the highest safety rating this month (98%).",
      icon: <ShieldCheck size={18} />,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/20",
    },
    {
      id: 3,
      type: "info",
      title: "Fuel Efficiency Improved",
      desc: "Fleet average MPG increased by 4.2% over the last 7 days.",
      icon: <TrendingUp size={18} />,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
  ];

  return (
    <section className="mb-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={16} className="text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/80">
          Smart Insights
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`flex items-start gap-3 rounded-2xl border ${insight.border} bg-surface/50 p-4 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-1`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${insight.bg} ${insight.color}`}>
              {insight.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{insight.title}</h3>
              <p className="mt-1 text-xs text-foreground/60 leading-relaxed">{insight.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
