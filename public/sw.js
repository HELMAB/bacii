const CACHE_VERSION = 'dobpi-v4'
const STATIC_CACHE = `${CACHE_VERSION}-static`
// Unversioned on purpose: downloaded PDFs survive app-shell version bumps so
// users don't have to re-download hundreds of MB after every deploy.
const PDF_CACHE = 'dobpi-pdfs'
const DATA_CACHE = `${CACHE_VERSION}-data`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/robots.txt'
]

// Data files to cache with stale-while-revalidate
const DATA_ASSETS = [
  '/docs.json'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[Service Worker] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      caches.open(DATA_CACHE).then((cache) => {
        console.log('[Service Worker] Caching data assets')
        return cache.addAll(DATA_ASSETS)
      })
    ]).then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('dobpi-') && name !== STATIC_CACHE && name !== PDF_CACHE && name !== DATA_CACHE && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[Service Worker] Deleting old cache:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // Handle PDF requests with dedicated cache
  if (url.pathname.endsWith('.pdf')) {
    event.respondWith(handlePdfRequest(request))
    return
  }

  // Handle docs.json with stale-while-revalidate
  if (DATA_ASSETS.includes(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE))
    return
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Handle all other requests with network first
  event.respondWith(networkFirst(request, RUNTIME_CACHE))
})

// Cache first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)

    if (response.ok) {
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.error('[Service Worker] Cache first failed:', error)
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    const response = await fetch(request)

    if (response.ok) {
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    const cached = await cache.match(request)

    if (cached) {
      return cached
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/')
    }

    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  // Fetch fresh data in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone())
      console.log('[Service Worker] Updated cache:', request.url)
    }
    return response
  }).catch((error) => {
    console.error('[Service Worker] Background fetch failed:', error)
    throw error // Re-throw to propagate the error
  })

  // Return cached version immediately if available
  if (cached) {
    console.log('[Service Worker] Serving from cache (will update in background):', request.url)
    return cached
  }

  // No cache, wait for network
  try {
    return await fetchPromise
  } catch (error) {
    console.error('[Service Worker] Stale-while-revalidate failed:', error)
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
  }
}

// Handle PDF requests - cache for offline access
async function handlePdfRequest(request) {
  const cache = await caches.open(PDF_CACHE)
  const cached = await cache.match(request)

  // Return cached PDF if available
  if (cached) {
    console.log('[Service Worker] Serving PDF from cache:', request.url)
    return cached
  }

  try {
    console.log('[Service Worker] Fetching PDF:', request.url)
    const response = await fetch(request)

    if (response.ok) {
      // Cache PDF for offline access
      cache.put(request, response.clone())
      console.log('[Service Worker] Cached PDF:', request.url)
    }

    return response
  } catch (error) {
    console.error('[Service Worker] PDF fetch failed:', error)

    // Return offline message for PDFs
    return new Response('PDF not available offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// Listen for messages from clients
self.addEventListener('message', (event) => {
  const data = event.data
  if (!data) {
    return
  }

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        )
      })
    )
  }

  if (data.type === 'GET_PDF_CACHE_STATUS') {
    event.waitUntil(reportPdfCacheStatus(event.source, data.urls || []))
  }

  if (data.type === 'CACHE_PDFS') {
    event.waitUntil(cacheAllPdfs(event.source, data.urls || []))
  }
})

// Report how many of the given PDF URLs are already cached
async function reportPdfCacheStatus(client, urls) {
  if (!client) {
    return
  }

  const cache = await caches.open(PDF_CACHE)
  let cachedCount = 0

  for (const url of urls) {
    const match = await cache.match(url)
    if (match) {
      cachedCount++
    }
  }

  client.postMessage({
    type: 'PDF_CACHE_STATUS',
    cachedCount,
    total: urls.length
  })
}

// Download every PDF and store it for offline access, reporting progress
async function cacheAllPdfs(client, urls) {
  const cache = await caches.open(PDF_CACHE)
  const CONCURRENCY = 4

  // Skip files that are already cached so re-runs only fetch what's missing.
  const pending = []
  let completed = 0

  for (const url of urls) {
    const existing = await cache.match(url)
    if (existing) {
      completed++
    } else {
      pending.push(url)
    }
  }

  let failedCount = 0

  const postProgress = (type) => {
    client?.postMessage({ type, completed, failedCount, total: urls.length })
  }

  postProgress('PDF_CACHE_PROGRESS')

  let index = 0

  async function worker() {
    while (index < pending.length) {
      const url = pending[index++]

      try {
        const response = await fetch(url)

        if (response.ok) {
          await cache.put(url, response.clone())
        } else {
          failedCount++
        }
      } catch (error) {
        failedCount++
        console.error('[Service Worker] Failed to cache PDF:', url, error)
      }

      completed++
      postProgress('PDF_CACHE_PROGRESS')
    }
  }

  const workers = []
  for (let i = 0; i < Math.min(CONCURRENCY, pending.length); i++) {
    workers.push(worker())
  }

  await Promise.all(workers)

  postProgress('PDF_CACHE_COMPLETE')
}
