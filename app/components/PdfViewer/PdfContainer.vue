<template>
  <div ref="pdfContainer" class="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-auto mx-2 sm:mx-4 mb-2 sm:mb-4 py-6 sm:py-8 relative">
    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="absolute inset-0 bg-white dark:bg-gray-800 z-10 p-4 space-y-4">
      <div class="animate-pulse space-y-4">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>

    <!-- PDF with fade transition -->
    <Transition name="pdf-fade" mode="out-in">
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
    <Transition name="fade">
      <div v-if="selectedPdf && totalPages > 0 && !isLoading" class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-full shadow-lg z-40 backdrop-blur-sm">
        <span class="text-sm font-medium">ទំព័រ {{ currentPage }} / {{ totalPages }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const VuePdfEmbed = defineAsyncComponent(() => import('vue-pdf-embed'))

const props = defineProps({
  selectedPdf: String,
  isLoading: Boolean,
  zoomLevel: Number,
  currentPage: Number,
  totalPages: Number
})

const emit = defineEmits(['rendered', 'loadingFailed', 'internalLinkClicked'])

const pdfContainer = ref(null)
const pdfRef = ref(null)

defineExpose({
  pdfContainer,
  pdfRef
})
</script>

<style scoped>
.pdf-fade-enter-active,
.pdf-fade-leave-active {
  transition: opacity 0.2s ease;
}

.pdf-fade-enter-from,
.pdf-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
