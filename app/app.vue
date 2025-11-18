<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ toastMessage }}
      </div>
    </Transition>

    <!-- Overlay for mobile -->
    <div
      v-if="isSidebarOpen && !isDesktop"
      @click="toggleSidebar"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl overflow-y-auto transition-all duration-300 ease-in-out z-40 border-r border-gray-200 dark:border-gray-700',
        isDesktop ? 'relative' : 'fixed inset-y-0 left-0',
        isSidebarOpen ? 'w-96' : 'w-0',
        !isDesktop && isSidebarOpen ? 'translate-x-0' : (!isDesktop ? '-translate-x-full' : '')
      ]"
    >
      <div class="p-6">
        <!-- Header -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-1">ឯកសារប្រឡង</h2>
          <div class="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        <!-- Search Bar -->
        <div class="mb-6 relative">
          <input
            v-model="searchQuery"
            @keydown.escape="searchQuery = ''"
            type="text"
            placeholder="ស្វែងរកមុខវិជ្ជា... (ចុច / ដើម្បីស្វែងរក)"
            class="w-full px-4 py-2.5 pl-10 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
          />
          <svg class="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Recently Viewed -->
        <div v-if="recentlyViewed.length > 0 && !searchQuery" class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              មើលថ្មីៗ
            </h3>
            <button
              @click="clearRecentlyViewed"
              class="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center gap-1"
              title="Clear recent history"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              សម្អាត
            </button>
          </div>
          <div class="space-y-1">
            <button
              v-for="item in recentlyViewed.slice(0, 3)"
              :key="item.pdf"
              @click="selectPdfFromRecent(item); !isDesktop && toggleSidebar()"
              class="flex items-center w-full text-left text-sm py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition-all"
            >
              <span class="mr-2 text-blue-500">{{ getSubjectIcon(item.label) }}</span>
              <span class="truncate flex-1">{{ item.label }}</span>
            </button>
          </div>
        </div>

        <div v-for="category in filteredData" :key="category.label" class="mb-6">
          <!-- Category -->
          <div>
            <button
              @click="toggleCategory(category.label)"
              class="flex items-center justify-between w-full text-left font-bold text-lg text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all py-3 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700/50 group focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span class="flex items-center gap-3">
                <span class="text-blue-600 dark:text-blue-400 transform transition-transform duration-200" :class="expandedCategories[category.label] ? 'rotate-90' : ''">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                {{ category.label }}
              </span>
            </button>

            <!-- Years -->
            <div v-if="expandedCategories[category.label]" class="mt-3 ml-6 space-y-2">
              <div v-for="year in category.children" :key="year.label">
                <button
                  @click="toggleYear(year.label)"
                  class="flex items-center justify-between w-full text-left font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all py-2 px-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700/30 dark:hover:to-gray-700/30 group focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-blue-500 dark:text-blue-400 text-xs transform transition-transform duration-200" :class="expandedYears[year.label] ? 'rotate-90' : ''">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span class="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full">
                      {{ extractYear(year.label) }}
                    </span>
                    {{ year.label }}
                  </span>
                </button>

                <!-- Subjects -->
                <div v-if="expandedYears[year.label]" class="mt-2 ml-6 space-y-1">
                  <button
                    v-for="subject in year.children"
                    :key="subject.label"
                    @click="selectPdf(subject, category.label, year.label); !isDesktop && toggleSidebar()"
                    :class="[
                      'flex items-center w-full text-left text-sm py-2.5 px-4 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500',
                      selectedPdf === subject.pdf
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105 font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:pl-6 hover:text-blue-600 dark:hover:text-blue-400'
                    ]"
                  >
                    <span :class="[
                      'mr-3 text-lg transition-all',
                      selectedPdf === subject.pdf ? '' : ''
                    ]">
                      {{ getSubjectIcon(subject.label) }}
                    </span>
                    {{ subject.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="searchQuery && filteredData.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400">រកមិនឃើញលទ្ធផល</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-gray-200 dark:bg-gray-900 overflow-hidden">
      <!-- Empty State -->
      <div v-if="!selectedPdf" class="flex-1 flex items-center justify-center px-4">
        <div class="text-center">
          <svg class="w-32 h-32 mx-auto mb-6 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">បង្ហាញឯកសារ PDF</h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg">ជ្រើសរើសឯកសារមួយពីម៉ឺនុយខាងឆ្វេង</p>
        </div>
      </div>

      <!-- PDF Viewer -->
      <div v-else class="flex-1 flex flex-col overflow-hidden py-2">
        <!-- Breadcrumb & Controls -->
        <div class="bg-white dark:bg-gray-800 px-4 py-3 shadow mx-2 sm:mx-4 mb-2 rounded-lg">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3 flex-wrap">
            <span>{{ selectedCategory }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span>{{ selectedYear }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="font-semibold text-blue-600 dark:text-blue-400">{{ selectedPdfTitle }}</span>
          </div>

          <!-- Controls Row -->
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-2">
              <!-- Toggle Sidebar Button -->
              <button
                @click="toggleSidebar"
                class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle sidebar"
              >
                <svg v-if="isSidebarOpen" class="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <svg v-else class="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span class="text-2xl">{{ getSubjectIcon(selectedPdfTitle) }}</span>
                {{ selectedPdfTitle }}
              </h2>
            </div>
            
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Zoom Controls -->
              <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  @click="zoomOut"
                  class="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Zoom Out"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  </svg>
                </button>
                <span class="px-2 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-center">{{ Math.round(zoomLevel * 100) }}%</span>
                <button
                  @click="zoomIn"
                  class="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Zoom In"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </button>
              </div>

              <!-- Fullscreen Button -->
              <button
                @click="toggleFullscreen"
                class="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
                title="Fullscreen"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span class="hidden sm:inline">ពេញអេក្រង់</span>
              </button>

              <!-- Print Button -->
              <button
                @click="printPdf"
                class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                title="Print"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span class="hidden sm:inline">បោះពុម្ព</span>
              </button>

              <!-- Download Button -->
              <button
                @click="downloadPdf"
                class="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                title="Download"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span class="hidden sm:inline">ទាញយក</span>
              </button>

              <!-- Dark Mode Toggle Button -->
              <button
                @click="toggleDarkMode"
                class="px-3 py-1.5 bg-gray-700 dark:bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors flex items-center gap-1"
                aria-label="Toggle dark mode"
                title="Toggle theme"
              >
                <svg v-if="isDark" class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span class="hidden sm:inline">ពន្លឺ</span>
              </button>
            </div>
          </div>
        </div>

        <!-- PDF Container -->
        <div ref="pdfContainer" class="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-auto mx-2 sm:mx-4 mb-2 sm:mb-4 relative">
          <!-- Loading State -->
          <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 z-10">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p class="text-gray-600 dark:text-gray-400">កំពុងផ្ទុក...</p>
            </div>
          </div>

          <ClientOnly>
            <VuePdfEmbed
              v-if="selectedPdf"
              :source="selectedPdf"
              :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }"
              class="w-full transition-transform duration-200"
              @rendered="onPdfRendered"
              @loading-failed="onPdfError"
            />
          </ClientOnly>
        </div>

        <!-- Scroll to Top Button -->
        <Transition name="fade">
          <button
            v-if="showScrollTop"
            @click="scrollToTop"
            class="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 z-50"
            title="Scroll to top"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, defineAsyncComponent, watch } from 'vue'
import docsData from './data/docs.json'

const VuePdfEmbed = defineAsyncComponent(() => import('vue-pdf-embed'))

const data = ref(docsData)
const selectedPdf = ref(null)
const selectedPdfTitle = ref('')
const selectedCategory = ref('')
const selectedYear = ref('')
const isSidebarOpen = ref(true)
const isDark = ref(false)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const expandedCategories = reactive({})
const expandedYears = reactive({})
const searchQuery = ref('')
const isSearchFocused = ref(false)
const recentlyViewed = ref([])
const zoomLevel = ref(typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0.75 : 1)
const isLoading = ref(false)
const showScrollTop = ref(false)
const pdfContainer = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const isDesktop = computed(() => windowWidth.value >= 1024)

// Subject icons mapping
const subjectIcons = {
  'អក្សរសាស្ត្រខ្មែរ': '📚',
  'គណិតវិទ្យា': '🧮',
  'រូបវិទ្យា': '⚛️',
  'គីមីវិទ្យា': '🧪',
  'ជីវវិទ្យា': '🧬',
  'ប្រវត្តិសាស្ត្រ': '📜',
  'ភូមិវិទ្យា': '🌍',
  'សីលធម៌': '🕊️',
  'ភាសាអង់គ្លេស': '🇬🇧'
}

const getSubjectIcon = (label) => {
  return subjectIcons[label] || '📄'
}

const extractYear = (label) => {
  const match = label.match(/\d{4}/)
  return match ? match[0] : ''
}

// Filter data based on search query
const filteredData = computed(() => {
  if (!searchQuery.value.trim()) return data.value

  const query = searchQuery.value.toLowerCase()
  return data.value.map(category => ({
    ...category,
    children: category.children.map(year => ({
      ...year,
      children: year.children.filter(subject =>
        subject.label.toLowerCase().includes(query)
      )
    })).filter(year => year.children.length > 0)
  })).filter(category => category.children.length > 0)
})

// Auto-expand filtered results
watch(searchQuery, (newVal) => {
  if (newVal.trim()) {
    filteredData.value.forEach(category => {
      expandedCategories[category.label] = true
      category.children.forEach(year => {
        expandedYears[year.label] = true
      })
    })
  }
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
  const wasDesktop = isSidebarOpen.value && windowWidth.value >= 1024
  
  if (isDesktop.value) {
    isSidebarOpen.value = true
  } else {
    isSidebarOpen.value = false
  }
  
  // Adjust zoom level based on screen size if PDF is loaded
  if (selectedPdf.value) {
    zoomLevel.value = isDesktop.value ? 0.75 : 1
  }
}

const toggleDarkMode = () => {
  if (typeof window === 'undefined') return

  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const showToastNotification = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Keyboard shortcuts
const handleKeydown = (e) => {
  if (e.key === '/' && !isSearchFocused.value) {
    e.preventDefault()
    const searchInput = document.querySelector('input[type="text"]')
    searchInput?.focus()
  }
}

// Scroll handling
const handleScroll = () => {
  if (pdfContainer.value) {
    showScrollTop.value = pdfContainer.value.scrollTop > 300
  }
}

onMounted(() => {
  // Initialize dark mode
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else if (savedTheme === 'light') {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }

    // Load recently viewed from localStorage
    const saved = localStorage.getItem('recentlyViewed')
    if (saved) {
      recentlyViewed.value = JSON.parse(saved)
    }
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
  handleResize()

  // Set initial sidebar state based on screen size
  if (!isDesktop.value) {
    isSidebarOpen.value = false
  }

  // Auto select first subject
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

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
  if (pdfContainer.value) {
    pdfContainer.value.removeEventListener('scroll', handleScroll)
  }
})

watch(pdfContainer, (newVal) => {
  if (newVal) {
    newVal.addEventListener('scroll', handleScroll)
  }
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleCategory = (label) => {
  expandedCategories[label] = !expandedCategories[label]
}

const toggleYear = (label) => {
  expandedYears[label] = !expandedYears[label]
}

const selectPdf = (subject, category, year) => {
  isLoading.value = true
  selectedPdf.value = subject.pdf
  selectedPdfTitle.value = subject.label
  selectedCategory.value = category
  selectedYear.value = year
  zoomLevel.value = isDesktop.value ? 0.75 : 1

  // Add to recently viewed
  const item = { ...subject, category, year }
  const existing = recentlyViewed.value.findIndex(i => i.pdf === subject.pdf)
  if (existing > -1) {
    recentlyViewed.value.splice(existing, 1)
  }
  recentlyViewed.value.unshift(item)
  recentlyViewed.value = recentlyViewed.value.slice(0, 5)

  if (typeof window !== 'undefined') {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed.value))
  }

  // Reset scroll
  if (pdfContainer.value) {
    pdfContainer.value.scrollTop = 0
  }
}

const selectPdfFromRecent = (item) => {
  selectPdf(item, item.category, item.year)
  
  // Expand the category and year
  expandedCategories[item.category] = true
  expandedYears[item.year] = true
}

const printPdf = () => {
  if (selectedPdf.value) {
    window.open(selectedPdf.value, '_blank')?.print()
    showToastNotification('កំពុងបើកសម្រាប់បោះពុម្ព...')
  }
}

const downloadPdf = () => {
  if (selectedPdf.value) {
    const link = document.createElement('a')
    link.href = selectedPdf.value
    link.download = selectedPdfTitle.value + '.pdf'
    link.click()
    showToastNotification('កំពុងទាញយក...')
  }
}

const zoomIn = () => {
  if (zoomLevel.value < 2) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2)
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
  }
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    pdfContainer.value?.requestFullscreen()
    showToastNotification('បានបើកពេញអេក្រង់')
  } else {
    document.exitFullscreen()
    showToastNotification('បានបិទពេញអេក្រង់')
  }
}

const scrollToTop = () => {
  if (pdfContainer.value) {
    pdfContainer.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const onPdfRendered = () => {
  isLoading.value = false
}

const onPdfError = () => {
  isLoading.value = false
  showToastNotification('មានបញ្ហាក្នុងការផ្ទុកឯកសារ')
}

const clearRecentlyViewed = () => {
  if (confirm('តើអ្នកប្រាកដថាចង់សម្អាតប្រវត្តិមើលថ្មីៗទេ?')) {
    recentlyViewed.value = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentlyViewed')
    }
    showToastNotification('បានសម្អាតប្រវត្តិមើលថ្មីៗ')
  }
}
</script>

