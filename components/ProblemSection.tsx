"use client";

import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const problems = [
  {
    title: "Manual Data Entry",
    description:
      "Copying provider names, NPIs, DEA numbers, and addresses from spreadsheets into board websites, field by field, state by state.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "50+ Different Websites",
    description:
      "Every state board has a different site layout, different form structure, and different requirements. There's no standard.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
  {
    title: "Human Error Risk",
    description:
      "One wrong digit in an NPI or license number can delay an application by weeks. Manual entry means manual mistakes.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 bg-background-alt">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-12 text-center">
            Every application. Every state. The same 50 fields.
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {problems.map((problem, index) => (
            <AnimatedSection key={problem.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-card-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-accent mb-4">{problem.icon}</div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {problem.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

