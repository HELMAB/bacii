<template>
  <div class="bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 shadow-lg">
    <div class="flex items-center justify-between px-4 py-2 gap-2">
      <!-- Left: Annotation Tools -->
      <div class="flex items-center gap-2">
        <!-- Toggle Annotation Mode -->
        <button
          @click="emit('toggleMode')"
          :class="[
            'px-3 py-2 rounded-lg font-medium transition-all text-sm',
            isAnnotationMode
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          ]"
          title="បើក/បិទមុខងារកត់ត្រា"
        >
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span class="hidden sm:inline">កត់ត្រា</span>
          </span>
        </button>

        <!-- Tool Buttons (shown when annotation mode is active) -->
        <div v-if="isAnnotationMode" class="flex items-center gap-1 pl-2 border-l border-gray-300 dark:border-gray-600">
          <!-- Note Tool -->
          <button
            @click="emit('setTool', 'note')"
            :class="[
              'px-3 py-2 rounded-lg transition-all text-sm',
              currentTool === 'note'
                ? 'bg-blue-400 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
            title="បន្ថែមកំណត់ចំណាំ"
          >
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span class="hidden sm:inline">កំណត់ចំណាំ</span>
            </span>
          </button>

          <!-- Bookmark Tool -->
          <button
            @click="emit('setTool', 'bookmark')"
            :class="[
              'px-3 py-2 rounded-lg transition-all text-sm',
              currentTool === 'bookmark'
                ? 'bg-purple-400 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
            title="បន្ថែមចំណាំទំព័រ"
          >
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span class="hidden sm:inline">ចំណាំទំព័រ</span>
            </span>
          </button>

          <!-- Color Picker -->
          <div v-if="currentTool === 'note'" class="flex items-center gap-1 pl-2 border-l border-gray-300 dark:border-gray-600">
            <button
              v-for="color in colors"
              :key="color.value"
              @click="emit('setColor', color.value)"
              :class="[
                'w-6 h-6 rounded-full border-2 transition-all',
                color.class,
                currentColor === color.value
                  ? 'border-gray-900 dark:border-white scale-110'
                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'
              ]"
              :title="color.name"
            ></button>
          </div>
        </div>
      </div>

      <!-- Right: Annotation Stats and Actions -->
      <div class="flex items-center gap-2">
        <!-- Annotation Count -->
        <div v-if="totalAnnotations > 0" class="hidden sm:flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <span>ការកត់ត្រា: {{ totalAnnotations }}</span>
        </div>

        <!-- Toggle Notes Panel -->
        <button
          @click="emit('toggleNotesPanel')"
          class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
          title="បង្ហាញកំណត់ចំណាំ"
        >
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="hidden md:inline">បញ្ជី ({{ notes.length }})</span>
          </span>
        </button>

        <!-- Export/Import Dropdown -->
        <div class="relative">
          <button
            @click="showMenu = !showMenu"
            class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
            title="ជម្រើសបន្ថែម"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <Transition name="fade">
            <div
              v-if="showMenu"
              v-click-outside="() => showMenu = false"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
            >
              <button
                @click="handleExport"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                នាំចេញការកត់ត្រា
              </button>

              <label class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                នាំចូលការកត់ត្រា
                <input
                  type="file"
                  accept="application/json"
                  @change="handleImport"
                  class="hidden"
                />
              </label>

              <button
                @click="handleClear"
                class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                លុបទាំងអស់
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isAnnotationMode: Boolean,
  currentTool: String,
  currentColor: String,
  colors: Array,
  totalAnnotations: Number,
  notes: Array
})

const emit = defineEmits([
  'toggleMode',
  'setTool',
  'setColor',
  'toggleNotesPanel',
  'export',
  'import',
  'clear'
])

const showMenu = ref(false)

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

function handleExport() {
  showMenu.value = false
  emit('export')
}

function handleImport(event) {
  showMenu.value = false
  const file = event.target.files[0]
  if (file) {
    emit('import', file)
  }
  event.target.value = ''
}

function handleClear() {
  showMenu.value = false
  emit('clear')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
