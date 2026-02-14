import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a2e",
        accent: "#0a84ff",
        success: "#30d158",
        warning: "#ff9f0a",
        background: {
          light: "#ffffff",
          alt: "#f5f5f7",
        },
      },
      borderRadius: {
        card: "12px",
        "card-lg": "16px",
      },
    },
  },
  plugins: [],
};
export default config;

