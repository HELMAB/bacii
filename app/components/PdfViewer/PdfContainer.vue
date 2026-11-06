<template>
  <div
    ref="pdfContainer"
    tabindex="-1"
    data-reader-scroll
    class="flex-1 bg-halftone overflow-auto focus-visible:outline-none pt-4 sm:pt-10 pb-[calc(72px+24px)] sm:pb-24 relative"
  >
    <PdfLoadOverlay
      :is-loading="isLoading"
      :load-error="loadError"
      :load-progress="loadProgress"
      @retry="$emit('retry')"
    />

    <!-- PDF with fade transition -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <div v-if="selectedPdf" :key="`${selectedPdf}:${attempt}`" class="w-fit mx-auto px-2">
        <ClientOnly>
          <VuePdfEmbed
            :source="selectedPdf"
            :width="pdfWidth"
            :scale="renderScale"
            @loaded="$emit('loaded', $event)"
            @progress="$emit('progress', $event)"
            @rendered="handleRendered"
            @loading-failed="$emit('loadingFailed')"
            @rendering-failed="$emit('loadingFailed')"
            @internal-link-clicked="$emit('internalLinkClicked', $event)"
          />
        </ClientOnly>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import PdfLoadOverlay from './PdfLoadOverlay.vue'
import { getPdfRenderScale, useFitPdfWidth } from '../../composables/useFitPdfWidth'
import { usePdfScrollAnchor } from '../../composables/usePdfScrollAnchor'

const VuePdfEmbed = defineAsyncComponent(() => import('vue-pdf-embed'))

// Widest reading column at 100% zoom (px); narrower screens fit the page to the
// container instead. Zoom scales this so the PDF re-renders crisply at each level
// instead of being upscaled with a CSS transform.
const BASE_PDF_WIDTH = 820

const props = defineProps({
  selectedPdf: String,
  isLoading: Boolean,
  loadError: Boolean,
  loadProgress: { type: Number, default: null },
  attempt: { type: Number, default: 0 },
  zoomLevel: Number
})

const emit = defineEmits([
  'loaded',
  'progress',
  'rendered',
  'loadingFailed',
  'internalLinkClicked',
  'retry'
])

const pdfContainer = ref(null)

const fitWidth = useFitPdfWidth(pdfContainer, BASE_PDF_WIDTH)
const pdfWidth = computed(() => Math.round(fitWidth.value * (props.zoomLevel || 1)))
const renderScale = computed(() => getPdfRenderScale(pdfWidth.value))

const { restoreAnchor, setPendingAnchor } = usePdfScrollAnchor(
  pdfContainer,
  pdfWidth,
  () => props.selectedPdf
)

function handleRendered() {
  restoreAnchor()
  emit('rendered')
}

defineExpose({
  pdfContainer,
  restorePosition: setPendingAnchor
})
</script>
