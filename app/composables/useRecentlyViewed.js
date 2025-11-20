import { ref, onMounted } from 'vue'

export function useRecentlyViewed() {
  const recentlyViewed = ref([])

  function addToRecentlyViewed(subject, category, year) {
    const item = { ...subject, category, year }
    const existing = recentlyViewed.value.findIndex(i => i.pdf === subject.pdf)
    if (existing > -1) {
      recentlyViewed.value.splice(existing, 1)
    }
    recentlyViewed.value.unshift(item)
    recentlyViewed.value = recentlyViewed.value.slice(0, 5)

    if (typeof window !== 'undefined') {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed.value))
    }
  }

  function clearRecentlyViewed(showToastNotification) {
    if (confirm('តើអ្នកប្រាកដថាចង់សម្អាតប្រវត្តិមើលថ្មីៗទេ?')) {
      recentlyViewed.value = []
      if (typeof window !== 'undefined') {
        localStorage.removeItem('recentlyViewed')
      }
      showToastNotification('បានសម្អាតប្រវត្តិមើលថ្មីៗ')
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentlyViewed')
      if (saved) {
        recentlyViewed.value = JSON.parse(saved)
      }
    }
  })

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed
  }
}
