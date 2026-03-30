export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#475569', 50: '#F8FAFC', 100: '#F1F5F9', 500: '#475569', 600: '#334155' },
        surface: { DEFAULT: '#0A0A0B', 50: '#18181B', 100: '#27272A', 200: '#3F3F46' }
      },
      fontFamily: { display: ['Syne', 'sans-serif'], sans: ['DM Sans', 'sans-serif'] }
    }
  },
  plugins: []
}
