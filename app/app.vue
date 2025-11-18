<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <!-- Control Buttons Container -->
    <div class="fixed top-4 left-0 right-0 z-50 flex justify-between items-start px-4 pointer-events-none">
      <!-- Toggle Sidebar Button -->
      <button
        @click="toggleSidebar"
        :class="[
          'p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all pointer-events-auto',
          isSidebarOpen && isDesktop ? 'ml-[20rem]' : ''
        ]"
      >
        <!-- Close Icon (X) when sidebar is open -->
        <svg v-if="isSidebarOpen" class="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <!-- Menu Icon (Hamburger) when sidebar is closed -->
        <svg v-else class="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Dark Mode Toggle Button -->
      <button
        @click="toggleDarkMode"
        class="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors pointer-events-auto"
      >
        <svg v-if="isDark" class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else class="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </div>

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
        isSidebarOpen ? 'w-80' : 'w-0',
        !isDesktop && isSidebarOpen ? 'translate-x-0' : (!isDesktop ? '-translate-x-full' : '')
      ]"
    >
      <div class="p-6">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-1">ឯកសារប្រឡង</h2>
          <div class="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        <div v-for="category in data" :key="category.label" class="mb-6">
          <!-- Category -->
          <div>
            <button
              @click="toggleCategory(category.label)"
              class="flex items-center justify-between w-full text-left font-bold text-lg text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all py-3 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700/50 group"
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
                  class="flex items-center justify-between w-full text-left font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all py-2 px-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700/30 dark:hover:to-gray-700/30 group"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-blue-500 dark:text-blue-400 text-xs transform transition-transform duration-200" :class="expandedYears[year.label] ? 'rotate-90' : ''">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    {{ year.label }}
                  </span>
                </button>

                <!-- Subjects -->
                <div v-if="expandedYears[year.label]" class="mt-2 ml-6 space-y-1">
                  <button
                    v-for="subject in year.children"
                    :key="subject.label"
                    @click="selectPdf(subject); !isDesktop && toggleSidebar()"
                    :class="[
                      'flex items-center w-full text-left text-sm py-2.5 px-4 rounded-lg transition-all duration-200 group',
                      selectedPdf === subject.pdf
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105 font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:pl-6 hover:text-blue-600 dark:hover:text-blue-400'
                    ]"
                  >
                    <span :class="[
                      'mr-3 transition-all',
                      selectedPdf === subject.pdf ? 'text-white' : 'text-blue-500 dark:text-blue-400'
                    ]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    {{ subject.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-gray-200 dark:bg-gray-900 overflow-hidden">
      <div v-if="!selectedPdf" class="flex-1 flex items-center justify-center px-4">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-200">បង្ហាញឯកសារ PDF</h1>
      </div>
      <div v-else class="flex-1 flex flex-col overflow-hidden pt-16">
        <div class="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 shadow flex-wrap gap-2 mx-2 sm:mx-4 mb-2 rounded">
          <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 truncate flex-1 min-w-0 mr-2">{{ selectedPdfTitle }}</h2>
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Print Button -->
            <button
              @click="printPdf"
              class="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-1"
              title="Print"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span class="hidden sm:inline">Print</span>
            </button>

            <!-- Download Button -->
            <a
              :href="selectedPdf"
              :download="selectedPdfTitle + '.pdf'"
              class="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors whitespace-nowrap flex items-center gap-1"
              title="Download"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span class="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>
        <div class="flex-1 bg-white dark:bg-gray-800 rounded shadow-lg overflow-auto mx-2 sm:mx-4 mb-2 sm:mb-4">
          <ClientOnly>
            <VuePdfEmbed
              v-if="selectedPdf"
              :source="selectedPdf"
              class="w-full"
            />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import docsData from './data/docs.json'

const VuePdfEmbed = defineAsyncComponent(() => import('vue-pdf-embed'))

const data = ref(docsData)
const selectedPdf = ref(null)
const selectedPdfTitle = ref('')
const isSidebarOpen = ref(true)
const isDark = ref(false)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const expandedCategories = reactive({})
const expandedYears = reactive({})

const isDesktop = computed(() => windowWidth.value >= 1024)

const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (isDesktop.value) {
    isSidebarOpen.value = true
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

onMounted(() => {
  // Initialize dark mode first
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else if (savedTheme === 'light') {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }
  }

  // Then handle resize
  window.addEventListener('resize', handleResize)
  handleResize()

  // Auto select first subject on first load
  if (data.value.length > 0 && data.value[0].children.length > 0) {
    const firstCategory = data.value[0]
    const firstYear = firstCategory.children[0]

    // Expand first category and year
    expandedCategories[firstCategory.label] = true
    expandedYears[firstYear.label] = true

    // Select first subject
    if (firstYear.children.length > 0) {
      const firstSubject = firstYear.children[0]
      selectedPdf.value = firstSubject.pdf
      selectedPdfTitle.value = firstSubject.label
    }
  }

  // Set page title
  if (typeof document !== 'undefined') {
    document.title = 'Home — Dobpi'
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
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

const selectPdf = (subject) => {
  selectedPdf.value = subject.pdf
  selectedPdfTitle.value = subject.label
}

const printPdf = () => {
  if (selectedPdf.value) {
    window.open(selectedPdf.value, '_blank')?.print()
  }
}
</script>

