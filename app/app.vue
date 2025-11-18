<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-lg overflow-y-auto">
      <div class="p-4">
        <div v-for="category in data" :key="category.label">
          <!-- Category -->
          <div class="mb-2">
            <button
              @click="toggleCategory(category.label)"
              class="flex items-center w-full text-left font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
              <span class="mr-2">{{ expandedCategories[category.label] ? '>' : '>' }}</span>
              {{ category.label }}
            </button>

            <!-- Years -->
            <div v-if="expandedCategories[category.label]" class="ml-4 mt-2">
              <div v-for="year in category.children" :key="year.label" class="mb-2">
                <button
                  @click="toggleYear(year.label)"
                  class="flex items-center w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span class="mr-2">{{ expandedYears[year.label] ? '>' : '>' }}</span>
                  {{ year.label }}
                </button>

                <!-- Subjects -->
                <div v-if="expandedYears[year.label]" class="ml-4 mt-1">
                  <button
                    v-for="subject in year.children"
                    :key="subject.label"
                    @click="selectPdf(subject)"
                    :class="[
                      'flex items-center w-full text-left text-sm py-1 px-2 rounded transition-colors',
                      selectedPdf === subject.pdf
                        ? 'bg-red-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    ]"
                  >
                    <span class="mr-2">></span>
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
    <div class="flex-1 flex items-center justify-center bg-gray-200">
      <div v-if="!selectedPdf" class="text-center">
        <h1 class="text-6xl font-bold text-gray-800">បង្ហាញឯកសារ PDF</h1>
      </div>
      <div v-else class="w-full h-full p-4">
        <iframe
          :src="selectedPdf"
          class="w-full h-full border-0 rounded shadow-lg bg-white"
          title="PDF Viewer"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import docsData from './data/docs.json'

const data = ref(docsData)
const selectedPdf = ref(null)
const expandedCategories = reactive({})
const expandedYears = reactive({})

const toggleCategory = (label) => {
  expandedCategories[label] = !expandedCategories[label]
}

const toggleYear = (label) => {
  expandedYears[label] = !expandedYears[label]
}

const selectPdf = (subject) => {
  selectedPdf.value = subject.pdf
}
</script>

