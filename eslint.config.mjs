// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'

export default withNuxt(
  // Turn off ESLint rules that conflict with Prettier so Prettier owns formatting.
  eslintConfigPrettier,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      // This app passes required props down explicitly; defaults aren't meaningful here.
      'vue/require-default-prop': 'off'
    }
  }
)
