/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'civic-blue': '#0B1F33',
        'verification-green': '#1E7F4B',
        'authority-amber': '#C28F2C',
        'institutional-white': '#F8F9FA',
        'deep-charcoal': '#1A1A1A',
        'subtle-border': '#E3E6E8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
