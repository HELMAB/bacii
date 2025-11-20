<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <!-- Toast Notification -->
    <ToastNotification :show="showToast" :message="toastMessage" />

    <!-- Keyboard Shortcuts Modal -->
    <KeyboardShortcutsModal :show="showKeyboardShortcuts" @close="showKeyboardShortcuts = false" />

    <!-- Overlay for mobile -->
    <div
      v-if="isSidebarOpen && !isDesktop"
      @click="toggleSidebar"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
    ></div>

    <!-- Sidebar -->
    <SidebarMain
      :isOpen="isSidebarOpen"
      :isDesktop="isDesktop"
      :isCompactMode="isCompactMode"
      v-model:searchQuery="searchQuery"
      :recentlyViewed="recentlyViewed"
      :filteredData="filteredData"
      :expandedCategories="expandedCategories"
      :expandedYears="expandedYears"
      :selectedPdf="selectedPdf"
      @toggleCompactMode="isCompactMode = !isCompactMode"
      @toggleCategory="toggleCategory"
      @toggleYear="toggleYear"
      @selectPdf="handleSelectPdf"
      @clearRecentlyViewed="clearRecentlyViewedWrapper"
      @closeSidebar="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-gray-200 dark:bg-gray-900 overflow-hidden">
      <!-- Empty State -->
      <EmptyState v-if="!selectedPdf" />

      <!-- PDF Viewer -->
      <div v-else class="flex-1 flex flex-col overflow-hidden py-2">
        <!-- PDF Viewer Header -->
        <PdfViewerHeader
          :selectedCategory="selectedCategory"
          :selectedYear="selectedYear"
          :selectedPdfTitle="selectedPdfTitle"
          :isSidebarOpen="isSidebarOpen"
          :currentPdfIndex="currentPdfIndex"
          :totalPdfsCount="totalPdfsCount"
          :canGoPrevious="canGoPrevious"
          :canGoNext="canGoNext"
          :zoomLevel="zoomLevel"
          :isDark="isDark"
          @toggleSidebar="toggleSidebar"
          @previousPdf="goToPreviousPdf"
          @nextPdf="goToNextPdf"
          @showKeyboardShortcuts="showKeyboardShortcuts = true"
          @zoomIn="zoomIn"
          @zoomOut="zoomOut"
          @toggleFullscreen="toggleFullscreen"
          @print="printPdf"
          @download="downloadPdf"
          @toggleDarkMode="toggleDarkMode"
        />

        <!-- PDF Container -->
        <PdfContainer
          ref="pdfContainerComponent"
          :selectedPdf="selectedPdf"
          :isLoading="isLoading"
          :zoomLevel="zoomLevel"
          :currentPage="currentPage"
          :totalPages="totalPages"
          @rendered="onPdfRendered"
          @loadingFailed="onPdfError"
          @internalLinkClicked="onInternalLinkClicked"
        />

        <!-- Scroll to Top Button -->
        <ScrollToTopButton :show="showScrollTop" @click="scrollToTop" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import docsData from './data/docs.json'

// Components
import ToastNotification from './components/ToastNotification.vue'
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal.vue'
import SidebarMain from './components/Sidebar/SidebarMain.vue'
import EmptyState from './components/PdfViewer/EmptyState.vue'
import PdfViewerHeader from './components/PdfViewer/PdfViewerHeader.vue'
import PdfContainer from './components/PdfViewer/PdfContainer.vue'
import ScrollToTopButton from './components/ScrollToTopButton.vue'

// Composables
import { useTheme } from './composables/useTheme'
import { useToast } from './composables/useToast'
import { useResponsive } from './composables/useResponsive'
import { useSidebar } from './composables/useSidebar'
import { useSearch } from './composables/useSearch'
import { useRecentlyViewed } from './composables/useRecentlyViewed'
import { usePdfViewer } from './composables/usePdfViewer'
import { useNavigation } from './composables/useNavigation'
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'

const data = ref(docsData)

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
  isCompactMode,
  toggleSidebar,
  toggleCategory,
  toggleYear
} = useSidebar(isDesktop)

// Search
const { searchQuery, filteredData } = useSearch(data, expandedCategories, expandedYears)

// Recently viewed
const { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed: clearRecent } = useRecentlyViewed()

// PDF Viewer
const {
  selectedPdf,
  selectedPdfTitle,
  selectedCategory,
  selectedYear,
  zoomLevel,
  isLoading,
  showScrollTop,
  currentPage,
  totalPages,
  zoomIn,
  zoomOut,
  createToggleFullscreen,
  createScrollToTop,
  createHandleScroll,
  printPdf,
  downloadPdf,
  onPdfRendered,
  onPdfError,
  onInternalLinkClicked
} = usePdfViewer(isDesktop, showToastNotification)

const pdfContainerComponent = ref(null)
const pdfContainer = computed(() => pdfContainerComponent.value?.pdfContainer)
const pdfRef = computed(() => pdfContainerComponent.value?.pdfRef)

// Create functions that need access to refs
const toggleFullscreen = createToggleFullscreen(pdfContainer)
const scrollToTop = createScrollToTop(pdfContainer)
const handleScroll = createHandleScroll(pdfContainer, pdfRef)

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
  if (pdfContainer.value) {
    pdfContainer.value.removeEventListener('scroll', handleScroll)
  }
})

// Select PDF with history tracking
function selectPdf(subject, category, year) {
  isLoading.value = true
  selectedPdf.value = subject.pdf
  selectedPdfTitle.value = subject.label
  selectedCategory.value = category
  selectedYear.value = year
  zoomLevel.value = isDesktop.value ? 0.75 : 1

  addToRecentlyViewed(subject, category, year)

  if (pdfContainer.value) {
    pdfContainer.value.scrollTop = 0
  }

  setTimeout(() => {
    if (isLoading.value) {
      isLoading.value = false
    }
  }, 2000)
}

function clearRecentlyViewedWrapper() {
  clearRecent(showToastNotification)
}

function handleSelectPdf(subject, category, year, isFromRecent = false) {
  selectPdf(subject, category, year)
  if (isFromRecent) {
    expandedCategories[category] = true
    expandedYears[year] = true
  }
}

// Navigation
const {
  currentPdfIndex,
  totalPdfsCount,
  canGoPrevious,
  canGoNext,
  goToPreviousPdf,
  goToNextPdf
} = useNavigation(data, selectedPdf, selectPdf, showToastNotification)

// Keyboard shortcuts
const { showKeyboardShortcuts } = useKeyboardShortcuts({
  searchQuery,
  toggleSidebar,
  isSidebarOpen,
  isDesktop,
  goToPreviousPdf,
  goToNextPdf,
  zoomIn,
  zoomOut,
  toggleFullscreen
})

onMounted(() => {
  if (!isDesktop.value) {
    isSidebarOpen.value = false
  }

  if (data.value.length > 0 && data.value[0].children.length > 0) {
    const firstCategory = data.value[0]
    const firstYear = firstCategory.children[0]

    expandedCategories[firstCategory.label] = true
    expandedYears[firstYear.label] = true

    if (firstYear.children.length > 0) {
      const firstSubject = firstYear.children[0]
      selectPdf(firstSubject, firstCategory.label, firstYear.label)
    }
  }

  if (typeof document !== 'undefined') {
    document.title = 'Home — Dobpi'
  }
})
</script>

