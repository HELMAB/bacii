import { onMounted, onUnmounted } from 'vue'

export function useKeyboardShortcuts({
  searchQuery,
  toggleSidebar,
  isSidebarOpen,
  goToPreviousPdf,
  goToNextPdf,
  zoomIn,
  zoomOut,
  toggleFullscreen
}) {
  function handleKeydown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key === 'Escape') {
        e.target.blur()
        searchQuery.value = ''
      }
      return
    }

    switch (e.key) {
      case '/': {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="text"]')
        searchInput?.focus()
        break
      }
      case 'Escape':
        if (isSidebarOpen.value) {
          toggleSidebar()
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        goToPreviousPdf()
        break
      case 'ArrowRight':
        e.preventDefault()
        goToNextPdf()
        break
      case '+':
      case '=':
        e.preventDefault()
        zoomIn()
        break
      case '-':
      case '_':
        e.preventDefault()
        zoomOut()
        break
      case 'f':
      case 'F':
        e.preventDefault()
        toggleFullscreen()
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    handleKeydown
  }
}
