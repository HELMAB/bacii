import { onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { useRequestURL } from '#imports'
import { getDocPath } from '../utils/docUrl'

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
  // The document named in the URL. `/` has none, even with the first exam open.
  const urlPdf = shallowRef(useRequestURL().searchParams.get(PDF_PARAM))
  let isHistorySelection = false
  let isInitialSelection = false
  let skipUrlUpdate = false

  function findDoc(pdf) {
    return allPdfs.value.find((doc) => doc.pdf === pdf)
  }

  function historyState() {
    return { overlayDepth: openOverlays.length }
  }

  function recordDocInHistory(pdf) {
    if (isHistorySelection || skipUrlUpdate) return

    urlPdf.value = pdf
    const url = getDocPath(pdf)
    const topOverlay = openOverlays.at(-1)
    if (isInitialSelection) {
      history.replaceState(historyState(), '', url)
    } else if (topOverlay?.replacedByDoc) {
      openOverlays.pop()
      history.replaceState(historyState(), '', url)
    } else {
      history.pushState(historyState(), '', url)
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
    urlPdf.value = pdf

    // No document in the URL means the `/` entry, which shows the first exam.
    const doc = findDoc(pdf) ?? allPdfs.value[0]
    if (doc && doc.pdf !== selectedPdf.value) {
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
    return {
      doc,
      position: doc && doc === savedDoc ? saved : null,
      isDefaultDoc: !urlDoc && !savedDoc
    }
  }

  // The default document leaves the URL at `/`, so that page stays the homepage for
  // search engines and first-time visitors.
  function openDocWithoutHistoryEntry(doc, { isDefaultDoc }) {
    isInitialSelection = true
    skipUrlUpdate = isDefaultDoc
    selectPdf(doc, doc.category, doc.year)
    isInitialSelection = false
    skipUrlUpdate = false
  }

  function savePosition(anchor) {
    if (selectedPdf.value && anchor) {
      writeSavedPosition({ pdf: selectedPdf.value, ...anchor })
    }
  }

  onMounted(() => window.addEventListener('popstate', handlePopState))
  onUnmounted(() => window.removeEventListener('popstate', handlePopState))

  return { urlPdf, resolveInitialDoc, openDocWithoutHistoryEntry, savePosition }
}
