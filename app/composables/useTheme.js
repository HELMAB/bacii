import { computed, shallowRef, onMounted } from 'vue'
import { useHead } from '#imports'

const THEME_COLOR_LIGHT = '#253c99'
const THEME_COLOR_DARK = '#030712'

export function useTheme() {
  const isDark = shallowRef(false)

  // Colours the phone's status bar to match the app.
  useHead({
    meta: [
      {
        name: 'theme-color',
        content: computed(() => (isDark.value ? THEME_COLOR_DARK : THEME_COLOR_LIGHT))
      }
    ]
  })

  function toggleDarkMode() {
    if (typeof window === 'undefined') return

    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
        isDark.value = true
        document.documentElement.classList.add('dark')
      } else if (savedTheme === 'light') {
        isDark.value = false
        document.documentElement.classList.remove('dark')
      }
    }
  })

  return {
    isDark,
    toggleDarkMode
  }
}
