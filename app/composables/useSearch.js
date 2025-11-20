import { ref, computed, watch } from 'vue'

export function useSearch(data, expandedCategories, expandedYears) {
  const searchQuery = ref('')
  const isSearchFocused = ref(false)

  const filteredData = computed(() => {
    if (!searchQuery.value.trim()) return data.value

    const query = searchQuery.value.toLowerCase()
    return data.value.map(category => ({
      ...category,
      children: category.children.map(year => ({
        ...year,
        children: year.children.filter(subject =>
          subject.label.toLowerCase().includes(query)
        )
      })).filter(year => year.children.length > 0)
    })).filter(category => category.children.length > 0)
  })

  watch(searchQuery, (newVal) => {
    if (newVal.trim()) {
      filteredData.value.forEach(category => {
        expandedCategories[category.label] = true
        category.children.forEach(year => {
          expandedYears[year.label] = true
        })
      })
    }
  })

  return {
    searchQuery,
    isSearchFocused,
    filteredData
  }
}
