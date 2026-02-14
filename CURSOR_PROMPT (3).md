# Cursor Prompt: License AutoFill — Internal Landing Page

## Overview

Build a single-page landing site that explains the License AutoFill Chrome extension to Fountain's licensing team. This is an internal tool page — not customer-facing. The audience is the licensing team members who will be using the extension daily. The tone should be clear, practical, and encouraging — not salesy. Think internal product launch, not marketing page.

## Tech Stack

- **Framework**: Next.js 14+ (App Router) or plain React — single page is fine
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion for scroll-triggered animations and section transitions
- **Deployment**: Vercel

## Page Structure

### Hero Section
- **Headline**: "Stop Copy-Pasting. Start Auto-Filling."
- **Subheadline**: "License AutoFill is a Chrome extension that fills out state licensing board applications in seconds — using the provider data you already have."
- **CTA Button**: "Get Started →" (scrolls to installation section)
- **Secondary CTA**: "See How It Works ↓" (scrolls to demo section)
- **Visual**: Animated mockup or illustration showing a form being auto-filled with fields lighting up green one by one. Can be a CSS/SVG animation — doesn't need to be a video.

### The Problem Section
- **Headline**: "Every application. Every state. The same 50 fields."
- Three cards showing the current pain points:
  1. **Manual Data Entry** — "Copying provider names, NPIs, DEA numbers, and addresses from spreadsheets into board websites, field by field, state by state."
  2. **50+ Different Websites** — "Every state board has a different site layout, different form structure, and different requirements. There's no standard."
  3. **Human Error Risk** — "One wrong digit in an NPI or license number can delay an application by weeks. Manual entry means manual mistakes."
- Keep this section brief and empathetic, not dramatic.

### How It Works Section
- **Headline**: "Three steps. That's it."
- Horizontal step-by-step flow with icons/illustrations:

  **Step 1: Load Your Providers**
  - "Import provider data from a CSV or add them manually. The extension stores everything locally — names, NPIs, DEA numbers, addresses, education, credentials, all of it."
  - Icon: database/people icon

  **Step 2: Teach It Once (Learn Mode)**
  - "Navigate to any state board website. Click 'Start Learning.' Then click on each form field and tell the extension what goes there — first name, NPI, license number, etc. Save it, and the extension remembers that site's layout forever."
  - Icon: target/crosshair icon
  - This is the key differentiator — emphasize that you map a site ONCE, then anyone on the team can auto-fill it going forward.

  **Step 3: Auto Fill in Seconds**
  - "Next time you visit that site, select a provider, click Auto Fill, and watch every field populate instantly. Review, submit, done."
  - Icon: lightning bolt icon

- Each step should have a visual — either a screenshot mockup, an animated SVG, or a small demo GIF placeholder.

### Learn Mode Deep Dive Section
- **Headline**: "You map it once. Everyone benefits."
- Explain Learn Mode in more detail since this is the most novel feature:
  - "When you click Start Learning, the extension enters a special mode where clicking on any form field opens a dropdown of provider data fields. Pick the match, move to the next field."
  - "The extension generates a CSS selector for each field automatically — you never touch code."
  - "Mappings are saved by URL pattern, so they work for every provider on that same board site."
  - "You can export and share mappings with teammates so everyone has the same library."
- Visual: Animated walkthrough showing the learn mode overlay on a mock form. Show: (1) clicking a field, (2) the dropdown appearing, (3) selecting "NPI Number", (4) the field outline turning green with a checkmark.

### What Data It Knows Section
- **Headline**: "80+ fields, organized and ready."
- Collapsible accordion or tabbed grid showing the field categories:
  - **Personal Info** — Name, DOB, SSN, Email, Phone
  - **Addresses** — Home, Mailing, Practice (each with full address fields)
  - **Credentials** — NPI, DEA, License #s, Board Certifications, Specialty
  - **Education** — School, Degree, Graduation, Residency, Fellowship
  - **Employment** — Employer, Title, Supervisor, Start Date
  - **Fountain-Specific** — Provider ID, Start Date, Collaborating Physician
  - **Smart Defaults** — "Yes", "No", "N/A", "United States", Today's Date
- Note: "Plus computed fields like Full Name, DOB split into Month/Day/Year, SSN Last 4, and Graduation Year — the extension handles the formatting automatically."

### Feature Highlights Section
- **Headline**: "Built for how you actually work."
- Grid of 4-6 feature cards:
  1. **Preview Before Filling** — "See exactly which fields will be filled with a pulsing blue highlight before you commit."
  2. **Works on Any Website** — "State boards, NPDB, DEA registration, credentialing portals — if it has a form, you can map it."
  3. **Custom Static Values** — "Map a field to a fixed value like 'Fountain TRT' or 'Telemedicine' so it auto-fills every time."
  4. **CSV Import** — "Already have providers in a spreadsheet? Import them in one click."
  5. **Export & Backup** — "Download all your data as JSON. Share mappings with the team."
  6. **Privacy-First** — "All data stays in your browser. Nothing is sent to any server."

