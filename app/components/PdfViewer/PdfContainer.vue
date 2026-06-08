<template>
  <div
    ref="pdfContainer"
    class="flex-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-auto mx-2 sm:mx-4 mb-2 sm:mb-4 py-6 sm:py-8 relative"
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
      <div v-if="selectedPdf && !isLoading" :key="selectedPdf" class="w-full">
        <ClientOnly>
          <VuePdfEmbed
            ref="pdfRef"
            :source="selectedPdf"
            :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }"
            class="w-full transition-transform duration-200"
            @rendered="$emit('rendered', $event)"
            @loading-failed="$emit('loadingFailed')"
            @internal-link-clicked="$emit('internalLinkClicked', $event)"
          />
        </ClientOnly>
      </div>
    </Transition>

    <!-- Page Progress Indicator -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedPdf && totalPages > 0 && !isLoading"
        class="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 z-40"
      >
        <span class="text-sm font-medium tabular-nums">
          ទំព័រ {{ currentPage }} / {{ totalPages }}
        </span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const VuePdfEmbed = defineAsyncComponent(() => import('vue-pdf-embed'))

defineProps({
  selectedPdf: String,
  isLoading: Boolean,
  zoomLevel: Number,
  currentPage: Number,
  totalPages: Number
})

defineEmits(['rendered', 'loadingFailed', 'internalLinkClicked'])

const pdfContainer = ref(null)
const pdfRef = ref(null)

defineExpose({
  pdfContainer,
  pdfRef
})
</script>
