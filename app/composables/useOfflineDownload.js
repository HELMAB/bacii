import { shallowRef, computed } from 'vue'

// Drives the "download all PDFs for offline reading" flow by messaging the
// Service Worker (see public/sw.js). The SW does the fetching/caching and posts
// progress back; this composable mirrors that into reactive state for the UI.
export function useOfflineDownload() {
  const isSupported = shallowRef(
    typeof navigator !== 'undefined' && 'serviceWorker' in navigator
  )
  const status = shallowRef('idle') // idle | downloading | complete | error
  const cachedCount = shallowRef(0)
  const totalCount = shallowRef(0)
  const failedCount = shallowRef(0)

  const progress = computed(() =>
    totalCount.value > 0 ? Math.round((cachedCount.value / totalCount.value) * 100) : 0
  )
  const isComplete = computed(
    () => totalCount.value > 0 && cachedCount.value >= totalCount.value
  )

  let listening = false

  function handleMessage(event) {
    const data = event.data
    if (!data) {
      return
    }

    if (data.type === 'PDF_CACHE_STATUS') {
      cachedCount.value = data.cachedCount
      totalCount.value = data.total

      if (status.value !== 'downloading') {
        status.value = data.total > 0 && data.cachedCount >= data.total ? 'complete' : 'idle'
      }
    }

    if (data.type === 'PDF_CACHE_PROGRESS') {
      cachedCount.value = data.completed
      failedCount.value = data.failedCount
      totalCount.value = data.total
      status.value = 'downloading'
    }

    if (data.type === 'PDF_CACHE_COMPLETE') {
      cachedCount.value = data.completed
      failedCount.value = data.failedCount
      totalCount.value = data.total
      status.value = data.failedCount > 0 ? 'error' : 'complete'
    }
  }

  function ensureListener() {
    if (listening || !isSupported.value) {
      return
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)
    listening = true
  }

  async function send(message) {
    if (!isSupported.value) {
      return
    }

    const registration = await navigator.serviceWorker.ready
    const target = navigator.serviceWorker.controller || registration.active
    target?.postMessage(message)
  }

  async function checkStatus(urls) {
    if (!isSupported.value || !urls.length) {
      return
    }

    ensureListener()
    await send({ type: 'GET_PDF_CACHE_STATUS', urls })
  }

  async function downloadAll(urls) {
    if (!isSupported.value || !urls.length) {
      return
    }

    ensureListener()
    status.value = 'downloading'
    totalCount.value = urls.length

    // Ask the browser to keep this cache from being evicted under storage
    // pressure (best-effort — iOS in particular may still decline).
    if (navigator.storage?.persist) {
      try {
        await navigator.storage.persist()
      } catch {
        // Non-fatal: persistence is a hint, not a guarantee.
      }
    }

    await send({ type: 'CACHE_PDFS', urls })
  }

  return {
    isSupported,
    status,
    cachedCount,
    totalCount,
    failedCount,
    progress,
    isComplete,
    checkStatus,
    downloadAll
  }
}
