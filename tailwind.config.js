/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Noto Sans TC", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(45, 64, 52, 0.12)"
      }
    },
  },
  plugins: [],
}
