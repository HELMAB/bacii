<template>
  <div
    ref="pdfContainer"
    class="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto py-6 sm:py-10 relative"
  >
    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="absolute inset-0 bg-white dark:bg-gray-950 z-10 p-6 space-y-4">
      <div class="animate-pulse space-y-4">
        <div class="h-8 bg-gray-100 dark:bg-gray-900 w-3/4"></div>
        <div class="h-4 bg-gray-100 dark:bg-gray-900 w-full"></div>
        <div class="h-4 bg-gray-100 dark:bg-gray-900 w-5/6"></div>
        <div class="h-4 bg-gray-100 dark:bg-gray-900 w-full"></div>
        <div class="h-64 bg-gray-100 dark:bg-gray-900"></div>
        <div class="h-4 bg-gray-100 dark:bg-gray-900 w-4/5"></div>
        <div class="h-4 bg-gray-100 dark:bg-gray-900 w-full"></div>
        <div class="h-4 bg-gray-100 dark:bg-gray-900 w-3/4"></div>
      </div>
    </div>

    <!-- PDF with fade transition -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <div v-if="selectedPdf && !isLoading" :key="selectedPdf" class="w-fit mx-auto px-2 sm:px-4">
        <ClientOnly>
          <VuePdfEmbed
            ref="pdfRef"
            :source="selectedPdf"
            :width="pdfWidth"
            @rendered="$emit('rendered', $event)"
            @loading-failed="$emit('loadingFailed')"
            @internal-link-clicked="$emit('internalLinkClicked', $event)"
          />
        </ClientOnly>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'

const VuePdfEmbed = defineAsyncComponent(() => import('vue-pdf-embed'))

// Reading-column width at 100% zoom (px). Zoom scales this so the PDF
// re-renders crisply at each level instead of being upscaled with a CSS transform.
const BASE_PDF_WIDTH = 820

const props = defineProps({
  selectedPdf: String,
  isLoading: Boolean,
  zoomLevel: Number
})

defineEmits(['rendered', 'loadingFailed', 'internalLinkClicked'])

const pdfWidth = computed(() => Math.round(BASE_PDF_WIDTH * (props.zoomLevel || 1)))

const pdfContainer = ref(null)
const pdfRef = ref(null)

defineExpose({
  pdfContainer,
  pdfRef
})
</script>
