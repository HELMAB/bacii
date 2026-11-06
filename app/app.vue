<template>
  <div class="flex flex-col h-dvh w-screen overflow-hidden bg-page text-fg">
    <h1 class="sr-only">{{ pageHeading }}</h1>

    <!-- Lets keyboard users jump past the header and the whole sidebar -->
    <button
      type="button"
      class="btn bg-surface-raised text-fg shadow-print-sm sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:px-4 focus:outline-highlight"
      @click="focusReader"
    >
      រំលងទៅឯកសារ
    </button>

    <!-- type: the splash also has a long fail-safe animation that Vue must not wait for -->
    <Transition
      type="transition"
      leave-active-class="app-splash-leave-active"
      leave-to-class="app-splash-leave-to"
    >
      <AppSplash v-if="isSplashVisible" />
    </Transition>

    <!-- Toast Notification -->
    <ToastNotification :show="showToast" :message="toastMessage" />

    <!-- PDF Selector Modal -->
    <PdfSelectorModal
      :show="showPdfSelector"
      :pdf-number="pdfSelectorNumber"
      :data="data"
      @close="showPdfSelector = false"
      @select="handlePdfSelection"
    />

    <!-- Backdrop (mobile overlay only) -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isSidebarOpen && !isDesktop"
        class="fixed inset-0 bg-ink-bar/55 z-40"
        @click="toggleSidebar"
      ></div>
    </Transition>

    <!-- In the layout flow so it can never cover the header's controls -->
    <OfflineIndicator />

    <!-- Full-width ink header -->
    <ReaderTopBar
      :has-pdf="!!selectedPdf && !isComparisonMode"
      :selected-category="selectedCategory"
      :selected-year="selectedYear"
      :selected-pdf-title="selectedPdfTitle"
      :zoom-level="zoomLevel"
      :is-dark="isDark"
      :is-comparison-mode="isComparisonMode"
      :is-drawer-open="isSidebarOpen"
      :is-fullscreen="isFullscreen"
      :is-fullscreen-supported="isFullscreenSupported"
      @toggle-drawer="toggleSidebar"
      @toggle-comparison="handleToggleComparison"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @toggle-fullscreen="toggleFullscreen"
      @print="printPdf"
      @download="downloadPdf"
      @toggle-dark-mode="toggleDarkMode"
    />

    <div class="flex-1 flex min-h-0">
      <!-- Navigation sidebar (pushes content on desktop, overlays on mobile) -->
      <SidebarMain
        v-model:search-query="searchQuery"
        :is-open="isSidebarOpen"
        :is-desktop="isDesktop"
        :data="data"
        :filtered-data="filteredData"
        :active-category="activeCategory"
        :expanded-years="expandedYears"
        :selected-pdf="selectedPdf"
        :cached-pdfs="cachedPdfs"
        :offline="offlineState"
        @select-category="selectCategory"
        @toggle-year="toggleYear"
        @select-pdf="handleDrawerSelect"
        @close-sidebar="toggleSidebar"
        @download-all="downloadAll(pdfUrls)"
        @cancel-download="cancelDownload"
      />

      <!-- Reader column -->
      <div class="flex-1 flex flex-col min-w-0 h-full">
        <main
          id="reader"
          tabindex="-1"
          class="flex-1 flex flex-col overflow-hidden relative focus-visible:outline-none"
        >
          <!-- Comparison View -->
          <ComparisonView
            v-if="isComparisonMode"
            :comparison-pdf1="comparisonPdf1"
            :comparison-pdf2="comparisonPdf2"
            :comparison-pdf1-title="comparisonPdf1Title"
            :comparison-pdf2-title="comparisonPdf2Title"
            :comparison-pdf1-year="comparisonPdf1Year"
            :comparison-pdf2-year="comparisonPdf2Year"
            @close="toggleComparisonMode"
            @swap="swapPdfs"
            @select-pdf="openPdfSelector"
          />

          <!-- Empty State -->
          <EmptyState v-else-if="!selectedPdf" :is-loading="isDocsLoading" />

          <!-- PDF Container -->
          <PdfContainer
            v-else
            ref="pdfContainerComponent"
            :selected-pdf="selectedPdf"
            :is-loading="isLoading"
            :load-error="loadError"
            :load-progress="loadProgress"
            :attempt="attempt"
            :zoom-level="zoomLevel"
            @loaded="onPdfLoaded"
            @progress="onPdfProgress"
            @rendered="handlePdfRendered"
            @loading-failed="onPdfError"
            @internal-link-clicked="onInternalLinkClicked"
            @retry="retryPdf"
          />

          <!-- Floating controls (positioned over the reader, not the viewport) -->
          <template v-if="selectedPdf && !isComparisonMode">
            <Transition
              enter-active-class="motion-safe:transition-opacity duration-300 ease-out"
              enter-from-class="opacity-0"
              leave-active-class="motion-safe:transition-opacity duration-300 ease-in"
              leave-to-class="opacity-0"
            >
              <PageIndicator
                v-if="totalPages > 0 && !isLoading"
                :current-page="currentPage"
                :total-pages="totalPages"
              />
            </Transition>

            <PdfPager
              :current-pdf-index="currentPdfIndex"
              :total-pdfs-count="totalPdfsCount"
              :can-go-previous="canGoPrevious"
              :can-go-next="canGoNext"
              @previous="goToPreviousPdf"
              @next="goToNextPdf"
            />

            <ScrollToTopButton :show="showScrollTop" @click="scrollToTop" />
          </template>
        </main>

        <!-- In the layout flow so it can never cover the pager -->
        <PWAInstallPrompt />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

