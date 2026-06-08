<template>
  <div class="flex-1 flex items-center justify-center px-4">
    <div class="text-center max-w-md">
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
import { FileText, Menu } from '@lucide/vue'
</script>
