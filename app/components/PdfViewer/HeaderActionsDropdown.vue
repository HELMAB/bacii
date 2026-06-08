<template>
  <div ref="dropdownRef" class="relative">
    <!-- Dropdown Toggle Button -->
    <button
      class="px-3 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
      :aria-expanded="isOpen"
      aria-label="បើកម៉ឺនុយសកម្មភាព"
      @click="isOpen = !isOpen"
    >
      <EllipsisVertical class="w-4 h-4" />
      <span class="hidden sm:inline">សកម្មភាព</span>
      <ChevronDown class="w-3 h-3 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 -translate-y-1"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-1 w-56 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 z-50"
      >
        <div class="py-1" role="menu">
          <!-- Comparison Mode -->
          <button
            :class="[
              'w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors',
              isComparisonMode
                ? 'bg-gray-50 dark:bg-gray-900 text-primary-700 dark:text-primary-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
            role="menuitem"
            @click="handleAction('toggleComparison')"
          >
            <Columns2 class="w-5 h-5 flex-shrink-0" />
            <span class="flex-1">{{ isComparisonMode ? 'បិទការប្រៀបធៀប' : 'ប្រៀបធៀបឯកសារ' }}</span>
            <span
              v-if="isComparisonMode"
              class="text-[10px] uppercase border border-primary-600 text-primary-700 dark:text-primary-300 px-1.5 py-0.5"
            >
              កំពុងប្រើ
            </span>
          </button>

          <div class="border-t border-gray-200 dark:border-gray-800 my-1"></div>

          <!-- Fullscreen -->
          <button
            class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
            role="menuitem"
            @click="handleAction('toggleFullscreen')"
          >
            <Maximize class="w-5 h-5 flex-shrink-0" />
            <span>ពេញអេក្រង់</span>
          </button>

          <!-- Print -->
          <button
            class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
            role="menuitem"
            @click="handleAction('print')"
          >
            <Printer class="w-5 h-5 flex-shrink-0" />
            <span>បោះពុម្ពឯកសារ</span>
          </button>

          <!-- Keyboard Shortcuts -->
          <button
            class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
            role="menuitem"
            @click="handleAction('showKeyboardShortcuts')"
          >
            <CircleHelp class="w-5 h-5 flex-shrink-0" />
            <span>គ្លីដកាត់</span>
          </button>

          <div class="border-t border-gray-200 dark:border-gray-800 my-1"></div>

          <!-- Dark Mode Toggle -->
          <button
            class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
            role="menuitem"
            @click="handleAction('toggleDarkMode')"
          >
            <Sun v-if="isDark" class="w-5 h-5 flex-shrink-0" />
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
import {
  EllipsisVertical,
  ChevronDown,
  Columns2,
  Maximize,
  Printer,
  CircleHelp,
  Sun,
  Moon
} from '@lucide/vue'

defineProps({
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
