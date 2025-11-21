import { ref, watch } from 'vue'

export function useFavorites() {
  const favorites = ref([])

  // Load favorites from localStorage on initialization
  function loadFavorites() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favorites')
      if (stored) {
        try {
          favorites.value = JSON.parse(stored)
        } catch (e) {
          console.error('Error loading favorites:', e)
          favorites.value = []
        }
      }
    }
  }

  // Save favorites to localStorage
  function saveFavorites() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }
  }

  // Check if a PDF is favorited
  function isFavorite(pdfPath) {
    return favorites.value.some(fav => fav.pdf === pdfPath)
  }

  // Add a PDF to favorites
  function addFavorite(subject, category, year) {
    const favorite = {
      pdf: subject.pdf,
      label: subject.label,
      category,
      year,
      timestamp: Date.now()
    }

    if (!isFavorite(subject.pdf)) {
      favorites.value.unshift(favorite) // Add to beginning
      saveFavorites()
      return true
    }
    return false
  }

  // Remove a PDF from favorites
  function removeFavorite(pdfPath) {
    const index = favorites.value.findIndex(fav => fav.pdf === pdfPath)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
      return true
    }
    return false
  }

  // Toggle favorite status
  function toggleFavorite(subject, category, year) {
    if (isFavorite(subject.pdf)) {
      removeFavorite(subject.pdf)
      return false // Removed
    } else {
      addFavorite(subject, category, year)
      return true // Added
    }
  }

  // Clear all favorites
  function clearFavorites() {
    favorites.value = []
    saveFavorites()
  }

  // Load favorites on initialization
  loadFavorites()

  // Watch for changes and save
  watch(favorites, saveFavorites, { deep: true })

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites
  }
}
