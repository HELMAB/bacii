const CACHE_VERSION = 'dobpi-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const PDF_CACHE = `${CACHE_VERSION}-pdfs`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/robots.txt'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
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
            .filter((name) => name.startsWith('dobpi-') && name !== STATIC_CACHE && name !== PDF_CACHE && name !== RUNTIME_CACHE)
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
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        )
      })
    )
  }
})
