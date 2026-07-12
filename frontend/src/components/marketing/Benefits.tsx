"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Reduce fuel costs with optimized routing algorithms.",
  "Decrease vehicle downtime through predictive maintenance.",
  "Ensure driver compliance and safety standards.",
  "Scale your operations without linear cost increases.",
];

export default function Benefits() {
  return (
    <section className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-y-16 gap-x-8 lg:grid-cols-2">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Transform your logistics <br/> from a cost center to a <br/>
              <span className="text-amber-500">competitive advantage.</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              TransitOps doesn't just digitize your paperwork—it fundamentally enhances how your business operates by injecting intelligence into every dispatch, route, and maintenance schedule.
            </p>
            
            <dl className="mt-10 max-w-xl space-y-6 text-base leading-7 text-slate-400">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative pl-9"
                >
                  <dt className="inline font-semibold text-white">
                    <CheckCircle className="absolute left-1 top-1 h-5 w-5 text-amber-500" aria-hidden="true" />
                  </dt>
                  <dd className="inline">{benefit}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center lg:justify-end"
          >
            {/* Illustration Placeholder */}
            <div className="relative h-[400px] w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-sm lg:h-[500px]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/10 via-transparent to-orange-500/10" />
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 text-slate-500">
                <span className="text-sm font-medium">Illustration Placeholder</span>
              </div>
              
              {/* Floating accents */}
              <div className="absolute -left-6 top-1/4 h-24 w-24 rounded-full bg-amber-500/20 blur-2xl" />
              <div className="absolute -right-6 bottom-1/4 h-24 w-24 rounded-full bg-orange-600/20 blur-2xl" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
