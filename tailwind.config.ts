import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-campton)", "Arial", "Helvetica", "sans-serif"],
        display: ["var(--font-campton)", "Arial", "Helvetica", "sans-serif"],
        campton: ["var(--font-campton)", "Arial", "Helvetica", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#FF6700",
          50: "#fff5eb",
          100: "#ffe8d1",
          200: "#ffcca3",
          300: "#ffaa6e",
          400: "#ff8438",
          500: "#FF6700",
          600: "#e65c00",
          700: "#cc5200",
          800: "#a34100",
          900: "#7a3100",
        },
        navy: {
          950: "#07131a",
          900: "#0c1e28",
          850: "#0e2430",
          800: "#132b38",
          700: "#1b3a4b",
        },
        amber: {
          400: "#ff8438",
          500: "#FF6700",
          600: "#e65c00",
          700: "#cc5200",
        },
        surface: {
          white: "#ffffff",
          header: "#f6f6f6",
          soft: "#f9f9f9",
          card: "#f5f5f5",
          alt: "#f4f4f4",
          light: "#f8fafc",
          border: "#e2e8f0",
          dark: "#0c1e28",
        },
      },
    },
  },
  plugins: [],
};

export default config;
