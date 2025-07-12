/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Deep blue
        secondary: '#7C3AED', // Vibrant purple
      },
    },
  },
  plugins: [],
}

