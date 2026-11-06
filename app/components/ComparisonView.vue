<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Comparison Header -->
    <div class="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-3">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-3">
          <h2 class="text-xs font-bold uppercase text-gray-900 dark:text-white">មុខងារប្រៀបធៀប</h2>
          <button
            :disabled="!comparisonPdf1 || !comparisonPdf2"
            :class="[
              'px-3 py-2.5 md:py-1.5 text-sm font-medium transition-colors border',
              comparisonPdf1 && comparisonPdf2
                ? 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
            ]"
            title="ប្តូរឯកសារ"
            @click="$emit('swap')"
          >
            ⇄ ប្តូរ
          </button>
        </div>
        <button
          class="px-4 py-2.5 md:py-1.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors flex items-center gap-1.5"
          @click="$emit('close')"
        >
          <X class="w-4 h-4" />
          ចេញ
        </button>
      </div>
    </div>

    <!-- Comparison Container -->
    <div
      class="flex-1 grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-2 p-2 overflow-hidden"
    >
      <ComparisonPanel
        label="១"
        :pdf="comparisonPdf1"
        :title="comparisonPdf1Title"
        :year="comparisonPdf1Year"
        @select-pdf="$emit('selectPdf', 1)"
      />
      <ComparisonPanel
        label="២"
        :pdf="comparisonPdf2"
        :title="comparisonPdf2Title"
        :year="comparisonPdf2Year"
        @select-pdf="$emit('selectPdf', 2)"
      />
    </div>
  </div>
</template>

<script setup>
import { X } from '@lucide/vue'
import ComparisonPanel from './ComparisonPanel.vue'

defineProps({
  comparisonPdf1: String,
  comparisonPdf2: String,
  comparisonPdf1Title: String,
  comparisonPdf2Title: String,
  comparisonPdf1Year: String,
  comparisonPdf2Year: String
})

defineEmits(['close', 'swap', 'selectPdf'])
</script>
