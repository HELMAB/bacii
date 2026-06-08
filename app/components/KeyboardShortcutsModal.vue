<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-300 ease-in"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      @click="$emit('close')"
    >
      <div
        class="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div
          class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800"
        >
          <h2
            class="text-lg font-bold uppercase text-gray-900 dark:text-white flex items-center gap-2.5"
          >
            <Keyboard class="w-5 h-5 text-primary-600" />
            គ្លីដកុំព្យូទ័រ
          </h2>
          <button
            class="text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            @click="$emit('close')"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-8">
          <!-- Navigation -->
          <div>
            <h3 class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-3">
              ការរុករក
            </h3>
            <div
              class="divide-y divide-gray-100 dark:divide-gray-900 border-y border-gray-100 dark:border-gray-900"
            >
              <div class="flex items-center justify-between py-2.5">
                <span class="text-gray-700 dark:text-gray-300">ឯកសារមុន</span>
                <kbd
                  class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-sm font-mono text-gray-700 dark:text-gray-300"
                >
                  ←
                </kbd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <span class="text-gray-700 dark:text-gray-300">ឯកសារបន្ទាប់</span>
                <kbd
                  class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-sm font-mono text-gray-700 dark:text-gray-300"
                >
                  →
                </kbd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <span class="text-gray-700 dark:text-gray-300">បើក/បិទម៉ឺនុយ</span>
                <kbd
                  class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-sm font-mono text-gray-700 dark:text-gray-300"
                >
                  ESC
                </kbd>
              </div>
            </div>
          </div>

          <!-- Search -->
          <div>
            <h3 class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-3">
              ការស្វែងរក
            </h3>
            <div
              class="divide-y divide-gray-100 dark:divide-gray-900 border-y border-gray-100 dark:border-gray-900"
            >
              <div class="flex items-center justify-between py-2.5">
                <span class="text-gray-700 dark:text-gray-300">ផ្តោតលើការស្វែងរក</span>
                <kbd
                  class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-sm font-mono text-gray-700 dark:text-gray-300"
                >
                  /
                </kbd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <span class="text-gray-700 dark:text-gray-300">បោះបង់ការស្វែងរក</span>
                <kbd
                  class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-sm font-mono text-gray-700 dark:text-gray-300"
                >
                  ESC
                </kbd>
              </div>
            </div>
          </div>

          <!-- View -->
          <div>
            <h3 class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-3">
              ការមើល
            </h3>
            <div
              class="divide-y divide-gray-100 dark:divide-gray-900 border-y border-gray-100 dark:border-gray-900"
            >
              <div class="flex items-center justify-between py-2.5">
                <span class="text-gray-700 dark:text-gray-300">ពង្រីក</span>
                <kbd
                  class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-sm font-mono text-gray-700 dark:text-gray-300"
                >
                  +
                </kbd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <span class="text-gray-700 dark:text-gray-300">បង្រួម</span>
                <kbd
                  class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-sm font-mono text-gray-700 dark:text-gray-300"
                >
                  -
                </kbd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <span class="text-gray-700 dark:text-gray-300">ពេញអេក្រង់</span>
                <kbd
                  class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-sm font-mono text-gray-700 dark:text-gray-300"
                >
                  F
                </kbd>
              </div>
            </div>
          </div>

          <!-- Help -->
          <div>
            <h3 class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-3">
              ជំនួយ
            </h3>
            <div
              class="divide-y divide-gray-100 dark:divide-gray-900 border-y border-gray-100 dark:border-gray-900"
            >
              <div class="flex items-center justify-between py-2.5">
                <span class="text-gray-700 dark:text-gray-300">បើក/បិទគ្លីដកុំព្យូទ័រ</span>
                <kbd
                  class="px-3 py-1 border border-gray-300 dark:border-gray-700 text-sm font-mono text-gray-700 dark:text-gray-300"
                >
                  ?
                </kbd>
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
