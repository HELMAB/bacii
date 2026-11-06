import { shallowRef, reactive, watch, onMounted } from 'vue'

export function useSidebar(isDesktop) {
  // Open by default on desktop (split view); closed on mobile where it overlays.
  const isSidebarOpen = shallowRef(true)
  const expandedCategories = reactive({})
  const expandedYears = reactive({})
  // The category tab on show. Exactly one category is expanded at a time.
  const activeCategory = shallowRef('')

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  // Switching tabs keeps the open year, so coming back shows the same list.
  function selectCategory(label) {
    if (!label) return

    Object.keys(expandedCategories).forEach((key) => {
      expandedCategories[key] = false
    })
    expandedCategories[label] = true
    activeCategory.value = label
  }

  // Shows the first category (docs.json order) until something is chosen.
  function ensureActiveCategory(categories) {
    if (!activeCategory.value && categories?.length) {
      selectCategory(categories[0].label)
    }
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
    // Compact mode was removed: the ledger needs fixed 44px rows.
    try {
      localStorage.removeItem('compactMode')
    } catch {
      // Storage can be blocked; nothing to clean up then.
    }

    // Start closed on mobile; the split view only makes sense on desktop.
    if (!isDesktop.value) {
      isSidebarOpen.value = false
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
    activeCategory,
    toggleSidebar,
    selectCategory,
    ensureActiveCategory,
    toggleYear
  }
}
