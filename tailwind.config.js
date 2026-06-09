/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: 'var(--bg)',
          card: 'var(--card)',
          accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
          gold: '#e2b342',
          grayDark: 'var(--grayDark)',
          textGray: 'var(--textGray)',
          textLight: 'var(--textLight)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
