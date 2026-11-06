<script setup>
import { computed } from 'vue'
import { Menu, Minus, Plus, Download, Sun, Moon } from '@lucide/vue'
import BrandStamp from '../BrandStamp.vue'
import HeaderActionsDropdown from './HeaderActionsDropdown.vue'
import { formatYearShort, stripCategoryPrefix, toKhmerDigits } from '../../utils/khmer'

const props = defineProps({
  hasPdf: Boolean,
  selectedCategory: String,
  selectedYear: String,
  selectedPdfTitle: String,
  zoomLevel: Number,
  isDark: Boolean,
  isComparisonMode: Boolean,
  isDrawerOpen: Boolean,
  isFullscreen: Boolean,
  isFullscreenSupported: Boolean
})

defineEmits([
  'toggleDrawer',
  'toggleComparison',
  'zoomIn',
  'zoomOut',
  'toggleFullscreen',
  'print',
  'download',
  'toggleDarkMode'
])

const zoomPercent = computed(() => Math.round(props.zoomLevel * 100))
const subtitle = computed(() =>
  [stripCategoryPrefix(props.selectedCategory), formatYearShort(props.selectedYear)]
    .filter(Boolean)
    .join(' · ')
)
</script>

<template>
  <div class="relative z-30 shrink-0">
    <header
      class="flex items-center gap-2 sm:gap-4 px-2.5 sm:px-6 py-2 sm:py-3 bg-ink-bar text-on-ink-bar"
    >
      <!-- Drawer toggle -->
      <button
        type="button"
        class="btn btn-icon border-on-ink-bar/50 hover:bg-on-ink-bar/10"
        aria-label="បើកបញ្ជីឯកសារ"
        :aria-expanded="isDrawerOpen"
        @click="$emit('toggleDrawer')"
      >
        <Menu class="w-[22px] h-[22px]" :stroke-width="2.4" aria-hidden="true" />
      </button>

      <!-- Brand: always without a document, from xl beside the title -->
      <div :class="['items-center gap-3 shrink-0', hasPdf ? 'hidden xl:flex' : 'flex']">
        <BrandStamp :size="hasPdf ? 48 : 40" class="sm:w-12 sm:h-12" />
        <div class="flex flex-col">
          <span class="font-display text-lg sm:text-xl leading-normal">បាក់ឌុប</span>
          <span class="font-mono text-xs leading-snug text-on-ink-bar/80">DOBPI</span>
        </div>
      </div>

      <!-- Title -->
      <div class="flex-1 min-w-0 flex flex-col pl-1 sm:items-center sm:text-center">
        <template v-if="hasPdf">
          <p class="font-display text-base sm:text-xl leading-[1.7] truncate max-w-full">
            {{ selectedPdfTitle }}
          </p>
          <p
            v-if="subtitle"
            class="text-[13px] sm:text-sm leading-normal text-on-ink-bar/80 truncate max-w-full"
          >
            {{ subtitle }}
          </p>
        </template>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-2">
        <!-- Zoom (phones use the actions menu) -->
        <div v-if="hasPdf" class="hidden sm:flex items-center border-2 border-on-ink-bar/50">
          <button
            type="button"
            class="grid place-items-center w-11 h-11 hover:bg-on-ink-bar/10 transition-colors"
            aria-label="បង្រួម"
            title="បង្រួម (-)"
            @click="$emit('zoomOut')"
          >
            <Minus class="w-[18px] h-[18px]" :stroke-width="2.4" aria-hidden="true" />
          </button>
          <span
            class="min-w-16 self-stretch flex items-center justify-center font-numeral text-lg border-x-2 border-dashed border-on-ink-bar/30"
            aria-live="polite"
          >
            {{ toKhmerDigits(zoomPercent) }}%
          </span>
          <button
            type="button"
            class="grid place-items-center w-11 h-11 hover:bg-on-ink-bar/10 transition-colors"
            aria-label="ពង្រីក"
            title="ពង្រីក (+)"
            @click="$emit('zoomIn')"
          >
            <Plus class="w-[18px] h-[18px]" :stroke-width="2.4" aria-hidden="true" />
          </button>
        </div>

        <!-- Theme toggle: in the actions menu once a document is open -->
        <button
          v-if="!hasPdf"
          type="button"
          class="btn btn-icon border-on-ink-bar/50 hover:bg-on-ink-bar/10"
          :aria-label="isDark ? 'ពន្លឺថ្ងៃ' : 'ពន្លឺយប់'"
          :title="isDark ? 'ពន្លឺថ្ងៃ' : 'ពន្លឺយប់'"
          @click="$emit('toggleDarkMode')"
        >
          <Sun v-if="isDark" class="w-5 h-5" aria-hidden="true" />
          <Moon v-else class="w-5 h-5" aria-hidden="true" />
        </button>

        <!-- Download -->
        <button
          v-if="hasPdf"
          type="button"
          class="btn btn-icon md:w-auto md:h-12 md:px-4 border-on-ink-bar/50 hover:bg-on-ink-bar/10 font-normal"
          aria-label="ទាញយក"
          title="ទាញយក"
          @click="$emit('download')"
        >
          <Download class="w-[18px] h-[18px]" :stroke-width="2.4" aria-hidden="true" />
          <span class="hidden md:inline" aria-hidden="true">ទាញយក</span>
        </button>

        <!-- Actions -->
        <HeaderActionsDropdown
          v-if="hasPdf"
          :is-dark="isDark"
          :is-comparison-mode="isComparisonMode"
          :is-fullscreen="isFullscreen"
          :is-fullscreen-supported="isFullscreenSupported"
          :zoom-percent="zoomPercent"
          @zoom-in="$emit('zoomIn')"
          @zoom-out="$emit('zoomOut')"
          @toggle-comparison="$emit('toggleComparison')"
          @toggle-fullscreen="$emit('toggleFullscreen')"
          @print="$emit('print')"
          @toggle-dark-mode="$emit('toggleDarkMode')"
        />
      </div>
    </header>
    <div class="bg-zigzag h-2.5 sm:h-3.5" aria-hidden="true"></div>
  </div>
</template>
