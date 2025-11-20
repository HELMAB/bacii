<template>
  <div class="mb-4 relative">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.escape="$emit('update:modelValue', '')"
      type="text"
      placeholder="ស្វែងរកមុខវិជ្ជា... (ចុច / ដើម្បីស្វែងរក)"
      class="w-full px-4 py-2 pl-10 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
      @focus="$emit('update:focused', true)"
      @blur="$emit('update:focused', false)"
    />
    <svg class="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <button
      v-if="modelValue"
      @click="$emit('update:modelValue', '')"
      class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  focused: Boolean
})

defineEmits(['update:modelValue', 'update:focused'])
</script>