// Components
import AppSplash from './components/AppSplash.vue'
import OfflineIndicator from './components/OfflineIndicator.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import ToastNotification from './components/ToastNotification.vue'
import SidebarMain from './components/Sidebar/SidebarMain.vue'
import EmptyState from './components/PdfViewer/EmptyState.vue'
import ReaderTopBar from './components/PdfViewer/ReaderTopBar.vue'
import PdfContainer from './components/PdfViewer/PdfContainer.vue'
import PdfPager from './components/PdfViewer/PdfPager.vue'
import PageIndicator from './components/PdfViewer/PageIndicator.vue'
import ScrollToTopButton from './components/ScrollToTopButton.vue'
import ComparisonView from './components/ComparisonView.vue'
import PdfSelectorModal from './components/PdfSelectorModal.vue'

// Composables
import { useTheme } from './composables/useTheme'
import { useToast } from './composables/useToast'
import { useResponsive } from './composables/useResponsive'
import { useSidebar } from './composables/useSidebar'
import { useSearch } from './composables/useSearch'
import { usePdfViewer } from './composables/usePdfViewer'
import { useNavigation } from './composables/useNavigation'
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'
import { useComparison } from './composables/useComparison'
import { useDocsCache } from './composables/useDocsCache'
import { useReaderHistory } from './composables/useReaderHistory'
import { useSeo } from './composables/useSeo'
import { useSplashScreen } from './composables/useSplashScreen'
import { useOfflineDownload } from './composables/useOfflineDownload'
import { getPdfScrollAnchor } from './utils/pdfScroll'

// How long scrolling must pause before the reading position is saved.
const SAVE_POSITION_DELAY_MS = 500

// Load docs data with caching
const { data, isLoading: isDocsLoading, loadDocs } = useDocsCache()

// Theme
const { isDark, toggleDarkMode } = useTheme()

// Toast notifications
const { showToast, toastMessage, showToastNotification } = useToast()

// Responsive
const { isDesktop } = useResponsive()

// Sidebar
const {
  isSidebarOpen,
  expandedCategories,
  expandedYears,
  activeCategory,
  toggleSidebar,
  selectCategory,
  ensureActiveCategory,
  toggleYear
} = useSidebar(isDesktop)

// Search
const { searchQuery, filteredData } = useSearch(data, expandedCategories, expandedYears)

