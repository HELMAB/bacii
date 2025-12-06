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
      <div
        v-if="selectedPdf && !isLoading"
        :key="selectedPdf"
        class="w-full relative"
        :class="{ 'cursor-crosshair': currentTool === 'note' }"
        @click="handlePdfClick"
      >
        <ClientOnly>
          <VuePdfEmbed
            v-if="selectedPdf"
            ref="pdfRef"
            :source="selectedPdf"
            :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }"
            class="w-full transition-transform duration-200 pdf-text-selectable"
            text-layer
            annotation-layer
            @rendered="$emit('rendered', $event)"
            @loading-failed="$emit('loadingFailed')"
            @internal-link-clicked="$emit('internalLinkClicked', $event)"
          />
        </ClientOnly>

        <!-- Note Markers -->
        <div
          v-for="note in notes"
          :key="note.id"
          class="absolute cursor-pointer group"
          :style="getNotePosition(note)"
          @click="$emit('noteClicked', note)"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
            :style="{ backgroundColor: note.color }"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <!-- Note Tooltip -->
          <div class="absolute left-10 top-0 w-64 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ note.text }}</p>
            <p class="text-xs text-gray-400 mt-2">ទំព័រ {{ note.page }}</p>
          </div>
        </div>
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
import { ref } from 'vue'

const props = defineProps({
  selectedPdf: String,
  isLoading: Boolean,
  zoomLevel: Number,
  currentPage: Number,
  totalPages: Number,
  isAnnotationMode: Boolean,
  currentTool: String,
  highlights: Array,
  notes: Array
})

const emit = defineEmits([
  'rendered',
  'loadingFailed',
  'internalLinkClicked',
  'addNote',
  'noteClicked'
])

const pdfContainer = ref(null)
const pdfRef = ref(null)

function handlePdfClick(event) {
  // Only handle clicks when note tool is active
  if (!props.isAnnotationMode || props.currentTool !== 'note') return

  // Get click position relative to the PDF container
  const rect = pdfContainer.value.getBoundingClientRect()
  const position = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }

  // Prompt for note text
  const noteText = prompt('បញ្ចូលកំណត់ចំណាំរបស់អ្នក:')
  if (noteText && noteText.trim()) {
    emit('addNote', noteText.trim(), props.currentPage, position)
  }
}

function getNotePosition(note) {
  if (!note.position) return {}
  return {
    top: note.position.y + 'px',
    left: note.position.x + 'px'
  }
}

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

/* Enable text selection in PDF */
.pdf-text-selectable :deep(.textLayer) {
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  pointer-events: auto !important;
}

.pdf-text-selectable :deep(.textLayer > span) {
  cursor: text !important;
  user-select: text !important;
}

/* Style for selected text */
.pdf-text-selectable :deep(.textLayer ::selection) {
  background: rgba(59, 130, 246, 0.3);
  color: inherit;
}

.pdf-text-selectable :deep(.textLayer ::-moz-selection) {
  background: rgba(59, 130, 246, 0.3);
  color: inherit;
}
</style>
