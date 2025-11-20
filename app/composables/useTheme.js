import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)

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
