import { shallowRef, computed, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  const windowWidth = shallowRef(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const isDesktop = computed(() => windowWidth.value >= 1024)

  function handleResize() {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    windowWidth,
    isDesktop,
    handleResize
  }
}
