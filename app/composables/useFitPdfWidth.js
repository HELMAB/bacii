import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'

// Horizontal padding around the page (px-2 on the wrapper inside the scroll container).
const PAGE_GUTTER = 16
// Every width change re-renders the PDF canvases, so don't react to each resize frame.
const RESIZE_DEBOUNCE_MS = 150

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
