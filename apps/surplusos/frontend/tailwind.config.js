export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#B45309', 50: '#FFFBEB', 100: '#FEF3C7', 500: '#B45309', 600: '#92400E' },
        surface: { DEFAULT: '#0A0A0B', 50: '#18181B', 100: '#27272A', 200: '#3F3F46' }
      },
      fontFamily: { display: ['Syne', 'sans-serif'], sans: ['DM Sans', 'sans-serif'] }
    }
  },
  plugins: []
}
