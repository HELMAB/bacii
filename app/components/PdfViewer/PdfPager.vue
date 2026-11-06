<script setup>
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { toKhmerDigits } from '../../utils/khmer'

defineProps({
  currentPdfIndex: Number,
  totalPdfsCount: Number,
  canGoPrevious: Boolean,
  canGoNext: Boolean
})

defineEmits(['previous', 'next'])
</script>

<template>
  <!-- Phones: a full-width bar at the bottom. sm and up: a floating "ticket". -->
  <nav
    aria-label="វិញ្ញាសាមុន និងបន្ទាប់"
    class="absolute z-20 inset-x-0 bottom-0 h-[72px] grid grid-cols-3 bg-surface border-t-4 border-double border-line sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:h-auto sm:flex sm:items-stretch sm:border-2 sm:border-solid sm:bg-surface-raised sm:shadow-print-sm"
  >
    <button
      type="button"
      :disabled="!canGoPrevious"
      class="min-h-12 flex items-center justify-center gap-1 sm:px-4 font-bold text-fg hover:bg-highlight/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      aria-label="ឯកសារមុន"
      title="ឯកសារមុន (←)"
      @click="$emit('previous')"
    >
      <ChevronLeft class="w-[18px] h-[18px]" :stroke-width="2.6" aria-hidden="true" />
      មុន
    </button>
    <span
      class="flex flex-col items-center justify-center border-x-2 border-dashed border-line sm:px-3.5 whitespace-nowrap"
    >
      <span class="font-bold text-lg leading-tight text-active sm:text-fg">
        {{ toKhmerDigits(`${currentPdfIndex + 1} / ${totalPdfsCount}`) }}
      </span>
      <span class="text-xs leading-snug text-fg-muted sm:sr-only">វិញ្ញាសា</span>
    </span>
    <button
      type="button"
      :disabled="!canGoNext"
      class="m-2.5 sm:m-0 min-h-12 sm:min-h-0 flex items-center justify-center gap-1 sm:px-4 font-bold bg-fg text-surface shadow-[3px_3px_0_rgb(var(--c-active))] dark:bg-active dark:text-on-active dark:shadow-print-sm sm:shadow-none sm:dark:shadow-none motion-safe:transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-transparent disabled:text-fg dark:disabled:bg-transparent dark:disabled:text-fg dark:disabled:shadow-none disabled:active:translate-x-0 disabled:active:translate-y-0"
      aria-label="ឯកសារបន្ទាប់"
      title="ឯកសារបន្ទាប់ (→)"
      @click="$emit('next')"
    >
      បន្ទាប់
      <ChevronRight class="w-[18px] h-[18px]" :stroke-width="2.6" aria-hidden="true" />
    </button>
  </nav>
</template>
