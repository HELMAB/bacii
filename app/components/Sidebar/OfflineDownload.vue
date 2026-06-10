<script setup>
import { computed, watch } from 'vue'
import { HardDriveDownload, Check, Loader } from '@lucide/vue'
import { useOfflineDownload } from '../../composables/useOfflineDownload'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const {
  isSupported,
  status,
  cachedCount,
  totalCount,
  failedCount,
  progress,
  isComplete,
  checkStatus,
  downloadAll
} = useOfflineDownload()

// Flatten the full docs tree to a flat list of PDF URLs (category → year → subject).
const pdfUrls = computed(() => {
  const urls = []
  props.data.forEach((category) => {
    category.children?.forEach((year) => {
      year.children?.forEach((subject) => {
        if (subject.pdf) {
          urls.push(subject.pdf)
        }
      })
    })
  })
  return urls
})

// Once the docs tree is loaded, ask the SW how many PDFs are already cached.
watch(
  pdfUrls,
  (urls) => {
    if (urls.length) {
      checkStatus(urls)
    }
  },
  { immediate: true }
)

function handleDownload() {
  downloadAll(pdfUrls.value)
}
</script>

<template>
  <div
    v-if="isSupported && pdfUrls.length"
    class="shrink-0 px-5 py-3.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
  >
    <!-- All cached -->
    <div
      v-if="isComplete"
      class="flex items-center gap-2.5 text-xs font-medium text-primary-700 dark:text-primary-400"
    >
      <Check class="w-4 h-4 shrink-0" />
      <span>អាចអានក្រៅបណ្តាញបានទាំងអស់ ({{ totalCount }})</span>
    </div>

    <!-- Downloading -->
    <div v-else-if="status === 'downloading'" class="space-y-2">
      <div class="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300">
        <Loader class="w-4 h-4 shrink-0 animate-spin text-primary-600 dark:text-primary-400" />
        <span class="tabular-nums">កំពុងទាញយក... {{ cachedCount }} / {{ totalCount }}</span>
      </div>
      <div class="h-1.5 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <div
          class="h-full bg-primary-600 dark:bg-primary-500 transition-[width] duration-300"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Idle / partial / error -->
    <div v-else class="space-y-2">
      <button
        class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        @click="handleDownload"
      >
        <HardDriveDownload class="w-4 h-4 shrink-0" />
        <span>{{ status === 'error' ? 'ព្យាយាមម្ដងទៀត' : 'ទាញយកសម្រាប់អានក្រៅបណ្តាញ' }}</span>
      </button>
      <p
        v-if="cachedCount > 0"
        class="text-[11px] text-center text-gray-400 dark:text-gray-500 tabular-nums"
      >
        បានរក្សាទុក {{ cachedCount }} / {{ totalCount }}
      </p>
      <p
        v-if="status === 'error' && failedCount > 0"
        class="text-[11px] text-center text-red-500 tabular-nums"
      >
        បរាជ័យ {{ failedCount }} ឯកសារ
      </p>
    </div>
  </div>
</template>
