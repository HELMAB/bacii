<template>
  <div
    class="flex flex-col min-h-0 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <!-- Panel Header -->
    <div class="border-b border-gray-200 dark:border-gray-800 p-3">
      <div class="flex items-center justify-between gap-2">
        <div class="flex-1 min-w-0">
          <h3 class="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400">
            ឯកសារ {{ label }}
          </h3>
          <div v-if="title" class="text-sm mt-1 text-gray-900 dark:text-gray-100">
            <span class="font-semibold">{{ title }}</span>
            <span class="mx-1 text-gray-400">•</span>
            <span class="text-gray-500 dark:text-gray-400">{{ year }}</span>
          </div>
        </div>
        <button
          class="px-3 py-2.5 md:py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium transition-colors shrink-0"
          @click="$emit('selectPdf')"
        >
          ផ្លាស់ប្តូរ
        </button>
      </div>
    </div>

    <!-- PDF Viewer -->
    <div class="relative flex-1 min-h-0 flex flex-col">
      <div
        ref="pdfContainer"
        class="relative flex-1 min-h-0 overflow-auto bg-gray-100 dark:bg-gray-900 bg-dots dark:bg-dots-dark py-2 md:py-4"
      >
        <div v-if="!pdf" class="flex items-center justify-center h-full">
          <div class="text-center text-gray-400 dark:text-gray-500">
            <FileText class="w-14 h-14 mx-auto mb-3" :stroke-width="1" />
            <p class="text-sm">សូមជ្រើសរើសឯកសារដើម្បីប្រៀបធៀប</p>
          </div>
        </div>
        <template v-else>
          <PdfLoadOverlay
            :is-loading="isLoading"
            :load-error="loadError"
            :load-progress="loadProgress"
            @retry="retryLoad"
          />
          <div :key="`${pdf}:${attempt}`" class="w-fit mx-auto px-2">
            <VuePdfEmbed
              :source="pdf"
              :width="pdfWidth"
              :scale="renderScale"
              @loaded="markDownloaded"
              @progress="trackProgress"
              @rendered="handleRendered"
              @loading-failed="failLoad"
              @rendering-failed="failLoad"
            />
          </div>
        </template>
      </div>

      <!-- Zoom -->
      <div
        v-if="pdf && !loadError"
        class="absolute bottom-2 right-2 z-20 flex bg-white/90 dark:bg-gray-950/90 backdrop-blur border border-gray-200 dark:border-gray-800 shadow-sm"
      >
        <button
          :disabled="zoom <= MIN_ZOOM"
          class="p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30"
          aria-label="បង្រួម"
          @click="zoom = Math.max(zoom - ZOOM_STEP, MIN_ZOOM)"
        >
          <ZoomOut class="w-5 h-5" />
        </button>
        <button
          :disabled="zoom >= MAX_ZOOM"
          class="p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30"
          aria-label="ពង្រីក"
          @click="zoom = Math.min(zoom + ZOOM_STEP, MAX_ZOOM)"
        >
          <ZoomIn class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { FileText, ZoomIn, ZoomOut } from '@lucide/vue'
import PdfLoadOverlay from './PdfViewer/PdfLoadOverlay.vue'
import { getPdfRenderScale, useFitPdfWidth } from '../composables/useFitPdfWidth'
import { usePdfLoadState } from '../composables/usePdfLoadState'
import { usePdfScrollAnchor } from '../composables/usePdfScrollAnchor'

const VuePdfEmbed = defineAsyncComponent(() => import('vue-pdf-embed'))

// Widest render width for a panel at 100% zoom (px) — narrower panels fit the page instead.
const COMPARISON_PDF_MAX_WIDTH = 520
const MIN_ZOOM = 1
const MAX_ZOOM = 2
const ZOOM_STEP = 0.25

const props = defineProps({
  label: String,
  pdf: String,
  title: String,
  year: String
})

defineEmits(['selectPdf'])

const pdfContainer = ref(null)
const zoom = ref(MIN_ZOOM)

const fitWidth = useFitPdfWidth(pdfContainer, COMPARISON_PDF_MAX_WIDTH)
const pdfWidth = computed(() => Math.round(fitWidth.value * zoom.value))
const renderScale = computed(() => getPdfRenderScale(pdfWidth.value))

const {
  isLoading,
  loadError,
  loadProgress,
  attempt,
  startLoad,
  retryLoad,
  trackProgress,
  markDownloaded,
  finishLoad,
  failLoad
} = usePdfLoadState()

const { restoreAnchor } = usePdfScrollAnchor(pdfContainer, pdfWidth, () => props.pdf)

function handleRendered() {
  restoreAnchor()
  finishLoad()
}

watch(
  () => props.pdf,
  (pdf) => {
    zoom.value = MIN_ZOOM
    if (pdf) {
      startLoad()
    }
  },
  { immediate: true }
)
</script>
