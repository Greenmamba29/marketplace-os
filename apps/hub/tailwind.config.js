/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ABFBC',
          50: '#E6FAFA',
          100: '#CCF5F5',
          200: '#99EBEB',
          300: '#66E0E0',
          400: '#33D6D6',
          500: '#0ABFBC',
          600: '#089998',
          700: '#067372',
          800: '#044D4C',
          900: '#022626',
        },
        surface: {
          DEFAULT: '#0A0A0B',
          50: '#18181B',
          100: '#27272A',
          200: '#3F3F46',
          300: '#52525B',
          400: '#71717A',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
