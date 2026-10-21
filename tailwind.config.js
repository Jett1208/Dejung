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
          950: '#0a0f1d',
          900: '#10182D',
          800: '#16213c',
          700: '#1f2d52',
          card: '#151f38',
          border: '#243257',
        },
        brand: {
          lime: '#D9FF62',
          mint: '#72F6BD',
          purple: '#A985FF',
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
