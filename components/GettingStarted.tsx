"use client";

import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Install the Extension",
    description:
      "Open Chrome → Go to chrome://extensions → Enable Developer Mode → Click 'Load Unpacked' → Select the extension folder.",
    link: "/extension.zip",
    linkText: "Download Extension (ZIP)",
  },
  {
    number: "2",
    title: "Add Your First Provider",
    description:
      "Click the ⚡ icon in your toolbar → Providers tab → + Add Provider (or Import CSV)",
  },
  {
    number: "3",
    title: "Map Your First Site",
    description:
      "Go to a state board application page → Click ⚡ → Learn Mode → Start Learning → Click fields and tag them → Save Mappings",
  },
  {
    number: "4",
    title: "Fill Your First Form",
    description:
      "Same site, Auto Fill tab → Select provider → ⚡ Auto Fill This Page",
  },
];

export default function GettingStarted() {
  return (
    <section id="getting-started" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-12 text-center">
            Up and running in 5 minutes.
          </h2>
        </AnimatedSection>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <AnimatedSection key={step.number} delay={index * 0.1}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {step.number}
                </div>
                <div className="flex-1 bg-background-alt rounded-card-lg p-6">
                  <h3 className="text-2xl font-bold text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    {step.description}
                  </p>
                  {step.link && (
                    <a
                      href={step.link}
                      download
                      className="text-accent hover:text-blue-600 font-medium inline-flex items-center gap-2"
                    >
                      {step.linkText}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

