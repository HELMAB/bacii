<template>
  <div class="bg-white dark:bg-gray-800 px-2 py-2 sm:px-4 sm:py-3 shadow mx-2 sm:mx-4 mb-2 rounded-lg">
    <!-- Breadcrumb -->
    <div class="hidden md:flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 flex-wrap">
      <span>{{ selectedCategory }}</span>
      <ChevronRight class="w-3 h-3 sm:w-4 sm:h-4" />
      <span>{{ selectedYear }}</span>
      <ChevronRight class="w-3 h-3 sm:w-4 sm:h-4" />
      <span class="font-semibold text-primary-600 dark:text-primary-400">{{ selectedPdfTitle }}</span>
    </div>

    <!-- Controls Row -->
    <div class="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
      <div class="flex items-center gap-2">
        <!-- Toggle Sidebar Button -->
        <button
          @click="$emit('toggleSidebar')"
          class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Toggle sidebar"
        >
          <X v-if="isSidebarOpen" class="w-5 h-5 text-gray-800 dark:text-gray-200" />
          <Menu v-else class="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>

        <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span class="text-2xl">{{ getSubjectIcon(selectedPdfTitle) }}</span>
          {{ selectedPdfTitle }}
        </h2>
      </div>

      <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <!-- Page Navigation -->
        <div class="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            @click="$emit('previousPdf')"
            :disabled="!canGoPrevious"
            class="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous PDF (←)"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <span class="px-2 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[5rem] text-center whitespace-nowrap">
            {{ currentPdfIndex + 1 }} / {{ totalPdfsCount }}
          </span>
          <button
            @click="$emit('nextPdf')"
            :disabled="!canGoNext"
            class="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next PDF (→)"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>

        <!-- Zoom Controls -->
        <div class="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            @click="$emit('zoomOut')"
            class="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut class="w-5 h-5" />
          </button>
          <span class="px-2 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-center">{{ Math.round(zoomLevel * 100) }}%</span>
          <button
            @click="$emit('zoomIn')"
            class="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn class="w-5 h-5" />
          </button>
        </div>

        <!-- Download Button -->
        <button
          @click="$emit('download')"
          class="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
          title="Download"
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
import { ChevronRight, ChevronLeft, X, Menu, ZoomIn, ZoomOut, Download } from '@lucide/vue'
import { getSubjectIcon } from '../../constants/icons'
import HeaderActionsDropdown from './HeaderActionsDropdown.vue'

defineProps({
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
