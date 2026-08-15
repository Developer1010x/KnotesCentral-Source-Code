import type { Config } from "tailwindcss";

/** Every colour is an RGB triplet in globals.css so `/opacity` modifiers work. */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        page: token("page"),
        surface: token("surface"),
        raised: token("raised"),
        line: token("line"),
        fg: token("fg"),
        muted: token("muted"),
        brand: {
          DEFAULT: token("brand"),
          soft: token("brand-soft"),
          contrast: token("brand-contrast"),
        },
        accent: token("accent"),
        theory: token("theory"),
        lab: token("lab"),
        paper: token("paper"),
      },
      borderRadius: {
        card: "0.875rem",
      },
      boxShadow: {
        card: "0 1px 2px rgb(15 23 42 / 0.04), 0 1px 3px rgb(15 23 42 / 0.06)",
        lift: "0 10px 30px -12px rgb(15 23 42 / 0.25)",
      },
      fontSize: {
        "display-sm": ["clamp(1.75rem, 1.2rem + 2vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        display: ["clamp(2rem, 1.3rem + 3vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
      },
      maxWidth: {
        prose: "68ch",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "none" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.3s ease-out both",
        // globals.css drives .skeleton::after by raw name; without this entry
        // Tailwind never emits @keyframes shimmer and every skeleton is dead.
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
};

export default config;
