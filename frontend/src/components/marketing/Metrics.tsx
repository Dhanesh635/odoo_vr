"use client";

import { motion } from "framer-motion";

const metrics = [
  { id: 1, value: "100+", label: "Vehicles Managed" },
  { id: 2, value: "98%", label: "Dispatch Accuracy" },
  { id: 3, value: "40%", label: "Reduced Downtime" },
  { id: 4, value: "24/7", label: "Fleet Visibility" },
];

export default function Metrics() {
  return (
    <section className="relative z-10 border-y border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {metric.value}
              </div>
              <div className="mt-2 text-sm font-medium text-slate-400 sm:text-base">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
