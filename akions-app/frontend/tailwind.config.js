/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#1e293b',
        dark: '#0f172a',
        light: '#f8fafc',
      },
    },
  },
  plugins: [],
}
