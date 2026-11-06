import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      // Composables are tested without booting Nuxt, so its auto-imports are stubbed.
      '#imports': fromRoot('./tests/stubs/nuxt-imports.js'),
      '~~': fromRoot('.')
    }
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.js'],
    restoreMocks: true,
    unstubGlobals: true
  }
})
