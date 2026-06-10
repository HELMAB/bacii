import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

// Name must match PDF_CACHE in app/composables/useOfflineDownload.js — the
// "download all" flow writes into this same cache from the page, so the SW
// serves those entries offline. Unversioned on purpose: downloaded PDFs
// survive app-shell updates so users don't re-download hundreds of MB.
const PDF_CACHE = 'dobpi-pdfs'
const PAGES_CACHE = 'dobpi-pages'
const DATA_CACHE = 'dobpi-data'
const FONTS_CACHE = 'dobpi-fonts'

self.skipWaiting()
clientsClaim()

// Precache every build asset (hashed JS/CSS chunks, including the lazy
// vue-pdf-embed chunk and the pdf.js worker). The manifest is injected at
// build time by @vite-pwa/nuxt.
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Warm the app shell so navigations work offline even on SSR'd HTML that is
// not part of the precache manifest.
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PAGES_CACHE).then((cache) => cache.add('/')))
})

// Drop caches left behind by the previous hand-written SW (dobpi-v4-* etc.),
// but never the PDF cache.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => /^dobpi-v\d+/.test(name))
          .map((name) => caches.delete(name))
      )
    )
  )
})

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({ cacheName: PAGES_CACHE })
)

registerRoute(
  ({ url }) => url.pathname.endsWith('.pdf'),
  new CacheFirst({ cacheName: PDF_CACHE })
)

registerRoute(
  ({ url }) => url.pathname === '/docs.json',
  new StaleWhileRevalidate({ cacheName: DATA_CACHE })
)

registerRoute(
  ({ url }) => url.pathname.startsWith('/fonts/'),
  new CacheFirst({ cacheName: FONTS_CACHE })
)
