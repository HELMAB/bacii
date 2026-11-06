import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePdfLoadState } from '../../app/composables/usePdfLoadState'
import { withSetup } from '../helpers/withSetup'

const STALL_MS = 30000

describe('usePdfLoadState', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('stays loading on a slow download until it finishes', () => {
    const { result } = withSetup(usePdfLoadState)
    result.startLoad()

    vi.advanceTimersByTime(STALL_MS - 1)
    expect(result.isLoading.value).toBe(true)

    result.markDownloaded()
    vi.advanceTimersByTime(STALL_MS * 2)
    result.finishLoad()

    expect(result.isLoading.value).toBe(false)
    expect(result.loadError.value).toBe(false)
  })

  it('fails when the download makes no progress', () => {
    const { result } = withSetup(usePdfLoadState)
    result.startLoad()

    vi.advanceTimersByTime(STALL_MS)

    expect(result.isLoading.value).toBe(false)
    expect(result.loadError.value).toBe(true)
  })

  it('gives a download that keeps progressing all the time it needs', () => {
    const { result } = withSetup(usePdfLoadState)
    result.startLoad()

    for (let loaded = 1; loaded <= 5; loaded++) {
      vi.advanceTimersByTime(STALL_MS - 1)
      result.trackProgress({ loaded, total: 10 })
    }

    expect(result.loadError.value).toBe(false)
    expect(result.loadProgress.value).toBe(50)
  })

  it('leaves progress unknown when the size is unknown', () => {
    const { result } = withSetup(usePdfLoadState)
    result.startLoad()
    result.trackProgress({ loaded: 500, total: 0 })
    expect(result.loadProgress.value).toBeNull()
  })

  it('caps progress at 100', () => {
    const { result } = withSetup(usePdfLoadState)
    result.startLoad()
    result.trackProgress({ loaded: 12, total: 10 })
    expect(result.loadProgress.value).toBe(100)
  })

  it('reloads on retry by changing the attempt', () => {
    const { result } = withSetup(usePdfLoadState)
    result.startLoad()
    result.failLoad()

    result.retryLoad()

    expect(result.attempt.value).toBe(1)
    expect(result.isLoading.value).toBe(true)
    expect(result.loadError.value).toBe(false)
  })

  it('stops watching for stalls once unmounted', () => {
    const { result, unmount } = withSetup(usePdfLoadState)
    result.startLoad()
    unmount()

    vi.advanceTimersByTime(STALL_MS)

    expect(result.loadError.value).toBe(false)
  })
})
