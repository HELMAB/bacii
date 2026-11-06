/** @type {import('tailwindcss').Config} */

// Semantic colours backed by the --c-* variables in app/assets/css/main.css,
// so dark mode is defined once there instead of with dark: on every class.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

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
        page: token('page'),
        surface: token('surface'),
        'surface-raised': token('surface-raised'),
        fg: token('fg'),
        'fg-muted': token('fg-muted'),
        'fg-faint': token('fg-faint'),
        line: token('line'),
        shadow: token('shadow'),
        // "Where you are": named active, not current, because Tailwind already
        // has text-current / border-current for currentColor.
        active: token('active'),
        'on-active': token('on-active'),
        highlight: token('highlight'),
        system: token('system'),
        'on-system': token('on-system'),
        'ink-bar': token('ink-bar'),
        'on-ink-bar': token('on-ink-bar'),
        reader: token('reader')
      },
      // The only two shadow sizes: offset print shadows, no blur.
      boxShadow: {
        'print-sm': '3px 3px 0 rgb(var(--c-shadow))',
        print: '8px 8px 0 rgb(var(--c-shadow))'
      },
      fontFamily: {
        // Body text
        sans: ['Battambang', 'PengHuoth', 'sans-serif'],
        // Headings, 16px and up only
        display: ['Moul', 'Battambang', 'PengHuoth', 'serif'],
        // Khmer numerals, stamps, counters
        numeral: ['Koulen', 'Battambang', 'PengHuoth', 'sans-serif'],
        // Latin only (no Khmer glyphs): "DOBPI", the site address
        mono: ['"Special Elite"', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
}
