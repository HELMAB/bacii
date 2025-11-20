<template>
  <div v-if="items.length > 0 && !searchQuery" class="mb-4">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 uppercase tracking-wide">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        មើលថ្មីៗ
      </h3>
      <button
        @click="$emit('clear')"
        class="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center gap-1"
        title="Clear recent history"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        សម្អាត
      </button>
    </div>
    <div class="space-y-0.5">
      <button
        v-for="item in items.slice(0, 3)"
        :key="item.pdf"
        @click="$emit('select', item)"
        class="flex items-center w-full text-left text-sm py-1.5 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition-all"
      >
        <span class="mr-2 text-base">{{ getIcon(item.label) }}</span>
        <span class="truncate flex-1 text-sm">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { getSubjectIcon } from '../../constants/icons'

defineProps({
  items: Array,
  searchQuery: String
})

defineEmits(['select', 'clear'])

function getIcon(label) {
  return getSubjectIcon(label)
}
</script>
