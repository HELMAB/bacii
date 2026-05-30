<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Comparison Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-3">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-bold text-gray-800 dark:text-white">
            📊 មុខងារប្រៀបធៀប
          </h2>
          <button
            @click="$emit('swap')"
            :disabled="!comparisonPdf1 || !comparisonPdf2"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              comparisonPdf1 && comparisonPdf2
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            ]"
            title="ប្តូរឯកសារ"
          >
            ⇄ ប្តូរ
          </button>
        </div>
        <button
          @click="$emit('close')"
          class="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ✕ ចេញពីការប្រៀបធៀប
        </button>
      </div>
    </div>

    <!-- Comparison Container -->
    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2 bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <!-- Left PDF Panel -->
      <div class="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <!-- Panel Header -->
        <div class="bg-primary-600 text-white p-3">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="font-bold text-sm">ឯកសារ ១</h3>
              <div v-if="comparisonPdf1Title" class="text-xs opacity-90 mt-1">
                <span class="font-semibold">{{ comparisonPdf1Title }}</span>
                <span class="mx-1">•</span>
                <span>{{ comparisonPdf1Year }}</span>
              </div>
            </div>
            <button
              @click="$emit('selectPdf', 1)"
              class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
            >
              ផ្លាស់ប្តូរ
            </button>
          </div>
        </div>

        <!-- PDF Viewer 1 -->
        <div class="flex-1 overflow-auto" ref="pdfContainer1">
          <div v-if="!comparisonPdf1" class="flex items-center justify-center h-full">
            <div class="text-center text-gray-500 dark:text-gray-400">
              <FileText class="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p class="text-sm">សូមជ្រើសរើសឯកសារដើម្បីប្រៀបធៀប</p>
            </div>
          </div>
          <component
            v-else-if="VuePdfEmbed"
            :is="VuePdfEmbed"
            :source="comparisonPdf1"
            class="pdf-document"
            @rendered="onPdfRendered"
          />
        </div>
      </div>

      <!-- Right PDF Panel -->
      <div class="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <!-- Panel Header -->
        <div class="bg-primary-600 text-white p-3">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="font-bold text-sm">ឯកសារ ២</h3>
              <div v-if="comparisonPdf2Title" class="text-xs opacity-90 mt-1">
                <span class="font-semibold">{{ comparisonPdf2Title }}</span>
                <span class="mx-1">•</span>
                <span>{{ comparisonPdf2Year }}</span>
              </div>
            </div>
            <button
              @click="$emit('selectPdf', 2)"
              class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
            >
              ផ្លាស់ប្តូរ
            </button>
          </div>
        </div>

        <!-- PDF Viewer 2 -->
        <div class="flex-1 overflow-auto" ref="pdfContainer2">
          <div v-if="!comparisonPdf2" class="flex items-center justify-center h-full">
            <div class="text-center text-gray-500 dark:text-gray-400">
              <FileText class="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p class="text-sm">សូមជ្រើសរើសឯកសារដើម្បីប្រៀបធៀប</p>
            </div>
          </div>
          <component
            v-else-if="VuePdfEmbed"
            :is="VuePdfEmbed"
            :source="comparisonPdf2"
            class="pdf-document"
            @rendered="onPdfRendered"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FileText } from '@lucide/vue'

const VuePdfEmbed = ref(null)

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

<style scoped>
.pdf-document {
  width: 100%;
  height: auto;
}
</style>
