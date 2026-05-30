<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div class="bg-primary-600 text-white p-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold">ជ្រើសរើសឯកសារ {{ pdfNumber }}</h2>
            <p class="text-sm opacity-90 mt-1">ជ្រើសរើសឯកសារប្រឡងដើម្បីប្រៀបធៀប</p>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Categories -->
        <div v-for="category in data" :key="category.label" class="mb-6">
          <div class="bg-primary-600 text-white rounded-lg p-3 mb-3">
            <h3 class="font-bold">{{ category.label }}</h3>
          </div>

          <!-- Years -->
          <div class="space-y-3 ml-4">
            <div v-for="year in category.children" :key="year.label">
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-2.5 mb-2">
                <h4 class="font-semibold text-gray-800 dark:text-white text-sm">{{ year.label }}</h4>
              </div>

              <!-- Subjects -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ml-4">
                <button
                  v-for="subject in year.children"
                  :key="subject.pdf"
                  @click="handleSelect(subject, category.label, year.label)"
                  class="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md transition-all text-left"
                >
                  <span class="text-xl">{{ getSubjectIcon(subject.label) }}</span>
                  <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {{ subject.label }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from '@lucide/vue'
import { getSubjectIcon } from '../constants/icons'

defineProps({
  show: Boolean,
  pdfNumber: Number,
  data: Array
})

const emit = defineEmits(['close', 'select'])

function handleSelect(subject, category, year) {
  emit('select', subject, category, year)
  emit('close')
}
</script>