// Searching opens every matching year (useSearch). Put the ledger back the way it
// was once the search is cleared. 'sync' so the snapshot is taken before useSearch
// expands anything.
let yearsBeforeSearch = null
watch(
  () => !!searchQuery.value.trim(),
  (isSearching) => {
    if (isSearching) {
      yearsBeforeSearch = { ...expandedYears }
    } else if (yearsBeforeSearch) {
      Object.keys(expandedYears).forEach((year) => {
        expandedYears[year] = !!yearsBeforeSearch[year]
      })
      yearsBeforeSearch = null
    }
  },
  { flush: 'sync' }
)

// Comparison Mode
const {
  isComparisonMode,
  comparisonPdf1,
  comparisonPdf2,
  comparisonPdf1Title,
  comparisonPdf2Title,
  comparisonPdf1Year,
  comparisonPdf2Year,
  toggleComparisonMode,
  setComparisonPdf1,
  setComparisonPdf2,
  swapPdfs
} = useComparison()

const showPdfSelector = ref(false)
const pdfSelectorNumber = ref(1)

// PDF Viewer
const {
  selectedPdf,
  selectedPdfTitle,
  selectedCategory,
  selectedYear,
  zoomLevel,
  isLoading,
  loadError,
  loadProgress,
  attempt,
  showScrollTop,
  currentPage,
  totalPages,
  isFullscreen,
  isFullscreenSupported,
  zoomIn,
  zoomOut,
  toggleFullscreen,
  createSelectPdf,
  createScrollToTop,
  createHandleScroll,
  retryPdf,
  printPdf,
  downloadPdf,
  onPdfLoaded,
  onPdfProgress,
  onPdfRendered,
  onPdfError,
  onInternalLinkClicked
} = usePdfViewer(isDesktop, showToastNotification)

// Splash screen
const { isSplashVisible } = useSplashScreen(computed(() => !!selectedPdf.value && !isLoading.value))

const pdfContainerComponent = ref(null)
const pdfContainer = computed(() => pdfContainerComponent.value?.pdfContainer)

// Create functions that need access to refs
const selectPdf = createSelectPdf(pdfContainer)
const scrollToTop = createScrollToTop(pdfContainer)
const trackScroll = createHandleScroll(pdfContainer)

let savePositionTimer = null

function handleScroll() {
  trackScroll()

  clearTimeout(savePositionTimer)
  savePositionTimer = setTimeout(() => {
    savePosition(getPdfScrollAnchor(pdfContainer.value))
  }, SAVE_POSITION_DELAY_MS)
}

