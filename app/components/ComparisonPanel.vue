<template>
  <div class="flex flex-col min-h-0 overflow-hidden">
    <!-- PDF Viewer -->
    <div class="relative flex-1 min-h-0 flex flex-col">
      <div
        ref="pdfContainer"
        class="relative flex-1 min-h-0 overflow-auto bg-halftone pt-16 pb-4 md:pb-6"
      >
        <div v-if="!pdf" class="flex items-center justify-center h-full px-4">
          <div class="sheet px-5 py-6 text-center max-w-xs border-dashed">
            <FileText
              class="w-10 h-10 mx-auto mb-2 text-fg-muted"
              :stroke-width="2"
              aria-hidden="true"
            />
            <p>សូមជ្រើសរើសឯកសារដើម្បីប្រៀបធៀប</p>
          </div>
        </div>
        <template v-else>
          <PdfLoadOverlay
            :is-loading="isLoading"
            :load-error="loadError"
            :load-progress="loadProgress"
            top-inset
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

      <!-- Panel label and change button, over the reader -->
      <div class="absolute top-2.5 inset-x-2.5 z-20 flex items-start justify-between gap-2">
        <h3
          class="min-w-0 h-11 flex items-center gap-2 px-2.5 bg-surface-raised border-2 border-line shadow-print-sm"
        >
          <span class="font-bold text-lg text-active leading-none" aria-hidden="true">
            {{ label }}
          </span>
          <span class="sr-only">ឯកសារ {{ label }}</span>
          <span v-if="title" class="min-w-0 truncate text-sm">
            <b>{{ title }}</b>
            <span class="text-fg-muted">{{ ` · ${formatYearShort(year)}` }}</span>
          </span>
        </h3>
        <button
          type="button"
          class="btn btn-outline bg-surface-raised shadow-print-sm shrink-0"
          @click="$emit('selectPdf')"
        >
          ផ្លាស់ប្តូរ
        </button>
      </div>

      <!-- Zoom -->
      <div
        v-if="pdf && !loadError"
        class="absolute bottom-3 right-3 z-20 flex bg-surface-raised border-2 border-line shadow-print-sm"
      >
        <button
          type="button"
          :disabled="zoom <= MIN_ZOOM"
          class="grid place-items-center w-11 h-11 hover:bg-highlight/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="បង្រួម"
          @click="zoom = Math.max(zoom - ZOOM_STEP, MIN_ZOOM)"
        >
          <Minus class="w-5 h-5" :stroke-width="2.4" aria-hidden="true" />
        </button>
        <button
          type="button"
          :disabled="zoom >= MAX_ZOOM"
          class="grid place-items-center w-11 h-11 border-l-2 border-dashed border-line hover:bg-highlight/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="ពង្រីក"
          @click="zoom = Math.min(zoom + ZOOM_STEP, MAX_ZOOM)"
        >
          <Plus class="w-5 h-5" :stroke-width="2.4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { FileText, Minus, Plus } from '@lucide/vue'
import PdfLoadOverlay from './PdfViewer/PdfLoadOverlay.vue'
import { getPdfRenderScale, useFitPdfWidth } from '../composables/useFitPdfWidth'
import { usePdfLoadState } from '../composables/usePdfLoadState'
import { usePdfScrollAnchor } from '../composables/usePdfScrollAnchor'
import { formatYearShort } from '../utils/khmer'

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
