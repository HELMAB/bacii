<script setup>
import { computed } from 'vue'
import { FileWarning, RotateCw } from '@lucide/vue'

const props = defineProps({
  isLoading: Boolean,
  loadError: Boolean,
  loadProgress: { type: Number, default: null }
})

defineEmits(['retry'])

const isOffline = computed(() => props.loadError && !navigator.onLine)
</script>

<template>
  <!-- Skeleton while the PDF downloads and renders -->
  <div
    v-if="isLoading"
    class="absolute inset-0 bg-white dark:bg-gray-950 z-10 p-6 space-y-4"
    role="status"
  >
    <div class="space-y-2">
      <p class="text-sm tabular-nums text-gray-500 dark:text-gray-400">
        កំពុងផ្ទុក{{ loadProgress === null ? '...' : ` ${loadProgress}%` }}
      </p>
      <div class="h-1 w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div
          v-if="loadProgress !== null"
          class="h-full bg-primary-600 dark:bg-primary-500 transition-[width] duration-200"
          :style="{ width: `${loadProgress}%` }"
        ></div>
      </div>
    </div>
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-100 dark:bg-gray-900 w-3/4"></div>
      <div class="h-4 bg-gray-100 dark:bg-gray-900 w-full"></div>
      <div class="h-4 bg-gray-100 dark:bg-gray-900 w-5/6"></div>
      <div class="h-4 bg-gray-100 dark:bg-gray-900 w-full"></div>
      <div class="h-64 bg-gray-100 dark:bg-gray-900"></div>
      <div class="h-4 bg-gray-100 dark:bg-gray-900 w-4/5"></div>
      <div class="h-4 bg-gray-100 dark:bg-gray-900 w-full"></div>
      <div class="h-4 bg-gray-100 dark:bg-gray-900 w-3/4"></div>
    </div>
  </div>

  <!-- Failed to load -->
  <div
    v-else-if="loadError"
    class="absolute inset-0 z-10 flex items-center justify-center p-6"
    role="alert"
  >
    <div class="text-center max-w-xs">
      <FileWarning
        class="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500"
        :stroke-width="1.5"
      />
      <h2 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
        {{ isOffline ? 'ឯកសារនេះមិនទាន់បានរក្សាទុកទេ' : 'មិនអាចបើកឯកសារបានទេ' }}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-5">
        សូមពិនិត្យអ៊ីនធឺណិត ហើយព្យាយាមម្ដងទៀត
      </p>
      <button
        class="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
        @click="$emit('retry')"
      >
        <RotateCw class="w-4 h-4" />
        ព្យាយាមម្ដងទៀត
      </button>
    </div>
  </div>
</template>
