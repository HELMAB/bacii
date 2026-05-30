<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <!-- PWA Components -->
    <OfflineIndicator />
    <PWAInstallPrompt />

    <!-- Toast Notification -->
    <ToastNotification :show="showToast" :message="toastMessage" />

    <!-- Keyboard Shortcuts Modal -->
    <KeyboardShortcutsModal :show="showKeyboardShortcuts" @close="showKeyboardShortcuts = false" />

    <!-- PDF Selector Modal -->
    <PdfSelectorModal
      :show="showPdfSelector"
      :pdfNumber="pdfSelectorNumber"
      :data="data"
      @close="showPdfSelector = false"
      @select="handlePdfSelection"
    />

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
      :filteredData="filteredData"
      :expandedCategories="expandedCategories"
      :expandedYears="expandedYears"
      :selectedPdf="selectedPdf"
      @toggleCompactMode="isCompactMode = !isCompactMode"
      @toggleCategory="toggleCategory"
      @toggleYear="toggleYear"
      @selectPdf="handleSelectPdf"
      @closeSidebar="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-gray-200 dark:bg-gray-900 overflow-hidden relative">
      <!-- Peace Banner -->
      <PeaceBanner />

      <!-- Comparison View -->
      <ComparisonView
        v-if="isComparisonMode"
        :comparisonPdf1="comparisonPdf1"
        :comparisonPdf2="comparisonPdf2"
        :comparisonPdf1Title="comparisonPdf1Title"
        :comparisonPdf2Title="comparisonPdf2Title"
        :comparisonPdf1Year="comparisonPdf1Year"
        :comparisonPdf2Year="comparisonPdf2Year"
        @close="toggleComparisonMode"
        @swap="swapPdfs"
        @selectPdf="openPdfSelector"
      />

      <!-- Empty State -->
      <EmptyState v-else-if="!selectedPdf" />

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
          :isComparisonMode="isComparisonMode"
          @toggleSidebar="toggleSidebar"
          @previousPdf="goToPreviousPdf"
          @nextPdf="goToNextPdf"
          @showKeyboardShortcuts="showKeyboardShortcuts = true"
          @toggleComparison="handleToggleComparison"
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

      <!-- Footer -->
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// Components
import OfflineIndicator from './components/OfflineIndicator.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import ToastNotification from './components/ToastNotification.vue'
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal.vue'
import SidebarMain from './components/Sidebar/SidebarMain.vue'
import EmptyState from './components/PdfViewer/EmptyState.vue'
import PdfViewerHeader from './components/PdfViewer/PdfViewerHeader.vue'
import PdfContainer from './components/PdfViewer/PdfContainer.vue'
import ScrollToTopButton from './components/ScrollToTopButton.vue'
import ComparisonView from './components/ComparisonView.vue'
import PdfSelectorModal from './components/PdfSelectorModal.vue'
import AppFooter from './components/AppFooter.vue'

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

// Load docs data with caching
const { data, loadDocs } = useDocsCache()

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

// Comparison Mode
const {
  isComparisonMode,
  comparisonPdf1,
  comparisonPdf2,
  comparisonPdf1Title,
  comparisonPdf2Title,
  comparisonPdf1Category,
  comparisonPdf2Category,
  comparisonPdf1Year,
  comparisonPdf2Year,
  toggleComparisonMode,
  setComparisonPdf1,
  setComparisonPdf2,
  clearComparison,
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

  if (pdfContainer.value) {
    pdfContainer.value.scrollTop = 0
  }

  setTimeout(() => {
    if (isLoading.value) {
      isLoading.value = false
    }
  }, 2000)
}

function handleSelectPdf(subject, category, year) {
  selectPdf(subject, category, year)
}

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
    showToastNotification('📊 បានបើកមុខងារប្រៀបធៀប។ សូមជ្រើសរើសឯកសារដើម្បីប្រៀបធៀប។')
  } else {
    showToastNotification('✓ បានបិទមុខងារប្រៀបធៀប')
  }
}

function openPdfSelector(pdfNumber) {
  pdfSelectorNumber.value = pdfNumber
  showPdfSelector.value = true
}

function handlePdfSelection(subject, category, year) {
  if (pdfSelectorNumber.value === 1) {
    setComparisonPdf1(subject, category, year)
    showToastNotification(`✓ បានជ្រើសរើសឯកសារ ១: ${subject.label}`)
  } else {
    setComparisonPdf2(subject, category, year)
    showToastNotification(`✓ បានជ្រើសរើសឯកសារ ២: ${subject.label}`)
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

onMounted(async () => {
  // Load docs data with caching
  await loadDocs()

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

