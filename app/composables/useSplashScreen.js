import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

export const SPLASH_SEEN_KEY = 'dobpi_splash_seen'

// Long enough to read as a moment rather than a flicker.
const MIN_VISIBLE_MS = 700
// Never make anyone wait for a large PDF: the reader shows its own progress from here.
const MAX_VISIBLE_MS = 2200

function hasSeenSplash() {
  try {
    return sessionStorage.getItem(SPLASH_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markSplashSeen() {
  try {
    sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
  } catch {
    // Blocked storage only means the splash shows again next time.
  }
}

// Shows once per session, until the reader is ready. The timings count from the start
// of the page load, because the splash is already on screen from the server's HTML.
export function useSplashScreen(isReaderReady) {
  const isSplashVisible = shallowRef(true)
  let timers = []
  let stopWatching = null

  function hide() {
    isSplashVisible.value = false
    timers.forEach(clearTimeout)
    stopWatching?.()
  }

  onMounted(() => {
    if (hasSeenSplash()) {
      hide()
      return
    }
    markSplashSeen()

    const elapsed = performance.now()
    let isMinimumMet = elapsed >= MIN_VISIBLE_MS

    stopWatching = watch(isReaderReady, (isReady) => {
      if (isReady && isMinimumMet) hide()
    })

    timers = [
      setTimeout(() => {
        isMinimumMet = true
        if (isReaderReady.value) hide()
      }, MIN_VISIBLE_MS - elapsed),
      setTimeout(hide, MAX_VISIBLE_MS - elapsed)
    ]
  })

  onBeforeUnmount(() => {
    timers.forEach(clearTimeout)
    stopWatching?.()
  })

  return { isSplashVisible }
}
