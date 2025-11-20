import { ref } from 'vue'

export function useToast() {
  const showToast = ref(false)
  const toastMessage = ref('')

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
