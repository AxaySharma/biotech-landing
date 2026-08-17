import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep clinical navy/near-black background
        background: "#05070A",
        // Warm off-white text color
        foreground: "#F4F6F5",
        // Bioluminescent accent teal-cyan
        "accent-teal": "var(--accent-teal)",
        // Secondary violet
        "accent-violet": "var(--accent-violet)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      fontSize: {
        // Custom fluid text-hero (clamp-based, roughly 56px–120px)
        hero: ["clamp(3.5rem, 8vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
      },
      spacing: {
        // Section padding py-24 desktop / py-16 mobile
        "section-mobile": "4rem", // 64px
        "section-desktop": "6rem", // 96px
      },
      maxWidth: {
        container: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
