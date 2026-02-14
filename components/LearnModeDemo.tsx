"use client";

import AnimatedSection from "./AnimatedSection";
import MockForm from "./MockForm";

export default function LearnModeDemo() {
  return (
    <section id="learn-mode" className="py-20 bg-background-alt">
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
                <p className="text-gray-600 leading-relaxed">
                  You can export and share mappings with teammates so everyone
                  has the same library.
                </p>
              </div>
              <div className="bg-accent/10 border-l-4 border-accent p-4 rounded">
                <p className="text-primary font-medium">
                  💡 Tip: One team member maps a site, then shares the mapping
                  file. Everyone else just imports it and starts auto-filling.
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

