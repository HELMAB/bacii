<template>
  <div
    class="flex-1 flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900 bg-dots dark:bg-dots-dark"
  >
    <!-- Loading the document list -->
    <p
      v-if="isLoading"
      class="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400"
      role="status"
    >
      <Loader class="w-5 h-5 animate-spin" />
      កំពុងផ្ទុក...
    </p>

    <!-- Document list failed to load -->
    <div v-else-if="loadFailed" class="text-center max-w-xs" role="alert">
      <FileWarning
        class="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500"
        :stroke-width="1.5"
      />
      <h1 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
        មិនអាចផ្ទុកបញ្ជីឯកសារបានទេ
      </h1>
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

    <div v-else class="text-center max-w-md">
      <FileText class="w-24 h-24 mx-auto mb-8 text-gray-200 dark:text-gray-800" :stroke-width="1" />
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        បង្ហាញឯកសារ PDF
      </h1>
      <p class="text-gray-500 dark:text-gray-400 inline-flex items-center gap-1.5">
        ចុច
        <Menu class="w-4 h-4" />
        ដើម្បីជ្រើសរើសឯកសារ
      </p>
    </div>
  </div>
</template>

<script setup>
import { FileText, FileWarning, Loader, Menu, RotateCw } from '@lucide/vue'

defineProps({
  isLoading: Boolean,
  loadFailed: Boolean
})

defineEmits(['retry'])
</script>
