<script setup>
import SearchBar from './SearchBar.vue'
import CategoryList from './CategoryList.vue'
import OfflineDownload from './OfflineDownload.vue'
import DisclaimerNotice from './DisclaimerNotice.vue'
import PeaceBanner from '../PeaceBanner.vue'
import AppFooter from '../AppFooter.vue'

const props = defineProps({
  isOpen: Boolean,
  isDesktop: Boolean,
  isCompactMode: Boolean,
  searchQuery: String,
  data: Array,
  filteredData: Array,
  expandedCategories: Object,
  expandedYears: Object,
  selectedPdf: String
})

const emit = defineEmits([
  'update:searchQuery',
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
            'fixed inset-y-0 left-0 z-50 w-80 sm:w-96 max-w-[85vw] transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          ]
    ]"
  >
    <div
      class="flex flex-col h-full w-full lg:w-96 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800"
    >
      <!-- Header -->
      <div
        class="shrink-0 flex items-center px-6 h-14 border-b border-gray-200 dark:border-gray-800"
      >
        <h2 class="text-xs font-bold uppercase text-gray-900 dark:text-white">ឯកសារប្រឡង</h2>
      </div>

      <!--
        Desktop: the nav scrolls on its own above the pinned chrome.
        Mobile: everything scrolls together so the chrome can't squeeze the nav on
        short screens, with the offline download kept stuck to the bottom.
      -->
      <div class="flex-1 min-h-0 overflow-y-auto lg:flex lg:flex-col lg:overflow-hidden">
        <div class="px-6 pt-5 pb-6 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
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

        <OfflineDownload class="sticky bottom-0 z-10 lg:static" :data="data" />
        <DisclaimerNotice />
        <PeaceBanner />
        <AppFooter class="shrink-0" />
      </div>
    </div>
  </aside>
</template>
