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
              'px-3 py-1.5 text-sm font-medium transition-colors border',
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
          class="px-4 py-1.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors flex items-center gap-1.5"
          @click="$emit('close')"
        >
          <X class="w-4 h-4" />
          ចេញ
        </button>
      </div>
    </div>

    <!-- Comparison Container -->
    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2 overflow-hidden">
      <!-- Left PDF Panel -->
      <div
        class="flex flex-col bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <!-- Panel Header -->
        <div class="border-b border-gray-200 dark:border-gray-800 p-3">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-[11px] font-bold uppercase text-gray-400 dark:text-gray-500">
                ឯកសារ ១
              </h3>
              <div v-if="comparisonPdf1Title" class="text-sm mt-1 text-gray-900 dark:text-gray-100">
                <span class="font-semibold">{{ comparisonPdf1Title }}</span>
                <span class="mx-1 text-gray-400">•</span>
                <span class="text-gray-500 dark:text-gray-400">{{ comparisonPdf1Year }}</span>
              </div>
            </div>
            <button
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium transition-colors"
              @click="$emit('selectPdf', 1)"
            >
              ផ្លាស់ប្តូរ
            </button>
          </div>
        </div>

        <!-- PDF Viewer 1 -->
        <div ref="pdfContainer1" class="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 py-4">
          <div v-if="!comparisonPdf1" class="flex items-center justify-center h-full">
            <div class="text-center text-gray-400 dark:text-gray-600">
              <FileText class="w-14 h-14 mx-auto mb-3" :stroke-width="1" />
              <p class="text-sm">សូមជ្រើសរើសឯកសារដើម្បីប្រៀបធៀប</p>
            </div>
          </div>
          <div v-else class="w-fit mx-auto px-2">
            <component
              :is="VuePdfEmbed"
              v-if="VuePdfEmbed"
              :source="comparisonPdf1"
              :width="COMPARISON_PDF_WIDTH"
              @rendered="onPdfRendered"
            />
          </div>
        </div>
      </div>

      <!-- Right PDF Panel -->
      <div
        class="flex flex-col bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <!-- Panel Header -->
        <div class="border-b border-gray-200 dark:border-gray-800 p-3">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-[11px] font-bold uppercase text-gray-400 dark:text-gray-500">
                ឯកសារ ២
              </h3>
              <div v-if="comparisonPdf2Title" class="text-sm mt-1 text-gray-900 dark:text-gray-100">
                <span class="font-semibold">{{ comparisonPdf2Title }}</span>
                <span class="mx-1 text-gray-400">•</span>
                <span class="text-gray-500 dark:text-gray-400">{{ comparisonPdf2Year }}</span>
              </div>
            </div>
            <button
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium transition-colors"
              @click="$emit('selectPdf', 2)"
            >
              ផ្លាស់ប្តូរ
            </button>
          </div>
        </div>

        <!-- PDF Viewer 2 -->
        <div ref="pdfContainer2" class="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 py-4">
          <div v-if="!comparisonPdf2" class="flex items-center justify-center h-full">
            <div class="text-center text-gray-400 dark:text-gray-600">
              <FileText class="w-14 h-14 mx-auto mb-3" :stroke-width="1" />
              <p class="text-sm">សូមជ្រើសរើសឯកសារដើម្បីប្រៀបធៀប</p>
            </div>
          </div>
          <div v-else class="w-fit mx-auto px-2">
            <component
              :is="VuePdfEmbed"
              v-if="VuePdfEmbed"
              :source="comparisonPdf2"
              :width="COMPARISON_PDF_WIDTH"
              @rendered="onPdfRendered"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FileText, X } from '@lucide/vue'

const VuePdfEmbed = ref(null)

// Render width for each comparison panel (px) — panels are roughly half-width on desktop.
const COMPARISON_PDF_WIDTH = 520

defineProps({
  comparisonPdf1: String,
  comparisonPdf2: String,
  comparisonPdf1Title: String,
  comparisonPdf2Title: String,
  comparisonPdf1Year: String,
  comparisonPdf2Year: String
})

defineEmits(['close', 'swap', 'selectPdf'])

onMounted(async () => {
  const module = await import('vue-pdf-embed')
  VuePdfEmbed.value = module.default
})

function onPdfRendered() {
  // PDF rendered successfully
}
</script>
