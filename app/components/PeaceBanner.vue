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
      v-if="true"
      class="w-full shadow-lg flex-shrink-0"
      style="background: linear-gradient(135deg, #032ea1 0%, #1e40af 50%, #032ea1 100%)"
    >
      <!-- Red top stripe (Cambodian flag inspired) -->
      <div class="w-full h-1.5 bg-red-600"></div>

      <div class="py-3 px-4 text-white">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 flex-1">
            <!-- Peace dove icon -->
            <div class="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full flex-shrink-0">
              <svg class="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C10.34 2 9 3.34 9 5c0 .35.07.68.18.99C6.41 6.46 4 8.86 4 12c0 .55.45 1 1 1s1-.45 1-1c0-2.21 1.79-4 4-4 .17 0 .33.03.5.05-.17.31-.5.95-.5.95-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1-.45 1-1s-.45-1-1-1c0 0-.33-.64-.5-.95.17-.02.33-.05.5-.05 2.21 0 4 1.79 4 4 0 .55.45 1 1 1s1-.45 1-1c0-3.14-2.41-5.54-5.18-6.01.11-.31.18-.64.18-.99 0-1.66-1.34-3-3-3z"/>
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <!-- Main message -->
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <div class="flex items-center gap-2">
                  <span class="text-lg sm:text-xl font-bold">🕊️ កម្ពុជាត្រូវការសន្តិភាព</span>
                </div>
                <span class="hidden sm:inline text-white/60">•</span>
                <div class="flex items-center gap-2">
                  <span class="text-base sm:text-lg font-semibold">CAMBODIA NEEDS PEACE 🇰🇭</span>
                </div>
              </div>

              <!-- Support message -->
              <p class="text-xs sm:text-sm text-white/90 mt-1">
                យើងគាំទ្រដល់ទាហានខ្មែរទាំងអស់ដែលការពារទឹកដីជាតិ • We stand with our brave soldiers defending our homeland
              </p>
            </div>
          </div>

          <!-- Close button -->
          <button
            @click="dismissBanner"
            class="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close peace banner"
            title="បិទ"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Red bottom stripe -->
      <div class="w-full h-1.5 bg-red-600"></div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showBanner = ref(true)

// Check if user has dismissed the banner before
onMounted(() => {
  if (typeof window !== 'undefined') {
    const dismissed = localStorage.getItem('peace_banner_dismissed')
    const dismissedDate = localStorage.getItem('peace_banner_dismissed_date')

    // Show banner again after 7 days
    if (dismissed && dismissedDate) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed > 7) {
        showBanner.value = true
        localStorage.removeItem('peace_banner_dismissed')
        localStorage.removeItem('peace_banner_dismissed_date')
      } else {
        showBanner.value = false
      }
    }
  }
})

function dismissBanner() {
  showBanner.value = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('peace_banner_dismissed', 'true')
    localStorage.setItem('peace_banner_dismissed_date', Date.now().toString())
  }
}
</script>
