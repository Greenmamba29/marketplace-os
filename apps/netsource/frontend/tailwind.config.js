export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0284C7', 50: '#F0F9FF', 100: '#E0F2FE', 500: '#0284C7', 600: '#0369A1' },
        surface: { DEFAULT: '#0A0A0B', 50: '#18181B', 100: '#27272A', 200: '#3F3F46' }
      },
      fontFamily: { display: ['Syne', 'sans-serif'], sans: ['DM Sans', 'sans-serif'] }
    }
  },
  plugins: []
}
