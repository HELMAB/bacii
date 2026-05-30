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
      class="w-full shadow-lg flex-shrink-0"
      style="background: #253c99"
    >
      <!-- Red top stripe (Cambodian flag inspired) -->
      <div class="w-full h-1.5 bg-red-600"></div>

      <div class="py-3 px-4 text-white text-center">
        <div class="max-w-full mx-auto">
          <!-- Main message -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 justify-center">
            <div class="flex items-center gap-2 justify-center">
              <span class="text-lg sm:text-xl font-bold">🕊️ កម្ពុជាត្រូវការសន្តិភាព</span>
            </div>
            <span class="hidden sm:inline text-white/60">•</span>
            <div class="flex items-center gap-2 justify-center">
              <span class="text-base sm:text-lg font-semibold">CAMBODIA NEEDS PEACE 🇰🇭</span>
            </div>
          </div>

          <!-- Support message -->
          <p class="text-xs sm:text-sm text-white/90 mt-1">
            យើងគាំទ្រដល់ទាហានខ្មែរទាំងអស់ដែលការពារទឹកដីជាតិ • We stand with our brave soldiers defending our homeland
          </p>
        </div>
      </div>

      <!-- Red bottom stripe -->
      <div class="w-full h-1.5 bg-red-600"></div>
    </div>
  </transition>
</template>

<script setup>
</script>
