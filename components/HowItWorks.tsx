"use client";

import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Load Your Providers",
    description:
      "Import provider data from a CSV or add them manually. The extension stores everything locally — names, NPIs, DEA numbers, addresses, education, credentials, all of it.",
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Teach It Once (Learn Mode)",
    description:
      "Navigate to any state board website. Click 'Start Learning.' Then click on each form field and tell the extension what goes there — first name, NPI, license number, etc. Save it, and the mapping is automatically shared with your entire team. Everyone benefits instantly.",
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
        />
      </svg>
    ),
    highlight: true,
  },
  {
    number: "3",
    title: "Auto Fill in Seconds",
    description:
      "Next time you visit that site, click the ⚡ extension icon, select a provider from the dropdown, click Auto Fill, and watch every field populate instantly. Review, submit, done.",
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-16 text-center">
            Three steps. That&apos;s it.
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <AnimatedSection key={step.number} delay={index * 0.15}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative ${
                  step.highlight
                    ? "bg-accent/10 rounded-card-lg p-8 border-2 border-accent"
                    : "p-8"
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                      step.highlight
                        ? "bg-accent text-white"
                        : "bg-primary text-white"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className={`${step.highlight ? "text-accent" : "text-primary"}`}>
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                {step.highlight && (
                  <div className="mt-4 text-sm font-medium text-accent">
                    ✨ Key differentiator — map once, entire team benefits instantly
                  </div>
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

