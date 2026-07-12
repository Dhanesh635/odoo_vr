"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do I need to install hardware in my vehicles?",
    answer: "No, TransitOps can operate purely through our driver mobile app using the smartphone's built-in GPS. However, for deeper telemetry, we do integrate with standard OBD-II hardware trackers.",
  },
  {
    question: "How long does it take to onboard my fleet?",
    answer: "Most fleets are fully onboarded and operational within 48 hours. Our intuitive interface allows you to bulk-import vehicles and drivers instantly.",
  },
  {
    question: "Is there a limit to the number of vehicles I can manage?",
    answer: "TransitOps is built to scale. Whether you have 5 vehicles or 5,000, our enterprise-grade architecture handles it smoothly without compromising speed.",
  },
  {
    question: "Can I integrate TransitOps with my existing ERP?",
    answer: "Yes, we offer robust REST APIs and pre-built connectors for major ERP systems, allowing seamless synchronization of financial and operational data.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-slate-800">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          
          <dl className="mt-10 space-y-4 divide-y divide-slate-800">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="pt-6">
                  <dt>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-start justify-between text-left text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg p-2"
                    >
                      <span className="text-base font-semibold leading-7">{faq.question}</span>
                      <span className="ml-6 flex h-7 items-center">
                        <motion.div
                           animate={{ rotate: isOpen ? 180 : 0 }}
                           transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </motion.div>
                      </span>
                    </button>
                  </dt>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.dd
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 pr-12 overflow-hidden"
                      >
                        <p className="text-base leading-7 text-slate-400 p-2">{faq.answer}</p>
                      </motion.dd>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
