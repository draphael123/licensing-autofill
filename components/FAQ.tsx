"use client";

import AnimatedSection from "./AnimatedSection";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Does this work on every state board site?",
    answer:
      "It works on any website with standard HTML forms. Some boards use embedded third-party portals that may need extra mapping, but we haven&apos;t found one it can&apos;t handle yet.",
  },
  {
    question: "What if a state board redesigns their website?",
    answer:
      "The mappings may break if field IDs change. Just re-map the site in Learn Mode — it takes 2-3 minutes.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. All provider data (names, NPIs, addresses, etc.) is stored locally in your Chrome browser and never leaves your machine. Only field mappings (which form fields correspond to which data types) are synced to the team&apos;s shared library. Your sensitive provider information stays private.",
  },
  {
    question: "How does the team-wide shared library work?",
    answer:
      "When you map a site in Learn Mode and save it, that mapping automatically syncs to your team&apos;s shared library. Everyone on the team instantly gets access to it — no manual file sharing needed. New team members start with the full library already available. Only mappings are shared, never your provider data.",
  },
  {
    question: "How do I select a provider when filling forms?",
    answer:
      "Click the ⚡ extension icon in your Chrome toolbar to open the extension popup. Go to the &quot;Auto Fill&quot; tab, and you&apos;ll see a dropdown list of all your providers. Select the provider you want, then click &quot;Auto Fill This Page&quot; to populate the form with that provider&apos;s data.",
  },
  {
    question: "What if a field doesn&apos;t fill correctly?",
    answer:
      "The extension shows a fill report after every auto-fill. Fields that couldn't be matched are flagged so you can fill them manually.",
  },
  {
    question: "Does it handle dropdowns and checkboxes?",
    answer:
      "Yes — it matches dropdown options by value or text, and handles checkboxes and radio buttons.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-background-alt">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-12 text-center">
            Frequently Asked Questions
          </h2>
        </AnimatedSection>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-gray-200/60 rounded-lg overflow-hidden bg-white hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-bold text-primary pr-8">
                    {faq.question}
                  </h3>
                  <motion.svg
                    animate={{
                      rotate: openIndex === index ? 180 : 0,
                    }}
                    className="w-6 h-6 text-accent flex-shrink-0"
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
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
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