### Getting Started Section
- **Headline**: "Up and running in 5 minutes."
- Numbered steps with clear instructions:
  1. **Install the Extension** — "Open Chrome → Go to chrome://extensions → Enable Developer Mode → Click 'Load Unpacked' → Select the extension folder." (Include a link to download the zip)
  2. **Add Your First Provider** — "Click the ⚡ icon in your toolbar → Providers tab → + Add Provider (or Import CSV)"
  3. **Map Your First Site** — "Go to a state board application page → Click ⚡ → Learn Mode → Start Learning → Click fields and tag them → Save Mappings"
  4. **Fill Your First Form** — "Same site, Auto Fill tab → Select provider → ⚡ Auto Fill This Page"
- Each step should have a small screenshot or mockup placeholder.

### FAQ Section
- Collapsible accordion:
  - **"Does this work on every state board site?"** — "It works on any website with standard HTML forms. Some boards use embedded third-party portals that may need extra mapping, but we haven't found one it can't handle yet."
  - **"What if a state board redesigns their website?"** — "The mappings may break if field IDs change. Just re-map the site in Learn Mode — it takes 2-3 minutes."
  - **"Is my data safe?"** — "All provider data is stored locally in your Chrome browser. Nothing leaves your machine. You can export/backup at any time."
  - **"Can I share mappings with teammates?"** — "Yes — export your data from Settings and send the JSON file. They can import it into their extension."
  - **"What if a field doesn't fill correctly?"** — "The extension shows a fill report after every auto-fill. Fields that couldn't be matched are flagged so you can fill them manually."
  - **"Does it handle dropdowns and checkboxes?"** — "Yes — it matches dropdown options by value or text, and handles checkboxes and radio buttons."

### Footer
- "Built by Daniel for the Fountain Licensing Team"
- Links: Download Extension | View README | Report an Issue (link to Slack channel or email)
- Version number

## Design Direction

- **Color Palette**:
  - Primary: #1a1a2e (dark navy) — hero background, section accents
  - Accent: #0a84ff (blue) — CTAs, links, active states, highlights
  - Success: #30d158 (green) — "filled" states, checkmarks, success indicators
  - Warning: #ff9f0a (amber) — used sparingly for attention
  - Background: White and #f5f5f7 alternating sections
  - Text: #1a1a2e on light, white on dark

- **Visual Style**:
  - Clean, minimal, lots of whitespace
  - Rounded corners (12-16px) on cards and sections
  - Subtle shadows for depth
  - Smooth scroll-triggered fade-in animations (Framer Motion)
  - Dark hero section transitioning to light content sections
  - Use geometric shapes or subtle grid patterns as decorative backgrounds — not stock photos

- **Typography**:
  - Headlines: Bold, large (48-64px hero, 32-40px sections), tight letter-spacing
  - Body: 16-18px, comfortable line-height (1.6)
  - Use Inter or the system font stack

- **Animations** (Framer Motion):
  - Hero: Staggered fade-in for headline → subheadline → CTAs
  - Steps: Slide in from left as you scroll
  - Feature cards: Fade up with slight stagger
  - Learn Mode demo: Animated sequence showing field click → dropdown → selection → green highlight
  - Auto-fill visual: Fields filling in one-by-one with a cascade effect
  - Keep animations subtle and fast (200-400ms) — this is a productivity tool, not a showpiece

- **Responsive**: Desktop-first (1280px+), should look fine on laptop screens. Mobile is low priority since the extension is desktop Chrome only.

## Mock Form Animation (Key Visual)

Build a reusable React component that simulates a fake "State Board Application" form. This is used in the hero and the Learn Mode deep dive:

- A card that looks like a simplified web form with fields: First Name, Last Name, NPI Number, License Number, State, Email
- In "auto-fill mode": fields light up one by one with the provider data appearing and a green checkmark, creating a satisfying cascade effect
- In "learn mode": show a cursor clicking a field, the picker dropdown appearing, a selection being made, and the field outline turning green
- Loop the animation on a 6-8 second cycle
- This is the main visual hook of the page — invest time making it look good

## Files to Generate

```
/app
  /page.tsx              — Main landing page
  /layout.tsx            — Root layout with fonts + metadata
  /globals.css           — Tailwind base + custom styles
/components
  /Hero.tsx              — Hero section with animated form mockup
  /ProblemSection.tsx    — Pain points cards
  /HowItWorks.tsx        — 3-step horizontal flow
  /LearnModeDemo.tsx     — Learn Mode deep dive with animation
  /FieldSchema.tsx       — Accordion/tabs showing the 80+ fields
  /Features.tsx          — Feature highlight cards
  /GettingStarted.tsx    — Installation steps
  /FAQ.tsx               — Collapsible FAQ
  /Footer.tsx            — Footer
  /MockForm.tsx          — Reusable animated form mockup component
  /AnimatedSection.tsx   — Scroll-triggered fade-in wrapper (Framer Motion)
/public
  /extension.zip         — The extension download (placeholder)
```

## Important Notes

- This is a SINGLE PAGE — no routing needed beyond the index
- All sections should have `id` attributes for smooth scroll navigation
- Add a sticky header/navbar with section links that highlights the active section on scroll
- The page should feel polished but not over-designed — the audience is internal team members, not customers
- Every section should be visually distinct (alternating backgrounds, varied layouts) to avoid monotony
- The Mock Form animation is the centerpiece — make it the hero visual AND reuse it in the Learn Mode section with different animation modes
