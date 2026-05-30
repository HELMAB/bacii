<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-gray-900 py-2 px-4 text-center shadow-lg"
    >
      <div class="flex items-center justify-center gap-2">
        <WifiOff class="w-5 h-5 animate-pulse" />
        <span class="font-semibold text-sm">
          អ្នកកំពុងប្រើប្រាស់ក្រៅបណ្តាញ - ឯកសារដែលបានមើលរួចនឹងដំណើរការ
        </span>
      </div>
    </div>
  </transition>

  <!-- Online notification (briefly shown when coming back online) -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="showOnlineNotification"
      class="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white py-2 px-4 text-center shadow-lg"
    >
      <div class="flex items-center justify-center gap-2">
        <CircleCheck class="w-5 h-5" />
        <span class="font-semibold text-sm">
          បណ្តាញត្រលប់មកវិញហើយ
        </span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { WifiOff, CircleCheck } from '@lucide/vue'

const isOnline = ref(true)
const showOnlineNotification = ref(false)
let onlineTimeout = null

function updateOnlineStatus() {
  const wasOffline = !isOnline.value
  isOnline.value = navigator.onLine

  // Show "back online" notification briefly
  if (wasOffline && isOnline.value) {
    showOnlineNotification.value = true

    // Clear any existing timeout
    if (onlineTimeout) {
      clearTimeout(onlineTimeout)
    }

    // Hide after 3 seconds
    onlineTimeout = setTimeout(() => {
      showOnlineNotification.value = false
    }, 3000)
  }
}

onMounted(() => {
  isOnline.value = navigator.onLine

  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)

  if (onlineTimeout) {
    clearTimeout(onlineTimeout)
  }
})
</script>
