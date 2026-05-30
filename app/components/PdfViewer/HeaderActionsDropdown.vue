<template>
  <div class="relative" ref="dropdownRef">
    <!-- Dropdown Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      class="px-3 py-1.5 bg-gray-600 dark:bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5"
      :aria-expanded="isOpen"
      aria-label="បើកម៉ឺនុយសកម្មភាព"
    >
      <EllipsisVertical class="w-4 h-4" />
      <span class="hidden sm:inline">សកម្មភាព</span>
      <ChevronDown class="w-3 h-3 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
      >
        <div class="py-1" role="menu">
          <!-- Comparison Mode -->
          <button
            @click="handleAction('toggleComparison')"
            :class="[
              'w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors',
              isComparisonMode
                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            role="menuitem"
          >
            <Columns2 class="w-5 h-5 flex-shrink-0" />
            <span class="flex-1">{{ isComparisonMode ? 'បិទការប្រៀបធៀប' : 'ប្រៀបធៀបឯកសារ' }}</span>
            <span v-if="isComparisonMode" class="text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded">កំពុងប្រើ</span>
          </button>

          <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>

          <!-- Fullscreen -->
          <button
            @click="handleAction('toggleFullscreen')"
            class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
            role="menuitem"
          >
            <Maximize class="w-5 h-5 flex-shrink-0" />
            <span>ពេញអេក្រង់</span>
          </button>

          <!-- Print -->
          <button
            @click="handleAction('print')"
            class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
            role="menuitem"
          >
            <Printer class="w-5 h-5 flex-shrink-0" />
            <span>បោះពុម្ពឯកសារ</span>
          </button>

          <!-- Keyboard Shortcuts -->
          <button
            @click="handleAction('showKeyboardShortcuts')"
            class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
            role="menuitem"
          >
            <CircleHelp class="w-5 h-5 flex-shrink-0" />
            <span>គ្លីដកាត់</span>
          </button>

          <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>

          <!-- Dark Mode Toggle -->
          <button
            @click="handleAction('toggleDarkMode')"
            class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
            role="menuitem"
          >
            <Sun v-if="isDark" class="w-5 h-5 flex-shrink-0 text-yellow-500" />
            <Moon v-else class="w-5 h-5 flex-shrink-0" />
            <span>{{ isDark ? 'ពន្លឺថ្ងៃ' : 'ពន្លឺយប់' }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { EllipsisVertical, ChevronDown, Columns2, Maximize, Printer, CircleHelp, Sun, Moon } from '@lucide/vue'

const props = defineProps({
  isDark: Boolean,
  isComparisonMode: Boolean
})

const emit = defineEmits([
  'toggleComparison',
  'toggleFullscreen',
  'print',
  'showKeyboardShortcuts',
  'toggleDarkMode'
])

const isOpen = ref(false)
const dropdownRef = ref(null)

function handleAction(action) {
  emit(action)
  isOpen.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

// Close dropdown on escape key
function handleEscapeKey(event) {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>
