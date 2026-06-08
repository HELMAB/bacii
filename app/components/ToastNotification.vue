<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-5 opacity-0"
  >
    <div
      v-if="show"
      class="fixed top-20 right-4 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 flex items-center gap-2.5 border-l-2 border-primary-500"
    >
      <Check class="w-5 h-5" />
      <span class="text-sm">{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { Check } from '@lucide/vue'

defineProps({
  show: Boolean,
  message: String
})
</script>
