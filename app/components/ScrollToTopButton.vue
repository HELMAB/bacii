<template>
  <Transition name="fade">
    <button
      v-if="show"
      @click="$emit('click')"
      class="fixed bottom-6 right-6 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 z-50"
      title="Scroll to top"
    >
      <ArrowUp class="w-6 h-6" />
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
