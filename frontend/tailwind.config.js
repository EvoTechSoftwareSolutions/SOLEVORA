/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
        '3xl': '1800px',
      },
      colors: {
        primary: "#ff6d2e",
        secondary: "#0c121e",
        "bg-light": "#f8fafc",
        "accent-orange": "#f97316",
        "accent-yellow": "#ffa007",
        "deep-red": "#7a1515",
        "dark-brown": "#3a261a",
        "brand-gold": "#ef8a3a",
        "card-beige": "#fcf6eb",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      animation: {
        'fadeIn': 'fadeIn 0.8s ease-out forwards',
        'slideInRight': 'slideInRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}