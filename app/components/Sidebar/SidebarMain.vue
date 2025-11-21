<template>
  <div
    :class="[
      'bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl overflow-y-auto transition-all duration-300 ease-in-out z-40 border-r border-gray-200 dark:border-gray-700',
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
            <div class="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
          <!-- Compact Mode Toggle -->
          <button
            @click="$emit('toggleCompactMode')"
            :class="[
              'p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500',
              isCompactMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            ]"
            title="Toggle compact mode"
          >
            <svg v-if="isCompactMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
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

      <!-- Recently Viewed -->
      <RecentlyViewed
        :items="recentlyViewed"
        :searchQuery="searchQuery"
        @select="handleRecentSelect"
        @clear="$emit('clearRecentlyViewed')"
      />

      <!-- Favorites List -->
      <FavoritesList
        v-if="!searchQuery"
        :favorites="favorites"
        :selectedPdf="selectedPdf"
        :isCompactMode="isCompactMode"
        @selectPdf="handleFavoriteSelect"
        @removeFavorite="$emit('removeFavorite', $event)"
        @clearFavorites="$emit('clearFavorites')"
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
import SearchBar from './SearchBar.vue'
import RecentlyViewed from './RecentlyViewed.vue'
import FavoritesList from './FavoritesList.vue'
import CategoryList from './CategoryList.vue'

const props = defineProps({
  isOpen: Boolean,
  isDesktop: Boolean,
  isCompactMode: Boolean,
  searchQuery: String,
  recentlyViewed: Array,
  favorites: Array,
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
  'clearRecentlyViewed',
  'removeFavorite',
  'clearFavorites',
  'closeSidebar'
])

const isSearchFocused = ref(false)

function handleSelectPdf(subject, category, year) {
  emit('selectPdf', subject, category, year)
  if (!props.isDesktop) {
    emit('closeSidebar')
  }
}

function handleRecentSelect(item) {
  emit('selectPdf', item, item.category, item.year, true)
  if (!props.isDesktop) {
    emit('closeSidebar')
  }
}

function handleFavoriteSelect(favorite) {
  emit('selectPdf', { pdf: favorite.pdf, label: favorite.label }, favorite.category, favorite.year, true)
  if (!props.isDesktop) {
    emit('closeSidebar')
  }
}
</script>
