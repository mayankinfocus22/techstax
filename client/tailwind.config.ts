import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#94a3b8", // Updated to look nicer on dark background
        surface: "#050814", // Now points to deep space blue
        space: {
          950: "#030712",
          900: "#050818",
          800: "#0c102b",
          700: "#161c3f",
          600: "#1e295d"
        },
        gold: {
          50: "#fbf8eb",
          100: "#f6eed0",
          200: "#eddca1",
          300: "#e1c167",
          400: "#d7ab3e",
          500: "#e5c158", // Primary gold
          600: "#dfa845",
          700: "#c59228",
          800: "#a2721f",
          900: "#7b541a",
          DEFAULT: "#e5c158"
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1", // Sleek indigo/violet
          600: "#4f46e5",
          700: "#4338ca"
        },
        accent: "#38bdf8" // Neon cyan/blue accent
      },
      boxShadow: {
        card: "0 10px 28px rgba(0, 0, 0, 0.3)",
        float: "0 22px 60px rgba(0, 0, 0, 0.4)",
        "glow-gold": "0 0 25px rgba(229, 193, 88, 0.3)",
        "glow-blue": "0 0 25px rgba(56, 189, 248, 0.25)",
        "glow-indigo": "0 0 25px rgba(99, 102, 241, 0.3)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
} satisfies Config;
