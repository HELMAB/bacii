import { shallowRef, computed, onMounted } from 'vue'

// Name must match PDF_CACHE in public/sw.js — the Service Worker serves offline
// reads from this same cache, so whatever the page stores here is what the SW
// hands back when there's no network.
const PDF_CACHE = 'dobpi-pdfs'
const CONCURRENCY = 4
const RECOUNT_DELAY_MS = 2000

// Drives the "download all PDFs for offline reading" flow.
//
// Caching is done here in the page (not via the Service Worker) using the Cache
// API, which the page and the SW share. This avoids fragile postMessage
// round-trips and makes the downloads show up as normal network requests.
export function useOfflineDownload() {
  // Set after mount so server and client render the same first markup.
  const isSupported = shallowRef(false)
  const status = shallowRef('idle') // idle | downloading | complete | error
  const cachedCount = shallowRef(0)
  const totalCount = shallowRef(0)
  const failedCount = shallowRef(0)
  // Which PDFs are saved, for the per-paper stamp in the sidebar. Replaced, never
  // mutated, so anything watching it updates.
  const cachedPdfs = shallowRef(new Set())
  let abortController = null

  function addCached(url) {
    if (cachedPdfs.value.has(url)) return false
    cachedPdfs.value = new Set(cachedPdfs.value).add(url)
    return true
  }

  onMounted(() => {
    isSupported.value = 'caches' in window && 'serviceWorker' in navigator
  })

  const progress = computed(() =>
    totalCount.value > 0 ? Math.round((cachedCount.value / totalCount.value) * 100) : 0
  )
  const isComplete = computed(() => totalCount.value > 0 && cachedCount.value >= totalCount.value)

  async function checkStatus(urls) {
    if (!isSupported.value || !urls.length) {
      return
    }

    const cache = await caches.open(PDF_CACHE)

    const found = new Set()
    for (const url of urls) {
      if (await cache.match(url)) {
        found.add(url)
      }
    }

    const cached = found.size
    cachedPdfs.value = found
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
    abortController = new AbortController()
    const { signal } = abortController
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

    const alreadyCached = new Set(cachedPdfs.value)
    for (const url of urls) {
      if (await cache.match(url)) {
        alreadyCached.add(url)
        completed++
      } else {
        pending.push(url)
      }
    }

    cachedPdfs.value = alreadyCached
    cachedCount.value = completed

    let failures = 0
    let index = 0

    async function worker() {
      while (index < pending.length && !signal.aborted) {
        const url = pending[index++]

        try {
          const response = await fetch(url, { cache: 'no-store', signal })
          if (response.ok) {
            await cache.put(url, response.clone())
            addCached(url)
          } else {
            failures++
          }
        } catch (error) {
          if (signal.aborted) return
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

    if (signal.aborted) {
      status.value = 'idle'
      // Downloads already in flight still land in the cache (the Service Worker's
      // PDF route stores them), so count again now and once they've settled.
      await checkStatus(urls)
      setTimeout(() => {
        if (status.value !== 'downloading') checkStatus(urls)
      }, RECOUNT_DELAY_MS)
      return
    }

    failedCount.value = failures
    status.value = failures > 0 ? 'error' : 'complete'
  }

  // A paper opened in the reader is saved by the Service Worker's cache-first PDF
  // route, not by downloadAll, so check the shared cache and mark it if it's there.
  async function markCached(url) {
    if (!isSupported.value || !url || status.value === 'downloading') return

    const cache = await caches.open(PDF_CACHE)
    if (!(await cache.match(url)) || !addCached(url)) return

    cachedCount.value = Math.min(cachedCount.value + 1, totalCount.value || Infinity)
    if (totalCount.value > 0 && cachedCount.value >= totalCount.value) {
      status.value = 'complete'
    }
  }

  // Already-saved PDFs stay cached, so downloading again resumes from here.
  function cancelDownload() {
    abortController?.abort()
  }

  return {
    isSupported,
    status,
    cachedCount,
    cachedPdfs,
    totalCount,
    failedCount,
    progress,
    isComplete,
    checkStatus,
    downloadAll,
    markCached,
    cancelDownload
  }
}
