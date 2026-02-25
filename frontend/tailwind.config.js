/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3C006B', // Deep Purple
        secondary: '#FF3269', // Pinkish Red
        accent: '#FFD700', // Gold/Yellow for alerts
      }
    },
  },
  plugins: [],
}
