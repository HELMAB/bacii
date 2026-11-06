<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <button
      v-if="show"
      class="absolute bottom-20 right-3 sm:bottom-6 sm:right-6 z-20 grid place-items-center w-11 h-11 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-primary-600 dark:hover:bg-primary-400 transition-colors duration-200"
      aria-label="ឡើងទៅលើ"
      title="ឡើងទៅលើ"
      @click="$emit('click')"
    >
      <ArrowUp class="w-5 h-5" />
    </button>
  </Transition>
</template>

<script setup>
import { ArrowUp } from '@lucide/vue'

defineProps({
  show: Boolean
})

defineEmits(['click'])
</script>
