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

        <!-- Favorite Button -->
        <button
          @click="$emit('toggleFavorite')"
          :class="[
            'px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1',
            isFavorite
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600'
          ]"
          :title="isFavorite ? 'លុបចេញពីចំណូលចិត្ត' : 'បន្ថែមទៅចំណូលចិត្ត'"
        >
          <svg v-if="isFavorite" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span class="hidden sm:inline">{{ isFavorite ? 'ចូលចិត្ត' : 'ចំណូលចិត្ត' }}</span>
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
  isComparisonMode: Boolean,
  isFavorite: Boolean
})

defineEmits([
  'toggleSidebar',
  'previousPdf',
  'nextPdf',
  'showKeyboardShortcuts',
  'toggleFavorite',
  'toggleComparison',
  'zoomIn',
  'zoomOut',
  'toggleFullscreen',
  'print',
  'download',
  'toggleDarkMode'
])
</script>
