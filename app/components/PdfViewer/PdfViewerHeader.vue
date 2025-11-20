<template>
  <div class="bg-white dark:bg-gray-800 px-4 py-3 shadow mx-2 sm:mx-4 mb-2 rounded-lg">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3 flex-wrap">
      <span>{{ selectedCategory }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span>{{ selectedYear }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span class="font-semibold text-blue-600 dark:text-blue-400">{{ selectedPdfTitle }}</span>
    </div>

    <!-- Controls Row -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <!-- Toggle Sidebar Button -->
        <button
          @click="$emit('toggleSidebar')"
          class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle sidebar"
        >
          <svg v-if="isSidebarOpen" class="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span class="text-2xl">{{ getSubjectIcon(selectedPdfTitle) }}</span>
          {{ selectedPdfTitle }}
        </h2>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- Page Navigation -->
        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            @click="$emit('previousPdf')"
            :disabled="!canGoPrevious"
            class="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous PDF (←)"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
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
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Keyboard Shortcuts Button -->
        <button
          @click="$emit('showKeyboardShortcuts')"
          class="px-3 py-1.5 bg-gray-600 dark:bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors flex items-center gap-1"
          title="Keyboard shortcuts (?)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="hidden sm:inline">គ្លីដ</span>
        </button>

        <!-- Zoom Controls -->
        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            @click="$emit('zoomOut')"
            class="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="Zoom Out"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <span class="px-2 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-center">{{ Math.round(zoomLevel * 100) }}%</span>
          <button
            @click="$emit('zoomIn')"
            class="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="Zoom In"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
        </div>

        <!-- Fullscreen Button -->
        <button
          @click="$emit('toggleFullscreen')"
          class="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
          title="Fullscreen"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span class="hidden sm:inline">ពេញអេក្រង់</span>
        </button>

        <!-- Print Button -->
        <button
          @click="$emit('print')"
          class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
          title="Print"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span class="hidden sm:inline">បោះពុម្ព</span>
        </button>

        <!-- Download Button -->
        <button
          @click="$emit('download')"
          class="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
          title="Download"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span class="hidden sm:inline">ទាញយក</span>
        </button>

        <!-- Dark Mode Toggle Button -->
        <button
          @click="$emit('toggleDarkMode')"
          class="px-3 py-1.5 bg-gray-700 dark:bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors flex items-center gap-1"
          aria-label="Toggle dark mode"
          title="Toggle theme"
        >
          <svg v-if="isDark" class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span class="hidden sm:inline">ពន្លឺ</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getSubjectIcon } from '../../constants/icons'

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
  isDark: Boolean
})

defineEmits([
  'toggleSidebar',
  'previousPdf',
  'nextPdf',
  'showKeyboardShortcuts',
  'zoomIn',
  'zoomOut',
  'toggleFullscreen',
  'print',
  'download',
  'toggleDarkMode'
])
</script>
