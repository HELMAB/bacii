<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <!-- PWA Components -->
    <OfflineIndicator />
    <PWAInstallPrompt />

    <!-- Toast Notification -->
    <ToastNotification :show="showToast" :message="toastMessage" />

    <!-- Keyboard Shortcuts Modal -->
    <KeyboardShortcutsModal :show="showKeyboardShortcuts" @close="showKeyboardShortcuts = false" />

    <!-- Confirm Clear Recently Viewed Modal -->
    <ConfirmModal
      :show="showClearConfirm"
      title="បញ្ជាក់ការសម្អាត"
      message="តើអ្នកប្រាកដថាចង់សម្អាតប្រវត្តិមើលថ្មីៗទេ?"
      confirmText="សម្អាត"
      cancelText="បោះបង់"
      @confirm="handleClearConfirm"
      @cancel="showClearConfirm = false"
    />

    <!-- Confirm Clear Favorites Modal -->
    <ConfirmModal
      :show="showClearFavoritesConfirm"
      title="បញ្ជាក់ការសម្អាត"
      message="តើអ្នកប្រាកដថាចង់សម្អាតចំណូលចិត្តទាំងអស់ទេ?"
      confirmText="សម្អាត"
      cancelText="បោះបង់"
      @confirm="handleClearFavoritesConfirm"
      @cancel="showClearFavoritesConfirm = false"
    />

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
      :recentlyViewed="recentlyViewed"
      :favorites="favorites"
      :filteredData="filteredData"
      :expandedCategories="expandedCategories"
      :expandedYears="expandedYears"
      :selectedPdf="selectedPdf"
      @toggleCompactMode="isCompactMode = !isCompactMode"
      @toggleCategory="toggleCategory"
      @toggleYear="toggleYear"
      @selectPdf="handleSelectPdf"
      @clearRecentlyViewed="clearRecentlyViewedWrapper"
      @removeFavorite="removeFavorite"
      @clearFavorites="clearFavoritesWrapper"
      @closeSidebar="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-gray-200 dark:bg-gray-900 overflow-hidden relative">
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
          :isFavorite="isFavorite(selectedPdf)"
          @toggleSidebar="toggleSidebar"
          @previousPdf="goToPreviousPdf"
          @nextPdf="goToNextPdf"
          @showKeyboardShortcuts="showKeyboardShortcuts = true"
          @toggleFavorite="handleToggleFavorite"
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
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 py-3 px-4 text-center text-xs text-gray-600 dark:text-gray-400">
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <span>© 2025 Dobpi</span>
          <span class="hidden sm:inline">•</span>
          <a
            href="https://github.com/HELMAB/bacii"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            GitHub
          </a>
          <span class="hidden sm:inline">•</span>
          <span class="text-gray-500 dark:text-gray-500">Made with <span class="text-red-500">❤</span> for Cambodian students</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import docsData from './data/docs.json'

// Components
import OfflineIndicator from './components/OfflineIndicator.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import ToastNotification from './components/ToastNotification.vue'
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import SidebarMain from './components/Sidebar/SidebarMain.vue'
import EmptyState from './components/PdfViewer/EmptyState.vue'
import PdfViewerHeader from './components/PdfViewer/PdfViewerHeader.vue'
import PdfContainer from './components/PdfViewer/PdfContainer.vue'
import ScrollToTopButton from './components/ScrollToTopButton.vue'
import ComparisonView from './components/ComparisonView.vue'
import PdfSelectorModal from './components/PdfSelectorModal.vue'

// Composables
import { useTheme } from './composables/useTheme'
import { useToast } from './composables/useToast'
import { useResponsive } from './composables/useResponsive'
import { useSidebar } from './composables/useSidebar'
import { useSearch } from './composables/useSearch'
import { useRecentlyViewed } from './composables/useRecentlyViewed'
import { useFavorites } from './composables/useFavorites'
import { usePdfViewer } from './composables/usePdfViewer'
import { useNavigation } from './composables/useNavigation'
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'
import { useComparison } from './composables/useComparison'

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
const showClearConfirm = ref(false)

// Favorites
const { favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites } = useFavorites()
const showClearFavoritesConfirm = ref(false)

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
  showClearConfirm.value = true
}

function handleClearConfirm() {
  clearRecent(showToastNotification)
  showClearConfirm.value = false
}

function handleSelectPdf(subject, category, year, isFromRecent = false) {
  selectPdf(subject, category, year)
  if (isFromRecent) {
    expandedCategories[category] = true
    expandedYears[year] = true
  }
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

// Favorites Functions
function handleToggleFavorite() {
  if (!selectedPdf.value) return

  const subject = { pdf: selectedPdf.value, label: selectedPdfTitle.value }
  const isAdded = toggleFavorite(subject, selectedCategory.value, selectedYear.value)

  if (isAdded) {
    showToastNotification(`⭐ បានបន្ថែមទៅចំណូលចិត្ត: ${selectedPdfTitle.value}`)
  } else {
    showToastNotification(`✓ បានលុបចេញពីចំណូលចិត្ត: ${selectedPdfTitle.value}`)
  }
}

function clearFavoritesWrapper() {
  showClearFavoritesConfirm.value = true
}

function handleClearFavoritesConfirm() {
  clearFavorites()
  showClearFavoritesConfirm.value = false
  showToastNotification('✓ បានសម្អាតចំណូលចិត្តទាំងអស់')
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

