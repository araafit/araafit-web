/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neutral-100": "#E7E7E7",
        "neutral-700": "#4F4F4F",
        "neutral-800": "#454545",
        "neutral-950": "#1C1C1C",
        "primary-50": "#F7F3EF",
        "primary-500": "#9A6C50",
        "primary-950": "#2E1B1A",
        "warning-pending-300": "#FCBB4D",
        "warning-pending-500": "#F59E0B",
        "warning-pending-700": "#B47409",
      },
      fontFamily: {
        inter: ["inter", "sans-serif"],
        lora: ["lora", "serif"],
      },
    },
  },
  plugins: [],
};
