<script setup>
import { onMounted, shallowRef } from 'vue'
import { Search, X } from '@lucide/vue'

const search = defineModel({ type: String, default: '' })

// The `/` shortcut only exists with a physical keyboard, so don't advertise it on
// touch screens. Added after mount because the server can't know the device.
const placeholder = shallowRef('ស្វែងរក...')

onMounted(() => {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    placeholder.value = 'ស្វែងរក... ( / )'
  }
})
</script>

<template>
  <div class="mb-6 relative">
    <Search class="w-4 h-4 absolute left-0 top-3 text-gray-400 dark:text-gray-500" />
    <input
      v-model="search"
      type="text"
      enterkeyhint="search"
      aria-label="ស្វែងរកឯកសារ"
      :placeholder="placeholder"
      class="w-full py-2.5 pl-7 pr-10 bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 text-base lg:text-sm transition-colors"
      @keydown.escape="search = ''"
    />
    <button
      v-if="search"
      class="absolute -right-3 top-0 p-3.5 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      aria-label="សម្អាតការស្វែងរក"
      @click="search = ''"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>
