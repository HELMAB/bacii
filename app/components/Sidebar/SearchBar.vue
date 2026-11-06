<script setup>
import { onMounted, shallowRef, useTemplateRef } from 'vue'
import { Search, X } from '@lucide/vue'

const search = defineModel({ type: String, default: '' })
const input = useTemplateRef('input')

// The `/` shortcut only exists with a physical keyboard, so don't advertise it on
// touch screens. Added after mount because the server can't know the device.
const placeholder = shallowRef('មុខវិជ្ជា ឬឆ្នាំ…')

onMounted(() => {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    placeholder.value = 'មុខវិជ្ជា ឬឆ្នាំ… ( / )'
  }
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label for="doc-search" class="hidden lg:block text-sm font-bold text-fg-muted">ស្វែងរក</label>
    <div
      class="h-11 flex items-center gap-2 pl-3 bg-surface-raised border-2 border-line shadow-print-sm focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-active cursor-text"
      @click.self="input?.focus()"
    >
      <Search
        class="w-[18px] h-[18px] shrink-0 pointer-events-none"
        :stroke-width="2.4"
        aria-hidden="true"
      />
      <!-- type="text": the / shortcut in useKeyboardShortcuts looks for it -->
      <input
        id="doc-search"
        ref="input"
        v-model="search"
        type="text"
        enterkeyhint="search"
        autocomplete="off"
        aria-label="ស្វែងរកឯកសារ"
        :placeholder="placeholder"
        class="flex-1 min-w-0 h-full bg-transparent border-0 text-base text-fg placeholder:text-fg-faint focus:outline-none focus-visible:outline-none"
        @keydown.escape="search = ''"
      />
      <button
        v-if="search"
        type="button"
        class="grid place-items-center w-11 h-full shrink-0 hover:bg-highlight/25 transition-colors"
        aria-label="សម្អាតការស្វែងរក"
        @click="search = ''"
      >
        <X class="w-4 h-4" :stroke-width="2.6" aria-hidden="true" />
      </button>
      <span v-else class="w-3 shrink-0" aria-hidden="true"></span>
    </div>
  </div>
</template>
