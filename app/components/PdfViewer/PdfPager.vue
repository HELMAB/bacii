<script setup>
import { ChevronLeft, ChevronRight } from '@lucide/vue'

defineProps({
  currentPdfIndex: Number,
  totalPdfsCount: Number,
  canGoPrevious: Boolean,
  canGoNext: Boolean
})

defineEmits(['previous', 'next'])
</script>

<template>
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center bg-white/90 dark:bg-gray-950/90 backdrop-blur border border-gray-200 dark:border-gray-800 shadow-sm"
  >
    <button
      :disabled="!canGoPrevious"
      class="p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      title="Previous (←)"
      @click="$emit('previous')"
    >
      <ChevronLeft class="w-5 h-5" />
    </button>
    <span
      class="px-3 text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300 border-x border-gray-200 dark:border-gray-800 self-stretch flex items-center whitespace-nowrap"
    >
      {{ currentPdfIndex + 1 }} / {{ totalPdfsCount }}
    </span>
    <button
      :disabled="!canGoNext"
      class="p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      title="Next (→)"
      @click="$emit('next')"
    >
      <ChevronRight class="w-5 h-5" />
    </button>
  </div>
</template>
