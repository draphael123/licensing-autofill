"use client";

import AnimatedSection from "./AnimatedSection";
import MockForm from "./MockForm";

export default function LearnModeDemo() {
  return (
    <section id="learn-mode" className="py-24 bg-background-alt border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-8 text-center">
            You map it once. Everyone benefits.
          </h2>
        </AnimatedSection>
        <div className="grid lg:grid-cols-2 gap-12 items-center mt-12">
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  How Learn Mode Works
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  When you click <strong>Start Learning</strong>, the extension
                  enters a special mode where clicking on any form field opens a
                  dropdown of provider data fields. Pick the match, move to the
                  next field.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  The extension generates a CSS selector for each field
                  automatically — you never touch code.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Mappings are saved by URL pattern, so they work for every
                  provider on that same board site.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>Team-Wide Shared Library:</strong> When you save a mapping, it&apos;s automatically synced to your team&apos;s shared library. Everyone on the team instantly gets access to new mappings — no manual file sharing needed.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Your provider data stays private on your machine. Only the field mappings (which fields map to which data types) are shared with the team.
                </p>
              </div>
              <div className="bg-accent/10 border-l-4 border-accent p-4 rounded">
                <p className="text-primary font-medium">
                  💡 Tip: One team member maps a site, and everyone else automatically gets that mapping. New team members start with the full library already available.
                </p>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <MockForm mode="learn" />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

