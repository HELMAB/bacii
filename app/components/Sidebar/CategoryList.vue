<template>
  <div v-for="category in categories" :key="category.label" :class="['mb-4', isCompactMode ? 'mb-2' : 'mb-4']">
    <!-- Category -->
    <div>
      <button
        @click="$emit('toggleCategory', category.label)"
        :class="[
          'flex items-center justify-between w-full text-left font-bold text-base text-white transition-all rounded-lg hover:shadow-lg group focus:outline-none focus:ring-2 focus:ring-primary-500 bg-primary-600 hover:bg-primary-700',
          isCompactMode ? 'py-1.5 px-2.5 text-sm' : 'py-2 px-3'
        ]"
      >
        <span class="flex items-center gap-2">
          <span class="transform transition-transform duration-200" :class="expandedCategories[category.label] ? 'rotate-90' : ''">
            <ChevronRight :class="isCompactMode ? 'w-3.5 h-3.5' : 'w-4 h-4'" />
          </span>
          {{ category.label }}
        </span>
      </button>

      <!-- Years -->
      <div v-if="expandedCategories[category.label]" :class="[isCompactMode ? 'mt-1 ml-3 space-y-0.5' : 'mt-1.5 ml-4 space-y-1']">
        <div v-for="year in category.children" :key="year.label">
          <button
            @click="$emit('toggleYear', year.label)"
            :class="[
              'flex items-center justify-between w-full text-left font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all rounded-md hover:bg-primary-50 dark:hover:bg-gray-700/30 group focus:outline-none focus:ring-2 focus:ring-primary-500',
              isCompactMode ? 'text-xs py-1 px-2' : 'text-sm py-1.5 px-3'
            ]"
          >
            <span class="flex items-center gap-2">
              <span class="text-primary-500 dark:text-primary-400 text-xs transform transition-transform duration-200" :class="expandedYears[year.label] ? 'rotate-90' : ''">
                <ChevronRight :class="isCompactMode ? 'w-3 h-3' : 'w-3.5 h-3.5'" />
              </span>
              <span :class="['bg-primary-600 text-white text-xs rounded-full font-medium', isCompactMode ? 'px-1 py-0.5 text-[10px]' : 'px-1.5 py-0.5']">
                {{ extractYear(year.label) }}
              </span>
              <span :class="isCompactMode ? 'text-xs' : 'text-sm'">{{ year.label }}</span>
            </span>
          </button>

          <!-- Subjects -->
          <div v-if="expandedYears[year.label]" :class="[isCompactMode ? 'mt-0.5 ml-3 space-y-0' : 'mt-1 ml-4 space-y-0.5']">
            <button
              v-for="subject in year.children"
              :key="subject.label"
              @click="$emit('selectPdf', subject, category.label, year.label)"
              :class="[
                'flex items-center w-full text-left rounded-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500',
                isCompactMode ? 'text-xs py-1 px-2' : 'text-sm py-1.5 px-3',
                selectedPdf === subject.pdf
                  ? 'bg-primary-600 text-white shadow-md font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-primary-600 dark:hover:text-primary-400'
              ]"
            >
              <span :class="['transition-all', isCompactMode ? 'mr-1.5 text-sm' : 'mr-2 text-base']">
                {{ getSubjectIcon(subject.label) }}
              </span>
              <span :class="isCompactMode ? 'text-xs' : 'text-sm'">{{ subject.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- No Results -->
  <div v-if="searchQuery && categories.length === 0" class="text-center py-8">
    <SearchX class="w-16 h-16 mx-auto text-gray-400 mb-3" />
    <p class="text-gray-500 dark:text-gray-400">រកមិនឃើញលទ្ធផល</p>
  </div>
</template>

<script setup>
import { ChevronRight, SearchX } from '@lucide/vue'
import { getSubjectIcon } from '../../constants/icons'
import { extractYear } from '../../utils/helpers'

defineProps({
  categories: Array,
  expandedCategories: Object,
  expandedYears: Object,
  selectedPdf: String,
  searchQuery: String,
  isCompactMode: Boolean,
  isDesktop: Boolean
})

defineEmits(['toggleCategory', 'toggleYear', 'selectPdf'])
</script>
