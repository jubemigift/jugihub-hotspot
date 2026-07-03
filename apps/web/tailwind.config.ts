import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05030a",
        violet: "#7c3aed",
        aurora: "#06b6d4",
        success: "#16a34a",
        warning: "#f59e0b"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(10, 8, 20, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
