"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    body: "TransitOps has completely revolutionized our dispatch process. What used to take hours of manual planning now happens instantly.",
    author: {
      name: "Sarah Jenkins",
      role: "Operations Manager",
      imageUrl: "https://i.pravatar.cc/150?u=sarah",
    },
  },
  {
    body: "The predictive maintenance feature alone paid for the platform in the first month. We've seen a 40% reduction in unexpected breakdowns.",
    author: {
      name: "Michael Chen",
      role: "Fleet Supervisor",
      imageUrl: "https://i.pravatar.cc/150?u=michael",
    },
  },
  {
    body: "Finally, a platform that gives me real-time visibility into our entire logistics network. The analytics are unparalleled.",
    author: {
      name: "David Rodriguez",
      role: "Logistics Head",
      imageUrl: "https://i.pravatar.cc/150?u=david",
    },
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-amber-500"
          >
            Testimonials
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Trusted by Industry Leaders
          </motion.p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-sm transition-all hover:bg-slate-800/80 hover:shadow-xl hover:shadow-amber-500/10"
            >
              <blockquote className="text-slate-300">
                <p>"{testimonial.body}"</p>
              </blockquote>
              <div className="mt-8 flex items-center gap-x-4">
                <img
                  className="h-12 w-12 rounded-full bg-slate-800"
                  src={testimonial.author.imageUrl}
                  alt=""
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.author.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.author.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
