<template>
  <div class="flex-1 flex items-center justify-center px-4">
    <div class="text-center">
      <FileText class="w-32 h-32 mx-auto mb-6 text-gray-300 dark:text-gray-700" :stroke-width="1" />
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">បង្ហាញឯកសារ PDF</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg">ជ្រើសរើសឯកសារមួយពីម៉ឺនុយខាងឆ្វេង</p>
    </div>
  </div>
</template>

<script setup>
import { FileText } from '@lucide/vue'
</script>
