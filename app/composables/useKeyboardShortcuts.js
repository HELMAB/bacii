import { ref, onMounted, onUnmounted } from 'vue'

export function useKeyboardShortcuts({
  searchQuery,
  toggleSidebar,
  isSidebarOpen,
  isDesktop,
  goToPreviousPdf,
  goToNextPdf,
  zoomIn,
  zoomOut,
  toggleFullscreen
}) {
  const showKeyboardShortcuts = ref(false)

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
      case '?':
        e.preventDefault()
        showKeyboardShortcuts.value = !showKeyboardShortcuts.value
        break
      case 'Escape':
        if (showKeyboardShortcuts.value) {
          showKeyboardShortcuts.value = false
        } else if (isSidebarOpen.value && !isDesktop.value) {
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
    showKeyboardShortcuts,
    handleKeydown
  }
}
