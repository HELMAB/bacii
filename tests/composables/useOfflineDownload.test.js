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
})
