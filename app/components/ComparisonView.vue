<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Comparison Header -->
    <div
      class="shrink-0 flex items-center justify-between flex-wrap gap-2 px-3.5 py-2 bg-surface border-b-2 border-line"
    >
      <div class="flex items-center gap-3">
        <h2 class="font-display text-base leading-[1.7]">មុខងារប្រៀបធៀប</h2>
        <button
          type="button"
          :disabled="!comparisonPdf1 || !comparisonPdf2"
          class="btn btn-outline"
          title="ប្តូរឯកសារ"
          @click="$emit('swap')"
        >
          <ArrowLeftRight class="w-[18px] h-[18px]" :stroke-width="2.4" aria-hidden="true" />
          ប្តូរ
        </button>
      </div>
      <button type="button" class="btn btn-ink" @click="$emit('close')">
        <X class="w-[18px] h-[18px]" :stroke-width="2.6" aria-hidden="true" />
        ចេញ
      </button>
    </div>

    <!-- Comparison Container -->
    <div class="flex-1 grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 overflow-hidden">
      <ComparisonPanel
        class="border-b-4 border-double border-line md:border-b-0 md:border-r-4"
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
import { ArrowLeftRight, X } from '@lucide/vue'
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
