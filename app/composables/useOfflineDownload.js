import { shallowRef, computed } from 'vue'

// Name must match PDF_CACHE in public/sw.js — the Service Worker serves offline
// reads from this same cache, so whatever the page stores here is what the SW
// hands back when there's no network.
const PDF_CACHE = 'dobpi-pdfs'
const CONCURRENCY = 4

// Drives the "download all PDFs for offline reading" flow.
//
// Caching is done here in the page (not via the Service Worker) using the Cache
// API, which the page and the SW share. This avoids fragile postMessage
// round-trips and makes the downloads show up as normal network requests.
export function useOfflineDownload() {
  const isSupported = shallowRef(
    typeof window !== 'undefined' && 'caches' in window && 'serviceWorker' in navigator
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

  async function checkStatus(urls) {
    if (!isSupported.value || !urls.length) {
      return
    }

    const cache = await caches.open(PDF_CACHE)

    let cached = 0
    for (const url of urls) {
      if (await cache.match(url)) {
        cached++
      }
    }

    cachedCount.value = cached
    totalCount.value = urls.length

    if (status.value !== 'downloading') {
      status.value = cached >= urls.length ? 'complete' : 'idle'
    }
  }

  async function downloadAll(urls) {
    if (!isSupported.value || !urls.length || status.value === 'downloading') {
      return
    }

    status.value = 'downloading'
    failedCount.value = 0
    totalCount.value = urls.length

    // Ask the browser not to evict this cache under storage pressure
    // (best-effort — iOS in particular may still decline).
    if (navigator.storage?.persist) {
      try {
        await navigator.storage.persist()
      } catch {
        // Non-fatal: persistence is a hint, not a guarantee.
      }
    }

    const cache = await caches.open(PDF_CACHE)

    // Only fetch what's missing so re-runs (e.g. after a failure) are cheap.
    const pending = []
    let completed = 0

    for (const url of urls) {
      if (await cache.match(url)) {
        completed++
      } else {
        pending.push(url)
      }
    }

    cachedCount.value = completed

    let failures = 0
    let index = 0

    async function worker() {
      while (index < pending.length) {
        const url = pending[index++]

        try {
          const response = await fetch(url, { cache: 'no-store' })
          if (response.ok) {
            await cache.put(url, response.clone())
          } else {
            failures++
          }
        } catch (error) {
          failures++
          console.error('[OfflineDownload] Failed to cache PDF:', url, error)
        }

        completed++
        cachedCount.value = completed
      }
    }

    const workers = []
    for (let i = 0; i < Math.min(CONCURRENCY, pending.length); i++) {
      workers.push(worker())
    }

    await Promise.all(workers)

    failedCount.value = failures
    status.value = failures > 0 ? 'error' : 'complete'
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
