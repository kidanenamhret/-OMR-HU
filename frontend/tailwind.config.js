/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orthodox: {
          burgundy: "#800020",
          gold: "#D4AF37",
          bronze: "#8B4513",
          cream: "#FDF5E6",
          dark: "#2C1810",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
