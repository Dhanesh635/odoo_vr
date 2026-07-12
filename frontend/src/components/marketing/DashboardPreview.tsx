"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            A Command Center for Your Operations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-slate-400"
          >
            Experience unparalleled visibility with our intuitive, real-time dashboard designed specifically for modern fleet managers.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-16"
        >
          {/* Main Dashboard Mockup */}
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/80 ring-1 ring-white/10">
            {/* Fake browser header */}
            <div className="flex h-10 items-center gap-2 border-b border-slate-800 bg-slate-950 px-4">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            
            {/* Dashboard content abstraction */}
            <div className="flex h-[400px] sm:h-[600px]">
              {/* Sidebar abstraction */}
              <div className="hidden w-64 border-r border-slate-800 bg-slate-950 p-4 sm:block">
                <div className="mb-8 h-8 w-32 rounded-lg bg-slate-800" />
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-6 w-full rounded-md bg-slate-800/50" />
                  ))}
                </div>
              </div>
              
              {/* Main content abstraction */}
              <div className="flex-1 p-6">
                <div className="mb-8 flex items-center justify-between">
                  <div className="h-8 w-48 rounded-lg bg-slate-800" />
                  <div className="h-10 w-32 rounded-lg bg-amber-500/20" />
                </div>
                
                {/* Metric cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                       <div className="mb-2 h-4 w-16 rounded bg-slate-800" />
                       <div className="h-8 w-24 rounded bg-slate-700" />
                    </div>
                  ))}
                </div>

                {/* Chart & Table abstraction */}
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="col-span-2 h-64 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                    <div className="h-full w-full rounded bg-gradient-to-t from-amber-500/10 to-transparent" />
                  </div>
                  <div className="h-64 rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
                     {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 w-full rounded bg-slate-800/40" />
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements (Parallax effect) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute -left-12 top-1/4 hidden rounded-xl border border-slate-700 bg-slate-800/80 p-4 shadow-2xl backdrop-blur-md lg:block"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">System Secure</p>
                <p className="text-xs text-slate-400">All modules active</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="absolute -right-12 bottom-1/4 hidden rounded-xl border border-slate-700 bg-slate-800/80 p-4 shadow-2xl backdrop-blur-md lg:block"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">High Efficiency</p>
                <p className="text-xs text-slate-400">+12% this week</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
