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
    const isCurrentlyExpanded = expandedCategories[label]

    // Close all categories
    Object.keys(expandedCategories).forEach((key) => {
      expandedCategories[key] = false
    })

    // Close all years when switching categories
    Object.keys(expandedYears).forEach((key) => {
      expandedYears[key] = false
    })

    // Toggle the clicked category
    expandedCategories[label] = !isCurrentlyExpanded
  }

  function toggleYear(label) {
    const isCurrentlyExpanded = expandedYears[label]

    // Close all years
    Object.keys(expandedYears).forEach((key) => {
      expandedYears[key] = false
    })

    // Toggle the clicked year
    expandedYears[label] = !isCurrentlyExpanded
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
