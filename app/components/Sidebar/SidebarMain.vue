<template>
  <div
    :class="[
      'bg-white dark:bg-gray-950 overflow-y-auto transition-all duration-300 ease-in-out z-40 border-r border-gray-200 dark:border-gray-800',
      isDesktop ? 'relative' : 'fixed inset-y-0 left-0',
      isOpen ? 'w-80 md:w-96' : 'w-0',
      !isDesktop && isOpen ? 'translate-x-0' : !isDesktop ? '-translate-x-full' : ''
    ]"
  >
    <div class="p-6">
      <!-- Header -->
      <div
        class="flex items-center justify-between pb-5 mb-5 border-b border-gray-200 dark:border-gray-800"
      >
        <h2 class="text-xs font-bold uppercase text-gray-900 dark:text-white">ឯកសារប្រឡង</h2>
        <!-- Compact Mode Toggle -->
        <button
          :class="[
            'hidden md:flex p-1.5 transition-colors',
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
      </div>

      <!-- Search Bar -->
      <SearchBar
        :model-value="searchQuery"
        @update:model-value="$emit('update:searchQuery', $event)"
      />

      <!-- Category List -->
      <CategoryList
        :categories="filteredData"
        :expanded-categories="expandedCategories"
        :expanded-years="expandedYears"
        :selected-pdf="selectedPdf"
        :search-query="searchQuery"
        :is-compact-mode="isCompactMode"
        :is-desktop="isDesktop"
        @toggle-category="$emit('toggleCategory', $event)"
        @toggle-year="$emit('toggleYear', $event)"
        @select-pdf="handleSelectPdf"
      />
    </div>
  </div>
</template>

<script setup>
import { Rows2, Rows4 } from '@lucide/vue'
import SearchBar from './SearchBar.vue'
import CategoryList from './CategoryList.vue'

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
  if (!props.isDesktop) {
    emit('closeSidebar')
  }
}
</script>
