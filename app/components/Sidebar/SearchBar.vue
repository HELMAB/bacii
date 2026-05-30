<template>
  <div class="mb-4 relative">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.escape="$emit('update:modelValue', '')"
      type="text"
      placeholder="ស្វែងរកមុខវិជ្ជា... (ចុច / ដើម្បីស្វែងរក)"
      class="w-full px-4 py-2 pl-10 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
      @focus="$emit('update:focused', true)"
      @blur="$emit('update:focused', false)"
    />
    <Search class="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
    <button
      v-if="modelValue"
      @click="$emit('update:modelValue', '')"
      class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { Search, X } from '@lucide/vue'

defineProps({
  modelValue: String,
  focused: Boolean
})

defineEmits(['update:modelValue', 'update:focused'])
</script>
