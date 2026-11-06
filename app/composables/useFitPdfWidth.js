import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'

// Horizontal padding around the page (px-2 on the wrapper inside the scroll container).
const PAGE_GUTTER = 16
// Every width change re-renders the PDF canvases, so don't react to each resize frame.
const RESIZE_DEBOUNCE_MS = 150
// Every page of a document is a live canvas, so high zoom on a 3x phone screen can
// exhaust memory. Limit canvas width, but never drop below 2x so text stays sharp.
const MAX_CANVAS_WIDTH = 1600
const MIN_SHARP_DENSITY = 2

// vue-pdf-embed multiplies `scale` by devicePixelRatio, so 1 is full device resolution.
export function getPdfRenderScale(width) {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
  const density = Math.max(MAX_CANVAS_WIDTH / width, MIN_SHARP_DENSITY)
  return Math.min(density / dpr, 1)
}

// Width (px) to render a PDF page at so it fits inside `containerRef`, capped at `maxWidth`.
export function useFitPdfWidth(containerRef, maxWidth) {
  const containerWidth = shallowRef(0)
  let observer = null
  let debounceTimer = null

  onMounted(() => {
    const container = containerRef.value
    if (!container) return

    containerWidth.value = container.clientWidth
    observer = new ResizeObserver(() => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        containerWidth.value = container.clientWidth
      }, RESIZE_DEBOUNCE_MS)
    })
    observer.observe(container)
  })

  onBeforeUnmount(() => {
    clearTimeout(debounceTimer)
    observer?.disconnect()
  })

  return computed(() => {
    const available = containerWidth.value - PAGE_GUTTER
    return available > 0 ? Math.min(maxWidth, available) : maxWidth
  })
}
