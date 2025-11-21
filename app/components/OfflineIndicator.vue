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
        <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
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
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-semibold text-sm">
          បណ្តាញត្រលប់មកវិញហើយ
        </span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
