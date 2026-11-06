import { watch } from 'vue'
import { getPdfScrollAnchor, scrollToPdfAnchor } from '../utils/pdfScroll'

// Keeps the reader on the same spot when a re-render changes page heights (zoom,
// rotation): captures the position before the width changes, restores it once the
// new pages have rendered.
export function usePdfScrollAnchor(containerRef, widthRef, pdfRef) {
  let pendingAnchor = null

  watch(widthRef, () => {
    // Keep the first anchor when zooming repeatedly: later ones would be measured
    // against a half-finished render.
    pendingAnchor ??= getPdfScrollAnchor(containerRef.value)
  })

  watch(pdfRef, () => {
    pendingAnchor = null
  })

  function restoreAnchor() {
    scrollToPdfAnchor(containerRef.value, pendingAnchor)
    pendingAnchor = null
  }

  function setPendingAnchor(anchor) {
    pendingAnchor = anchor
  }

  return { restoreAnchor, setPendingAnchor }
}
