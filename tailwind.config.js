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
      }
    }
  },
  plugins: []
}
