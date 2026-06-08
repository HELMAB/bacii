import { shallowRef } from 'vue'

export function useToast() {
  const showToast = shallowRef(false)
  const toastMessage = shallowRef('')

  function showToastNotification(message) {
    toastMessage.value = message
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }

  return {
    showToast,
    toastMessage,
    showToastNotification
  }
}
