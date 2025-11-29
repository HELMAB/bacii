import { ref } from 'vue'

const CACHE_KEY = 'bacii_docs_data'
const CACHE_VERSION_KEY = 'bacii_docs_version'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export function useDocsCache() {
  const data = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function loadDocs() {
    isLoading.value = true
    error.value = null

    try {
      // Try to get cached data first
      const cachedData = getCachedData()
      if (cachedData) {
        data.value = cachedData
        isLoading.value = false

        // Fetch fresh data in background and update if different
        fetchAndUpdateCache().catch((err) => {
          console.warn('Background data refresh failed:', err)
        })
        return
      }

      // No cache, fetch fresh data
      await fetchAndUpdateCache()
    } catch (err) {
      error.value = err
      console.error('Failed to load docs data:', err)

      // Try to use any cached data as fallback
      const cachedData = getCachedDataIgnoringExpiry()
      if (cachedData) {
        data.value = cachedData
      }
    } finally {
      isLoading.value = false
    }
  }

  function getCachedData() {
    if (typeof localStorage === 'undefined') return null

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const version = localStorage.getItem(CACHE_VERSION_KEY)

      if (!cached || !version) return null

      const versionData = JSON.parse(version)
      const now = Date.now()

      // Check if cache is still valid
      if (now - versionData.timestamp < CACHE_DURATION) {
        return JSON.parse(cached)
      }

      return null
    } catch (err) {
      console.error('Error reading from cache:', err)
      return null
    }
  }

  function getCachedDataIgnoringExpiry() {
    if (typeof localStorage === 'undefined') return null

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch (err) {
      return null
    }
  }

  async function fetchAndUpdateCache() {
    try {
      const response = await fetch('/docs.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const freshData = await response.json()
      data.value = freshData

      // Update cache
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(freshData))
          localStorage.setItem(CACHE_VERSION_KEY, JSON.stringify({
            timestamp: Date.now()
          }))
        } catch (err) {
          // Handle quota exceeded errors gracefully
          console.warn('Failed to cache data:', err)
        }
      }
    } catch (err) {
      throw err
    }
  }

  function clearCache() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_VERSION_KEY)
    }
  }

  return {
    data,
    isLoading,
    error,
    loadDocs,
    clearCache
  }
}
