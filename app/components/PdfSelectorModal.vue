<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div class="border-b border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold uppercase text-gray-900 dark:text-white">
              ជ្រើសរើសឯកសារ {{ pdfNumber }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ជ្រើសរើសឯកសារប្រឡងដើម្បីប្រៀបធៀប
            </p>
          </div>
          <button
            class="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            @click="$emit('close')"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Categories -->
        <div v-for="category in data" :key="category.label" class="mb-8 last:mb-0">
          <h3
            class="text-xs font-bold uppercase text-gray-900 dark:text-white pb-2 mb-4 border-b border-gray-200 dark:border-gray-800"
          >
            {{ category.label }}
          </h3>

          <!-- Years -->
          <div class="space-y-5">
            <div v-for="year in category.children" :key="year.label">
              <h4 class="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2.5">
                {{ year.label }}
              </h4>

              <!-- Subjects -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  v-for="subject in year.children"
                  :key="subject.pdf"
                  class="flex items-center gap-2.5 p-3 border border-gray-200 dark:border-gray-800 hover:border-primary-600 dark:hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left"
                  @click="handleSelect(subject, category.label, year.label)"
                >
                  <component
                    :is="getSubjectIcon(subject.label)"
                    class="w-5 h-5 shrink-0 text-primary-600 dark:text-primary-400"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
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
