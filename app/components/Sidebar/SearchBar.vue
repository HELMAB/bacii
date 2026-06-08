<script setup>
import { Search, X } from '@lucide/vue'

const search = defineModel({ type: String, default: '' })
</script>

<template>
  <div class="mb-6 relative">
    <Search class="w-4 h-4 absolute left-0 top-3 text-gray-400 dark:text-gray-500" />
    <input
      v-model="search"
      type="text"
      placeholder="ស្វែងរក... ( / )"
      class="w-full py-2.5 pl-7 pr-7 bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-sm transition-colors"
      @keydown.escape="search = ''"
    />
    <button
      v-if="search"
      class="absolute right-0 top-3 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      @click="search = ''"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>
