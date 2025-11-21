<template>
  <div :class="['mb-4', isCompactMode ? 'mb-2' : 'mb-4']">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <h3 :class="['font-bold text-gray-800 dark:text-gray-200', isCompactMode ? 'text-sm' : 'text-base']">
        ⭐ ចំណូលចិត្ត
      </h3>
      <button
        v-if="favorites.length > 0"
        @click="$emit('clearFavorites')"
        :class="[
          'text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors',
          isCompactMode ? 'text-[10px]' : 'text-xs'
        ]"
        title="សម្អាតចំណូលចិត្តទាំងអស់"
      >
        សម្អាត
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="favorites.length === 0"
      :class="[
        'text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg',
        isCompactMode ? 'py-3 px-2' : 'py-4 px-3'
      ]"
    >
      <svg :class="['mx-auto mb-2 text-gray-400', isCompactMode ? 'w-8 h-8' : 'w-10 h-10']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      <p :class="[isCompactMode ? 'text-xs' : 'text-sm']">
        មិនទាន់មានឯកសារចំណូលចិត្ត
      </p>
    </div>

    <!-- Favorites List -->
    <div v-else :class="['space-y-1', isCompactMode ? 'space-y-0.5' : 'space-y-1']">
      <button
        v-for="favorite in favorites"
        :key="favorite.pdf"
        @click="$emit('selectPdf', favorite)"
        :class="[
          'w-full flex items-center gap-2 rounded-lg transition-all group relative',
          isCompactMode ? 'text-xs py-1 px-2' : 'text-sm py-2 px-3',
          selectedPdf === favorite.pdf
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 dark:hover:from-yellow-900/30 dark:hover:to-orange-900/30'
        ]"
      >
        <!-- Icon -->
        <span :class="[isCompactMode ? 'text-base' : 'text-lg']">
          {{ getSubjectIcon(favorite.label) }}
        </span>

        <!-- Content -->
        <div class="flex-1 text-left min-w-0">
          <div :class="['font-medium truncate', isCompactMode ? 'text-xs' : 'text-sm']">
            {{ favorite.label }}
          </div>
          <div :class="['opacity-80 truncate', isCompactMode ? 'text-[10px]' : 'text-xs']">
            {{ favorite.year }}
          </div>
        </div>

        <!-- Remove Button -->
        <button
          @click.stop="$emit('removeFavorite', favorite.pdf)"
          :class="[
            'opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10',
            selectedPdf === favorite.pdf ? 'text-white' : 'text-red-500'
          ]"
          title="លុបចេញពីចំណូលចិត្ត"
        >
          <svg :class="[isCompactMode ? 'w-3.5 h-3.5' : 'w-4 h-4']" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </button>
    </div>
  </div>
</template>

<script setup>
import { getSubjectIcon } from '../../constants/icons'

defineProps({
  favorites: Array,
  selectedPdf: String,
  isCompactMode: Boolean
})

defineEmits(['selectPdf', 'removeFavorite', 'clearFavorites'])
</script>
