<script setup>
import { nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { X } from '@lucide/vue'
import SearchBar from './SearchBar.vue'
import CategoryTabs from './CategoryTabs.vue'
import CategoryList from './CategoryList.vue'
import OfflineDownload from './OfflineDownload.vue'
import DisclaimerNotice from './DisclaimerNotice.vue'
import PeaceBanner from '../PeaceBanner.vue'
import AppFooter from '../AppFooter.vue'

// Shared by the tabs and their panels so aria-controls / aria-labelledby match.
const TABS_ID = 'sidebar-category'

const props = defineProps({
  isOpen: Boolean,
  isDesktop: Boolean,
  searchQuery: String,
  data: Array,
  filteredData: Array,
  activeCategory: String,
  expandedYears: Object,
  selectedPdf: String,
  cachedPdfs: { type: Set, default: () => new Set() },
  // State from useOfflineDownload() in app.vue (see OfflineDownload props).
  offline: { type: Object, default: () => ({}) }
})

const emit = defineEmits([
  'update:searchQuery',
  'selectCategory',
  'toggleYear',
  'selectPdf',
  'closeSidebar',
  'downloadAll',
  'cancelDownload'
])

const scroller = useTemplateRef('scroller')

// The server can't know the screen size and renders the open desktop panel. Hide
// it on narrow screens until the app has run and closed the drawer, so phones
// don't flash an open drawer before hydration. One tick after mount, because
// useSidebar closes it in app.vue's own (later) mounted hook.
const isHydrated = shallowRef(false)
onMounted(async () => {
  await nextTick()
  isHydrated.value = true
})
const closeButton = useTemplateRef('closeButton')

// Keep the open paper in view: on a deep link, after prev/next and when the
// drawer opens. 'nearest' leaves the list alone when it's already visible.
watch(
  () => [props.selectedPdf, props.isOpen, props.activeCategory],
  async () => {
    if (!props.isOpen || props.searchQuery?.trim()) return
    await nextTick()
    scroller.value?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' })
  },
  { flush: 'post' }
)

// On phones the drawer is a modal overlay: move focus into it when it opens and
// give it back to whatever opened it when it closes.
let returnFocusTo = null
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (props.isDesktop) return
    if (isOpen) {
      returnFocusTo = document.activeElement
      await nextTick()
      closeButton.value?.focus()
    } else if (returnFocusTo) {
      returnFocusTo.focus?.()
      returnFocusTo = null
    }
  }
)

function handleSelectPdf(subject, category, year) {
  emit('selectPdf', subject, category, year)
  // On mobile the sidebar overlays the reader, so close it after picking.
  if (!props.isDesktop) {
    emit('closeSidebar')
  }
}
</script>

<template>
  <aside
    :inert="!isOpen"
    :class="[
      !isHydrated && 'max-lg:hidden',
      isDesktop
        ? [
            'relative shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
            isOpen ? 'w-80 sm:w-96' : 'w-0'
          ]
        : [
            'fixed inset-y-0 left-0 z-50 w-80 sm:w-96 max-w-[85vw] transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          ]
    ]"
  >
    <div
      class="flex flex-col h-full w-full lg:w-96 bg-surface text-fg border-r-4 border-double border-line"
    >
      <!-- Mobile drawer header -->
      <div class="lg:hidden shrink-0">
        <div class="flex items-center gap-3 pl-4 pr-2.5 py-2 bg-ink-bar text-on-ink-bar">
          <h2 class="flex-1 font-display text-lg leading-[1.7]">ឯកសារប្រឡង</h2>
          <button
            ref="closeButton"
            type="button"
            class="btn btn-icon border-on-ink-bar/50 hover:bg-on-ink-bar/10"
            aria-label="បិទ"
            @click="$emit('closeSidebar')"
          >
            <X class="w-5 h-5" :stroke-width="2.6" aria-hidden="true" />
          </button>
        </div>
        <div class="bg-zigzag h-2.5" aria-hidden="true"></div>
      </div>

      <!--
        Everything scrolls together so the notes below can't squeeze the ledger on
        short screens, with the offline download kept stuck to the bottom.
      -->
      <div ref="scroller" class="flex-1 min-h-0 overflow-y-auto">
        <div class="flex flex-col gap-5 pt-5 lg:pt-6 pb-6">
          <!-- Desktop heading -->
          <div class="hidden lg:flex flex-col px-6">
            <h2 class="font-display text-[22px] leading-[1.7] text-active">ឯកសារប្រឡង</h2>
            <p class="text-sm text-fg-muted">សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ</p>
          </div>

          <SearchBar
            class="px-4 sm:px-6"
            :model-value="searchQuery"
            @update:model-value="$emit('update:searchQuery', $event)"
          />

          <CategoryTabs
            v-show="!searchQuery?.trim()"
            class="mx-4 sm:mx-6"
            :categories="data"
            :active-category="activeCategory"
            :id-prefix="TABS_ID"
            @select="$emit('selectCategory', $event)"
          />

          <div>
            <CategoryList
              :categories="data"
              :filtered-data="filteredData"
              :active-category="activeCategory"
              :expanded-years="expandedYears"
              :selected-pdf="selectedPdf"
              :search-query="searchQuery"
              :cached-pdfs="cachedPdfs"
              :show-saved-stamps="!offline.isComplete"
              :id-prefix="TABS_ID"
              @toggle-year="$emit('toggleYear', $event)"
              @select-pdf="handleSelectPdf"
            />
          </div>
        </div>

        <OfflineDownload
          class="sticky bottom-0 z-10"
          v-bind="offline"
          @download="$emit('downloadAll')"
          @cancel="$emit('cancelDownload')"
        />
        <DisclaimerNotice />
        <PeaceBanner />
        <AppFooter class="shrink-0" />
      </div>
    </div>
  </aside>
</template>
