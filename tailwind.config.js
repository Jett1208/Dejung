/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mitr', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        midnight: {
          950: '#08090B',
          900: '#0D0F13',
          800: '#13161C',
          700: '#1C2028',
          card: '#12151A',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        brand: {
          lime: '#05DF72',
          mint: '#10B981',
          emerald: '#05DF72',
          purple: '#10B981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      }
    },
  },
  plugins: [],
}
