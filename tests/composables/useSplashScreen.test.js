import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { SPLASH_SEEN_KEY, useSplashScreen } from '../../app/composables/useSplashScreen'
import { withSetup } from '../helpers/withSetup'

const MIN_MS = 700
const MAX_MS = 2200

function setup({ elapsed = 0 } = {}) {
  vi.spyOn(performance, 'now').mockReturnValue(elapsed)
  const isReaderReady = shallowRef(false)
  const { result, unmount } = withSetup(() => useSplashScreen(isReaderReady))
  return { ...result, isReaderReady, unmount }
}

describe('useSplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
  })
  afterEach(() => vi.useRealTimers())

  it('stays up until the reader is ready', () => {
    const { isSplashVisible } = setup()
    vi.advanceTimersByTime(MIN_MS)
    expect(isSplashVisible.value).toBe(true)
  })

  it('leaves once the reader is ready', async () => {
    const { isSplashVisible, isReaderReady } = setup()
    vi.advanceTimersByTime(MIN_MS)

    isReaderReady.value = true
    await nextTick()

    expect(isSplashVisible.value).toBe(false)
  })

  it('stays for the minimum time when the reader is ready at once', async () => {
    const { isSplashVisible, isReaderReady } = setup()
    isReaderReady.value = true
    await nextTick()
    expect(isSplashVisible.value).toBe(true)

    vi.advanceTimersByTime(MIN_MS)
    expect(isSplashVisible.value).toBe(false)
  })

  it('never waits past the maximum for a slow PDF', () => {
    const { isSplashVisible } = setup()
    vi.advanceTimersByTime(MAX_MS)
    expect(isSplashVisible.value).toBe(false)
  })

  it('counts time already spent loading the page', () => {
    const { isSplashVisible } = setup({ elapsed: 2000 })
    vi.advanceTimersByTime(MAX_MS - 2000)
    expect(isSplashVisible.value).toBe(false)
  })

  it('shows once per session', () => {
    setup()
    expect(sessionStorage.getItem(SPLASH_SEEN_KEY)).toBe('1')

    expect(setup().isSplashVisible.value).toBe(false)
  })

  it('still works when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    const { isSplashVisible } = setup()
    expect(isSplashVisible.value).toBe(true)

    vi.advanceTimersByTime(MAX_MS)
    expect(isSplashVisible.value).toBe(false)
  })

  it('leaves no timers behind once unmounted', () => {
    const { unmount } = setup()
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
