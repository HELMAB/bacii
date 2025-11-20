import { ref, reactive, watch, onMounted } from 'vue'

export function useSidebar(isDesktop) {
  const isSidebarOpen = ref(true)
  const expandedCategories = reactive({})
  const expandedYears = reactive({})
  const isCompactMode = ref(false)

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function toggleCategory(label) {
    expandedCategories[label] = !expandedCategories[label]
  }

  function toggleYear(label) {
    expandedYears[label] = !expandedYears[label]
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      const compactMode = localStorage.getItem('compactMode')
      if (compactMode === 'true') {
        isCompactMode.value = true
      }
    }
  })

  watch(isCompactMode, (newVal) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('compactMode', newVal.toString())
    }
  })

  watch(isDesktop, (newVal) => {
    if (newVal) {
      isSidebarOpen.value = true
    } else {
      isSidebarOpen.value = false
    }
  })

  return {
    isSidebarOpen,
    expandedCategories,
    expandedYears,
    isCompactMode,
    toggleSidebar,
    toggleCategory,
    toggleYear
  }
}
