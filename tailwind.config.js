/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        line: {
          green: '#06C755',
          darkgreen: '#05B34C',
          lightgreen: '#E6F8ED',
          bg: '#111827',
          panel: '#1F2937',
          card: '#111827'
        },
        brand: {
          primary: '#06C755',
          secondary: '#3B82F6',
          purple: '#8B5CF6',
          amber: '#F59E0B',
          rose: '#F43F5E',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Kanit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
