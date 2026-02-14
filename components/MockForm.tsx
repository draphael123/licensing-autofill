"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface MockFormProps {
  mode?: "autofill" | "learn";
}

interface FormField {
  id: string;
  label: string;
  value: string;
  filled: boolean;
}

const mockProviderData = {
  firstName: "Sarah",
  lastName: "Chen",
  npi: "1234567890",
  license: "MD-2024-12345",
  state: "California",
  email: "sarah.chen@example.com",
};

export default function MockForm({ mode = "autofill" }: MockFormProps) {
  const [fields, setFields] = useState<FormField[]>([
    { id: "firstName", label: "First Name", value: "", filled: false },
    { id: "lastName", label: "Last Name", value: "", filled: false },
    { id: "npi", label: "NPI Number", value: "", filled: false },
    { id: "license", label: "License Number", value: "", filled: false },
    { id: "state", label: "State", value: "", filled: false },
    { id: "email", label: "Email", value: "", filled: false },
  ]);

  const [learnModeActive, setLearnModeActive] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (mode === "autofill") {
      const interval = setInterval(() => {
        setFields((prev) => {
          const allFilled = prev.every((f) => f.filled);
          if (allFilled) {
            // Reset after all fields are filled
            setTimeout(() => {
              setFields((prev) =>
                prev.map((f) => ({ ...f, value: "", filled: false }))
              );
            }, 2000);
            return prev;
          }

          const nextIndex = prev.findIndex((f) => !f.filled);
          if (nextIndex === -1) return prev;

          const field = prev[nextIndex];
          const value =
            field.id === "firstName"
              ? mockProviderData.firstName
              : field.id === "lastName"
              ? mockProviderData.lastName
              : field.id === "npi"
              ? mockProviderData.npi
              : field.id === "license"
              ? mockProviderData.license
              : field.id === "state"
              ? mockProviderData.state
              : mockProviderData.email;

          return prev.map((f, i) =>
            i === nextIndex
              ? { ...f, value, filled: true }
              : f
          );
        });
      }, 800);

      return () => clearInterval(interval);
    } else if (mode === "learn") {
      const interval = setInterval(() => {
        // Cycle through learn mode animation
        setLearnModeActive(true);
        setSelectedField("npi");
        setShowDropdown(true);

        setTimeout(() => {
          setShowDropdown(false);
          setFields((prev) =>
            prev.map((f) =>
              f.id === "npi" ? { ...f, value: mockProviderData.npi, filled: true } : f
            )
          );
        }, 1500);

        setTimeout(() => {
          setLearnModeActive(false);
          setSelectedField(null);
          setFields((prev) =>
            prev.map((f) => ({ ...f, value: "", filled: false }))
          );
        }, 4000);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [mode]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200/60">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <h3 className="text-sm font-medium text-gray-500 ml-4">
            State Board Application Form
          </h3>
        </div>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={field.value}
                  readOnly
                  className={`w-full px-3 py-2 text-sm border rounded-md transition-all duration-200 ${
                    field.filled
                      ? "border-success/50 bg-success/5"
                      : selectedField === field.id && learnModeActive
                      ? "border-accent/50 bg-accent/5"
                      : "border-gray-200 bg-gray-50/50"
                  }`}
                />
                {field.filled && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <svg
                      className="w-5 h-5 text-success"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
                {selectedField === field.id && learnModeActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-2 left-0 text-xs text-accent font-medium"
                  >
                    Click to map
                  </motion.div>
                )}
              </div>
              {showDropdown && selectedField === field.id && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 mt-2 w-full bg-white border-2 border-accent rounded-lg shadow-lg"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm font-medium text-accent">
                      ✓ NPI Number
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                      First Name
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                      Last Name
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
        {mode === "learn" && learnModeActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
          >
            Learn Mode Active
          </motion.div>
        )}
      </div>
    </div>
  );
}

