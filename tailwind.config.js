/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './app/**/*.{js,vue,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef1fc',
          100: '#dde2f9',
          200: '#bcc6f2',
          300: '#92a1e7',
          400: '#6376d6',
          500: '#3f50c0',
          600: '#253c99',
          700: '#213484',
          800: '#1d2c6b',
          900: '#1c2856',
          950: '#121833',
          DEFAULT: '#253c99'
        }
      },
      fontFamily: {
        sans: ['PengHuoth', 'sans-serif']
      },
      backgroundImage: {
        // Subtle dot grid (graph-paper feel) for reading surfaces. SVG tile, not a gradient.
        dots: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23cbd5e1'/%3E%3C/svg%3E\")",
        'dots-dark':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23334155'/%3E%3C/svg%3E\")"
      }
    }
  },
  plugins: []
}
