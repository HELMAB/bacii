import { onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { usePdfLoadState } from './usePdfLoadState'
import { getVisiblePdfPage } from '../utils/pdfScroll'

const SELECTED_ZOOM_DESKTOP = 1
const SELECTED_ZOOM_MOBILE = 1

export function usePdfViewer(isDesktop, showToastNotification) {
  const selectedPdf = shallowRef(null)
  const selectedPdfTitle = shallowRef('')
  const selectedCategory = shallowRef('')
  const selectedYear = shallowRef('')
  const zoomLevel = shallowRef(
    typeof window !== 'undefined' && window.innerWidth >= 1024
      ? SELECTED_ZOOM_DESKTOP
      : SELECTED_ZOOM_MOBILE
  )
  const showScrollTop = shallowRef(false)
  const currentPage = shallowRef(1)
  const totalPages = shallowRef(0)
  const isFullscreen = shallowRef(false)
  const isFullscreenSupported = shallowRef(false)

  const {
    isLoading,
    loadError,
    loadProgress,
    attempt,
    startLoad,
    retryLoad,
    trackProgress,
    markDownloaded,
    finishLoad,
    failLoad
  } = usePdfLoadState()

  function zoomIn() {
    if (zoomLevel.value < 2) {
      zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2)
    }
  }

  function zoomOut() {
    if (zoomLevel.value > 0.5) {
      zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
    }
  }

  // Fullscreens the whole app rather than the PDF so the header, pager and drawer
  // stay usable. iPhone Safari has no fullscreen API, so `isFullscreenSupported`
  // hides the option there.
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else if (isFullscreenSupported.value) {
        await document.documentElement.requestFullscreen()
      }
    } catch {
      showToastNotification('មិនអាចបើកពេញអេក្រង់បានទេ')
    }
  }

  function handleFullscreenChange() {
    isFullscreen.value = !!document.fullscreenElement
  }

  function createScrollToTop(pdfContainerRef) {
    return function scrollToTop() {
      const container = pdfContainerRef.value
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  function createSelectPdf(pdfContainerRef) {
    return function selectPdf(subject, category, year) {
      if (subject.pdf === selectedPdf.value) {
        // The same document won't re-render, so only a failed one needs reloading.
        if (loadError.value) {
          retryPdf()
        }
        return
      }

      startLoad()
      totalPages.value = 0
      currentPage.value = 1
      selectedPdf.value = subject.pdf
      selectedPdfTitle.value = subject.label
      selectedCategory.value = category
      selectedYear.value = year
      zoomLevel.value = isDesktop.value ? SELECTED_ZOOM_DESKTOP : SELECTED_ZOOM_MOBILE

      if (pdfContainerRef.value) {
        pdfContainerRef.value.scrollTop = 0
      }
    }
  }

  function retryPdf() {
    totalPages.value = 0
    retryLoad()
  }

  function printPdf() {
    if (selectedPdf.value) {
      window.open(selectedPdf.value, '_blank')?.print()
      showToastNotification('កំពុងបើកសម្រាប់បោះពុម្ព...')
    }
  }

  function downloadPdf() {
    if (selectedPdf.value) {
      const link = document.createElement('a')
      link.href = selectedPdf.value
      link.download = selectedPdfTitle.value + '.pdf'
      link.click()
      showToastNotification('កំពុងទាញយក...')
    }
  }

  function onPdfLoaded(pdfProxy) {
    markDownloaded()
    totalPages.value = pdfProxy.numPages
    currentPage.value = 1
  }

  function onPdfError() {
    failLoad()
    totalPages.value = 0
  }

  function onInternalLinkClicked(pageNumber) {
    currentPage.value = pageNumber
  }

  function createHandleScroll(pdfContainerRef) {
    return function handleScroll() {
      const container = pdfContainerRef.value
      if (container) {
        showScrollTop.value = container.scrollTop > 300

        if (totalPages.value > 0) {
          currentPage.value = getVisiblePdfPage(container)
        }
      }
    }
  }

  watch(isDesktop, () => {
    if (selectedPdf.value) {
      zoomLevel.value = isDesktop.value ? SELECTED_ZOOM_DESKTOP : SELECTED_ZOOM_MOBILE
    }
  })

  onMounted(() => {
    isFullscreenSupported.value = document.fullscreenEnabled === true
    document.addEventListener('fullscreenchange', handleFullscreenChange)
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
  })

  return {
    selectedPdf,
    selectedPdfTitle,
    selectedCategory,
    selectedYear,
    zoomLevel,
    isLoading,
    loadError,
    loadProgress,
    attempt,
    showScrollTop,
    currentPage,
    totalPages,
    isFullscreen,
    isFullscreenSupported,
    zoomIn,
    zoomOut,
    toggleFullscreen,
    createSelectPdf,
    createScrollToTop,
    createHandleScroll,
    retryPdf,
    printPdf,
    downloadPdf,
    onPdfLoaded,
    onPdfProgress: trackProgress,
    onPdfRendered: finishLoad,
    onPdfError,
    onInternalLinkClicked
  }
}
