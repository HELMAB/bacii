import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useOfflineDownload } from '../../app/composables/useOfflineDownload'
import { withSetup } from '../helpers/withSetup'

function stubCache(cachedUrls = []) {
  const stored = new Set(cachedUrls)
  const cache = {
    match: vi.fn(async (url) => stored.has(url)),
    put: vi.fn(async (url) => stored.add(url))
  }
  vi.stubGlobal('caches', { open: vi.fn(async () => cache) })
  return { cache, stored }
}

function setup() {
  Object.defineProperty(navigator, 'serviceWorker', { value: {}, configurable: true })
  return withSetup(useOfflineDownload).result
}

describe('useOfflineDownload', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}))

  it('counts what is already cached', async () => {
    stubCache(['/a.pdf'])
    const download = setup()

    await download.checkStatus(['/a.pdf', '/b.pdf'])

    expect(download.cachedCount.value).toBe(1)
    expect(download.totalCount.value).toBe(2)
    expect(download.isComplete.value).toBe(false)
  })

  it('fetches only what is missing', async () => {
    stubCache(['/a.pdf'])
    const fetchMock = vi.fn(async () => new Response('pdf'))
    vi.stubGlobal('fetch', fetchMock)
    const download = setup()

    await download.downloadAll(['/a.pdf', '/b.pdf'])

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0][0]).toBe('/b.pdf')
    expect(download.status.value).toBe('complete')
  })

  it('reports failures so they can be retried', async () => {
    stubCache()
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 500 }))
    )
    const download = setup()

    await download.downloadAll(['/a.pdf'])

    expect(download.status.value).toBe('error')
    expect(download.failedCount.value).toBe(1)
  })

  it('stops on cancel, keeps saved PDFs and reports no error', async () => {
    const { stored } = stubCache()
    const urls = Array.from({ length: 20 }, (_, index) => `/${index}.pdf`)
    const download = setup()
    const fetchMock = vi.fn((_url, { signal }) => {
      if (fetchMock.mock.calls.length === 1) return Promise.resolve(new Response('pdf'))
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('', 'AbortError')))
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const finished = download.downloadAll(urls)
    await vi.waitFor(() => expect(stored.size).toBe(1))
    download.cancelDownload()
    await finished

    expect(download.status.value).toBe('idle')
    expect(download.failedCount.value).toBe(0)
    expect(stored.size).toBe(1)
    // Aborted downloads must not count as saved.
    expect(download.cachedCount.value).toBe(1)
    expect(console.error).not.toHaveBeenCalled()
  })

  it('starts no new downloads after a cancel between files', async () => {
    const { cache } = stubCache()
    const urls = Array.from({ length: 20 }, (_, index) => `/${index}.pdf`)
    const fetchMock = vi.fn(async () => new Response('pdf'))
    vi.stubGlobal('fetch', fetchMock)
    const download = setup()
    cache.put.mockImplementationOnce(async () => download.cancelDownload())

    await download.downloadAll(urls)

    expect(download.status.value).toBe('idle')
    expect(fetchMock.mock.calls.length).toBeLessThanOrEqual(4)
  })

  it('lists which PDFs are cached', async () => {
    stubCache(['/a.pdf'])
    const download = setup()

    await download.checkStatus(['/a.pdf', '/b.pdf'])

    expect([...download.cachedPdfs.value]).toEqual(['/a.pdf'])
  })

  it('adds each PDF to the list as it is saved', async () => {
    stubCache(['/a.pdf'])
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('pdf'))
    )
    const download = setup()

    await download.downloadAll(['/a.pdf', '/b.pdf'])

    expect([...download.cachedPdfs.value].sort()).toEqual(['/a.pdf', '/b.pdf'])
  })

  it('keeps PDFs saved before a cancel in the list', async () => {
    const { stored } = stubCache()
    const urls = Array.from({ length: 20 }, (_, index) => `/${index}.pdf`)
    const download = setup()
    const fetchMock = vi.fn((_url, { signal }) => {
      if (fetchMock.mock.calls.length === 1) return Promise.resolve(new Response('pdf'))
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('', 'AbortError')))
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const finished = download.downloadAll(urls)
    await vi.waitFor(() => expect(stored.size).toBe(1))
    download.cancelDownload()
    await finished

    expect(download.cachedPdfs.value).toEqual(stored)
  })

  it('marks a single PDF once the cache has it', async () => {
    stubCache(['/a.pdf'])
    const download = setup()
    download.totalCount.value = 2

    await download.markCached('/a.pdf')
    await download.markCached('/b.pdf')

    expect([...download.cachedPdfs.value]).toEqual(['/a.pdf'])
    expect(download.cachedCount.value).toBe(1)
  })

  it('counts PDFs the Service Worker saved after a cancel', async () => {
    const { stored } = stubCache()
    const urls = Array.from({ length: 20 }, (_, index) => `/${index}.pdf`)
    const download = setup()
    const fetchMock = vi.fn((url, { signal }) => {
      if (fetchMock.mock.calls.length === 1) return Promise.resolve(new Response('pdf'))
      // The SW's cache-first route stores the PDF even though the page aborts.
      stored.add(url)
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('', 'AbortError')))
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const finished = download.downloadAll(urls)
    await vi.waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(4))
    download.cancelDownload()
    await finished

    expect(download.cachedCount.value).toBe(stored.size)
    expect(download.cachedPdfs.value).toEqual(stored)
  })
})
