import { shallowRef, reactive, watch, onMounted } from 'vue'

export function useSidebar(isDesktop) {
  // Open by default on desktop (split view); closed on mobile where it overlays.
  const isSidebarOpen = shallowRef(true)
  const expandedCategories = reactive({})
  const expandedYears = reactive({})
  const isCompactMode = shallowRef(false)

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

    // Start closed on mobile; the split view only makes sense on desktop.
    if (!isDesktop.value) {
      isSidebarOpen.value = false
    }
  })

  watch(isCompactMode, (newVal) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('compactMode', newVal.toString())
    }
  })

  // Follow viewport changes: open when entering desktop, close when leaving.
  watch(isDesktop, (desktop) => {
    isSidebarOpen.value = desktop
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
