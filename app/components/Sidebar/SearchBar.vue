<template>
  <div class="mb-6 relative">
    <Search class="w-4 h-4 absolute left-0 top-3 text-gray-400 dark:text-gray-500" />
    <input
      :value="modelValue"
      type="text"
      placeholder="ស្វែងរក... ( / )"
      class="w-full py-2.5 pl-7 pr-7 bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-sm transition-colors"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.escape="$emit('update:modelValue', '')"
      @focus="$emit('update:focused', true)"
      @blur="$emit('update:focused', false)"
    />
    <button
      v-if="modelValue"
      class="absolute right-0 top-3 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      @click="$emit('update:modelValue', '')"
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