// Watch for pdfContainer changes and attach scroll listener
watch(pdfContainer, (newVal, oldVal) => {
  if (oldVal) {
    oldVal.removeEventListener('scroll', handleScroll)
  }
  if (newVal) {
    newVal.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  clearTimeout(savePositionTimer)
  if (pdfContainer.value) {
    pdfContainer.value.removeEventListener('scroll', handleScroll)
  }
})

// Comparison Mode Functions
function handleToggleComparison() {
  toggleComparisonMode()
  if (isComparisonMode.value) {
    // Set current PDF as first comparison PDF
    if (selectedPdf.value) {
      setComparisonPdf1(
        { pdf: selectedPdf.value, label: selectedPdfTitle.value },
        selectedCategory.value,
        selectedYear.value
      )
    }
    showToastNotification('បានបើកមុខងារប្រៀបធៀប។ សូមជ្រើសរើសឯកសារដើម្បីប្រៀបធៀប')
  } else {
    showToastNotification('បានបិទមុខងារប្រៀបធៀប')
  }
}

function openPdfSelector(pdfNumber) {
  pdfSelectorNumber.value = pdfNumber
  showPdfSelector.value = true
}

function handlePdfSelection(subject, category, year) {
  assignComparisonPdf(pdfSelectorNumber.value, subject, category, year)
}

function assignComparisonPdf(pdfNumber, subject, category, year) {
  if (pdfNumber === 1) {
    setComparisonPdf1(subject, category, year)
    showToastNotification(`បានជ្រើសរើសឯកសារ ១: ${subject.label}`)
  } else {
    setComparisonPdf2(subject, category, year)
    showToastNotification(`បានជ្រើសរើសឯកសារ ២: ${subject.label}`)
  }
}

// While comparing, the drawer fills the empty panel, or replaces the second one.
function handleDrawerSelect(subject, category, year) {
  if (isComparisonMode.value) {
    assignComparisonPdf(comparisonPdf1.value ? 2 : 1, subject, category, year)
  } else {
    selectPdf(subject, category, year)
  }
}

// Navigation
const {
  allPdfs,
  currentPdfIndex,
  totalPdfsCount,
  canGoPrevious,
  canGoNext,
  goToPreviousPdf,
  goToNextPdf
} = useNavigation(data, selectedPdf, selectPdf, showToastNotification)

// The tab follows the open paper, so prev/next across the two categories (and
// opening a paper from search) switches it, with that paper's year open.
watch([selectedCategory, selectedYear], ([category, year]) => {
  if (category) selectCategory(category)
  if (year && !expandedYears[year]) toggleYear(year)
})

// Until a paper is open, show the first category (docs.json order).
watch(data, (categories) => ensureActiveCategory(categories), { immediate: true })

// Offline reading: one instance for the whole app, so the sidebar's per-paper
// "saved" stamps and the download card share the same state.
const {
  isSupported: isOfflineSupported,
  status: offlineStatus,
  cachedCount,
  cachedPdfs,
  totalCount,
  failedCount,
  progress: offlineProgress,
  isComplete: isOfflineComplete,
  checkStatus,
  downloadAll,
  markCached,
  cancelDownload
} = useOfflineDownload()

const pdfUrls = computed(() => allPdfs.value.map((doc) => doc.pdf).filter(Boolean))

const offlineState = computed(() => ({
  isSupported: isOfflineSupported.value,
  status: offlineStatus.value,
  cachedCount: cachedCount.value,
  totalCount: totalCount.value,
  failedCount: failedCount.value,
  progress: offlineProgress.value,
  isComplete: isOfflineComplete.value
}))

// Once the docs tree is loaded (and the Cache API is known to work), count what's saved.
watch(
  [pdfUrls, isOfflineSupported],
  ([urls]) => {
    if (urls.length) {
      checkStatus(urls)
    }
  },
  { immediate: true }
)

// Skip link target: the PDF scroller (so arrow keys scroll it), else the reader.
function focusReader() {
  const reader = document.getElementById('reader')
  ;(reader?.querySelector('[data-reader-scroll]') ?? reader)?.focus()
}

// An opened paper is saved by the Service Worker's cache-first PDF route.
function handlePdfRendered() {
  onPdfRendered()
  markCached(selectedPdf.value)
}

// URLs, Back button and reading position
const { urlPdf, resolveInitialDoc, openDocWithoutHistoryEntry, savePosition } = useReaderHistory({
  allPdfs,
  selectedPdf,
  selectPdf,
  overlays: [
    {
      isOpen: computed(() => isSidebarOpen.value && !isDesktop.value),
      close: toggleSidebar,
      replacedByDoc: true
    },
    { isOpen: showPdfSelector, close: () => (showPdfSelector.value = false) },
    { isOpen: isComparisonMode, close: toggleComparisonMode }
  ]
})

// Search engine metadata
const { pageHeading } = useSeo({ allPdfs, urlPdf })

// Keyboard shortcuts
useKeyboardShortcuts({
  searchQuery,
  toggleSidebar,
  isSidebarOpen,
  goToPreviousPdf,
  goToNextPdf,
  zoomIn,
  zoomOut,
  toggleFullscreen
})

async function openInitialDoc() {
  const { doc, position, isDefaultDoc } = resolveInitialDoc()
  if (!doc) return

  selectCategory(doc.category)
  expandedYears[doc.year] = true
  openDocWithoutHistoryEntry(doc, { isDefaultDoc })

  if (position) {
    await nextTick()
    pdfContainerComponent.value?.restorePosition(position)
  }
}

onMounted(async () => {
  await loadDocs()
  await openInitialDoc()
})
</script>
