"use client";

import AnimatedSection from "./AnimatedSection";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FieldCategory {
  title: string;
  fields: string[];
}

const categories: FieldCategory[] = [
  {
    title: "Personal Info",
    fields: ["Name", "DOB", "SSN", "Email", "Phone"],
  },
  {
    title: "Addresses",
    fields: [
      "Home Address (full)",
      "Mailing Address (full)",
      "Practice Address (full)",
    ],
  },
  {
    title: "Credentials",
    fields: [
      "NPI",
      "DEA",
      "License #s",
      "Board Certifications",
      "Specialty",
    ],
  },
  {
    title: "Education",
    fields: [
      "School",
      "Degree",
      "Graduation",
      "Residency",
      "Fellowship",
    ],
  },
  {
    title: "Employment",
    fields: [
      "Employer",
      "Title",
      "Supervisor",
      "Start Date",
    ],
  },
  {
    title: "Fountain-Specific",
    fields: [
      "Provider ID",
      "Start Date",
      "Collaborating Physician",
    ],
  },
  {
    title: "Smart Defaults",
    fields: [
      '"Yes"',
      '"No"',
      '"N/A"',
      '"United States"',
      "Today's Date",
    ],
  },
];

export default function FieldSchema() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <section id="field-schema" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4 text-center">
            80+ fields, organized and ready.
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Plus computed fields like Full Name, DOB split into Month/Day/Year,
            SSN Last 4, and Graduation Year — the extension handles the
            formatting automatically.
          </p>
        </AnimatedSection>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <AnimatedSection key={category.title} delay={index * 0.05}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border-2 border-gray-200 rounded-card-lg overflow-hidden hover:border-accent transition-colors"
              >
                <button
                  onClick={() =>
                    setOpenCategory(
                      openCategory === category.title ? null : category.title
                    )
                  }
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-xl font-bold text-primary">
                    {category.title}
                  </h3>
                  <motion.svg
                    animate={{
                      rotate: openCategory === category.title ? 180 : 0,
                    }}
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openCategory === category.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-white">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {category.fields.map((field) => (
                            <div
                              key={field}
                              className="flex items-center gap-2 text-gray-700"
                            >
                              <svg
                                className="w-4 h-4 text-success"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-sm">{field}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

