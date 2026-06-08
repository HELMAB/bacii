<template>
  <div
    class="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-2 py-2 sm:px-4 sm:py-3 mx-2 sm:mx-4 mb-2"
  >
    <!-- Breadcrumb -->
    <div
      class="hidden md:flex items-center gap-1.5 sm:gap-2 text-xs uppercase text-gray-400 dark:text-gray-500 mb-2 sm:mb-3 flex-wrap"
    >
      <span>{{ selectedCategory }}</span>
      <ChevronRight class="w-3 h-3" />
      <span>{{ selectedYear }}</span>
      <ChevronRight class="w-3 h-3" />
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ selectedPdfTitle }}</span>
    </div>

    <!-- Controls Row -->
    <div class="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
      <div class="flex items-center gap-2">
        <!-- Toggle Sidebar Button -->
        <button
          class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-1 focus:ring-primary-600"
          aria-label="Toggle sidebar"
          @click="$emit('toggleSidebar')"
        >
          <X v-if="isSidebarOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>

        <h2
          class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2"
        >
          <component
            :is="subjectIcon"
            class="w-5 h-5 shrink-0 text-primary-600 dark:text-primary-400"
          />
          {{ selectedPdfTitle }}
        </h2>
      </div>

      <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <!-- Page Navigation -->
        <div class="hidden md:flex items-center border border-gray-200 dark:border-gray-800">
          <button
            :disabled="!canGoPrevious"
            class="px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title="Previous PDF (←)"
            @click="$emit('previousPdf')"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <span
            class="px-2 text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300 min-w-[5rem] text-center whitespace-nowrap border-x border-gray-200 dark:border-gray-800 self-stretch flex items-center justify-center"
          >
            {{ currentPdfIndex + 1 }} / {{ totalPdfsCount }}
          </span>
          <button
            :disabled="!canGoNext"
            class="px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title="Next PDF (→)"
            @click="$emit('nextPdf')"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>

        <!-- Zoom Controls -->
        <div class="hidden md:flex items-center border border-gray-200 dark:border-gray-800">
          <button
            class="px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Zoom Out"
            @click="$emit('zoomOut')"
          >
            <ZoomOut class="w-5 h-5" />
          </button>
          <span
            class="px-2 text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300 min-w-[3.5rem] text-center border-x border-gray-200 dark:border-gray-800 self-stretch flex items-center justify-center"
          >
            {{ zoomPercent }}%
          </span>
          <button
            class="px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Zoom In"
            @click="$emit('zoomIn')"
          >
            <ZoomIn class="w-5 h-5" />
          </button>
        </div>

        <!-- Download Button -->
        <button
          class="px-3 py-2 bg-primary-600 text-white text-sm hover:bg-primary-700 transition-colors flex items-center gap-1.5"
          title="Download"
          @click="$emit('download')"
        >
          <Download class="w-4 h-4" />
          <span class="hidden sm:inline">ទាញយក</span>
        </button>

        <!-- Actions Dropdown -->
        <HeaderActionsDropdown
          :is-dark="isDark"
          :is-comparison-mode="isComparisonMode"
          @toggle-comparison="$emit('toggleComparison')"
          @toggle-fullscreen="$emit('toggleFullscreen')"
          @print="$emit('print')"
          @show-keyboard-shortcuts="$emit('showKeyboardShortcuts')"
          @toggle-dark-mode="$emit('toggleDarkMode')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronRight, ChevronLeft, X, Menu, ZoomIn, ZoomOut, Download } from '@lucide/vue'
import { getSubjectIcon } from '../../constants/icons'
import HeaderActionsDropdown from './HeaderActionsDropdown.vue'

const props = defineProps({
  selectedCategory: String,
  selectedYear: String,
  selectedPdfTitle: String,
  isSidebarOpen: Boolean,
  currentPdfIndex: Number,
  totalPdfsCount: Number,
  canGoPrevious: Boolean,
  canGoNext: Boolean,
  zoomLevel: Number,
  isDark: Boolean,
  isComparisonMode: Boolean
})

const zoomPercent = computed(() => Math.round(props.zoomLevel * 100))
const subjectIcon = computed(() => getSubjectIcon(props.selectedPdfTitle))

defineEmits([
  'toggleSidebar',
  'previousPdf',
  'nextPdf',
  'showKeyboardShortcuts',
  'toggleComparison',
  'zoomIn',
  'zoomOut',
  'toggleFullscreen',
  'print',
  'download',
  'toggleDarkMode'
])
</script>
