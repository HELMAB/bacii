<script setup>
import { X, Rows2, Rows4 } from '@lucide/vue'
import SearchBar from './SearchBar.vue'
import CategoryList from './CategoryList.vue'
import PeaceBanner from '../PeaceBanner.vue'
import AppFooter from '../AppFooter.vue'

const props = defineProps({
  isOpen: Boolean,
  isDesktop: Boolean,
  isCompactMode: Boolean,
  searchQuery: String,
  filteredData: Array,
  expandedCategories: Object,
  expandedYears: Object,
  selectedPdf: String
})

const emit = defineEmits([
  'update:searchQuery',
  'toggleCompactMode',
  'toggleCategory',
  'toggleYear',
  'selectPdf',
  'closeSidebar'
])

function handleSelectPdf(subject, category, year) {
  emit('selectPdf', subject, category, year)
  // On mobile the sidebar overlays the reader, so close it after picking.
  if (!props.isDesktop) {
    emit('closeSidebar')
  }
}
</script>

<template>
  <aside
    :class="[
      isDesktop
        ? [
            'relative shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
            isOpen ? 'w-80 sm:w-96' : 'w-0'
          ]
        : [
            'fixed inset-y-0 left-0 z-50 w-80 sm:w-96 transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          ]
    ]"
  >
    <div
      class="flex flex-col h-full w-80 sm:w-96 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800"
    >
      <!-- Header -->
      <div
        class="shrink-0 flex items-center justify-between px-6 h-14 border-b border-gray-200 dark:border-gray-800"
      >
        <h2 class="text-xs font-bold uppercase text-gray-900 dark:text-white">ឯកសារប្រឡង</h2>
        <div class="flex items-center gap-1">
          <!-- Compact Mode Toggle -->
          <button
            :class="[
              'p-1.5 transition-colors',
              isCompactMode
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            ]"
            title="Toggle compact mode"
            @click="$emit('toggleCompactMode')"
          >
            <Rows2 v-if="isCompactMode" class="w-5 h-5" />
            <Rows4 v-else class="w-5 h-5" />
          </button>
          <!-- Close sidebar -->
          <button
            class="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Close navigation"
            @click="$emit('closeSidebar')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Scrollable nav -->
      <div class="flex-1 overflow-y-auto px-6 pt-5 pb-6">
        <SearchBar
          :model-value="searchQuery"
          @update:model-value="$emit('update:searchQuery', $event)"
        />

        <CategoryList
          :categories="filteredData"
          :expanded-categories="expandedCategories"
          :expanded-years="expandedYears"
          :selected-pdf="selectedPdf"
          :search-query="searchQuery"
          :is-compact-mode="isCompactMode"
          @toggle-category="$emit('toggleCategory', $event)"
          @toggle-year="$emit('toggleYear', $event)"
          @select-pdf="handleSelectPdf"
        />
      </div>

      <!-- Pinned chrome -->
      <div class="shrink-0">
        <PeaceBanner />
        <AppFooter />
      </div>
    </div>
  </aside>
</template>
