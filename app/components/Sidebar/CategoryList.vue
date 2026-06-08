<template>
  <div
    v-for="category in categories"
    :key="category.label"
    :class="[isCompactMode ? 'mb-2' : 'mb-5']"
  >
    <!-- Category -->
    <div>
      <button
        :class="[
          'flex items-center gap-2 w-full text-left font-bold uppercase text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors',
          isCompactMode ? 'text-[11px] py-1.5' : 'text-xs py-2'
        ]"
        @click="$emit('toggleCategory', category.label)"
      >
        <ChevronRight
          :class="[
            'shrink-0 transition-transform duration-200',
            expandedCategories[category.label] ? 'rotate-90' : '',
            isCompactMode ? 'w-3.5 h-3.5' : 'w-4 h-4'
          ]"
        />
        <span>{{ category.label }}</span>
      </button>

      <!-- Years -->
      <div
        v-if="expandedCategories[category.label]"
        :class="[isCompactMode ? 'mt-1 ml-3 space-y-0.5' : 'mt-1.5 ml-4 space-y-1']"
      >
        <div v-for="year in category.children" :key="year.label">
          <button
            :class="[
              'flex items-center gap-2 w-full text-left text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors',
              isCompactMode ? 'text-xs py-1' : 'text-sm py-1.5'
            ]"
            @click="$emit('toggleYear', year.label)"
          >
            <ChevronRight
              :class="[
                'shrink-0 transition-transform duration-200',
                expandedYears[year.label] ? 'rotate-90' : '',
                isCompactMode ? 'w-3 h-3' : 'w-3.5 h-3.5'
              ]"
            />
            <span class="flex-1">{{ year.label }}</span>
            <span
              class="shrink-0 text-[11px] font-semibold tabular-nums text-gray-400 dark:text-gray-500"
            >
              {{ extractYear(year.label) }}
            </span>
          </button>

          <!-- Subjects -->
          <div v-if="expandedYears[year.label]" :class="[isCompactMode ? 'ml-3' : 'ml-4']">
            <button
              v-for="subject in year.children"
              :key="subject.label"
              :class="[
                'flex items-center w-full text-left border-l transition-colors duration-150',
                isCompactMode ? 'text-xs py-1 px-3' : 'text-sm py-1.5 px-3',
                selectedPdf === subject.pdf
                  ? 'border-l-2 border-primary-600 bg-gray-50 dark:bg-gray-900 text-primary-700 dark:text-primary-300 font-semibold'
                  : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100'
              ]"
              @click="$emit('selectPdf', subject, category.label, year.label)"
            >
              <span>{{ subject.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- No Results -->
  <div v-if="searchQuery && categories.length === 0" class="text-center py-12">
    <SearchX class="w-9 h-9 mx-auto text-gray-300 dark:text-gray-700 mb-3" :stroke-width="1.5" />
    <p class="text-sm text-gray-500 dark:text-gray-400">រកមិនឃើញលទ្ធផល</p>
  </div>
</template>

<script setup>
import { ChevronRight, SearchX } from '@lucide/vue'
import { extractYear } from '../../utils/helpers'

defineProps({
  categories: Array,
  expandedCategories: Object,
  expandedYears: Object,
  selectedPdf: String,
  searchQuery: String,
  isCompactMode: Boolean
})

defineEmits(['toggleCategory', 'toggleYear', 'selectPdf'])
</script>
