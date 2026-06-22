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
        navy: {
          50: "#f0f3fa",
          100: "#d9e0f0",
          200: "#b3c1e0",
          300: "#8da2d1",
          400: "#6683c1",
          500: "#4064b1",
          600: "#2d4f97",
          700: "#1e3a7a",
          800: "#14285c",
          900: "#0d1a3d",
          950: "#080f24",
        },
        gold: {
          300: "#e8d5a3",
          400: "#ddc07a",
          500: "#c9a84c",
          600: "#b08c30",
          700: "#8a6e24",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
