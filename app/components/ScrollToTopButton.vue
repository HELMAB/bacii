<template>
  <Transition
    enter-active-class="motion-safe:transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="motion-safe:transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <button
      v-if="show"
      type="button"
      class="btn btn-icon-lg absolute bottom-[92px] right-4 sm:bottom-6 sm:right-6 z-20 bg-surface-raised text-fg shadow-print-sm hover:bg-highlight/25"
      aria-label="ឡើងទៅលើ"
      title="ឡើងទៅលើ"
      @click="$emit('click')"
    >
      <ChevronUp class="w-5 h-5" :stroke-width="2.6" aria-hidden="true" />
    </button>
  </Transition>
</template>

<script setup>
import { ChevronUp } from '@lucide/vue'

defineProps({
  show: Boolean
})

defineEmits(['click'])
</script>
