/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1360px" },
    },
    extend: {
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: "#FF4500",
          hover: "#E03E00",
          soft: "#FFEBE0",
        },
        ink: {
          0: "#FFFFFF",
          50: "#F4F4F5",
          100: "#E4E4E7",
          400: "#A1A1AA",
          500: "#71717A",
          900: "#18181B",
          950: "#09090B",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shine": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "float": "float 6s ease-in-out infinite",
        "shine": "shine 3s linear infinite",
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(255,69,0,0.45)",
        card: "0 8px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
