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
      class="shrink-0 bg-system text-on-system py-2 px-4 text-center border-b-2 border-line"
      role="status"
    >
      <div class="flex items-center justify-center gap-2">
        <WifiOff class="w-5 h-5 shrink-0" :stroke-width="2.4" aria-hidden="true" />
        <span class="font-bold text-[15px] leading-snug">
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
      class="shrink-0 bg-surface text-system py-2 px-4 text-center border-b-2 border-dashed border-system"
      role="status"
    >
      <div class="flex items-center justify-center gap-2">
        <CircleCheck class="w-5 h-5 shrink-0" :stroke-width="2.4" aria-hidden="true" />
        <span class="font-bold text-[15px] leading-snug">បណ្តាញត្រលប់មកវិញហើយ</span>
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
