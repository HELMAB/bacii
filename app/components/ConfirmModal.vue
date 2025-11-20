<template>
  <Transition name="fade">
    <div v-if="show" @click="handleCancel" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        <div class="flex items-start gap-4 mb-6">
          <div class="flex-shrink-0">
            <svg class="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">{{ title }}</h2>
            <p class="text-gray-600 dark:text-gray-300">{{ message }}</p>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="handleCancel"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Confirm'
  },
  message: {
    type: String,
    default: 'Are you sure?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
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
