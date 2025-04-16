import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        // Brand colors
        primary: {
          DEFAULT: "#10B981", // emerald-500
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          950: "#022C22",
        },
        secondary: {
          DEFAULT: "#7C3AED", // violet-600
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          950: "#2E1065",
        },
      },
      animation: {
        float1: "float1 15s ease-in-out infinite alternate",
        float2: "float2 18s ease-in-out infinite alternate",
        soundWave: "soundWave 1.5s infinite",
      },
      keyframes: {
        float1: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(50px, 50px) scale(1.2)" },
        },
        float2: {
          "0%": { transform: "translate(0, 0) scale(1.2)" },
          "100%": { transform: "translate(-50px, -50px) scale(1)" },
        },
        soundWave: {
          "0%, 100%": { height: "20px" },
          "50%": { height: "80px" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
