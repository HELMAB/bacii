<template>
  <div
    :class="[
      'bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto transition-all duration-300 ease-in-out z-40 border-r border-gray-200 dark:border-gray-700',
      isDesktop ? 'relative' : 'fixed inset-y-0 left-0',
      isOpen ? 'w-80 md:w-96' : 'w-0',
      !isDesktop && isOpen ? 'translate-x-0' : (!isDesktop ? '-translate-x-full' : '')
    ]"
  >
    <div class="p-6">
      <!-- Header -->
      <div class="mb-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-1">ឯកសារប្រឡង</h2>
            <div class="h-1 w-16 bg-primary-600 rounded-full"></div>
          </div>
          <!-- Compact Mode Toggle -->
          <button
            @click="$emit('toggleCompactMode')"
            :class="[
              'hidden md:block p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500',
              isCompactMode
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            ]"
            title="Toggle compact mode"
          >
            <Rows2 v-if="isCompactMode" class="w-5 h-5" />
            <Rows4 v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <SearchBar
        :modelValue="searchQuery"
        :focused="isSearchFocused"
        @update:modelValue="$emit('update:searchQuery', $event)"
        @update:focused="isSearchFocused = $event"
      />

      <!-- Category List -->
      <CategoryList
        :categories="filteredData"
        :expandedCategories="expandedCategories"
        :expandedYears="expandedYears"
        :selectedPdf="selectedPdf"
        :searchQuery="searchQuery"
        :isCompactMode="isCompactMode"
        :isDesktop="isDesktop"
        @toggleCategory="$emit('toggleCategory', $event)"
        @toggleYear="$emit('toggleYear', $event)"
        @selectPdf="handleSelectPdf"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

const isSearchFocused = ref(false)

function handleSelectPdf(subject, category, year) {
  emit('selectPdf', subject, category, year)
  if (!props.isDesktop) {
    emit('closeSidebar')
  }
}
</script>
