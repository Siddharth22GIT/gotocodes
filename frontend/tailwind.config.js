/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0B12",
          800: "#0F111C",
          700: "#151827",
          600: "#1C2033",
        },
        violet: {
          DEFAULT: "#7C5CFF",
          light: "#9C85FF",
          dark: "#5C3FE0",
        },
        amber: {
          DEFAULT: "#FFB454",
          light: "#FFCB85",
        },
        mist: {
          DEFAULT: "#E7E9F5",
          dim: "#8A8FA3",
          faint: "#565B70",
        },
        teal: {
          DEFAULT: "#3ED6C4",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-violet": "0 0 40px -8px rgba(124,92,255,0.55)",
        "glow-amber": "0 0 40px -8px rgba(255,180,84,0.55)",
        "btn-3d": "0 6px 0 0 #5C3FE0, 0 10px 24px -6px rgba(124,92,255,0.5)",
        "btn-3d-active": "0 2px 0 0 #5C3FE0, 0 4px 12px -4px rgba(124,92,255,0.5)",
        "card": "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(124,92,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "42px 42px",
      },
      keyframes: {
        shoot: {
          "0%": { transform: "translate(0,0)", opacity: 0 },
          "8%": { opacity: 1 },
          "100%": { transform: "translate(-620px, 320px)", opacity: 0 },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blink: {
          "0%, 49%": { opacity: 1 },
          "50%, 100%": { opacity: 0 },
        },
      },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
        blink: "blink 1s step-start infinite",
      },
    },
  },
  plugins: [],
};
