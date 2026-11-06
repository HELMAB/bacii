import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useHead } from '#imports'

const PDF_PARAM = 'pdf'
const POSITION_KEY = 'dobpi_reading_position'

function readSavedPosition() {
  try {
    return JSON.parse(localStorage.getItem(POSITION_KEY))
  } catch {
    return null
  }
}

function writeSavedPosition(position) {
  try {
    localStorage.setItem(POSITION_KEY, JSON.stringify(position))
  } catch {
    // Storage full or blocked: losing the saved position is harmless.
  }
}

// Ties the reader to browser history: each document gets a shareable URL, Back
// walks through opened documents, and open overlays get their own history entry so
// Back closes them instead of leaving the app. The last position is saved so the
// app reopens where the student stopped.
//
// `overlays`: [{ isOpen: Ref<boolean>, close: () => void, replacedByDoc?: boolean }].
// `replacedByDoc` marks an overlay that closes because a document was picked in it;
// its history entry becomes the document's, so Back doesn't land on a dead entry.
export function useReaderHistory({ allPdfs, selectedPdf, selectPdf, overlays }) {
  const openOverlays = []
  let isHistorySelection = false
  let isInitialSelection = false

  function findDoc(pdf) {
    return allPdfs.value.find((doc) => doc.pdf === pdf)
  }

  useHead({
    title: computed(() => {
      const doc = findDoc(selectedPdf.value)
      return doc ? `${doc.label} — Dobpi` : 'Home — Dobpi'
    })
  })

  function buildUrl(pdf) {
    const url = new URL(window.location.href)
    url.searchParams.set(PDF_PARAM, pdf)
    return url.pathname + url.search
  }

  function historyState() {
    return { overlayDepth: openOverlays.length }
  }

  function recordDocInHistory(pdf) {
    if (isHistorySelection) return

    const topOverlay = openOverlays.at(-1)
    if (isInitialSelection) {
      history.replaceState(historyState(), '', buildUrl(pdf))
    } else if (topOverlay?.replacedByDoc) {
      openOverlays.pop()
      history.replaceState(historyState(), '', buildUrl(pdf))
    } else {
      history.pushState(historyState(), '', buildUrl(pdf))
    }
  }

  // Sync, so this runs before a drawer closing in the same tick tries to pop an
  // entry that the document has just taken over.
  watch(
    selectedPdf,
    (pdf) => {
      if (!pdf) return

      recordDocInHistory(pdf)
      if (!isInitialSelection) {
        writeSavedPosition({ pdf, page: 0, offset: 0 })
      }
    },
    { flush: 'sync' }
  )

  overlays.forEach((overlay) => {
    watch(
      overlay.isOpen,
      (isOpen) => {
        if (isOpen) {
          openOverlays.push(overlay)
          history.pushState(historyState(), '')
          return
        }

        // Already gone when Back closed it or a document took over its entry.
        const index = openOverlays.indexOf(overlay)
        if (index !== -1) {
          openOverlays.splice(index, 1)
          history.back()
        }
      },
      { flush: 'sync' }
    )
  })

  function handlePopState(event) {
    const depth = event.state?.overlayDepth ?? 0
    while (openOverlays.length > depth) {
      openOverlays.pop().close()
    }

    const pdf = new URLSearchParams(window.location.search).get(PDF_PARAM)
    const doc = findDoc(pdf)
    if (doc && pdf !== selectedPdf.value) {
      isHistorySelection = true
      selectPdf(doc, doc.category, doc.year)
      isHistorySelection = false
    }
  }

  // Priority: the URL, then the last document read, then the first in the list.
  function resolveInitialDoc() {
    const urlDoc = findDoc(new URLSearchParams(window.location.search).get(PDF_PARAM))
    const saved = readSavedPosition()
    const savedDoc = findDoc(saved?.pdf)
    const doc = urlDoc ?? savedDoc ?? allPdfs.value[0]
    return { doc, position: doc && doc === savedDoc ? saved : null }
  }

  function openDocWithoutHistoryEntry(doc) {
    isInitialSelection = true
    selectPdf(doc, doc.category, doc.year)
    isInitialSelection = false
  }

  function savePosition(anchor) {
    if (selectedPdf.value && anchor) {
      writeSavedPosition({ pdf: selectedPdf.value, ...anchor })
    }
  }

  onMounted(() => window.addEventListener('popstate', handlePopState))
  onUnmounted(() => window.removeEventListener('popstate', handlePopState))

  return { resolveInitialDoc, openDocWithoutHistoryEntry, savePosition }
}
