import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#65708a",
        surface: "#f7f8fc",
        brand: {
          50: "#edf5ff",
          100: "#d8eaff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af"
        },
        accent: "#ff825c"
      },
      boxShadow: {
        card: "0 10px 28px rgba(23, 32, 51, 0.08)",
        float: "0 22px 60px rgba(23, 32, 51, 0.13)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
} satisfies Config;
