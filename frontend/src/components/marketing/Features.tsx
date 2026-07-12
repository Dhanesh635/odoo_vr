"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Users,
  Navigation,
  Wrench,
  LineChart,
  Fuel,
} from "lucide-react";

const features = [
  {
    name: "Fleet Management",
    description:
      "Track your entire fleet in real-time. Monitor vehicle status, location, and operational readiness with ease.",
    icon: Truck,
  },
  {
    name: "Driver Management",
    description:
      "Manage driver profiles, assignments, and compliance. Ensure your team is always ready for the next dispatch.",
    icon: Users,
  },
  {
    name: "Trip Dispatch",
    description:
      "Automate and optimize trip assignments. Reduce idle time and maximize the efficiency of your transport network.",
    icon: Navigation,
  },
  {
    name: "Predictive Maintenance",
    description:
      "Stay ahead of breakdowns with intelligent maintenance schedules based on real-time vehicle telemetry.",
    icon: Wrench,
  },
  {
    name: "Operational Analytics",
    description:
      "Turn data into decisions. Comprehensive dashboards provide insights into costs, utilization, and performance.",
    icon: LineChart,
  },
  {
    name: "Fuel Tracking",
    description:
      "Monitor fuel consumption and expenses. Identify inefficiencies and reduce one of your largest operational costs.",
    icon: Fuel,
  },
];

export default function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-amber-500"
          >
            Deploy faster
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Everything you need to run your fleet
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-400"
          >
            TransitOps provides a comprehensive suite of tools designed to streamline your operations, reduce costs, and keep your vehicles on the road.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-sm transition-all hover:bg-slate-800/80 hover:shadow-xl hover:shadow-amber-500/10"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 shadow-inner ring-1 ring-white/10 group-hover:from-amber-500 group-hover:to-orange-500">
                    <feature.icon
                      className="h-5 w-5 text-amber-400 group-hover:text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
