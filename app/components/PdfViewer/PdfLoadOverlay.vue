<script setup>
import { computed } from 'vue'
import { RotateCw } from '@lucide/vue'
import { toKhmerDigits } from '../../utils/khmer'

const props = defineProps({
  isLoading: Boolean,
  loadError: Boolean,
  loadProgress: { type: Number, default: null },
  // Leave room for controls laid over the top of the reader (comparison panels).
  topInset: Boolean
})

defineEmits(['retry'])

const isOffline = computed(() => props.loadError && !navigator.onLine)

// Placeholder lines on the skeleton sheet (widths in %).
const SKELETON_LINES = [92, 98, 74, 86, 40, 0, 88, 95, 66, 90]
</script>

<template>
  <!-- While the PDF downloads and renders: a progress card over a skeleton sheet -->
  <div
    v-if="isLoading"
    :class="[
      'absolute inset-0 z-10 bg-halftone flex flex-col items-center gap-6 px-4 overflow-hidden',
      topInset ? 'pt-16' : 'pt-6 sm:pt-10'
    ]"
    role="status"
  >
    <div class="sheet w-60 max-w-full p-5 space-y-3">
      <p class="flex items-baseline justify-between gap-2 font-bold">
        កំពុងផ្ទុក
        <span v-if="loadProgress !== null" class="font-numeral font-normal text-xl">
          {{ toKhmerDigits(loadProgress) }}%
        </span>
      </p>
      <div class="h-3.5 border-2 border-line bg-surface overflow-hidden" aria-hidden="true">
        <div
          v-if="loadProgress !== null"
          class="h-full bg-stripes animate-stripes transition-[width] duration-200"
          :style="{ width: `${loadProgress}%` }"
        ></div>
        <div v-else class="h-full bg-stripes progress-indeterminate"></div>
      </div>
    </div>

    <div class="sheet w-full max-w-[720px] p-6 sm:p-10 space-y-3" aria-hidden="true">
      <div class="h-6 w-10 bg-fg/20 mb-4"></div>
      <template v-for="(width, index) in SKELETON_LINES" :key="index">
        <div v-if="width" class="h-2.5 bg-fg/15" :style="{ width: `${width}%` }"></div>
        <div v-else class="h-32 border-2 border-dashed border-fg/30"></div>
      </template>
    </div>
  </div>

  <!-- Failed to load -->
  <div
    v-else-if="loadError"
    class="absolute inset-0 z-10 bg-halftone flex items-center justify-center p-4"
    role="alert"
  >
    <div class="sheet relative w-full max-w-sm px-6 pt-10 pb-6 text-center">
      <span
        class="stamp stamp-active absolute -top-4 left-1/2 -translate-x-1/2 -rotate-[5deg] bg-surface-raised border-[3px] px-3 text-xl"
        aria-hidden="true"
      >
        បរាជ័យ
      </span>
      <h2 class="font-bold text-[17px] leading-snug mb-1.5">
        {{ isOffline ? 'ឯកសារនេះមិនទាន់បានរក្សាទុកទេ' : 'មិនអាចបើកឯកសារបានទេ' }}
      </h2>
      <p class="text-fg-muted mb-5">សូមពិនិត្យអ៊ីនធឺណិត ហើយព្យាយាមម្ដងទៀត</p>
      <button type="button" class="btn btn-ink" @click="$emit('retry')">
        <RotateCw class="w-[18px] h-[18px]" :stroke-width="2.4" aria-hidden="true" />
        ព្យាយាមម្ដងទៀត
      </button>
    </div>
  </div>
</template>
