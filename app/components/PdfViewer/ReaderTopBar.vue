<script setup>
import { computed } from 'vue'
import { Menu, ZoomIn, ZoomOut, Download, Sun, Moon } from '@lucide/vue'
import { getSubjectIcon } from '../../constants/icons'
import HeaderActionsDropdown from './HeaderActionsDropdown.vue'

const props = defineProps({
  hasPdf: Boolean,
  selectedYear: String,
  selectedPdfTitle: String,
  zoomLevel: Number,
  isDark: Boolean,
  isComparisonMode: Boolean
})

defineEmits([
  'toggleDrawer',
  'showKeyboardShortcuts',
  'toggleComparison',
  'zoomIn',
  'zoomOut',
  'toggleFullscreen',
  'print',
  'download',
  'toggleDarkMode'
])

const zoomPercent = computed(() => Math.round(props.zoomLevel * 100))
const subjectIcon = computed(() => getSubjectIcon(props.selectedPdfTitle))
</script>

<template>
  <header
    class="relative z-30 shrink-0 h-14 flex items-center gap-2 px-2 sm:px-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800"
  >
    <!-- Drawer toggle -->
    <button
      class="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-1 focus:ring-primary-600"
      aria-label="Open navigation"
      @click="$emit('toggleDrawer')"
    >
      <Menu class="w-5 h-5" />
    </button>

    <!-- Title / brand -->
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <template v-if="hasPdf">
        <component
          :is="subjectIcon"
          class="w-5 h-5 shrink-0 text-primary-600 dark:text-primary-400"
        />
        <h1 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
          {{ selectedPdfTitle }}
        </h1>
        <span
          class="hidden sm:inline shrink-0 text-xs tabular-nums uppercase text-gray-400 dark:text-gray-500"
        >
          {{ selectedYear }}
        </span>
      </template>
      <span v-else class="text-sm font-bold uppercase text-gray-900 dark:text-white">Dobpi</span>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-1 sm:gap-1.5">
      <!-- Zoom -->
      <div
        v-if="hasPdf"
        class="hidden sm:flex items-center border border-gray-200 dark:border-gray-800"
      >
        <button
          class="px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Zoom Out"
          @click="$emit('zoomOut')"
        >
          <ZoomOut class="w-4 h-4" />
        </button>
        <span
          class="px-1.5 text-xs font-medium tabular-nums text-gray-700 dark:text-gray-300 min-w-[3rem] text-center border-x border-gray-200 dark:border-gray-800 self-stretch flex items-center justify-center"
        >
          {{ zoomPercent }}%
        </span>
        <button
          class="px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Zoom In"
          @click="$emit('zoomIn')"
        >
          <ZoomIn class="w-4 h-4" />
        </button>
      </div>

      <!-- Theme toggle (always available) -->
      <button
        class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :title="isDark ? 'Light mode' : 'Dark mode'"
        @click="$emit('toggleDarkMode')"
      >
        <Sun v-if="isDark" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
      </button>

      <!-- Download -->
      <button
        v-if="hasPdf"
        class="px-3 py-2 bg-primary-600 text-white text-sm hover:bg-primary-700 transition-colors flex items-center gap-1.5"
        title="Download"
        @click="$emit('download')"
      >
        <Download class="w-4 h-4" />
        <span class="hidden md:inline">ទាញយក</span>
      </button>

      <!-- Actions -->
      <HeaderActionsDropdown
        v-if="hasPdf"
        :is-dark="isDark"
        :is-comparison-mode="isComparisonMode"
        @toggle-comparison="$emit('toggleComparison')"
        @toggle-fullscreen="$emit('toggleFullscreen')"
        @print="$emit('print')"
        @show-keyboard-shortcuts="$emit('showKeyboardShortcuts')"
        @toggle-dark-mode="$emit('toggleDarkMode')"
      />
    </div>
  </header>
</template>
