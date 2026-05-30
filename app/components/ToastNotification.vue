<template>
  <Transition name="toast">
    <div v-if="show" class="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
      <Check class="w-5 h-5" />
      {{ message }}
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

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
