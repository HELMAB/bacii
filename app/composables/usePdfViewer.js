import { ref, watch } from 'vue'

export function usePdfViewer(isDesktop, showToastNotification) {
  const selectedPdf = ref(null)
  const selectedPdfTitle = ref('')
  const selectedCategory = ref('')
  const selectedYear = ref('')
  const zoomLevel = ref(typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0.75 : 1)
  const isLoading = ref(false)
  const showScrollTop = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(0)

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

  function createToggleFullscreen(pdfContainerRef) {
    return function toggleFullscreen() {
      const container = pdfContainerRef.value
      if (!container) return

      if (!document.fullscreenElement) {
        container.requestFullscreen()
        showToastNotification('បានបើកពេញអេក្រង់')
      } else {
        document.exitFullscreen()
        showToastNotification('បានបិទពេញអេក្រង់')
      }
    }
  }

  function createScrollToTop(pdfContainerRef) {
    return function scrollToTop() {
      const container = pdfContainerRef.value
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
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

  function onPdfRendered(pdfProxy) {
    isLoading.value = false
    if (pdfProxy && pdfProxy.numPages) {
      totalPages.value = pdfProxy.numPages
      currentPage.value = 1
    } else {
      totalPages.value = 0
      currentPage.value = 1
    }
  }

  function onPdfError() {
    isLoading.value = false
    showToastNotification('មានបញ្ហាក្នុងការផ្ទុកឯកសារ')
  }

  function onInternalLinkClicked(pageNumber) {
    currentPage.value = pageNumber
  }

  function createHandleScroll(pdfContainerRef, pdfRefComputed) {
    return function handleScroll() {
      const container = pdfContainerRef.value
      if (container) {
        showScrollTop.value = container.scrollTop > 300

        if (totalPages.value > 0 && pdfRefComputed.value) {
          const scrollTop = container.scrollTop
          const scrollHeight = container.scrollHeight - container.clientHeight
          const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0
          currentPage.value = Math.min(Math.ceil(scrollPercent * totalPages.value) || 1, totalPages.value)
        }
      }
    }
  }

  watch(isDesktop, () => {
    if (selectedPdf.value) {
      zoomLevel.value = isDesktop.value ? 0.75 : 1
    }
  })

  return {
    selectedPdf,
    selectedPdfTitle,
    selectedCategory,
    selectedYear,
    zoomLevel,
    isLoading,
    showScrollTop,
    currentPage,
    totalPages,
    zoomIn,
    zoomOut,
    createToggleFullscreen,
    createScrollToTop,
    createHandleScroll,
    printPdf,
    downloadPdf,
    onPdfRendered,
    onPdfError,
    onInternalLinkClicked
  }
}
