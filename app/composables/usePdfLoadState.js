import { onBeforeUnmount, shallowRef } from 'vue'

// Give up only when the download makes no progress for this long, so large PDFs
// on slow connections keep their loading state for as long as they need.
const STALL_TIMEOUT_MS = 30000

// Loading / progress / failure state for one embedded PDF.
export function usePdfLoadState() {
  const isLoading = shallowRef(false)
  const loadError = shallowRef(false)
  const loadProgress = shallowRef(null) // 0-100, or null while the size is unknown
  const attempt = shallowRef(0) // Key the embed with this to force a fresh load on retry

  let stallTimer = null

  function clearStallTimer() {
    clearTimeout(stallTimer)
  }

  function armStallTimer() {
    clearStallTimer()
    stallTimer = setTimeout(failLoad, STALL_TIMEOUT_MS)
  }

  function startLoad() {
    isLoading.value = true
    loadError.value = false
    loadProgress.value = null
    armStallTimer()
  }

  function retryLoad() {
    attempt.value++
    startLoad()
  }

  function trackProgress({ loaded, total }) {
    if (total > 0) {
      loadProgress.value = Math.min(Math.round((loaded / total) * 100), 100)
    }
    armStallTimer()
  }

  function markDownloaded() {
    clearStallTimer()
  }

  function finishLoad() {
    clearStallTimer()
    isLoading.value = false
    loadError.value = false
  }

  function failLoad() {
    clearStallTimer()
    isLoading.value = false
    loadError.value = true
  }

  onBeforeUnmount(clearStallTimer)

  return {
    isLoading,
    loadError,
    loadProgress,
    attempt,
    startLoad,
    retryLoad,
    trackProgress,
    markDownloaded,
    finishLoad,
    failLoad
  }
}
