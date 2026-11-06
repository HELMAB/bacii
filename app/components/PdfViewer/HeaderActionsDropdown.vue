<template>
  <div ref="dropdownRef" class="relative">
    <!-- Dropdown Toggle Button -->
    <button
      ref="toggleRef"
      type="button"
      class="btn btn-icon sm:w-12 sm:h-12 border-on-ink-bar/50 hover:bg-on-ink-bar/10"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      aria-label="បើកម៉ឺនុយសកម្មភាព"
      @click="toggleMenu"
      @keydown.down.prevent="openMenu"
    >
      <Ellipsis class="w-5 h-5" :stroke-width="2.6" aria-hidden="true" />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="motion-safe:transition ease-out duration-100"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="motion-safe:transition ease-in duration-75"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        ref="menuRef"
        class="absolute right-0 mt-3 w-60 bg-surface-raised text-fg border-2 border-line shadow-print z-50"
        role="menu"
        aria-label="សកម្មភាព"
        @keydown="handleMenuKeydown"
      >
        <!-- Zoom (the top bar's zoom controls are hidden on phones) -->
        <div class="sm:hidden flex items-center border-b-2 border-line">
          <button
            type="button"
            class="flex-1 grid place-items-center min-h-12 hover:bg-highlight/25 transition-colors"
            role="menuitem"
            aria-label="បង្រួម"
            @click="$emit('zoomOut')"
          >
            <Minus class="w-5 h-5" :stroke-width="2.4" aria-hidden="true" />
          </button>
          <span
            class="w-20 self-stretch flex items-center justify-center font-numeral text-lg border-x-2 border-dashed border-line"
            aria-live="polite"
          >
            {{ toKhmerDigits(zoomPercent) }}%
          </span>
          <button
            type="button"
            class="flex-1 grid place-items-center min-h-12 hover:bg-highlight/25 transition-colors"
            role="menuitem"
            aria-label="ពង្រីក"
            @click="$emit('zoomIn')"
          >
            <Plus class="w-5 h-5" :stroke-width="2.4" aria-hidden="true" />
          </button>
        </div>

        <!-- Comparison Mode -->
        <button
          type="button"
          :class="[itemClass, isComparisonMode && 'font-bold']"
          role="menuitem"
          @click="handleAction('toggleComparison')"
        >
          <Columns2 class="w-5 h-5 shrink-0" aria-hidden="true" />
          <span class="flex-1">{{ isComparisonMode ? 'បិទការប្រៀបធៀប' : 'ប្រៀបធៀបឯកសារ' }}</span>
          <span v-if="isComparisonMode" class="stamp stamp-system">កំពុងប្រើ</span>
        </button>

        <!-- Fullscreen -->
        <button
          v-if="isFullscreenSupported"
          type="button"
          :class="itemClass"
          role="menuitem"
          @click="handleAction('toggleFullscreen')"
        >
          <Minimize v-if="isFullscreen" class="w-5 h-5 shrink-0" aria-hidden="true" />
          <Maximize v-else class="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{{ isFullscreen ? 'ចេញពីពេញអេក្រង់' : 'ពេញអេក្រង់' }}</span>
        </button>

        <!-- Print -->
        <button type="button" :class="itemClass" role="menuitem" @click="handleAction('print')">
          <Printer class="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>បោះពុម្ពឯកសារ</span>
        </button>

        <!-- Dark Mode Toggle -->
        <button
          type="button"
          :class="[itemClass, 'border-b-0']"
          role="menuitem"
          @click="handleAction('toggleDarkMode')"
        >
          <Sun v-if="isDark" class="w-5 h-5 shrink-0" aria-hidden="true" />
          <Moon v-else class="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{{ isDark ? 'ពន្លឺថ្ងៃ' : 'ពន្លឺយប់' }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { nextTick, ref, onMounted, onBeforeUnmount } from 'vue'
import {
  Ellipsis,
  Columns2,
  Maximize,
  Minimize,
  Printer,
  Sun,
  Moon,
  Minus,
  Plus
} from '@lucide/vue'
import { toKhmerDigits } from '../../utils/khmer'

defineProps({
  isDark: Boolean,
  isComparisonMode: Boolean,
  isFullscreen: Boolean,
  isFullscreenSupported: Boolean,
  zoomPercent: Number
})

const emit = defineEmits([
  'toggleComparison',
  'toggleFullscreen',
  'print',
  'toggleDarkMode',
  'zoomIn',
  'zoomOut'
])

const itemClass =
  'w-full min-h-11 px-3.5 py-2 flex items-center gap-2.5 text-left text-base border-b-2 border-dashed border-line hover:bg-highlight/25 focus-visible:bg-highlight/25 transition-colors'

const isOpen = ref(false)
const dropdownRef = ref(null)
const toggleRef = ref(null)
const menuRef = ref(null)

function menuItems() {
  return [...(menuRef.value?.querySelectorAll('[role="menuitem"]') ?? [])].filter(
    (item) => item.offsetParent !== null
  )
}

async function openMenu() {
  isOpen.value = true
  await nextTick()
  menuItems()[0]?.focus()
}

function closeMenu({ restoreFocus = false } = {}) {
  isOpen.value = false
  if (restoreFocus) toggleRef.value?.focus()
}

function toggleMenu() {
  if (isOpen.value) closeMenu()
  else openMenu()
}

function handleAction(action) {
  emit(action)
  closeMenu({ restoreFocus: true })
}

// Arrow keys move between items, Home/End jump, Tab leaves the menu.
function handleMenuKeydown(event) {
  const items = menuItems()
  const index = items.indexOf(document.activeElement)
  const target = {
    ArrowDown: items[(index + 1) % items.length],
    ArrowUp: items[(index - 1 + items.length) % items.length],
    Home: items[0],
    End: items[items.length - 1]
  }[event.key]

  if (target) {
    event.preventDefault()
    event.stopPropagation()
    target.focus()
  } else if (event.key === 'Tab') {
    closeMenu()
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeMenu()
  }
}

// Close dropdown on escape key
function handleEscapeKey(event) {
  if (event.key === 'Escape' && isOpen.value) {
    // Close only the menu, not the drawer too (global shortcut on window).
    event.stopPropagation()
    closeMenu({ restoreFocus: true })
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
