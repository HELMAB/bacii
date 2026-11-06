<script setup>
import { computed, shallowRef } from 'vue'
import { Download } from '@lucide/vue'
import { toKhmerDigits } from '../../utils/khmer'

// Average PDF size, for the estimate shown before a download starts on mobile data.
const AVERAGE_PDF_MB = 1.8

// State comes from the single useOfflineDownload() in app.vue, which also feeds
// the per-paper "saved" stamps in the sidebar.
const props = defineProps({
  isSupported: Boolean,
  status: { type: String, default: 'idle' },
  cachedCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  isComplete: Boolean
})

const emit = defineEmits(['download', 'cancel'])

const isConfirming = shallowRef(false)
const estimatedMb = computed(() => {
  const remaining = props.totalCount - props.cachedCount
  return Math.max(Math.round((remaining * AVERAGE_PDF_MB) / 10) * 10, 10)
})
const savedText = computed(
  () => `${toKhmerDigits(props.cachedCount)} / ${toKhmerDigits(props.totalCount)}`
)

function handleDownload() {
  isConfirming.value = false
  emit('download')
}
</script>

<template>
  <div
    v-if="isSupported && totalCount"
    class="shrink-0 px-4 py-2.5 lg:px-6 lg:py-3 bg-surface border-t-2 border-line"
  >
    <div class="lg:p-4 lg:border-2 lg:border-dashed lg:border-system lg:bg-surface-raised">
      <!-- All cached -->
      <div v-if="isComplete" class="flex flex-wrap items-center gap-x-3 gap-y-1 min-h-11">
        <span class="stamp stamp-system">បានទាញយកទាំងអស់</span>
        <span class="text-sm text-fg-muted">អានបានគ្មានអ៊ីនធឺណិត · {{ savedText }}</span>
      </div>

      <!-- Downloading -->
      <div v-else-if="status === 'downloading'" class="space-y-2">
        <p class="flex items-center justify-between gap-2 text-sm font-bold text-system">
          <span role="status">កំពុងទាញយក…</span>
          <span class="font-numeral font-normal text-base" aria-hidden="true">{{ savedText }}</span>
        </p>
        <div class="h-2.5 border-2 border-system bg-surface" aria-hidden="true">
          <div
            class="h-full bg-stripes-system animate-stripes transition-[width] duration-300"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <button type="button" class="btn btn-outline w-full" @click="$emit('cancel')">
          បោះបង់
        </button>
      </div>

      <!-- Confirm before using mobile data -->
      <div v-else-if="isConfirming" class="space-y-2">
        <p class="text-sm">នឹងទាញយកប្រហែល {{ toKhmerDigits(estimatedMb) }} MB។ គួរប្រើ Wi-Fi។</p>
        <div class="flex gap-2">
          <button type="button" class="btn btn-system flex-1" @click="handleDownload">ទាញយក</button>
          <button type="button" class="btn btn-outline flex-1" @click="isConfirming = false">
            បោះបង់
          </button>
        </div>
      </div>

      <!-- Idle / partial / error: one compact row on phones, a card on desktop -->
      <div v-else class="flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-2">
        <div class="flex-1 min-w-0 flex flex-col">
          <span class="text-[15px] lg:text-base font-bold leading-snug text-system">
            អានពេលគ្មានអ៊ីនធឺណិត
          </span>
          <span class="text-sm text-fg-muted">បានរក្សាទុក {{ savedText }} វិញ្ញាសា</span>
          <span v-if="status === 'error' && failedCount > 0" class="text-sm font-bold text-active">
            បរាជ័យ {{ toKhmerDigits(failedCount) }} ឯកសារ
          </span>
        </div>
        <div class="hidden lg:block h-2.5 border-2 border-system bg-surface" aria-hidden="true">
          <div class="h-full bg-system" :style="{ width: progress + '%' }"></div>
        </div>
        <button
          type="button"
          class="btn btn-system btn-icon lg:w-full lg:h-auto lg:min-h-11 lg:px-4"
          :aria-label="status === 'error' ? 'ព្យាយាមម្ដងទៀត' : 'ទាញយកទាំងអស់'"
          @click="isConfirming = true"
        >
          <Download class="w-[18px] h-[18px] shrink-0" :stroke-width="2.4" aria-hidden="true" />
          <span class="hidden lg:inline" aria-hidden="true">
            {{ status === 'error' ? 'ព្យាយាមម្ដងទៀត' : 'ទាញយកទាំងអស់' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
