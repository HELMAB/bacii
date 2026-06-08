<template>
  <div class="flex-1 flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <FileText class="w-24 h-24 mx-auto mb-8 text-gray-200 dark:text-gray-800" :stroke-width="1" />
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        បង្ហាញឯកសារ PDF
      </h1>
      <p class="text-gray-500 dark:text-gray-400">ជ្រើសរើសឯកសារមួយពីម៉ឺនុយខាងឆ្វេង</p>
    </div>
  </div>
</template>

<script setup>
import { FileText } from '@lucide/vue'
</script>
