<template>
  <Transition name="fade">
    <div v-if="show" @click="$emit('close')" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Keyboard class="w-6 h-6 text-primary-600" />
            គ្លីដកុំព្យូទ័រ (Keyboard Shortcuts)
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-6">
          <!-- Navigation -->
          <div>
            <h3 class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">ការរុករក (Navigation)</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">ឯកសារមុន</span>
                <kbd class="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono shadow-sm">←</kbd>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">ឯកសារបន្ទាប់</span>
                <kbd class="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono shadow-sm">→</kbd>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">បើក/បិទម៉ឺនុយ</span>
                <kbd class="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono shadow-sm">ESC</kbd>
              </div>
            </div>
          </div>

          <!-- Search -->
          <div>
            <h3 class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">ការស្វែងរក (Search)</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">ផ្តោតលើការស្វែងរក</span>
                <kbd class="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono shadow-sm">/</kbd>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">បោះបង់ការស្វែងរក</span>
                <kbd class="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono shadow-sm">ESC</kbd>
              </div>
            </div>
          </div>

          <!-- View -->
          <div>
            <h3 class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">ការមើល (View)</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">ពង្រីក</span>
                <kbd class="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono shadow-sm">+</kbd>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">បង្រួម</span>
                <kbd class="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono shadow-sm">-</kbd>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">ពេញអេក្រង់</span>
                <kbd class="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono shadow-sm">F</kbd>
              </div>
            </div>
          </div>

          <!-- Help -->
          <div>
            <h3 class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">ជំនួយ (Help)</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">បើក/បិទគ្លីដកុំព្យូទ័រ</span>
                <kbd class="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono shadow-sm">?</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { Keyboard, X } from '@lucide/vue'

defineProps({
  show: Boolean
})

defineEmits(['close'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
