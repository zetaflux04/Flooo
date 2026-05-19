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
        primary: "#00D4FF",
        secondary: "#01237A",
        accent: "#00E5FF",
        deep: "#002147",
        foam: "#E6F4FF",
        ripple: "#00B8D9",
        background: "#F2FAFF",
        foreground: "#00103A",
        muted: "#6B7280",
        "light-blue": "#E6F4FF",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 212, 255, 0.08)",
        "card-hover": "0 8px 30px rgba(0, 212, 255, 0.15)",
      },
      borderRadius: {
        card: "16px",
        btn: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
